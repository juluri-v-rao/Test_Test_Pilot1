import { Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { ModuleBarChart, RiskChart, TeamComparisonChart, TrendChart } from '../components/Charts.jsx';
import Skeleton from '../components/Skeleton.jsx';
import StatCard from '../components/StatCard.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';

export default function Analytics() {
  const { data, loading } = useTrainingData();
  if (loading) return <Skeleton lines={6} />;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Skill Growth" value={`${data.kpis.skillGrowth}%`} detail="Average skill score lift" icon={Sparkles} tone="bg-violet-600" />
        <StatCard label="Completion Forecast" value={`${Math.min(100, data.kpis.teamCompletion + 12)}%`} detail="Projected next month" icon={Flame} tone="bg-orange-500" />
        <StatCard label="Risk Index" value={`${Math.max(0, 100 - data.kpis.readiness)}%`} detail="Readiness gap remaining" icon={ShieldAlert} tone="bg-red-600" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Monthly Growth Analytics</h2>
          <TrendChart data={data.monthly} />
        </div>
        <div className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Risk Indicators</h2>
          <RiskChart data={data.monthly} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Team Comparison</h2>
          <TeamComparisonChart data={data.employees} />
        </div>
        <div className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Team Heatmap</h2>
          <div className="overflow-auto">
            <div className="min-w-[680px]">
              <div className="grid gap-2" style={{ gridTemplateColumns: `160px repeat(${data.modules.length}, minmax(86px, 1fr))` }}>
                <div />
                {data.modules.map((module) => <div key={module.id} className="truncate text-xs font-black text-slate-500">{module.category}</div>)}
                {data.heatmap.map((row) => (
                  <>
                    <div key={`${row.employee}-name`} className="truncate text-sm font-black">{row.employee}</div>
                    {row.values.map((value, index) => (
                      <div key={`${row.employee}-${index}`} className="h-10 rounded-lg" title={`${value}%`} style={{ backgroundColor: `rgba(${value < 50 ? '239,68,68' : value < 75 ? '249,115,22' : '20,184,166'}, ${Math.max(value / 100, 0.18)})` }} />
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="surface p-5">
        <h2 className="mb-4 text-lg font-black">Module Completion</h2>
        <ModuleBarChart data={data.modules} />
      </div>
    </div>
  );
}
