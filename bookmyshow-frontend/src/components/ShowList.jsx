import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function ShowList({ movie, city, onBack, onSelect }) {
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }),
    []
  );
  const [date, setDate] = useState(iso(days[0]));
  const [shows, setShows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setShows(null);
    setError("");
    api.shows(city, date).then(setShows).catch((e) => setError(e.message));
  }, [city, date]);

  const byTheatre = useMemo(() => {
    const map = {};
    (shows || [])
      .filter((s) => s.movie.id === movie.id)
      .forEach((s) => { (map[s.theatre.name] ||= { theatre: s.theatre, shows: [] }).shows.push(s); });
    return Object.values(map);
  }, [shows, movie]);

  return (
    <>
      <button className="btn ghost small" onClick={onBack}>← Back</button>
      <h2>{movie.title}</h2>
      <p className="muted">
        {[movie.language, movie.genre, movie.durationMinutes && `${movie.durationMinutes} min`, movie.certificate]
          .filter(Boolean).join(" • ")}
      </p>
      {movie.description && <p className="desc">{movie.description}</p>}

      <div className="dates">
        {days.map((d) => (
          <div key={iso(d)} className={`date ${iso(d) === date ? "on" : ""}`} onClick={() => setDate(iso(d))}>
            <small>{d.toLocaleDateString("en", { weekday: "short" })}</small>
            <b>{d.getDate()}</b>
            <small>{d.toLocaleDateString("en", { month: "short" })}</small>
          </div>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {!shows && !error && <p className="muted">Loading shows…</p>}
      {shows && byTheatre.length === 0 && (
        <p className="muted">No shows for “{movie.title}” in {city} on this date.</p>
      )}
      {byTheatre.map(({ theatre, shows }) => (
        <div className="theatre" key={theatre.id}>
          <div>
            <b>{theatre.name}</b>
            <div className="muted small-text">{theatre.address}</div>
          </div>
          <div className="times">
            {shows.map((s) => {
              const free = s.availableSeatsLabels.length;
              return (
                <button
                  key={s.id}
                  className="time"
                  disabled={free === 0}
                  onClick={() => onSelect(s)}
                >
                  {new Date(s.startAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                  <small>₹{s.ticketPrice} • {free === 0 ? "Sold out" : `${free} left`}</small>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
