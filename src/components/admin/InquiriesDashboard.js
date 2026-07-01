import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { HiArrowPath, HiArrowRightOnRectangle, HiMagnifyingGlass } from "react-icons/hi2";
import { adminSignOut, fetchInquiries, updateInquiryStatus } from "../../firebase";

const PROJECT_LABELS = {
  mobile: "Mobile App",
  web: "Web Project",
  both: "Full-Stack",
};

const STATUS_OPTIONS = [
  { value: "received", label: "Received", color: "#818cf8" },
  { value: "under_review", label: "Under Review", color: "#f59e0b" },
  { value: "replied", label: "Replied", color: "#34d399" },
];

const formatDate = (date) => {
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InquiriesDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchInquiries();
      setInquiries(data);
      setSelectedId((prev) => (prev && data.some((i) => i.id === prev) ? prev : data[0]?.id ?? null));
    } catch (err) {
      console.error(err);
      setError("Could not load inquiries. Check Firestore rules and that you are signed in.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (!q) return true;
      return (
        i.refId?.toLowerCase().includes(q) ||
        i.name?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.message?.toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, statusFilter]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? null;

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: inquiries.length,
      today: inquiries.filter((i) => i.createdAt && i.createdAt >= today).length,
      pending: inquiries.filter((i) => i.status === "received").length,
    };
  }, [inquiries]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  const handleSignOut = async () => {
    await adminSignOut();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#f1f5f9" }}>
      {/* header */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, margin: 0 }}>
            Inquiries
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            Portfolio contact submissions
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={load} disabled={loading} style={ghostBtn}>
            <HiArrowPath size={16} /> Refresh
          </button>
          <Link to="/" style={{ ...ghostBtn, textDecoration: "none" }}>← Site</Link>
          <button type="button" onClick={handleSignOut} style={ghostBtn}>
            <HiArrowRightOnRectangle size={16} /> Sign out
          </button>
        </div>
      </header>

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, padding: "20px 20px 0" }}>
        {[
          { label: "Total", value: stats.total },
          { label: "Today", value: stats.today },
          { label: "Awaiting reply", value: stats.pending },
        ].map((s) => (
          <div key={s.label} style={statCard}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#818cf8" }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 360 }}>
          <HiMagnifyingGlass size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
          <input
            type="search"
            placeholder="Search name, email, ref ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "100%", paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", ...STATUS_OPTIONS.map((s) => s.value)].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setStatusFilter(val)}
              style={{
                ...chipStyle,
                background: statusFilter === val ? "rgba(129,140,248,0.18)" : "rgba(255,255,255,0.04)",
                borderColor: statusFilter === val ? "rgba(129,140,248,0.4)" : "rgba(255,255,255,0.08)",
                color: statusFilter === val ? "#818cf8" : "rgba(255,255,255,0.45)",
              }}
            >
              {val === "all" ? "All" : STATUS_OPTIONS.find((s) => s.value === val)?.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ margin: "0 20px 12px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#f87171" }}>{error}</p>
      )}

      {loading ? (
        <p style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>Loading inquiries…</p>
      ) : filtered.length === 0 ? (
        <p style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>
          {inquiries.length === 0 ? "No inquiries yet." : "No matches for your filters."}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
            gap: 0,
            minHeight: "calc(100vh - 220px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
          className="admin-inquiries-layout"
        >
          {/* list */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
            {filtered.map((inq) => {
              const active = selected?.id === inq.id;
              const statusMeta = STATUS_OPTIONS.find((s) => s.value === inq.status) ?? STATUS_OPTIONS[0];
              return (
                <button
                  key={inq.id}
                  type="button"
                  onClick={() => setSelectedId(inq.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "16px 20px",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: active ? "rgba(129,140,248,0.08)" : "transparent",
                    borderLeft: active ? "3px solid #818cf8" : "3px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
                      {inq.name || "Unknown"}
                    </span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: statusMeta.color }}>{statusMeta.label}</span>
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{inq.email}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "#818cf8", letterSpacing: "0.04em" }}>{inq.refId}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{formatDate(inq.createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* detail */}
          {selected && (
            <div style={{ padding: "24px 28px", overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 24 }}>
                <div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#818cf8" }}>{selected.refId}</span>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, margin: "6px 0 4px", color: "rgba(255,255,255,0.95)" }}>
                    {selected.name}
                  </h2>
                  <a href={`mailto:${selected.email}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#22d3ee", textDecoration: "none" }}>
                    {selected.email}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => handleStatusChange(selected.id, s.value)}
                      style={{
                        ...chipStyle,
                        background: selected.status === s.value ? `${s.color}22` : "rgba(255,255,255,0.04)",
                        borderColor: selected.status === s.value ? s.color : "rgba(255,255,255,0.08)",
                        color: selected.status === s.value ? s.color : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
                <MetaField label="Project type" value={PROJECT_LABELS[selected.projectType] || selected.projectType || "—"} />
                <MetaField label="Budget" value={selected.budget || "—"} />
                <MetaField label="Timeline" value={selected.timeline || "—"} />
                <MetaField label="Submitted" value={formatDate(selected.createdAt)} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={fieldLabel}>Project brief</div>
                <div style={messageBox}>{selected.message || "—"}</div>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry ${selected.refId}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 22px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#050505",
                  textDecoration: "none",
                }}
              >
                Reply via email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MetaField = ({ label, value }) => (
  <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
    <div style={fieldLabel}>{label}</div>
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{value}</div>
  </div>
);

const fieldLabel = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.28)",
  marginBottom: 6,
};

const statCard = {
  padding: "16px 18px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "10px 14px",
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  color: "rgba(255,255,255,0.9)",
  outline: "none",
};

const chipStyle = {
  padding: "7px 12px",
  borderRadius: 999,
  border: "1px solid",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  background: "transparent",
};

const ghostBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.03)",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 12,
  color: "rgba(255,255,255,0.55)",
  cursor: "pointer",
};

const messageBox = {
  padding: "16px 18px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.75)",
  whiteSpace: "pre-wrap",
};

export default InquiriesDashboard;
