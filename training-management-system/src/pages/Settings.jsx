import { DatabaseZap, Moon, RadioTower, Sun } from 'lucide-react';
import { hasSupabase } from '../services/api.js';

export default function Settings({ darkMode, setDarkMode }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="surface p-5">
        <h2 className="text-lg font-black">Application Settings</h2>
        <div className="mt-5 space-y-3">
          <button className="secondary-button w-full justify-between" onClick={() => setDarkMode(!darkMode)}>
            <span className="inline-flex items-center gap-2">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme</span>
            <span>{darkMode ? 'Dark' : 'Light'}</span>
          </button>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10">
            <div className="flex items-center gap-3">
              <DatabaseZap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-black">Data Source</p>
                <p className="text-sm font-semibold text-slate-500">{hasSupabase ? 'Supabase PostgreSQL realtime' : 'Local preview storage'}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10">
            <div className="flex items-center gap-3">
              <RadioTower className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-black">Realtime Updates</p>
                <p className="text-sm font-semibold text-slate-500">Enabled for employees, modules, assignments, and reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface p-5">
        <h2 className="text-lg font-black">Deployment Checklist</h2>
        <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {[
            'Create Supabase project and run src/supabase/schema.sql.',
            'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.',
            'Set VITE_ADMIN_PASSWORD for admin mode.',
            'Deploy to Vercel using npm run build.'
          ].map((item) => (
            <div key={item} className="rounded-lg bg-slate-100 p-3 dark:bg-white/10">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
