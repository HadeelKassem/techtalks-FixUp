// Centralizes every call to the Java Spring backend.
// Adjust API_BASE_URL below if your backend runs somewhere else.

const API_BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// Decodes a JWT's payload without verifying the signature (verification
// happens server-side). Good enough for reading non-sensitive claims
// like email/role to drive the UI.
export function decodeJwtPayload(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Backend returns only { token }. We decode it to get { email, role, exp }.
export async function login({ email, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const claims = decodeJwtPayload(data.token);

  return {
    token: data.token,
    user: claims ? { email: claims.sub, role: claims.role } : null,
  };
}

// Backend returns only { message } on success — no token, no user.
// Field names must match RegisterRequest exactly: username, email,
// password, phoneNumber, role, description, location.
export function signup({ username, email, phoneNumber, password, role, description, location }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      phoneNumber,
      role: role?.toUpperCase(), // Spring's Role enum expects CLIENT / PROVIDER / ADMIN
      description,
      location,
    }),
  });
}

export function saveSession({ token, user }) {
  if (token) localStorage.setItem("fixup_token", token);
  if (user) localStorage.setItem("fixup_user", JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem("fixup_token");
  const userRaw = localStorage.getItem("fixup_user");
  return {
    token,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
}

export function clearSession() {
  localStorage.removeItem("fixup_token");
  localStorage.removeItem("fixup_user");
}

// Like getSession(), but checks the JWT's expiry (exp claim) and wipes
// the stored session if the token has expired. Use this on app startup.
export function getValidSession() {
  const { token, user } = getSession();
  if (!token) return { token: null, user: null };

  const claims = decodeJwtPayload(token);
  const isExpired = claims?.exp && claims.exp * 1000 < Date.now();

  if (isExpired) {
    clearSession();
    return { token: null, user: null };
  }

  return { token, user };
}

// Generic authenticated request helper for later use
// (e.g. authRequest("/api/client/requests"))
export function authRequest(path, options = {}) {
  const { token } = getSession();
  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ---- Providers feed ----
// GET /api/providers -> List<PublicProviderDto>
export function getProviders() {
  return authRequest("/api/providers");
}

export function getProviderById(id) {
  return authRequest(`/api/providers/${id}`);
}

// ---- Bookings / request history ----
// GET /api/bookings/my -> List<ServiceRequestResponseDTO>
export function getMyBookings() {
  return authRequest("/api/bookings/my");
}

// ---- Client profile ----
// GET /api/clients/me/profile -> ClientProfileDto
export function getMyClientProfile() {
  return authRequest("/api/clients/me/profile");
}

// PUT /api/clients/me/profile -> ClientProfileDto
export function updateMyClientProfile(updates) {
  return authRequest("/api/clients/me/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ---- Provider profile ----
// GET /api/providers/me/profile -> ProviderProfileDto
export function getMyProviderProfile() {
  return authRequest("/api/providers/me/profile");
}

// PUT /api/providers/me/profile -> ProviderProfileDto
export function updateMyProviderProfile(updates) {
  return authRequest("/api/providers/me/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ---- Booking actions (Authentication resolves the user server-side) ----

export function acceptBooking(id) {
  return authRequest(`/api/bookings/${id}/accept`, { method: "PUT" });
}

export function denyBooking(id) {
  return authRequest(`/api/bookings/${id}/deny`, { method: "PUT" });
}

export function providerCompleteBooking(id) {
  return authRequest(`/api/bookings/${id}/complete-provider`, { method: "PUT" });
}

export function clientCompleteBooking(id) {
  return authRequest(`/api/bookings/${id}/complete`, { method: "PUT" });
}

export function cancelBooking(id) {
  return authRequest(`/api/bookings/${id}/cancel`, { method: "PUT" });
}

// ---- Location sharing ----

export function startSharingLocation(id) {
  return authRequest(`/api/bookings/${id}/location/start`, { method: "PUT" });
}

export function stopSharingLocation(id) {
  return authRequest(`/api/bookings/${id}/location/stop`, { method: "PUT" });
}

export function updateLocation(id, { latitude, longitude }) {
  return authRequest(`/api/bookings/${id}/location`, {
    method: "PUT",
    body: JSON.stringify({ latitude, longitude }),
  });
}
// Add these to your existing api.js, next to getMyBookings / startSharingLocation / etc.
// They follow the same fetch + auth-header pattern you're already using there.

export async function getConversationMessages(bookingId) {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/messages`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load messages");
  }

  return response.json();
}

export async function sendChatMessage(bookingId, { text }) {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

