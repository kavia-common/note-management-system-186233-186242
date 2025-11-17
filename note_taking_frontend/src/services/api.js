/**
 * Notes API client with optional in-memory mock mode.
 * Mock mode controlled via REACT_APP_FEATURE_FLAGS e.g. {"mockNotes": true}
 */

import { parseFeatureFlags } from "../utils/env";

const flags = parseFeatureFlags();
const isMock = !!flags.mockNotes;
const latency = flags.mockLatencyMs ?? 250;

// In-memory mock store
let mockNotes = [
  { id: "1", title: "Welcome to Ocean Notes", content: "This is your first note.\n\nTry editing me!", updatedAt: new Date().toISOString() },
  { id: "2", title: "Shortcuts", content: "- Cmd/Ctrl+N: New note\n- Cmd/Ctrl+S: Save\n- Delete: Delete", updatedAt: new Date().toISOString() },
];

function delay(value, ms = latency) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function baseUrl() {
  const url = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  return (url || "").replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export async function listNotes(query = "") {
  /** List notes, optionally filtered by query (client-side substring search). */
  if (isMock) {
    let list = [...mockNotes];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return delay(list);
  }
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  const res = await fetch(`${baseUrl()}/notes${qs}`);
  if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id. */
  if (isMock) {
    const n = mockNotes.find((x) => x.id === id);
    if (!n) throw new Error("Not found");
    return delay(n);
  }
  const res = await fetch(`${baseUrl()}/notes/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch note: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function createNote(payload = { title: "", content: "" }) {
  /** Create a new note. */
  if (isMock) {
    const note = {
      id: uid(),
      title: payload.title || "Untitled",
      content: payload.content || "",
      updatedAt: new Date().toISOString(),
    };
    mockNotes.unshift(note);
    return delay(note);
  }
  const res = await fetch(`${baseUrl()}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create note: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update an existing note. Partial payload allowed. */
  if (isMock) {
    const idx = mockNotes.findIndex((x) => x.id === id);
    if (idx < 0) throw new Error("Not found");
    mockNotes[idx] = {
      ...mockNotes[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return delay(mockNotes[idx]);
  }
  const res = await fetch(`${baseUrl()}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update note: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  if (isMock) {
    mockNotes = mockNotes.filter((x) => x.id !== id);
    return delay({ success: true });
  }
  const res = await fetch(`${baseUrl()}/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
  return { success: true };
}
