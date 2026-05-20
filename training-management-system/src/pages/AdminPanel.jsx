import { LockKeyhole, LogOut, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';

export default function AdminPanel() {
  const { isAdmin, login, logout } = useAdmin();
  const { notify } = useToast();
  const { data } = useTrainingData();
  const [password, setPassword] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!login(password)) {
      notify('Incorrect admin password', 'error');
      return;
    }
    notify('Admin mode enabled');
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl">
        <form className="surface p-6" onSubmit={submit}>
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg bg-slate-950 text-white">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black">Admin Access</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">Enter the single admin password to unlock employee, module, progress, and report management.</p>
          <input className="field mt-5" type="password" placeholder="Admin password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="primary-button mt-4 w-full" type="submit">Unlock admin mode</button>
          <p className="mt-3 text-xs font-semibold text-slate-500">Local default is admin123. Set VITE_ADMIN_PASSWORD in production.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-emerald-600 text-white"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <h2 className="text-2xl font-black">Admin Mode Enabled</h2>
              <p className="text-sm font-semibold text-slate-500">Public viewers remain read-only. Editing tools are available in the management pages.</p>
            </div>
          </div>
          <button className="secondary-button" onClick={() => { logout(); notify('Admin mode disabled'); }}><LogOut className="h-4 w-4" />Logout</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/employees" className="surface p-5 transition hover:-translate-y-0.5">
          <p className="text-sm font-bold text-slate-500">Manage Employees</p>
          <p className="mt-2 text-3xl font-black">{data?.employees.length || 0}</p>
        </Link>
        <Link to="/modules" className="surface p-5 transition hover:-translate-y-0.5">
          <p className="text-sm font-bold text-slate-500">Manage Modules</p>
          <p className="mt-2 text-3xl font-black">{data?.modules.length || 0}</p>
        </Link>
        <Link to="/reports" className="surface p-5 transition hover:-translate-y-0.5">
          <p className="text-sm font-bold text-slate-500">Manage Reports</p>
          <p className="mt-2 text-3xl font-black">{data?.kpis.readiness || 0}%</p>
        </Link>
      </section>
    </div>
  );
}
