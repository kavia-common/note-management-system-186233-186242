import React from "react";

// PUBLIC_INTERFACE
export default function Header({ theme, onToggleTheme, search, onChangeSearch }) {
  /** App header with brand, search, and theme toggle. */
  return (
    <header
      className="surface"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        margin: 12,
        borderRadius: 14,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.85))",
        position: "sticky",
        top: 8,
        zIndex: 10,
      }}
      aria-label="Application header"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background:
              "conic-gradient(from 180deg at 50% 50%, #2563EB, #60A5FA, #F59E0B, #2563EB)",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.12)",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div className="h1" style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            Ocean Notes
            <span className="small" style={{ color: "var(--muted)", fontWeight: 500 }}>
              Pro
            </span>
          </div>
          <div className="h2">Minimal note-taking, maximum clarity</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <label htmlFor="search" className="small" style={{ position: "absolute", left: -10000 }}>
        Search notes
      </label>
      <input
        id="search"
        className="input"
        value={search}
        onChange={(e) => onChangeSearch(e.target.value)}
        placeholder="Search notes..."
        aria-label="Search notes"
        style={{ maxWidth: 360 }}
      />

      <button
        className="btn"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"} Theme
      </button>
    </header>
  );
}
```

Explanation: Sidebar listing notes and new note button
````write file="note-management-system-186233-186242/note_taking_frontend/src/components/Sidebar.jsx"
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
```

Explanation: Note editor component with autosave and basic keyboard shortcuts
````write file="note-management-system-186233-186242/note_taking_frontend/src/components/NoteEditor.jsx"
import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete, saving }) {
  /** Note editor with title input and content textarea. */
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd+S prevent default
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // We use autosave debounce; here just provide visual cue quickly
        if (titleRef.current) titleRef.current.blur();
        if (contentRef.current) contentRef.current.blur();
      }
      // Ctrl/Cmd+N new note - actually handled upstream
      // Delete - confirm upstream; here no-op
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!note) return null;

  return (
    <section
      className="surface"
      style={{
        flex: 1,
        margin: 12,
        padding: 16,
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 120px)",
      }}
      aria-label="Note editor"
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <input
          ref={titleRef}
          className="input"
          placeholder="Note title"
          value={note.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          aria-label="Note title"
          style={{ fontSize: 20, fontWeight: 700, padding: "12px 14px" }}
        />
        <div style={{ flex: 1 }} />
        <button className="btn btn-danger" onClick={() => onDelete(note.id)} aria-label="Delete note">
          🗑 Delete
        </button>
      </div>
      <textarea
        ref={contentRef}
        className="textarea"
        placeholder="Start writing..."
        value={note.content || ""}
        onChange={(e) => onChange({ content: e.target.value })}
        aria-label="Note content"
        style={{ flex: 1, resize: "vertical", minHeight: 240, lineHeight: 1.6 }}
      />
      <div className="small" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span>Last updated: {new Date(note.updatedAt).toLocaleString()}</span>
        <span aria-live="polite" style={{ color: "var(--muted)" }}>
          {saving ? "Saving..." : "Saved"}
        </span>
      </div>
    </section>
  );
}
```

Explanation: Empty state component
````write file="note-management-system-186233-186242/note_taking_frontend/src/components/EmptyState.jsx"
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
```

Explanation: Toast notification component (portal-less simple)
````write file="note-management-system-186233-186242/note_taking_frontend/src/components/Toast.jsx"
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
```

Explanation: Modal component for delete confirmation
````write file="note-management-system-186233-186242/note_taking_frontend/src/components/Modal.jsx"
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
```

Explanation: Update global index.css to match theme and base typography
````edit file="note-management-system-186233-186242/note_taking_frontend/src/index.css"
<<<<<<< SEARCH
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
=======
@import "./styles/theme.css";

* { box-sizing: border-box; }

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-size: .95em;
  background: rgba(0,0,0,.04);
  padding: 2px 6px;
  border-radius: 6px;
}
>>>>>>> REPLACE
