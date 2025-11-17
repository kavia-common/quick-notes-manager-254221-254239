# Quick Notes - Rose Gold Frontend

Elegant, responsive React UI to create, view, and manage notes. Uses Supabase if configured; otherwise falls back to local storage. Styled with a refined Rose Gold theme.

## Features

- Create, edit, delete notes
- Accessible modal for add/edit
- Search notes
- Floating action button
- Supabase-backed persistence when available
- LocalStorage fallback
- Responsive cards grid

## Getting Started

1) Install dependencies
   npm install

2) Run the app
   npm start
   Open http://localhost:3000

3) Optional: Configure Supabase
   Create a .env file in this folder with:
   REACT_APP_SUPABASE_URL=<your-supabase-url>
   REACT_APP_SUPABASE_KEY=<your-anon-key>

When both variables are set, the app uses Supabase. Otherwise it stores notes in localStorage.

## Environment Variables

- REACT_APP_SUPABASE_URL: Supabase project URL
- REACT_APP_SUPABASE_KEY: Supabase anon/public API key
- REACT_APP_NODE_ENV: Environment label shown in the UI (optional)

You can also set other variables passed by the platform as needed, but they are not required.

## Supabase Schema

Create a table called notes:

- id: uuid primary key default uuid_generate_v4()
- title: text
- content: text
- created_at: timestamp with time zone default now()
- updated_at: timestamp with time zone default now()

You may add a trigger to keep updated_at in sync on updates.

Example SQL:

create extension if not exists "uuid-ossp";

create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_notes_update on public.notes;
create trigger on_notes_update
before update on public.notes
for each row
execute procedure public.set_updated_at();

## Project Structure

src/
  components/
    FloatingActionButton.js
    Navbar.js
    NoteCard.js
    NoteModal.js
  services/
    notesService.js
  App.js
  App.css
  theme.css
  index.js
  index.css

## Security

- No secrets stored in code. Provide Supabase credentials via environment variables.
- Avoid logging sensitive data.
- Sanitizes user input by trimming before save.

## Accessibility

- Modal uses aria-modal, labelled headings, Escape to close, and focus management.
- Buttons have clear aria-labels/titles.
- Logical heading and landmark structure.

## License

MIT
