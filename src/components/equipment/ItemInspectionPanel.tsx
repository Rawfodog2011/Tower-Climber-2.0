import React from 'react';
import { Item, Player, ClassDefinition } from '../../types';
import { useTranslation } from '../../core/engine/translation';

interface Props {
  item: Item | null;
  player: Player;
  CLASSES: Record<string, ClassDefinition>;
  canClassEquipItem: (classId: string, item: Item) => boolean;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  renderManufacturerBadge: (item: Item) => React.ReactNode;
}

export const ItemInspectionPanel: React.FC<Props> = ({
  item, player, CLASSES, canClassEquipItem, getItemIcon, renderManufacturerBadge
}) => {
  const { t } = useTranslation();

  if (!item) {
    return (
      <div className="w-full h-[520px] border border-slate-700/50 bg-[#060b13] flex flex-col items-center justify-center relative overflow-hidden group">
        {/* Holographic scanning animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent h-[20%] w-full animate-[scan_3s_ease-in-out_infinite]" />
        
        <div className="w-16 h-16 rounded-full border border-dashed border-cyan-800/50 flex items-center justify-center mb-4 animate-[spin_10s_linear_infinite]">
          <div className="w-8 h-8 border border-cyan-800/30 rotate-45" />
        </div>
        <span className="font-mono text-cyan-700/60 text-xs tracking-[0.3em] uppercase">
          {t("Aguardando Seleção do Operador")}
        </span>
      </div>
    );
  }

  const isCompatible = canClassEquipItem(player.currentClassId, item);
  
  return (
    <div className="w-full h-[520px] border border-cyan-900/40 bg-slate-900/80 flex flex-col relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500" />

      {/* Header Image/Icon Area */}
      <div className="h-40 flex items-center justify-center relative bg-gradient-to-b from-slate-800/50 to-transparent border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.8)_0%,transparent_70%)]" />
        {getItemIcon(item.type, "w-20 h-20 text-cyan-100 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] relative z-10")}
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* Title & Rarity */}
        <div>
          <h3 className="font-bold text-lg text-slate-100 tracking-wider uppercase font-mono">{t(item.name)}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest border rounded-sm ${
              item.rarity === 'common' ? 'text-slate-400 border-slate-600 bg-slate-900/50' :
              item.rarity === 'rare' ? 'text-cyan-400 border-cyan-600 bg-cyan-950/50 shadow-[0_0_8px_rgba(34,211,238,0.2)]' :
              'text-purple-400 border-purple-500 bg-purple-950/50 shadow-[0_0_10px_rgba(192,132,252,0.3)] animate-pulse'
            }`}>
              {item.rarity === 'common' ? t('Padrão') : item.rarity === 'rare' ? t('Avançado') : t('Protótipo')}
            </span>
            {renderManufacturerBadge(item)}
            {item.level && (
              <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest border border-slate-700 rounded-sm text-slate-300">
                {t("NVL")} {item.level}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 font-mono leading-relaxed border-l-2 border-slate-700 pl-3 italic">
          {t(item.description)}
        </p>

        {/* Stats */}
        {item.statModifiers && Object.keys(item.statModifiers).length > 0 && (
          <div className="space-y-1 mt-2">
            <h4 className="text-[10px] text-cyan-600 font-mono uppercase tracking-[0.2em] mb-2">{t("Especificações")}</h4>
            {Object.entries(item.statModifiers).map(([stat, val]) => (
              <div key={stat} className="flex justify-between items-center text-xs font-mono bg-slate-900/40 px-2 py-1 border border-slate-800/50">
                <span className="text-slate-400 uppercase">{t(stat)}</span>
                <span className="text-cyan-300 font-bold">{(val as number) > 0 ? '+' : ''}{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Passive Effects */}
        {item.passiveEffects && Object.keys(item.passiveEffects).length > 0 && (
          <div className="space-y-1 mt-2">
            <h4 className="text-[10px] text-purple-500/80 font-mono uppercase tracking-[0.2em] mb-2">{t("Subsistemas")}</h4>
            {item.passiveEffects.lifesteal && (
              <div className="flex justify-between items-center text-xs font-mono bg-purple-950/20 px-2 py-1 border border-purple-900/30">
                <span className="text-purple-300/80">{t("Sifão de Energia")}</span>
                <span className="text-purple-400">{(item.passiveEffects.lifesteal * 100).toFixed(0)}%</span>
              </div>
            )}
            {item.passiveEffects.statusResistance && (
              <div className="flex justify-between items-center text-xs font-mono bg-purple-950/20 px-2 py-1 border border-purple-900/30">
                <span className="text-purple-300/80">{t("Blindagem de Status")}</span>
                <span className="text-purple-400">{(item.passiveEffects.statusResistance * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Requirements */}
        <div className="mt-auto pt-4 border-t border-slate-800"> 
           <h4 className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mb-2">{t("Restrições")}</h4>
           <div className="flex flex-col gap-1">
             <div className={`text-[10px] font-mono font-bold px-2 py-1 rounded flex justify-between ${isCompatible ? 'bg-cyan-950/40 text-cyan-500 border border-cyan-900/50' : 'bg-red-950/40 text-red-500 border border-red-900/50'}`}>
                <span>{t("CLASSE")}</span>
                <span>{item.allowedClassIds && item.allowedClassIds.length > 0 ? item.allowedClassIds.map(id => CLASSES[id]?.name || id).join(', ') : t('Qualquer')}</span>
             </div>
             {item.requiredLevel && (
               <div className={`text-[10px] font-mono font-bold px-2 py-1 rounded flex justify-between ${player.level >= item.requiredLevel ? 'bg-cyan-950/40 text-cyan-500 border border-cyan-900/50' : 'bg-red-950/40 text-red-500 border border-red-900/50'}`}>
                  <span>{t("NÍVEL")}</span>
                  <span>{t("Mínimo")} {item.requiredLevel}</span>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
