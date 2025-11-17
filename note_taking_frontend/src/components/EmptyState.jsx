import React from "react";

// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  /** Empty state prompting user to create first note. */
  return (
    <div
      className="surface"
      style={{
        margin: 12,
        padding: 24,
        borderRadius: 14,
        textAlign: "center",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)",
      }}
      aria-label="Empty state"
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🗒️</div>
      <div className="h1" style={{ marginBottom: 8 }}>No notes yet</div>
      <div className="h2" style={{ marginBottom: 16 }}>Create your first note to get started.</div>
      <button className="btn btn-primary" onClick={onCreate} aria-label="Create first note">Create note</button>
    </div>
  );
}
