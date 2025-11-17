# Quick Notes Frontend (React + Rose Gold Theme)

Elegant, responsive notes app with Supabase-ready persistence.

## Setup

1) Install dependencies
   npm install

2) Start development server
   npm start
   Open http://localhost:3000

3) Optional: Supabase persistence
   Create a .env in this folder with:
   REACT_APP_SUPABASE_URL=<your-supabase-url>
   REACT_APP_SUPABASE_KEY=<your-anon-key>

If Supabase env vars are not present, the app uses localStorage.

Environment variables recognized:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_NODE_ENV (optional label)

## Scripts

- npm start
- npm test
- npm run build

## Notes

- UI components are built with accessible HTML and pure CSS under theme.css.
- Notes service is abstracted at src/services/notesService.js for quick swap-in of Supabase.

For more details see QUICK_NOTES_README.md.
