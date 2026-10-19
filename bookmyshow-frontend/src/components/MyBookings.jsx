import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function MyBookings({ user, notify }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api.myBookings(user.id).then(setList).catch((e) => setError(e.message));

  useEffect(() => { load(); }, [user.id]);

  async function cancel(id) {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.cancel(id, user.id);
      notify("Booking cancelled");
      load();
    } catch (e) {
      notify(e.message, "err");
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!list) return <p className="muted">Loading…</p>;

  return (
    <>
      <h2>My bookings</h2>
      {list.length === 0 && <p className="muted">You have no bookings yet.</p>}
      {list.map((b) => (
        <div className="booking" key={b.id}>
          <div>
            <b>{b.movieTitle}</b>
            <div className="muted">{b.theatreName}</div>
            <div className="muted small-text">
              Seats: {b.seatLabels.join(", ")} • ₹{b.totalAmount} • Booked{" "}
              {new Date(b.bookedAt).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}
            </div>
          </div>
          <div className="right">
            <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
            {b.status === "CONFIRMED" && (
              <button className="btn danger small" onClick={() => cancel(b.id)}>Cancel</button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
