import React, { useEffect, useState } from 'react';
import { EventOption } from '../core/entities/events';
import { usePlayerStore } from '../store/usePlayerStore';



import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';

export const EventScene: React.FC = () => {
  const { activeEvent, eventLog, selectedFloor, setSelectedFloor } = useExplorationStore();
  const { handleEventOption, handleStartDive, handleReturnToHub } = useExploration();
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const { player } = usePlayerStore();

  useEffect(() => {
    if (activeEvent && !eventLog) {
      setFlavorText(null);
      fetch('/api/flavor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId: player.name || 'player_default',
          eventId: activeEvent.id,
          eventTitle: activeEvent.title,
          eventDescription: activeEvent.description
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.text) {
            setFlavorText(data.text);
          }
        })
        .catch(err => {
          console.error("Failed to fetch flavor text", err);
        });
    }
  }, [activeEvent, eventLog, player.name]);

  if (!activeEvent) return null;

  return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
            <div className="system-panel max-w-2xl w-full flex flex-col overflow-hidden">
              <div className="tech-panel-header px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-cyan-50 tracking-widest uppercase text-lg">{activeEvent.title}</span>
                <span className="text-cyan-400 font-mono text-sm border border-cyan-900/50 px-2 py-1 rounded shadow-[0_0_10px_rgba(34,211,238,0.2)]">Evento de Exploração</span>
              </div>
              
              <div className="p-8 space-y-8 flex-1">
                {!eventLog ? (
                  <>
                    <div className="mb-8">
                      <p className="text-cyan-100 text-lg leading-relaxed text-center font-serif italic">
                        "{activeEvent.description}"
                      </p>
                      {flavorText && (
                        <p className="text-slate-400 text-sm mt-4 leading-relaxed text-center font-serif opacity-80 animate-pulse">
                          {flavorText}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      {activeEvent.options.map((opt: EventOption, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleEventOption(opt)}
                          className="w-full bg-slate-900/80 hover:bg-slate-800/80 border border-cyan-700/50 text-white font-bold py-4 px-6 rounded transition-all text-center cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] uppercase tracking-widest"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-8">
                    <p className="text-emerald-300 text-xl font-bold leading-relaxed max-w-lg mx-auto">
                      {eventLog}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <button
                        onClick={() => {
                          const nextF = selectedFloor + 1;
                          setSelectedFloor(nextF);
                          handleStartDive(nextF);
                        }}
                        className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 px-6 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                      >
                        Avançar (Andar {selectedFloor + 1})
                      </button>
                      <button
                        onClick={handleReturnToHub}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-600 text-slate-300 font-bold py-3 px-6 rounded uppercase tracking-widest transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]"
                      >
                        Retornar ao Hub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
  );
};
