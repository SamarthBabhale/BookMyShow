import { useEffect, useState } from "react";
import { api } from "./api.js";
import AuthModal from "./components/AuthModal.jsx";
import MovieList from "./components/MovieList.jsx";
import ShowList from "./components/ShowList.jsx";
import SeatPicker from "./components/SeatPicker.jsx";
import MyBookings from "./components/MyBookings.jsx";

export default function App() {
  const [view, setView] = useState("movies"); // movies | shows | seats | bookings
  const [city, setCity] = useState(localStorage.getItem("bms_city") || "Mumbai");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bms_user")); } catch { return null; }
  });
  const [movie, setMovie] = useState(null);
  const [show, setShow] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem("bms_city", city); }, [city]);

  function notify(text, type = "ok") {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }

  function saveUser(u) {
    setUser(u);
    if (u) localStorage.setItem("bms_user", JSON.stringify(u));
    else localStorage.removeItem("bms_user");
  }

  return (
    <>
      <header>
        <div className="bar">
          <div className="logo" onClick={() => setView("movies")}>
            book<b>my</b>show
          </div>
          <input
            className="city"
            list="cities"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <datalist id="cities">
            {["Mumbai", "Pune", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata"].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <div className="spacer" />
          {user ? (
            <>
              <button className="btn ghost" onClick={() => setView("bookings")}>My Bookings</button>
              <span className="muted hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn ghost small" onClick={() => { saveUser(null); setView("movies"); }}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn" onClick={() => setShowAuth(true)}>Sign in</button>
          )}
        </div>
      </header>

      <main>
        {view === "movies" && (
          <MovieList onSelect={(m) => { setMovie(m); setView("shows"); }} />
        )}
        {view === "shows" && movie && (
          <ShowList
            movie={movie}
            city={city}
            onBack={() => setView("movies")}
            onSelect={(s) => {
              if (!user) { setShowAuth(true); notify("Please sign in to book", "err"); return; }
              setShow(s);
              setView("seats");
            }}
          />
        )}
        {view === "seats" && show && (
          <SeatPicker
            show={show}
            user={user}
            onBack={() => setView("shows")}
            onBooked={() => { notify("Booking confirmed 🎉"); setView("bookings"); }}
            notify={notify}
          />
        )}
        {view === "bookings" && user && <MyBookings user={user} notify={notify} />}
      </main>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(u) => { saveUser(u); setShowAuth(false); notify(`Welcome, ${u.name}`); }}
        />
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}
    </>
  );
}
