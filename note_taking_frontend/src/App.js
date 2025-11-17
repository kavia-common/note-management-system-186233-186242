import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import Modal from './components/Modal';
import { useNotes } from './hooks/useNotes';
import { parseFeatureFlags } from './utils/env';

// PUBLIC_INTERFACE
function App() {
  /** Main application layout and state integration. */
  const [theme, setTheme] = useState('light');
  const { notes, selected, selectedId, setSelectedId, createNew, updateSelected, deleteSelected, search, setSearch, loading, error, saving } = useNotes();

  // apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const flags = useMemo(() => parseFeatureFlags(), []);

  // toast handling
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    if (error) setToast({ message: error, type: "error" });
  }, [error]);

  // keyboard shortcuts at app level
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNew().then(() => setToast({ message: "New note created", type: "success" }));
      }
      if (e.key === 'Delete' && selectedId) {
        e.preventDefault();
        setConfirmOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [createNew, selectedId]);

  const onToggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // delete confirmation modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const doConfirmDelete = () => {
    deleteSelected(selectedId).then(() => {
      setToast({ message: "Note deleted", type: "success" });
      setConfirmOpen(false);
    }).catch((e) => {
      setToast({ message: e.message || 'Failed to delete', type: "error" });
      setConfirmOpen(false);
    });
  };

  return (
    <div className="app-root">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        search={search}
        onChangeSearch={setSearch}
      />

      <main className="main-area" aria-busy={loading}>
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={() => {
            createNew().then(() => setToast({ message: "New note created", type: "success" }));
          }}
        />

        {selected ? (
          <NoteEditor
            note={selected}
            onChange={updateSelected}
            onDelete={() => setConfirmOpen(true)}
            saving={saving}
          />
        ) : (
          <EmptyState onCreate={() => {
            createNew().then(() => setToast({ message: "New note created", type: "success" }));
          }} />
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />

      <Modal
        open={confirmOpen}
        title="Delete note?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={doConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <footer style={{ padding: 12, textAlign: "center", color: "var(--muted)" }}>
        <small>
          {flags.mockNotes ? "Mock mode enabled" : "Connected to backend"}
        </small>
      </footer>
    </div>
  );
}

export default App;
