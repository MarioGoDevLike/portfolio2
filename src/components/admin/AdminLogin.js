import React, { useState } from "react";
import { motion } from "framer-motion";
import { adminSignIn } from "../../firebase";

const EASE = [0.22, 1, 0.36, 1];

const AdminLogin = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminSignIn(email.trim(), password);
      onSuccess?.();
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Invalid email or password."
          : "Sign-in failed. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#050505",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "36px 32px",
          borderRadius: 20,
          background: "rgba(10,10,13,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#818cf8",
            }}
          >
            Admin
          </span>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 26,
              color: "rgba(255,255,255,0.95)",
              margin: "8px 0 6px",
            }}
          >
            Inquiries Dashboard
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Sign in with your Firebase admin account.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </label>

          {error && (
            <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#f87171" }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 14px",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: "rgba(255,255,255,0.9)",
  outline: "none",
};

const btnStyle = {
  marginTop: 8,
  padding: "13px 20px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 14,
  fontWeight: 700,
  color: "#050505",
  cursor: "pointer",
};

export default AdminLogin;
