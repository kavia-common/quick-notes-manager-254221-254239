Instructions for future agent:
- If Supabase is to be used, ensure the `notes` table exists with columns:
  id (uuid pk, default uuid_generate_v4()), title (text), content (text), created_at (timestamptz default now()), updated_at (timestamptz default now()).
- Optionally create trigger to auto-update updated_at. See QUICK_NOTES_README.md for SQL.
- Consider adding pagination and optimistic updates for larger datasets.
- For routing to a detail page, integrate react-router-dom and add a NoteDetail route (not required currently).
