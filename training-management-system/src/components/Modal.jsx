import { X } from 'lucide-react';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-white/40 bg-white p-6 shadow-glass dark:border-white/10 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
