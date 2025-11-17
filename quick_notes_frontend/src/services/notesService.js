/**
 * Notes service abstraction with optional Supabase backend.
 *
 * This module reads environment variables REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
 * If both are present, it attempts to initialize Supabase and use it for persistence.
 * Otherwise, it falls back to a local in-memory store stored in localStorage.
 *
 * No secrets are hardcoded. Use .env to set required variables at runtime.
 */

// PUBLIC_INTERFACE
export function createNotesService() {
  /** Initialize service using env vars. */
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

  const hasSupabase = Boolean(supabaseUrl && supabaseKey);

  // Lazy import supabase-js only if keys exist to avoid unnecessary dependency if unused.
  let supabase = null;

  const localKey = "quick_notes_v1";

  function readLocal() {
    try {
      const raw = localStorage.getItem(localKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function writeLocal(notes) {
    localStorage.setItem(localKey, JSON.stringify(notes));
  }

  /** Generates a simple id */
  const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // PUBLIC_INTERFACE
  async function init() {
    /**
     * Initialize service. If Supabase config is present, load client dynamically.
     * Returns info about backend in use.
     */
    if (hasSupabase) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        supabase = createClient(supabaseUrl, supabaseKey);
        // Ensure table exists note: This is a no-op here; database migration should create table.
        // Table expected schema:
        // notes: { id: uuid (primary key), title: text, content: text, created_at: timestamp, updated_at: timestamp }
        return { backend: "supabase" };
      } catch (e) {
        // Fallback gracefully
        console.warn("Supabase initialization failed, falling back to local:", e?.message);
        return { backend: "local" };
      }
    }
    return { backend: "local" };
  }

  // PUBLIC_INTERFACE
  async function listNotes({ search = "" } = {}) {
    /**
     * List notes, optionally filtered by search string in title/content.
     */
    if (supabase) {
      const query = supabase.from("notes").select("*").order("updated_at", { ascending: false });
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const filtered = data?.filter((n) => {
        const s = search.trim().toLowerCase();
        if (!s) return true;
        return (n.title || "").toLowerCase().includes(s) || (n.content || "").toLowerCase().includes(s);
      }) || [];
      return filtered;
    }
    // local
    let notes = readLocal().sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
    if (search?.trim()) {
      const s = search.trim().toLowerCase();
      notes = notes.filter(
        (n) => n.title?.toLowerCase().includes(s) || n.content?.toLowerCase().includes(s)
      );
    }
    return notes;
  }

  // PUBLIC_INTERFACE
  async function createNote({ title, content }) {
    /**
     * Create a note.
     */
    const nowIso = new Date().toISOString();
    if (supabase) {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ title, content, created_at: nowIso, updated_at: nowIso }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    const current = readLocal();
    const note = {
      id: newId(),
      title,
      content,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    current.push(note);
    writeLocal(current);
    return note;
  }

  // PUBLIC_INTERFACE
  async function updateNote(id, { title, content }) {
    /**
     * Update a note by id.
     */
    const nowIso = new Date().toISOString();
    if (supabase) {
      const { data, error } = await supabase
        .from("notes")
        .update({ title, content, updated_at: nowIso })
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    const current = readLocal();
    const idx = current.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    current[idx] = { ...current[idx], title, content, updated_at: Date.now() };
    writeLocal(current);
    return current[idx];
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id) {
    /**
     * Delete a note by id.
     */
    if (supabase) {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    }
    const current = readLocal().filter((n) => n.id !== id);
    writeLocal(current);
    return true;
  }

  return { init, listNotes, createNote, updateNote, deleteNote };
}
