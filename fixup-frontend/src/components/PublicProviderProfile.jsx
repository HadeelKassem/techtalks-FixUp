import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authRequest } from "../api";
import "./PublicProviderProfile.css";

export default function PublicProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProvider() {
      try {
        const providerData = await authRequest(`/api/providers/${id}`);
        setProvider(providerData);
    
        const reviewData = await authRequest(`/api/providers/${id}/reviews`);
        setReviews(reviewData);
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
        <button className="back-btn" onClick={() => navigate(-1)}>
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
          {provider.verified && <span className="verified-pill">✓ Verified</span>}
          <span className="rating-pill">★ {provider.avgRating}</span>
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
            <input value={provider.serviceArea || "-"} readOnly />
          </div>

          <div className="input-group full-width">
            <label>Bio</label>
            <textarea value={provider.bio || ""} rows={4} readOnly />
          </div>
        </div>

        <div className="buttons">
          <button
            className="book-btn"
            onClick={() =>
              navigate(`/client/book/${provider.id || id}`, {
                state: { provider },
              })
            }
          >
            Book Now
          </button>
        </div>
        <div className="reviews-section">
  <h2>Customer Reviews</h2>

  {reviews.length === 0 ? (
    <p className="no-reviews">No reviews yet.</p>
  ) : (
    reviews.map((review) => (
      <div className="review-card" key={review.id}>
        <div className="review-top">
          <strong>{review.clientName}</strong>

          <div className="stars">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>

        {review.comment && (
          <p className="review-comment">
            {review.comment}
          </p>
        )}

        <small>
          {new Date(review.createdAt).toLocaleDateString()}
        </small>
      </div>
    ))
  )}
</div>
      </div>

    </div>
  );
}
