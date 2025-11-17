import React from "react";

/**
 * NoteCard renders a single note as a card with edit/delete actions.
 *
 * PUBLIC_INTERFACE
 */
export default function NoteCard({ note, onEdit, onDelete }) {
  const title = note.title?.trim() || "Untitled";
  const date = note.updated_at
    ? typeof note.updated_at === "string"
      ? new Date(note.updated_at)
      : new Date(note.updated_at)
    : null;
  const dateLabel = date ? date.toLocaleString() : "";

  return (
    <article className="note-card" aria-label={`Note: ${title}`}>
      <header className="note-meta">
        <h3 className="note-title">{title}</h3>
        <time dateTime={date ? date.toISOString() : undefined} aria-label="Last updated">
          {dateLabel}
        </time>
      </header>
      <div className="note-content">{note.content}</div>
      <div className="card-actions">
        <button
          className="icon-btn"
          onClick={() => onEdit(note)}
          aria-label={`Edit ${title}`}
          title="Edit"
          type="button"
        >
          ✏️ Edit
        </button>
        <button
          className="icon-btn"
          onClick={() => onDelete(note)}
          aria-label={`Delete ${title}`}
          title="Delete"
          type="button"
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}
