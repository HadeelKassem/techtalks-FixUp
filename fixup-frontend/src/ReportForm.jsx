import { useState } from "react";
import { submitReview } from "./api";

function StarInput({ value, onChange }) {
  return (
    <div className="star-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="star-input-btn"
          aria-checked={value === n}
          role="radio"
          onClick={() => onChange(n)}
          style={{
            fontSize: 20,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: n <= value ? "#f5a623" : "#ccc",
          }}
        >
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ bookingId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitReview(bookingId, { rating, comment: comment.trim() || null });
      onSubmitted(bookingId);
    } catch (err) {
      setError(err.message || "Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}
    >
      <strong style={{ fontSize: 14 }}>Rate this provider</strong>
      <StarInput value={rating} onChange={setRating} />
      <textarea
        rows={2}
        placeholder="Optional: share details about your experience"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <span className="server-error">{error}</span>}
      <button
        type="submit"
        className="primary-button compact"
        disabled={submitting}
        style={{ alignSelf: "flex-start" }}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;