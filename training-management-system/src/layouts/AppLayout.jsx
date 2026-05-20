import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookOpenCheck, BriefcaseBusiness, ChevronLeft, LayoutDashboard, Menu, Moon, Settings, ShieldCheck, Sun, UsersRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { hasSupabase } from '../services/api.js';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: UsersRound },
  { to: '/modules', label: 'Modules', icon: BookOpenCheck },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: BriefcaseBusiness },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/admin', label: 'Admin', icon: ShieldCheck }
];

export default function AppLayout({ children, darkMode, setDarkMode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const sidebar = (
    <aside className={`${collapsed ? 'w-[86px]' : 'w-72'} flex h-full flex-col border-r border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-2xl transition-all dark:border-white/10 dark:bg-slate-950/80`}>
      <div className="flex items-center justify-between">
        <NavLink to="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-white shadow-xl shadow-slate-900/20 dark:bg-blue-500">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-[0.18em] text-slate-950 dark:text-white">TrainOps</p>
              <p className="truncate text-xs font-semibold text-slate-500">Realtime academy</p>
            </div>
          )}
        </NavLink>
        <button className="icon-button hidden lg:inline-grid" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">
          <ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="mt-8 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15 dark:bg-blue-500'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
        {!collapsed && (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Access</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{isAdmin ? 'Admin editing enabled' : 'Public view mode'}</p>
            <p className="text-xs text-slate-500">{hasSupabase ? 'Supabase realtime connected' : 'Local preview data active'}</p>
          </>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(135deg,#f8fafc,#eef2ff_42%,#ecfeff)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,#1d4ed8,transparent_30%),linear-gradient(135deg,#020617,#0f172a_54%,#111827)] dark:text-white">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="h-full w-80 max-w-[86vw]" initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}>
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`${collapsed ? 'lg:pl-[86px]' : 'lg:pl-72'} transition-all`}>
        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/65 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button className="icon-button lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Training Management</p>
                <h1 className="truncate text-xl font-black sm:text-2xl">{pageTitle(location.pathname)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <NavLink to="/admin" className="primary-button">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Login'}</span>
              </NavLink>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

function pageTitle(pathname) {
  if (pathname.startsWith('/employees/')) return 'Employee Profile';
  const match = nav.find((item) => item.to === pathname);
  return match?.label || 'Dashboard';
}
