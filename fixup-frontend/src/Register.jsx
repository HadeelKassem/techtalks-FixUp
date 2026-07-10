import { useState } from "react";
import { login, signup, saveSession } from "./api";
import "./Register.css";

const serviceCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Appliance Repair",
  "Cleaning",
  "Other",
];

function Register({ onDone }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [role, setRole] = useState("client");
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    description: serviceCategories[0], // provider's service category
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  };

  const validateLogin = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateSignup = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!/^\+?[\d\s-]{7,}$/.test(form.phoneNumber)) next.phoneNumber = "Enter a valid phone number.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords don't match.";
    if (role === "client" && !form.location.trim()) next.location = "Enter your area.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (mode === "login") {
      if (!validateLogin()) return;
      setIsSubmitting(true);
      try {
        const data = await login({ email: form.email, password: form.password });
        saveSession(data);
        onDone?.({ mode: "login", user: data.user });
      } catch (err) {
        setServerError(err.message || "Couldn't log in. Check your credentials and try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!validateSignup()) return;
      setIsSubmitting(true);
      try {
        // Register endpoint only returns a confirmation message, not a
        // session — so send them to log in right after.
        await signup({ role, ...form });
        setSuccessMessage("Account created! Log in below to continue.");
        setMode("login");
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } catch (err) {
        setServerError(err.message || "Couldn't create your account. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="register-shell">
      <div className="register-card">
        <div className="register-brand">
          Fix<span>Up</span>
        </div>
        <p className="register-tagline">
          {mode === "login"
            ? "Welcome back — log in to manage your requests."
            : "Book trusted help, or find your next job — pick how you'll use FixUp."}
        </p>

        <div className="mode-toggle" role="tablist" aria-label="Login or sign up">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "mode-option is-active" : "mode-option"}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? "mode-option is-active" : "mode-option"}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        {mode === "signup" && (
          <div className="role-toggle" role="tablist" aria-label="Account type">
            <button
              type="button"
              role="tab"
              aria-selected={role === "client"}
              className={role === "client" ? "role-option is-active" : "role-option"}
              onClick={() => setRole("client")}
            >
              I need a service
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === "provider"}
              className={role === "provider" ? "role-option is-active" : "role-option"}
              onClick={() => setRole("provider")}
            >
              I offer a service
            </button>
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <label className="field">
              <span className="field-label">Full name</span>
              <input
                type="text"
                value={form.username}
                onChange={handleChange("username")}
                placeholder="e.g. Sarah Haddad"
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </label>
          )}

          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          {mode === "signup" && (
            <label className="field">
              <span className="field-label">Phone number</span>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                placeholder="+961 70 000 000"
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </label>
          )}

          {mode === "signup" &&
            (role === "client" ? (
              <label className="field">
                <span className="field-label">Your area</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={handleChange("location")}
                  placeholder="e.g. Achrafieh, Beirut"
                />
                {errors.location && <span className="field-error">{errors.location}</span>}
              </label>
            ) : (
              <label className="field">
                <span className="field-label">Main service category</span>
                <select value={form.description} onChange={handleChange("description")}>
                  {serviceCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            ))}

          {mode === "login" ? (
            <label className="field">
              <span className="field-label">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </label>
          ) : (
            <div className="field-row">
              <label className="field">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="At least 6 characters"
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </label>

              <label className="field">
                <span className="field-label">Confirm password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </label>
            </div>
          )}

          {serverError && <div className="server-error">{serverError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button type="submit" className="register-submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait…"
              : mode === "login"
              ? "Log in"
              : `Create ${role === "client" ? "client" : "provider"} account`}
          </button>
        </form>

        <p className="register-footnote">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" className="link-btn" onClick={() => switchMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Register;