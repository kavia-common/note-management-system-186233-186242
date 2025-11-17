import React from "react";

// PUBLIC_INTERFACE
export default function Modal({ open, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) {
  /** Accessible modal dialog for confirmations. */
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 100,
      }}
      onClick={onCancel}
    >
      <div
        className="surface"
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          borderRadius: 14,
          padding: 16,
          boxShadow: "var(--shadow-md)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="modal-title" className="h1" style={{ marginBottom: 8 }}>
          {title}
        </div>
        <div className="h2" style={{ marginBottom: 16 }}>{message}</div>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onCancel} autoFocus>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
