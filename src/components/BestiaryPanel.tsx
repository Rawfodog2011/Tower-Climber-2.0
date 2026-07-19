import React, { useState } from 'react';
import { Player } from '../types';
import { BookOpen, Skull, MapPin, Search, ShieldAlert, CheckCircle } from 'lucide-react';
import { getMonsterLore } from '../core/entities/monsters';
import { useTranslation } from '../core/engine/translation';

interface Props {
  player: Player;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231f2937' stroke='%23374151' stroke-width='4'/><text x='50' y='55' font-family='monospace' font-size='40' fill='%23ef4444' text-anchor='middle'>X</text></svg>";
};

const ALL_BASE_THREATS = [
  // Bosses
  { id: 'soberano_ninhada', name: 'Soberano da Ninhada', isBoss: true },
  { id: 'guardiao_cibernetico', name: 'Guardião Cibernético', isBoss: true },
  { id: 'destruidor_sistemas', name: 'Destruidor de Sistemas', isBoss: true },
  { id: 'leviata_biomecanico', name: 'Leviatã Biomecânico', isBoss: true },
  { id: 'mente_colmeia_alpha', name: 'Mente-Colmeia Alpha', isBoss: true },
  { id: 'holograma_corrompido', name: 'Holograma Corrompido', isBoss: true },
  { id: 'anomalia_omega', name: 'Anomalia Ômega', isBoss: true },
  { id: 'mainframe_prime', name: 'O Núcleo Matriz', isBoss: true },

  // Comuns
  { id: 'parasita_acido', name: 'Parasita Ácido', isBoss: false },
  { id: 'drone_defeituoso', name: 'Drone Defeituoso', isBoss: false },
  { id: 'soldado_reptiliano', name: 'Soldado Reptiliano', isBoss: false },
  { id: 'aberracao_genetica', name: 'Aberração Genética', isBoss: false },
  { id: 'mutante_biomecanico', name: 'Mutante Biomecânico', isBoss: false },
];

export const BestiaryPanel: React.FC<Props> = ({ player }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  // Auxiliar para obter estatísticas agregadas de uma ameaça base
  const getAggregatedStats = (baseName: string) => {
    let kills = 0;
    let firstFloor = 999;
    let lastFloor = 0;

    Object.entries(player.bestiary || {}).forEach(([key, val]) => {
      const data = val as { name: string; kills: number; firstFloor: number; lastFloor: number };
      const keyBase = key.replace(/\s*\(Nv\s+\d+\)/i, '').replace(/\s*\(Andar\s+\d+\)/i, '').trim();
      if (keyBase.toLowerCase() === baseName.toLowerCase()) {
        kills += data.kills || 0;
        if (data.firstFloor < firstFloor) firstFloor = data.firstFloor;
        if (data.lastFloor > lastFloor) lastFloor = data.lastFloor;
      }
    });

    return {
      kills,
      firstFloor: firstFloor === 999 ? 0 : firstFloor,
      lastFloor
    };
  };

  const threatEntries = ALL_BASE_THREATS.map(threat => {
    const stats = getAggregatedStats(threat.name);
    const discovered = stats.kills > 0;
    return {
      ...threat,
      ...stats,
      discovered,
      lore: getMonsterLore(threat.name),
    };
  }).sort((a, b) => {
    // Coloca os descobertos primeiro, e depois ordena por número de abates decrescente
    if (a.discovered && !b.discovered) return -1;
    if (!a.discovered && b.discovered) return 1;
    return b.kills - a.kills;
  });

  const filteredEntries = threatEntries.filter(e => {
    const term = searchTerm.toLowerCase();
    if (e.discovered) {
      return t(e.name).toLowerCase().includes(term);
    } else {
      return t("[Dados Corrompidos]").toLowerCase().includes(term) || t("bloqueado").toLowerCase().includes(term);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-500" />
            {t("Arquivo de Ameaças")}
          </h2>
          <p className="text-red-200/60 font-mono text-sm uppercase tracking-wider">{t("Registros Biomecânicos & Anomalias da Torre")}</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t("Buscar registro...")}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 transition-colors font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEntries.length === 0 ? (
          <div className="system-panel p-12 flex flex-col items-center justify-center text-slate-500 border-dashed">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-mono uppercase tracking-widest text-center whitespace-pre-line">
              {t("Nenhum registro correspondente encontrado.\nExplore a torre para catalogar mais ameaças.")}
            </p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              className={`system-panel p-5 flex flex-col md:flex-row gap-5 hover:border-red-500/50 transition-all group overflow-hidden relative ${
                entry.discovered 
                  ? 'border-slate-800 bg-slate-950/40' 
                  : 'border-dashed border-slate-800 bg-slate-950/10 opacity-75'
              }`}
            >
              {/* Image box */}
              <div className="w-24 h-24 bg-slate-950 rounded border border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden relative self-center md:self-start">
                {entry.discovered ? (
                  <>
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                    <img 
                      src={`https://robohash.org/${entry.name}?set=set2&size=120x120`} onError={handleImageError} 
                      alt={entry.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)] group-hover:scale-110 transition-transform duration-500 relative z-10"
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 relative z-10">
                    <ShieldAlert className="w-8 h-8 opacity-40 animate-pulse text-red-500/50" />
                    <span className="text-[9px] font-mono mt-1 tracking-widest uppercase">{t("LOCKED")}</span>
                  </div>
                )}
              </div>

              {/* Contents */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                        entry.isBoss 
                          ? 'bg-red-950/50 text-red-400 border border-red-500/20' 
                          : 'bg-blue-950/50 text-blue-400 border-blue-500/20'
                      }`}>
                        {entry.isBoss ? t('Ameaça Nível Chefe') : t('Ameaça Comum')}
                      </span>
                      {entry.discovered ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {t("ANALISADO")}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-500/80">
                          {t("⚡ SINAL NÃO DETECTADO")}
                        </span>
                      )}
                    </div>

                    {entry.discovered && (
                      <div className="flex gap-4 text-xs font-mono">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Skull className="w-3.5 h-3.5 text-red-500" />
                          <span>{t("Abates")}: <span className="text-red-400 font-bold">{entry.kills}</span></span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{t("Andares")}: <span className="text-cyan-400">{entry.firstFloor}{entry.lastFloor > entry.firstFloor ? `-${entry.lastFloor}` : ''}</span></span>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className={`text-base font-bold uppercase tracking-widest ${
                    entry.discovered ? 'text-red-100' : 'text-slate-600'
                  }`}>
                    {entry.discovered ? t(entry.name) : t('[DADOS CRIPTOGRAFADOS]')}
                  </h3>

                  {/* Lore entry console */}
                  <div className={`mt-3 p-3.5 rounded font-mono text-xs leading-relaxed relative border ${
                    entry.discovered 
                      ? 'bg-slate-950/80 text-slate-300 border-slate-800/80 text-justify' 
                      : 'bg-red-950/10 text-red-400/70 border-red-950/20 text-center select-none'
                  }`}>
                    {entry.discovered ? (
                      <>
                        <div className="absolute top-1.5 right-2 text-[9px] text-red-500/40 select-none tracking-widest uppercase">SYS.LOG</div>
                        <p>{t(entry.lore)}</p>
                      </>
                    ) : (
                      <p className="font-bold tracking-widest py-1">
                        {t("[DADOS INSUFICIENTES — ELIMINE PARA DESBLOQUEAR REGISTRO]")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
