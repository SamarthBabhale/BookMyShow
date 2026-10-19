import { useEffect, useState } from "react";
import { api } from "../api.js";

export function Poster({ movie }) {
  const [broken, setBroken] = useState(false);
  const hue = [...movie.title].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="poster"
      style={{ background: `linear-gradient(160deg, hsl(${hue} 60% 35%), hsl(${(hue + 50) % 360} 55% 15%))` }}
    >
      {movie.posterUrl && !broken && (
        <img src={movie.posterUrl} alt={movie.title} onError={() => setBroken(true)} />
      )}
      {(!movie.posterUrl || broken) && <span>{movie.title}</span>}
      {movie.certificate && <em>{movie.certificate}</em>}
    </div>
  );
}

export default function MovieList({ onSelect }) {
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.movies().then(setMovies).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!movies) return <p className="muted">Loading movies…</p>;
  if (movies.length === 0)
    return <p className="muted">No movies yet. Run your sample-catalog SQL in MySQL first.</p>;

  return (
    <>
      <h2>Now showing</h2>
      <div className="grid">
        {movies.map((m) => (
          <div className="card" key={m.id} onClick={() => onSelect(m)}>
            <Poster movie={m} />
            <div className="info">
              <b>{m.title}</b>
              <span className="muted">{[m.language, m.genre].filter(Boolean).join(" • ")}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
