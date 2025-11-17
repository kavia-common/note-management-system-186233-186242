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
        if (titleRef.current) titleRef.current.blur();
        if (contentRef.current) contentRef.current.blur();
      }
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
