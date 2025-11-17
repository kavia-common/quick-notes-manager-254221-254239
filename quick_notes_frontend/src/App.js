import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./theme.css";
import Navbar from "./components/Navbar";
import NoteCard from "./components/NoteCard";
import FloatingActionButton from "./components/FloatingActionButton";
import NoteModal from "./components/NoteModal";
import { createNotesService } from "./services/notesService";

/**
 * Quick Notes main app with Rose Gold theme.
 *
 * PUBLIC_INTERFACE
 */
function App() {
  // Theme preference (light only UI with elegant Rose Gold background; keeping toggle for extensibility)
  const [theme] = useState("light");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [backend, setBackend] = useState("local");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Service instance
  const service = useMemo(() => createNotesService(), []);

  // Apply data-theme for existing base styles (not strictly used with Rose Gold CSS)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await service.listNotes({ search });
      setNotes(list);
    } catch (e) {
      setErr(e?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [service, search]);

  useEffect(() => {
    async function bootstrap() {
      const info = await service.init();
      setBackend(info.backend || "local");
      await load();
    }
    bootstrap();
  }, [service, load]);

  const onAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const onEdit = (note) => {
    setEditing(note);
    setModalOpen(true);
  };

  const onDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title || "Untitled"}"?`)) return;
    setErr("");
    try {
      await service.deleteNote(note.id);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to delete note");
    }
  };

  const onSave = async ({ title, content }) => {
    setErr("");
    try {
      if (editing) {
        await service.updateNote(editing.id, { title, content });
      } else {
        await service.createNote({ title, content });
      }
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to save note");
    }
  };

  const envLabel = useMemo(() => {
    const be = backend === "supabase" ? "Supabase" : "Local";
    return `${be} • ${process.env.REACT_APP_NODE_ENV || "dev"}`;
  }, [backend]);

  const filtered = notes;

  return (
    <div>
      <Navbar environmentLabel={envLabel} />
      <main className="container">
        <section className="toolbar" aria-label="Notes toolbar">
          <label htmlFor="search" className="visually-hidden">Search notes</label>
          <input
            id="search"
            className="search-input"
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" type="button" onClick={load} aria-label="Refresh notes">
            Refresh
          </button>
        </section>

        {err ? (
          <div role="alert" className="empty" style={{ borderColor: "#fecaca", color: "#b91c1c" }}>
            {err}
          </div>
        ) : null}

        {loading ? (
          <div aria-busy="true" className="empty">Loading notes…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            No notes yet. Click “New Note” to create your first note.
          </div>
        ) : (
          <section className="grid" aria-label="Notes list">
            {filtered.map((n) => (
              <NoteCard key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </section>
        )}
      </main>

      <FloatingActionButton onClick={onAdd} />

      <NoteModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
        initialNote={editing}
      />
    </div>
  );
}

export default App;
