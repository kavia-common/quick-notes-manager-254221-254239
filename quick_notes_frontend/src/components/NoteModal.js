import React, { useEffect, useRef, useState } from "react";

/**
 * Accessible modal to add/edit a note.
 *
 * PUBLIC_INTERFACE
 */
export default function NoteModal({ open, onClose, onSave, initialNote }) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const dialogRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle(initialNote?.title || "");
      setContent(initialNote?.content || "");
      setTimeout(() => titleInputRef.current?.focus(), 50);
      const handleEsc = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [open, initialNote, onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const payload = { title: title.trim(), content: content.trim() };
    onSave(payload);
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
      ref={dialogRef}
      onMouseDown={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" id="note-modal-title">
            {initialNote ? "Edit Note" : "Add Note"}
          </h2>
          <button
            className="modal-close"
            aria-label="Close"
            onClick={onClose}
            type="button"
            title="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="input"
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              maxLength={120}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
            />
          </div>
          <div className="modal-actions">
            <button className="btn" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {initialNote ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
