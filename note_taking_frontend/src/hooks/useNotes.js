import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createNote, deleteNote, listNotes, updateNote } from "../services/api";
import { debounce } from "../utils/debounce";

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to manage notes collection and currently selected note.
   * Provides: notes, selected, setSelectedId, createNew, updateSelected,
   * deleteSelected (with id), search, setSearch, loading, error, saving
   */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listNotes(search);
      setNotes(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0].id);
      } else if (selectedId && !data.find(n => n.id === selectedId)) {
        setSelectedId(data[0]?.id || null);
      }
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [search, selectedId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNew = useCallback(async () => {
    const note = await createNote({ title: "Untitled", content: "" });
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    return note;
  }, []);

  const doUpdate = useCallback(async (id, payload) => {
    setSaving(true);
    try {
      const updated = await updateNote(id, payload);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }, []);

  const debouncedRef = useRef(null);
  useEffect(() => {
    debouncedRef.current = debounce(doUpdate, 500);
    return () => { debouncedRef.current?.cancel?.(); };
  }, [doUpdate]);

  const updateSelected = useCallback((patch) => {
    if (!selected) return;
    // optimistic local update
    setNotes((prev) =>
      prev.map((n) => (n.id === selected.id ? { ...n, ...patch } : n))
    );
    debouncedRef.current(selected.id, patch);
  }, [selected]);

  const deleteSelected = useCallback(async (id) => {
    const toDelete = id || selectedId;
    if (!toDelete) return;
    await deleteNote(toDelete);
    setNotes((prev) => prev.filter((n) => n.id !== toDelete));
    if (selectedId === toDelete) {
      setSelectedId((prev) => {
        const first = notes.find((n) => n.id !== toDelete);
        return first?.id || null;
      });
    }
  }, [selectedId, notes]);

  return {
    notes,
    selected,
    selectedId,
    setSelectedId,
    createNew,
    updateSelected,
    deleteSelected,
    search,
    setSearch,
    loading,
    error,
    saving,
    refresh,
  };
}
