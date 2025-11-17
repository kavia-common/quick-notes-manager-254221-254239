import React from "react";

/**
 * FloatingActionButton to trigger creating a new note.
 *
 * PUBLIC_INTERFACE
 */
export default function FloatingActionButton({ onClick }) {
  return (
    <button
      className="fab"
      onClick={onClick}
      aria-label="Add new note"
      title="Add note"
      type="button"
    >
      <span aria-hidden="true">＋</span>
      New Note
    </button>
  );
}
