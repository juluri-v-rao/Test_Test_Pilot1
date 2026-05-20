import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X, XCircle } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          className="fixed bottom-5 right-5 z-[80] flex w-[calc(100vw-2.5rem)] max-w-sm items-center gap-3 rounded-lg border border-white/70 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
        >
          {toast.tone === 'error' ? <XCircle className="h-5 w-5 shrink-0 text-red-500" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
          <p className="min-w-0 flex-1 text-sm font-bold text-slate-800 dark:text-white">{toast.message}</p>
          <button className="icon-button h-8 w-8" onClick={onClose} aria-label="Close toast">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
