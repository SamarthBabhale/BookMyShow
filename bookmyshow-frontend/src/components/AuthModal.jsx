import { useState } from "react";
import { api } from "../api.js";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", identifier: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user =
        mode === "login"
          ? await api.login(form.identifier)
          : await api.signup({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.replace(/\D/g, "") });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{mode === "login" ? "Sign in" : "Create profile"}</h2>
        {mode === "login" ? (
          <input
            required
            placeholder="Email or phone number"
            value={form.identifier}
            onChange={set("identifier")}
          />
        ) : (
          <>
            <input required placeholder="Full name" value={form.name} onChange={set("name")} />
            <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} />
            <input
              required
              placeholder="Phone (digits only, 10+)"
              value={form.phone}
              onChange={set("phone")}
            />
          </>
        )}
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
        </button>
        <p className="muted switch" onClick={() => { setError(""); setMode(mode === "login" ? "signup" : "login"); }}>
          {mode === "login" ? "New here? Create a profile" : "Already have a profile? Sign in"}
        </p>
      </form>
    </div>
  );
}
