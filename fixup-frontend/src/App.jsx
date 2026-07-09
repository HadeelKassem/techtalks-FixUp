import { useState, useEffect } from "react";
import Register from "./Register";
import ClientDashboard from "./ClientDashboard";
import ProviderDashboard from "./ProviderDashboard";
import { getValidSession, clearSession } from "./api";
import "./App.css";

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

  if (user.role === "PROVIDER") {
    return <ProviderDashboard user={user} onLogout={handleLogout} />;
  }

  // Unknown/unexpected role — safest fallback is to log out rather than
  // show a broken screen.
  clearSession();
  return <Register onDone={handleAuthDone} />;
}

export default App;