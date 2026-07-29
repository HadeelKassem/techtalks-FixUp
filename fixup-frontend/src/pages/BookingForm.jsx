import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { authRequest } from "../api";
import "./BookingForm.css";

const initialForm = {
  preferredDate: "",
  preferredTime: "",
  address: "",
  area: "",
  locationDetails: "",
  description: "",
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // @Future on the backend requires a date strictly after today
  const minimumDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const offset = tomorrow.getTimezoneOffset();
    return new Date(tomorrow.getTime() - offset * 60 * 1000)
      .toISOString()
      .split("T")[0];
  }, []);

  useEffect(() => {
    if (providerFromNavigation) return;

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

  function validateForm() {
    const nextErrors = {};

    if (!provider?.categoryId) {
      nextErrors.category = "This provider has no category on file — booking can't be created.";
    }
    if (!form.preferredDate) nextErrors.preferredDate = "Please choose a date.";
    if (!form.address.trim()) {
      nextErrors.address = "Please enter the address where the provider should come.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  // The DTO only has a single `location` string and a single `notes` string,
  // so we fold the richer form fields into those two before sending.
  // categoryId comes from the provider being booked, not from the form.
  function buildPayload() {
    const locationParts = [form.address.trim(), form.area.trim(), form.locationDetails.trim()].filter(Boolean);

    const notesParts = [];
    if (form.preferredTime) notesParts.push(`Preferred time: ${form.preferredTime}`);
    if (form.description.trim()) notesParts.push(form.description.trim());

    return {
      categoryId: provider.categoryId,
      location: locationParts.join(", "),
      preferredDate: form.preferredDate,
      notes: notesParts.join("\n\n") || null,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await authRequest("/api/bookings", {
        method: "POST",
        body: JSON.stringify(buildPayload()),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Could not submit your booking request. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          <h1>Booking request sent</h1>
          <p>
            Your request for <strong>{provider?.name || "the provider"}</strong> has been sent.
            You'll be notified once they respond.
          </p>
          <div className="booking-success-actions">
            <button onClick={() => navigate("/client")}>Client Dashboard</button>
            <button
              className="secondary"
              onClick={() => {
                setForm(initialForm);
                setSubmitError("");
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
            Choose when you need the service, explain the request, and tell the provider where to come.
          </p>
        </header>

        <div className="booking-provider-summary">
          <img
            src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(provider?.name || "Provider")}
            alt={provider?.name || "Provider"}
          />
          <div>
            <strong>{provider?.name || "Selected Provider"}</strong>
            <span>{provider?.categoryName || provider?.skills || "Service provider"}</span>
            <small>{provider?.serviceArea || "Service area not specified"}</small>
          </div>
        </div>

        {errors.category && <div className="booking-submit-error">{errors.category}</div>}

        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="booking-form-row">
            <div className="booking-field">
              <label htmlFor="preferredDate">Preferred date *</label>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                min={minimumDate}
                value={form.preferredDate}
                onChange={handleChange}
              />
              {errors.preferredDate && <span className="booking-field-error">{errors.preferredDate}</span>}
            </div>

            <div className="booking-field">
              <label htmlFor="preferredTime">Preferred time</label>
              <input
                id="preferredTime"
                name="preferredTime"
                type="time"
                value={form.preferredTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="booking-field">
            <label htmlFor="description">What service do you need?</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Example: The kitchen sink is leaking and needs repair."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="booking-field">
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Street, building, city"
              value={form.address}
              onChange={handleChange}
            />
            {errors.address && <span className="booking-field-error">{errors.address}</span>}
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

          {submitError && <div className="booking-submit-error">{submitError}</div>}

          <button className="booking-submit-button" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </form>
      </section>
    </main>
  );
}