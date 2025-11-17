import React from "react";

// PUBLIC_INTERFACE
export default function Sidebar({ notes, selectedId, onSelect, onCreate }) {
  /** Sidebar displays notes list and create button. */
  return (
    <aside
      className="surface"
      style={{
        width: 300,
        minWidth: 240,
        maxWidth: 360,
        margin: 12,
        padding: 12,
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
      }}
      aria-label="Notes sidebar"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="h1">Notes</span>
        <button className="btn btn-primary" onClick={onCreate} aria-label="Create new note">
          + New
        </button>
      </div>
      <div
        role="listbox"
        aria-label="Note titles"
        tabIndex={0}
        style={{ overflowY: "auto", paddingRight: 6 }}
      >
        {notes.map((n) => {
          const active = n.id === selectedId;
          return (
            <button
              key={n.id}
              role="option"
              aria-selected={active}
              onClick={() => onSelect(n.id)}
              className="btn"
              style={{
                width: "100%",
                textAlign: "left",
                justifyContent: "flex-start",
                marginBottom: 8,
                borderColor: active ? "rgba(37,99,235,0.6)" : "var(--border)",
                background: active
                  ? "linear-gradient(180deg, rgba(37,99,235,0.10), rgba(37,99,235,0.05))"
                  : "var(--surface)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 600, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: 240 }}>
                  {n.title || "Untitled"}
                </div>
                <div className="small">
                  {new Date(n.updatedAt).toLocaleString()}
                </div>
              </div>
            </button>
          );
        })}
        {!notes.length && <div className="small" style={{ color: "var(--muted)", padding: 12 }}>No notes yet. Create one to get started.</div>}
      </div>
    </aside>
  );
}
