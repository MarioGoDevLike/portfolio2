import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiArrowLeft } from "react-icons/hi";
import { HiArrowDownTray, HiDocumentText } from "react-icons/hi2";
import { SITE } from "../../constants";

const EASE = [0.22, 1, 0.36, 1];

const PortfolioModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState("choice");

  const reset = useCallback(() => {
    setView("choice");
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const fn = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, handleClose]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = SITE.portfolioUrl;
    a.download = SITE.cvFileName;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10003,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: view === "viewer" ? 920 : 440,
              maxHeight: "min(92vh, 900px)",
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(12,12,14,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {view === "viewer" && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Back to options"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <HiArrowLeft size={16} />
                  </button>
                )}
                <span
                  id="portfolio-modal-title"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.88)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {view === "viewer" ? "Portfolio — CV" : "My Portfolio"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <HiX size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {view === "choice" ? (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  style={{ padding: "28px 24px 32px" }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.42)",
                      margin: "0 0 24px",
                      textAlign: "center",
                    }}
                  >
                    How would you like to view Mario&apos;s portfolio?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setView("viewer")}
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", gap: 8 }}
                    >
                      <HiDocumentText size={18} />
                      Open portfolio
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="btn btn-outline"
                      style={{ width: "100%", justifyContent: "center", gap: 8 }}
                    >
                      <HiArrowDownTray size={18} />
                      Download PDF
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="viewer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    background: "#111",
                  }}
                >
                  <iframe
                    title="Mario Nassar CV"
                    src={SITE.portfolioUrl}
                    style={{
                      width: "100%",
                      flex: 1,
                      minHeight: "min(72vh, 760px)",
                      border: "none",
                      display: "block",
                      background: "#fff",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "12px 16px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      Scroll inside the viewer to read the full CV
                    </span>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="btn btn-outline"
                      style={{ padding: "8px 14px", fontSize: 12, gap: 6 }}
                    >
                      <HiArrowDownTray size={14} />
                      Download
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioModal;
