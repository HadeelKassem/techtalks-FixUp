import { useEffect, useMemo, useState } from "react";
import "./LiveLocationPage.css";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import {
  getMyBookings,
  startSharingLocation,
  stopSharingLocation,
  updateLocation,
} from "../api";

const fallbackLocation = {
  latitude: 33.8938,
  longitude: 35.5018,
  accuracy: 25,
};

function formatCoordinate(value) {
  return Number(value).toFixed(6);
}

function LiveLocationPage({ role = "PROVIDER" }) {
  const [location, setLocation] = useState(fallbackLocation);
  const [sharing, setSharing] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(
    role === "PROVIDER"
      ? "Location sharing is currently off."
      : "Waiting for the provider to share a live location.",
  );
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);

  const isProvider = role === "PROVIDER";

  useEffect(() => {
  async function loadActiveBooking() {
    try {
      const bookings = await getMyBookings();
      const inProgress = bookings.find((b) => b.status === "IN_PROGRESS");
      setActiveBooking(inProgress || null);
      setStatusMessage(
        inProgress
          ? (isProvider
              ? "Location sharing is currently off."
              : "Waiting for the provider to share a live location.")
          : "No active job right now."
      );
    } catch (err) {
      setStatusMessage("Could not load your active booking.");
    }
  }

  loadActiveBooking();
}, [isProvider]);

useEffect(() => {
  if (isProvider || !activeBooking) return;

  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      stompClient.subscribe(`/topic/requests/${activeBooking.id}/location`, (message) => {
        const update = JSON.parse(message.body);

        setLocation({
          latitude: update.currentLatitude,
          longitude: update.currentLongitude,
          accuracy: 10,
        });
        setLastUpdated(new Date());
        setSharing(update.sharingLocation);
        setStatusMessage(
          update.sharingLocation
            ? "Tracking the provider's live location."
            : "Waiting for the provider to share a live location."
        );
      });
    },
  });

  stompClient.activate();

  return () => {
    stompClient.deactivate();
  };
}, [isProvider, activeBooking]);

  useEffect(() => {
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const mapUrl = useMemo(() => {
    const { latitude, longitude } = location;
    const delta = 0.008;
    const left = longitude - delta;
    const right = longitude + delta;
    const top = latitude + delta;
    const bottom = latitude - delta;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  }, [location]);

  function updateFromPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  setLocation({
    latitude,
    longitude,
    accuracy: Math.round(position.coords.accuracy),
  });
  setLastUpdated(new Date());
  setSharing(true);
  setStatusMessage("Your live location is being shared for this active request.");

  if (activeBooking) {
    updateLocation(activeBooking.id, { latitude, longitude }).catch(() => {
      setStatusMessage("Location captured locally, but the update to the server failed.");
    });
  }
}

  async function startSharing() {
  if (!activeBooking) {
    setStatusMessage("No active job to share location for.");
    return;
  }

  if (!navigator.geolocation) {
    setStatusMessage("Location services are not supported by this browser.");
    return;
  }

  setStatusMessage("Requesting permission to access your location…");

  try {
    await startSharingLocation(activeBooking.id);
  } catch (err) {
    setStatusMessage("Could not start sharing: " + err.message);
    return;
  }

  const id = navigator.geolocation.watchPosition(
    updateFromPosition,
    (error) => {
      setSharing(false);
      if (error.code === error.PERMISSION_DENIED) {
        setStatusMessage("Location permission was denied. Allow location access and try again.");
      } else {
        setStatusMessage("Your location could not be detected. Please try again.");
      }
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
  );

  setWatchId(id);
}

 async function stopSharing() {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
  setWatchId(null);
  setSharing(false);

  if (!activeBooking) {
    setStatusMessage("Location sharing has been stopped.");
    return;
  }

  try {
    await stopSharingLocation(activeBooking.id);
    setStatusMessage("Location sharing has been stopped.");
  } catch (err) {
    setStatusMessage("Stopped locally, but the server update failed: " + err.message);
  }
}

  function centerOnCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(updateFromPosition);
  }

  return (
    <main className="location-page-wrap">
      <section className="location-page-heading">
        <div>
          <p className="location-eyebrow">LIVE SERVICE TRACKING</p>
          <h1>{isProvider ? "Share live location" : "Provider live location"}</h1>
          <p>
            {isProvider
              ? "Let the client follow your trip while the request is in progress."
              : "Follow the provider while they are travelling to your service address."}
          </p>
        </div>
        <span className={sharing ? "location-state is-live" : "location-state"}>
          <span />
          {sharing ? "Live" : "Not sharing"}
        </span>
      </section>

      <section className="location-layout">
        <div className="location-map-card">
          <header className="location-map-header">
            <div>
              <small>ACTIVE REQUEST</small>
              <h2>Emergency Plumbing Repair</h2>
              <p>Sarah Haddad · Achrafieh, Beirut</p>
            </div>
            <span className="status-badge in-progress">In Progress</span>
          </header>

          <div className="map-frame-wrap">
            <iframe
              title="Live service location"
              src={mapUrl}
              className="location-map"
              loading="lazy"
            />
            <div className="map-person-card">
              <span className="map-avatar">JP</span>
              <div>
                <strong>John Plumbing</strong>
                <small>{sharing ? "Location updating live" : "Preview location"}</small>
              </div>
            </div>
          </div>

          <div className="map-footer">
            <div>
              <small>Latitude</small>
              <strong>{formatCoordinate(location.latitude)}</strong>
            </div>
            <div>
              <small>Longitude</small>
              <strong>{formatCoordinate(location.longitude)}</strong>
            </div>
            <div>
              <small>Accuracy</small>
              <strong>±{location.accuracy} m</strong>
            </div>
            <div>
              <small>Last updated</small>
              <strong>
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                  : "Not yet"}
              </strong>
            </div>
          </div>
        </div>

        <aside className="location-control-card">
          <div className="location-control-icon">⌖</div>
          <h2>{isProvider ? "Location controls" : "Tracking status"}</h2>
          <p>{statusMessage}</p>

          {isProvider ? (
            <div className="location-actions">
              {!sharing ? (
                <button type="button" className="primary-button location-main-button" onClick={startSharing}>
                  Start sharing
                </button>
              ) : (
                <button type="button" className="danger-button location-main-button" onClick={stopSharing}>
                  Stop sharing
                </button>
              )}
              <button type="button" className="secondary-button location-main-button" onClick={centerOnCurrentLocation}>
                Update current location
              </button>
            </div>
          ) : (
            null
          )}

          <div className="location-safety-note">
            <strong>Privacy and safety</strong>
            <p>Location is intended only for the client and provider assigned to this active request.</p>
          </div>

          <div className="location-steps">
            <div><span>1</span><p>Provider starts sharing after accepting the job.</p></div>
            <div><span>2</span><p>The browser updates coordinates while the provider moves.</p></div>
            <div><span>3</span><p>Sharing stops when the provider chooses Stop or completes the request.</p></div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default LiveLocationPage;
