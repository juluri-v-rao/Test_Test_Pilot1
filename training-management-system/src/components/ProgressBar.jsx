export default function ProgressBar({ value = 0, tone = 'bg-brand' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
      <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
