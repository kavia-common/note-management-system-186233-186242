import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export default function Toast({ message, type = "info", onClose, duration = 2200 }) {
  /** Simple toast; types: info, success, error */
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg =
    type === "error"
      ? "linear-gradient(180deg, rgba(239,68,68,.95), rgba(239,68,68,.85))"
      : type === "success"
      ? "linear-gradient(180deg, rgba(16,185,129,.95), rgba(16,185,129,.85))"
      : "linear-gradient(180deg, rgba(37,99,235,.95), rgba(37,99,235,.85))";

  return (
    <div
      role="status"
      aria-live="polite"
      className="surface"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        padding: "10px 14px",
        borderRadius: 12,
        color: "#fff",
        background: bg,
        border: "1px solid rgba(255,255,255,.2)",
        boxShadow: "var(--shadow-md)",
        zIndex: 50,
      }}
      onClick={onClose}
      title="Dismiss"
    >
      {message}
    </div>
  );
}
