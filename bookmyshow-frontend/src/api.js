const BASE = "/api/v1";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach backend. Is Spring Boot running on port 8081?");
  }
  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!res.ok) {
    const method = options.method || "GET";
    throw new Error(
      (data && data.msg) ||
        `${method} ${BASE + path} failed (${res.status}) - no message from backend, check the Spring Boot console`
    );
  }
  return data;
}

export const api = {
  movies: () => request("/movies"),
  shows: (city, date) =>
    request(`/shows?city=${encodeURIComponent(city)}&date=${date}`),
  signup: (body) => request("/profiles", { method: "POST", body: JSON.stringify(body) }),
  login: (identifier) => request(`/profiles/login?identifier=${encodeURIComponent(identifier)}`),
  myBookings: (profileId) => request(`/profiles/${profileId}/bookings`),
  book: (showId, profileId, seatLabels) =>
    request(`/booking/shows/${showId}`, {
      method: "POST",
      body: JSON.stringify({ profileId, seatLabels }),
    }),
  // backend expects a bare JSON number as the body
  cancel: (bookingId, profileId) =>
    request(`/booking/${bookingId}/cancel`, { method: "POST", body: JSON.stringify(profileId) }),
};
