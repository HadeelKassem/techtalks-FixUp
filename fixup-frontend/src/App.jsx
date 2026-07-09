import { useState, useEffect, useMemo } from "react";
import Register from "./Register";
import ClientDashboard from "./ClientDashboard";
import { getValidSession, clearSession } from "./api";
import "./App.css";

/* ---------------- PROVIDER DASHBOARD DATA (unchanged) ---------------- */

const initialRequests = [
  {
    id: 1,
    client: "Sarah Haddad",
    provider: "John Plumbing",
    service: "Emergency Plumbing Repair",
    date: "June 28, 2026",
    time: "10:00 AM",
    location: "Achrafieh, Beirut",
    status: "Pending",
    notes: "Kitchen sink is leaking under the cabinet.",
  },
  {
    id: 2,
    client: "Karim Mansour",
    provider: "John Plumbing",
    service: "Pipe Installation",
    date: "June 29, 2026",
    time: "2:30 PM",
    location: "Jounieh",
    status: "Accepted",
    notes: "Install a water pipe for a washing machine.",
  },
  {
    id: 3,
    client: "Maya Khoury",
    provider: "John Plumbing",
    service: "Bathroom Repair",
    date: "June 25, 2026",
    time: "11:00 AM",
    location: "Hazmieh",
    status: "In Progress",
    notes: "Replace the bathroom faucet and check the drain.",
  },
  {
    id: 4,
    client: "Nadine Salameh",
    provider: "John Plumbing",
    service: "Water Heater Check",
    date: "June 19, 2026",
    time: "9:00 AM",
    location: "Verdun, Beirut",
    status: "Completed",
    notes: "Annual water-heater maintenance visit.",
  },
];

const statusSteps = ["Pending", "Accepted", "In Progress", "Completed"];

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClass(status)}`}>{status}</span>;
}

function StatusTracker({ status }) {
  if (status === "Rejected") {
    return (
      <div className="rejected-tracker">
        <span className="rejected-icon">×</span>
        This request was rejected by the provider.
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(status);

  return (
    <div className="status-tracker">
      {statusSteps.map((step, index) => (
        <div className="tracker-item" key={step}>
          <div className={`tracker-dot ${index <= currentStep ? "is-complete" : ""}`}>
            {index < currentStep ? "✓" : index + 1}
          </div>
          <span className={index <= currentStep ? "tracker-label is-complete" : "tracker-label"}>
            {step}
          </span>
          {index < statusSteps.length - 1 && (
            <span className={`tracker-line ${index < currentStep ? "is-complete" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function RequestDetails({ request }) {
  return (
    <div className="request-details">
      <div>
        <span className="detail-label">Client</span>
        <span>{request.client}</span>
      </div>
      <div>
        <span className="detail-label">Date & time</span>
        <span>
          {request.date} · {request.time}
        </span>
      </div>
      <div>
        <span className="detail-label">Location</span>
        <span>{request.location}</span>
      </div>
      <div className="details-notes">
        <span className="detail-label">Client notes</span>
        <span>{request.notes}</span>
      </div>
    </div>
  );
}

/* ---------------- PROVIDER DASHBOARD ---------------- */

function Dashboard({ onLogout }) {
  const [activeView, setActiveView] = useState("provider");
  const [requests, setRequests] = useState(initialRequests);
  const [expandedRequestId, setExpandedRequestId] = useState(null);

  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setExpandedRequestId(id);
  };

  const summary = useMemo(
    () => ({
      pending: requests.filter((r) => r.status === "Pending").length,
      active: requests.filter((r) =>
        ["Accepted", "In Progress"].includes(r.status)
      ).length,
      completed: requests.filter((r) => r.status === "Completed").length,
    }),
    [requests]
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setActiveView("provider")}>
          Fix<span>Up</span>
        </button>

        <nav className="main-nav">
          <button
            className={activeView === "provider" ? "nav-link active" : "nav-link"}
            onClick={() => setActiveView("provider")}
          >
            Provider Dashboard
          </button>
          <button
            className={activeView === "history" ? "nav-link active" : "nav-link"}
            onClick={() => setActiveView("history")}
          >
            Request History
          </button>
          <button className="nav-link" onClick={onLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="page-wrap">
        <h1>Dashboard Loaded</h1>
        <p>You can now paste your full UI here (your original HEAD code).</p>
      </main>
    </div>
  );
}

/* ---------------- APP ENTRY ---------------- */

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // On first load (including refresh), check localStorage for a
  // still-valid token instead of always showing the login screen.
  useEffect(() => {
    const { user: storedUser } = getValidSession();
    if (storedUser) {
      setUser(storedUser);
    }
    setCheckingSession(false);
  }, []);

  const handleAuthDone = ({ user: authedUser }) => {
    if (authedUser) setUser(authedUser);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  if (checkingSession) {
    // Avoids a flash of the login screen while we check localStorage.
    return null;
  }

  if (!user) {
    return <Register onDone={handleAuthDone} />;
  }

  if (user.role === "CLIENT") {
    return <ClientDashboard user={user} onLogout={handleLogout} />;
  }

  // PROVIDER (or anything else) falls back to the existing dashboard.
  return <Dashboard onLogout={handleLogout} />;
}

export default App;