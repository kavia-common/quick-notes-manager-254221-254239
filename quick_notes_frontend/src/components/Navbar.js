import React from "react";

/**
 * Top navigation bar with brand and environment badge.
 *
 * PUBLIC_INTERFACE
 */
export default function Navbar({ environmentLabel = "Quick Notes" }) {
  return (
    <nav className="navbar" aria-label="Top Navigation">
      <div className="navbar-inner">
        <div className="brand-dot" aria-hidden="true" />
        <div className="brand-title" aria-label="App Title">
          Quick Notes
        </div>
        <div className="nav-spacer" />
        <span className="env-badge" aria-label="Environment">
          {environmentLabel}
        </span>
      </div>
    </nav>
  );
}
