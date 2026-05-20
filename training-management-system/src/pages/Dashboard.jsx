import { AlertTriangle, BrainCircuit, CheckCircle2, Clock, Gauge, TrendingUp, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryPie, ModuleBarChart, TrendChart } from '../components/Charts.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Skeleton from '../components/Skeleton.jsx';
import StatCard from '../components/StatCard.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';

export default function Dashboard() {
  const { data, loading, error } = useTrainingData();
  if (loading) return <Skeleton lines={8} />;
  if (error) return <div className="surface p-6 text-red-600">{error}</div>;

  const cards = [
    { label: 'Employees', value: data.kpis.employees, detail: 'Active learning profiles', icon: UsersRound, tone: 'bg-slate-950' },
    { label: 'Team Completion', value: `${data.kpis.teamCompletion}%`, detail: 'Average module completion', icon: CheckCircle2, tone: 'bg-emerald-600' },
    { label: 'Readiness Score', value: `${data.kpis.readiness}%`, detail: 'Weighted operational readiness', icon: Gauge, tone: 'bg-blue-600' },
    { label: 'At Risk', value: data.kpis.atRisk, detail: 'Employees needing attention', icon: AlertTriangle, tone: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.9fr]">
        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Progress Trends</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completion, readiness, and forecast movement</p>
            </div>
            <Link className="secondary-button" to="/analytics"><TrendingUp className="h-4 w-4" />Analytics</Link>
          </div>
          <TrendChart data={data.monthly} />
        </div>
        <div className="surface p-5">
          <h2 className="text-lg font-black">Skill Mix</h2>
          <CategoryPie data={data.categories} />
          <div className="grid grid-cols-2 gap-2">
            {data.categories.map((category) => (
              <div key={category.name} className="rounded-lg bg-slate-100 p-3 dark:bg-white/10">
                <p className="text-sm font-black">{category.name}</p>
                <p className="text-xs font-semibold text-slate-500">{category.completion}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_.8fr]">
        <div className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Employee Cards</h2>
          <div className="space-y-4">
            {data.employees.slice(0, 5).map((employee) => (
              <Link key={employee.id} to={`/employees/${employee.id}`} className="block rounded-lg border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <img src={employee.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-black">{employee.name}</p>
                      <span className={`badge ${employee.status === 'At Risk' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'}`}>{employee.status}</span>
                    </div>
                    <p className="truncate text-xs font-semibold text-slate-500">{employee.role}</p>
                    <div className="mt-2"><ProgressBar value={employee.progress} tone="bg-blue-600" /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Completion Analytics</h2>
          <ModuleBarChart data={data.modules} />
        </div>

        <div className="rounded-lg border border-slate-900/10 bg-slate-950 p-5 text-white shadow-glass">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/10"><BrainCircuit className="h-5 w-5" /></div>
            <div>
              <h2 className="text-lg font-black">Insight Cards</h2>
              <p className="text-xs font-semibold text-slate-300">Realtime training signals</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.recent.map((item) => <div key={item} className="rounded-lg bg-white/10 p-3 text-sm font-semibold text-slate-100">{item}</div>)}
            <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3 text-sm font-semibold">
              <Clock className="h-5 w-5 text-blue-300" /> {data.kpis.dueSoon} deadlines in the next 21 days.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
