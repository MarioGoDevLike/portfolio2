import React, { useState, useEffect } from "react";
import { subscribeToAuth } from "../firebase";
import AdminLogin from "../components/admin/AdminLogin";
import InquiriesDashboard from "../components/admin/InquiriesDashboard";

const AdminDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.35)" }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <InquiriesDashboard />;
};

export default AdminDashboardPage;
