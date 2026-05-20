import {
  BarChart3,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
  UsersRound
} from 'lucide-react';

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: UsersRound },
  { id: 'modules', label: 'Training', icon: BookOpenCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function Layout({ page, setPage, collapsed, setCollapsed, dark, setDark, children }) {
  return (
    <div className="min-h-screen bg-fog text-slate-900 transition dark:bg-[#101826] dark:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(22,163,74,0.14),transparent_30%)]" />
      <div className="relative flex min-h-screen">
        <aside className={`${collapsed ? 'w-24' : 'w-72'} sticky top-0 h-screen border-r border-white/60 bg-white/70 p-4 shadow-glass backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-950/60`}>
          <div className="mb-8 flex items-center justify-between">
            <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => setPage('dashboard')}>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-ink text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              {!collapsed && (
                <div>
                  <div className="text-base font-extrabold leading-tight">Training MS</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Offline enterprise suite</div>
                </div>
              )}
            </button>
            <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${active ? 'bg-ink text-white shadow-lg shadow-slate-900/15' : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10'}`}
                  onClick={() => setPage(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-6">
          <header className="mb-6 flex items-center justify-between rounded-lg border border-white/60 bg-white/70 px-5 py-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
            <div>
              <h1 className="text-2xl font-black tracking-normal">{nav.find((item) => item.id === page)?.label || 'Dashboard'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Local SQLite data, offline reporting, and desktop-grade workflows.</p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {dark ? 'Light' : 'Dark'}
            </button>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
