import { useMemo, useState } from "react";
import { api } from "../api.js";

const MAX_SEATS = 8; // backend limit

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true });
}

export default function SeatPicker({ show, user, onBack, onBooked, notify }) {
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const map = {};
    [...show.availableSeatsLabels].sort(naturalSort).forEach((l) => {
      (map[l[0]] ||= []).push(l);
    });
    return Object.entries(map);
  }, [show]);

  function toggle(label) {
    setSelected((cur) => {
      if (cur.includes(label)) return cur.filter((l) => l !== label);
      if (cur.length >= MAX_SEATS) { notify(`Max ${MAX_SEATS} seats per booking`, "err"); return cur; }
      return [...cur, label];
    });
  }

  async function confirm() {
    setBusy(true);
    try {
      await api.book(show.id, user.id, selected);
      onBooked();
    } catch (err) {
      notify(err.message, "err");
      setSelected([]);
    } finally {
      setBusy(false);
    }
  }

  const total = selected.length * Number(show.ticketPrice);

  return (
    <>
      <button className="btn ghost small" onClick={onBack}>← Back</button>
      <h2>{show.movie.title}</h2>
      <p className="muted">
        {show.theatre.name} • {new Date(show.startAt).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}
      </p>

      <div className="screen">SCREEN</div>
      <div className="seatmap">
        {rows.map(([row, labels]) => (
          <div className="seat-row" key={row}>
            <span className="row-name">{row}</span>
            {labels.map((l) => (
              <button
                key={l}
                className={`seat ${selected.includes(l) ? "sel" : ""}`}
                onClick={() => toggle(l)}
              >
                {l.slice(1)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="legend">
        <span><i className="seat" /> Available</span>
        <span><i className="seat sel" /> Selected</span>
        <span className="muted">Booked seats are hidden</span>
      </div>

      <div className="checkout">
        <div>
          <b>{selected.length ? selected.join(", ") : "No seats selected"}</b>
          <div className="muted">Total: ₹{total}</div>
        </div>
        <button className="btn" disabled={!selected.length || busy} onClick={confirm}>
          {busy ? "Booking…" : "Confirm booking"}
        </button>
      </div>
    </>
  );
}
