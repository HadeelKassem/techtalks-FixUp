import { useEffect, useState } from "react";
import { getProviders, getMyBookings, getMyClientProfile, updateMyClientProfile, clearSession } from "./api";
import "./ClientDashboard.css";

function StarRating({ value }) {
  const rounded = Math.round(value || 0);
  return (
    <span className="star-rating" aria-label={`${value?.toFixed?.(1) ?? 0} out of 5`}>
      {"★".repeat(rounded)}
      {"☆".repeat(5 - rounded)}
    </span>
  );
}

function bookingStatusClass(status) {
  return (status || "").toLowerCase().replaceAll(" ", "-").replaceAll("_", "-");
}

function ProviderCard({ provider }) {
  return (
    <div className="provider-card">
      <div className="provider-card-top">
        <div className="provider-avatar">{provider.name?.charAt(0)?.toUpperCase() || "?"}</div>
        <div>
          <div className="provider-name-row">
            <span className="provider-name">{provider.name}</span>
            {provider.isVerified && <span className="verified-badge" title="Verified">✓</span>}
          </div>
          <StarRating value={provider.avgRating} />
        </div>
      </div>
      {provider.bio && <p className="provider-bio">{provider.bio}</p>}
      <div className="provider-meta">
        {provider.skills && <span className="meta-chip">{provider.skills}</span>}
        {provider.serviceArea && <span className="meta-chip">{provider.serviceArea}</span>}
      </div>
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <div className="booking-row">
      <div className="booking-main">
        <span className="booking-provider">{booking.providerName}</span>
        <span className="booking-category">{booking.categoryName}</span>
      </div>
      <div className="booking-details">
        <span>{booking.location}</span>
        {booking.preferredDate && <span>· {booking.preferredDate}</span>}
      </div>
      {booking.notes && <p className="booking-notes">{booking.notes}</p>}
      <span className={`status-badge ${bookingStatusClass(booking.status)}`}>{booking.status}</span>
    </div>
  );
}

function ProfileModal({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyClientProfile()
      .then((data) => {
        setProfile(data);
        setForm(data);
      })
      .catch((err) => setError(err.message || "Couldn't load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateMyClientProfile(form);
      setProfile(updated);
      setForm(updated);
    } catch (err) {
      setError(err.message || "Couldn't save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your profile</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {loading && <p className="modal-loading">Loading…</p>}
        {error && <div className="server-error">{error}</div>}

        {form && (
          <div className="modal-form">
            <label className="field">
              <span className="field-label">Name</span>
              <input type="text" value={form.name || ""} onChange={handleChange("name")} />
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input type="email" value={form.email || ""} disabled />
            </label>
            <label className="field">
              <span className="field-label">Phone</span>
              <input type="tel" value={form.phone || ""} onChange={handleChange("phone")} />
            </label>
            <label className="field">
              <span className="field-label">Address</span>
              <input type="text" value={form.address || ""} onChange={handleChange("address")} />
            </label>
            <label className="field">
              <span className="field-label">City</span>
              <input type="text" value={form.city || ""} onChange={handleChange("city")} />
            </label>

            <button className="register-submit" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClientDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("feed");
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    getProviders()
      .then(setProviders)
      .catch((err) => setFeedError(err.message || "Couldn't load providers."))
      .finally(() => setLoadingFeed(false));

    getMyBookings()
      .then(setBookings)
      .catch((err) => setHistoryError(err.message || "Couldn't load your request history."))
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleLogout = () => {
    clearSession();
    onLogout?.();
  };

  return (
    <div className="client-shell">
      <header className="client-topbar">
        <div className="client-brand">
          Fix<span>Up</span>
        </div>

        <nav className="client-tabs">
          <button
            className={tab === "feed" ? "client-tab is-active" : "client-tab"}
            onClick={() => setTab("feed")}
          >
            Providers
          </button>
          <button
            className={tab === "history" ? "client-tab is-active" : "client-tab"}
            onClick={() => setTab("history")}
          >
            Request History
          </button>
        </nav>

        <div className="profile-menu-wrap">
          <button
            className="profile-icon-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Account menu"
          >
            {user?.email?.charAt(0)?.toUpperCase() || "U"}
          </button>
          {menuOpen && (
            <div className="profile-menu">
              <button
                onClick={() => {
                  setProfileOpen(true);
                  setMenuOpen(false);
                }}
              >
                Profile
              </button>
              <button onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </header>

      <main className="client-page-wrap">
        {tab === "feed" && (
          <section>
            <h1 className="section-title">Available providers</h1>
            {loadingFeed && <p className="muted">Loading providers…</p>}
            {feedError && <div className="server-error">{feedError}</div>}
            {!loadingFeed && !feedError && providers.length === 0 && (
              <p className="muted">No providers available right now.</p>
            )}
            <div className="provider-grid">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </section>
        )}

        {tab === "history" && (
          <section>
            <h1 className="section-title">Your request history</h1>
            {loadingHistory && <p className="muted">Loading your requests…</p>}
            {historyError && <div className="server-error">{historyError}</div>}
            {!loadingHistory && !historyError && bookings.length === 0 && (
              <p className="muted">You haven't made any requests yet.</p>
            )}
            <div className="booking-list">
              {bookings.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </div>
          </section>
        )}
      </main>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  );
}

export default ClientDashboard;