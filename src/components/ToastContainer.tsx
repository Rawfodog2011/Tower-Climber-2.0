import React from 'react';
import { useToastStore } from '../store/useToastStore';
import { Sparkles } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const isMythic = toast.message.includes('MÍTICO');
        const isLegendary = toast.message.includes('LENDÁRIO');
        const isError = toast.message.includes('⚠️') || toast.message.includes('Erro') || toast.message.includes('Falha');

        let containerStyle = "bg-slate-900/90 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-400";
        if (isMythic) {
          containerStyle = "bg-rose-950/95 border-2 border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.9)] text-rose-100 font-extrabold animate-bounce ring-2 ring-rose-500/80";
        } else if (isLegendary) {
          containerStyle = "bg-amber-950/95 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.85)] text-amber-200 font-bold animate-pulse ring-2 ring-amber-500/60";
        } else if (isError) {
          containerStyle = "bg-red-950/90 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-red-300";
        }

        return (
          <div
            key={toast.id}
            className={`${containerStyle} font-mono text-sm px-4 py-3 rounded min-w-[280px] flex items-center gap-2 relative overflow-hidden`}
          >
            {(isLegendary || isMythic) && (
              <Sparkles className={`w-4 h-4 ${isMythic ? 'text-rose-300 animate-spin-slow' : 'text-amber-300 animate-pulse'}`} />
            )}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
