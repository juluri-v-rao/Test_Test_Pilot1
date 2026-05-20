import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = 'Create a new record to get started.' }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-white/50 p-10 text-center dark:border-white/15 dark:bg-white/5">
      <div>
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-lg bg-slate-100 dark:bg-white/10">
          <Inbox className="h-6 w-6 text-slate-500" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
    </div>
  );
}
