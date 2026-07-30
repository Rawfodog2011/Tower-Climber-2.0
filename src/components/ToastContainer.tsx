import React from 'react';
import { useToastStore } from '../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-slate-900/90 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-400 font-mono text-sm px-4 py-3 rounded min-w-[250px] animate-fade-in-up"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
