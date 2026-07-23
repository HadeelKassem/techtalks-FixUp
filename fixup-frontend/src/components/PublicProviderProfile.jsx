import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authRequest } from "../api";
import "./PublicProviderProfile.css";

export default function PublicProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProvider() {
      try {
        const data = await authRequest(`/api/providers/${id}`);
        setProvider(data);
      } catch (err) {
        setError(err.message || "Couldn't load provider.");
      } finally {
        setLoading(false);
      }
    }

    loadProvider();
  }, [id]);

  if (loading) {
    return <p className="profile-loading">Loading provider...</p>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="public-profile-page">
      <div className="public-profile-card">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="profile-header">
          <h1>Provider Profile</h1>
          <p>View provider information.</p>
        </div>

        <div className="profile-image-section">
          <img
            src={
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(provider.name)
            }
            alt="Provider"
            className="profile-image"
          />
        </div>

        <div className="provider-status-row">
          {provider.verified && (
            <span className="verified-pill">
              ✓ Verified
            </span>
          )}

          <span className="rating-pill">
            ★ {provider.avgRating}
          </span>
        </div>

        <div className="grid">

          <div className="input-group">
            <label>Name</label>
            <input value={provider.name} readOnly />
          </div>

          <div className="input-group">
            <label>Skills</label>
            <input value={provider.skills || "-"} readOnly />
          </div>

          <div className="input-group full-width">
            <label>Service Area</label>
            <input
              value={provider.serviceArea || "-"}
              readOnly
            />
          </div>

          <div className="input-group full-width">
            <label>Bio</label>

            <textarea
              value={provider.bio || ""}
              rows={4}
              readOnly
            />
          </div>

        </div>

        <div className="buttons">
          <button className="book-btn">
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
}