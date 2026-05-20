# Training Management Dashboard

Production-ready public Training Management SaaS dashboard built with React, Vite, TailwindCSS, Supabase, Recharts, Framer Motion, React Router, and browser-based PDF/Excel exports.

## Features

- Public dashboard at `/` for read-only viewers
- Admin page at `/admin` with a single password gate
- Employee management with profile images, roles, remarks, progress, skill scores, search, filters, sorting, and pagination
- Training module management with categories, deadlines, descriptions, weightage, completion, and employee assignment
- Automatic weighted progress calculations, team completion, skill growth, readiness score, risk indicators, heatmaps, and forecasting
- Realtime Supabase subscriptions for employees, modules, assignments, and reviews
- Reports page with PDF and Excel exports
- Dark mode, collapsed sidebar, responsive mobile layout, loading states, toasts, and confirmation dialogs

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://127.0.0.1:5173`.

If Supabase environment variables are not set, the app uses local seeded preview data in `localStorage`.

## Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_ADMIN_PASSWORD=change-this-password
```

Local default admin password is `admin123` when `VITE_ADMIN_PASSWORD` is not set.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `src/supabase/schema.sql`.
4. Enable Realtime for the four tables if your project UI requires manual confirmation.
5. Add the Supabase URL and anon key to `.env` and to Vercel project settings.

The schema includes public read policies and write policies for the single-password UI model. For stricter production security, keep public reads and move writes behind a Supabase Edge Function that validates the admin password server-side.

## Vercel Deployment

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variables from `.env.example`.
7. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Project Structure

```text
src/
  assets/
  components/
  hooks/
  layouts/
  pages/
  services/
  styles/
  supabase/
  utils/
```
