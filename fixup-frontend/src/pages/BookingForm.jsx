import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { authRequest } from "../api";
import "./BookingForm.css";

const initialForm = {
  date: "",
  time: "",
  description: "",
  address: "",
  area: "",
  locationDetails: "",
  latitude: "",
  longitude: "",
};

export default function BookingForm({ user }) {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const providerFromNavigation = location.state?.provider || null;
  const [provider, setProvider] = useState(providerFromNavigation);
  const [loadingProvider, setLoadingProvider] = useState(!providerFromNavigation);
  const [providerError, setProviderError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [locationStatus, setLocationStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const minimumDate = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60 * 1000)
      .toISOString()
      .split("T")[0];
  }, []);

  useEffect(() => {
    if (providerFromNavigation) {
      return;
    }

    async function loadProvider() {
      try {
        const data = await authRequest(`/api/providers/${providerId}`);
        setProvider(data);
      } catch (error) {
        setProviderError(error.message || "Could not load provider information.");
      } finally {
        setLoadingProvider(false);
      }
    }

    loadProvider();
  }, [providerId, providerFromNavigation]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Your browser does not support location sharing.");
      return;
    }

    setLocationStatus("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setLocationStatus("Current location added successfully.");
      },
      () => {
        setLocationStatus("Location permission was denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.date) nextErrors.date = "Please choose a date.";
    if (!form.time) nextErrors.time = "Please choose a time.";
    if (!form.description.trim()) {
      nextErrors.description = "Please explain what service you need.";
    }
    if (!form.address.trim()) {
      nextErrors.address = "Please enter the address where the provider should come.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const booking = {
      id: Date.now(),
      providerId,
      providerName: provider?.name || "Selected provider",
      clientId: user?.id || null,
      clientName: user?.name || user?.fullName || "Client",
      ...form,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    const previousBookings = JSON.parse(
      localStorage.getItem("fixupBookings") || "[]"
    );

    localStorage.setItem(
      "fixupBookings",
      JSON.stringify([...previousBookings, booking])
    );

    setSubmitted(true);
  }

  if (loadingProvider) {
    return <p className="booking-page-message">Loading provider...</p>;
  }

  if (providerError) {
    return (
      <div className="booking-page-message booking-page-error">
        <p>{providerError}</p>
        <button type="button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <main className="booking-page">
        <section className="booking-success-card">
          <div className="booking-success-icon">✓</div>
          <h1>Booking request created</h1>
          <p>
            Your request for <strong>{provider?.name || "the provider"}</strong> was
            saved successfully.
          </p>
          <p className="booking-demo-note">
            This is the frontend version, so the request is currently stored only
            in this browser.
          </p>
          <div className="booking-success-actions">
            <button onClick={() => navigate("/client")}>Client Dashboard</button>
            <button
              className="secondary"
              onClick={() => {
                setForm(initialForm);
                setSubmitted(false);
              }}
            >
              Create Another Booking
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <section className="booking-card">
        <button className="booking-back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <header className="booking-header">
          <p className="booking-eyebrow">FixUp Service Booking</p>
          <h1>Book {provider?.name || "Provider"}</h1>
          <p>
            Choose when you need the service, explain the request, and tell the
            provider where to come.
          </p>
        </header>

        <div className="booking-provider-summary">
          <img
            src={
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(provider?.name || "Provider")
            }
            alt={provider?.name || "Provider"}
          />
          <div>
            <strong>{provider?.name || "Selected Provider"}</strong>
            <span>{provider?.skills || "Service provider"}</span>
            <small>{provider?.serviceArea || "Service area not specified"}</small>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="booking-form-row">
            <div className="booking-field">
              <label htmlFor="date">Preferred date *</label>
              <input
                id="date"
                name="date"
                type="date"
                min={minimumDate}
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && <span className="booking-field-error">{errors.date}</span>}
            </div>

            <div className="booking-field">
              <label htmlFor="time">Preferred time *</label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
              />
              {errors.time && <span className="booking-field-error">{errors.time}</span>}
            </div>
          </div>

          <div className="booking-field">
            <label htmlFor="description">What service do you need? *</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Example: The kitchen sink is leaking and needs repair."
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && (
              <span className="booking-field-error">{errors.description}</span>
            )}
          </div>

          <div className="booking-field">
            <label htmlFor="address">Client address *</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Street, building, city"
              value={form.address}
              onChange={handleChange}
            />
            {errors.address && (
              <span className="booking-field-error">{errors.address}</span>
            )}
          </div>

          <div className="booking-form-row">
            <div className="booking-field">
              <label htmlFor="area">Area / city</label>
              <input
                id="area"
                name="area"
                type="text"
                placeholder="Example: Baabda"
                value={form.area}
                onChange={handleChange}
              />
            </div>

            <div className="booking-field">
              <label htmlFor="locationDetails">Building / floor / landmark</label>
              <input
                id="locationDetails"
                name="locationDetails"
                type="text"
                placeholder="Example: 3rd floor, near the pharmacy"
                value={form.locationDetails}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="booking-location-box">
            <div>
              <strong>Current location</strong>
              <p>Add coordinates to help the provider find you more easily.</p>
              {form.latitude && form.longitude && (
                <small>
                  Latitude: {form.latitude} · Longitude: {form.longitude}
                </small>
              )}
              {locationStatus && <span>{locationStatus}</span>}
            </div>
            <button type="button" onClick={useCurrentLocation}>
              Use Current Location
            </button>
          </div>

          <button className="booking-submit-button" type="submit">
            Submit Booking Request
          </button>
        </form>
      </section>
    </main>
  );
}
