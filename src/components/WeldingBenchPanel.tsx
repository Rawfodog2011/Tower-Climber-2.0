import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, Item } from '../types';
import { useTranslation } from '../core/engine/translation';

import { usePlayerStore } from '../store/usePlayerStore';
import { useCrafting } from '../hooks/useCrafting';
import { getRarityStyle } from './uiUtils';
import { ItemRevealModal } from './equipment/ItemRevealModal';

export const WeldingBenchPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { handleSocketModule, handleUnsocketModule, handleMergeChips } = useCrafting();

  const { t } = useTranslation();

  const [soldagemSubTab, setSoldagemSubTab] = useState<'socket' | 'merge'>('socket');
  const [selectedEquipmentForSocketing, setSelectedEquipmentForSocketing] = useState<{
    item: Item;
    source: string;
    index: number;
  } | null>(null);
  const [selectedSocketIndex, setSelectedSocketIndex] = useState<number | null>(null);
  const [revealedItem, setRevealedItem] = useState<Item | null>(null);

  // Internal fallback if prop is not supplied
  const renderStatModifiers = ((item: Item) => {
    if (!item.statModifiers) return null;
    const mods = [];
    if (item.statModifiers.atk) mods.push(<span key="atk" className="text-red-400">+{item.statModifiers.atk} ATK</span>);
    if (item.statModifiers.def) mods.push(<span key="def" className="text-blue-400">+{item.statModifiers.def} DEF</span>);
    if (item.statModifiers.hp) mods.push(<span key="hp" className="text-emerald-400">+{item.statModifiers.hp} HP</span>);
    if (item.statModifiers.mp) mods.push(<span key="mp" className="text-indigo-400">+{item.statModifiers.mp} EP</span>);
    if (item.statModifiers.spd) mods.push(<span key="spd" className="text-yellow-400">+{item.statModifiers.spd} SPD</span>);
    
    if (mods.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] font-mono mt-1">
        {mods}
      </div>
    );
  });

  return (
    <div className="system-panel" id="welding-bench-panel">
      <div className="border-b border-indigo-500/20 bg-indigo-950/40 px-4 py-3 flex justify-between items-center" id="welding-header">
        <span className="font-bold text-indigo-400 tracking-widest uppercase text-sm flex gap-4">
          <button 
            id="btn-subtab-socket"
            onClick={() => setSoldagemSubTab('socket')}
            className={`${soldagemSubTab === 'socket' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-700 hover:text-indigo-300'}`}
          >
            {t("Bancada de Soldagem PCB")}
          </button>
          <button 
            id="btn-subtab-merge"
            onClick={() => setSoldagemSubTab('merge')}
            className={`${soldagemSubTab === 'merge' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-700 hover:text-indigo-300'}`}
          >
            {t("Fusão de Componentes")}
          </button>
        </span>
      </div>
      
      {soldagemSubTab === 'socket' && (
        <>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6" id="socketing-grid">
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-mono text-indigo-300">{t("Equipamentos Compatíveis")}</h4>
              <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                {(() => {
                  const equipSlots = ['weapon', 'helmet', 'armor', 'pants', 'boots', 'bracers', 'accessory1', 'accessory2', 'accessory3'] as const;
                  const socketableEq = equipSlots
                    .map(slot => ({ item: player.equipment[slot], source: slot as string, index: 0 }))
                    .filter((e): e is { item: Item; source: string; index: number } => !!(e.item && e.item.hardwareSlots && e.item.hardwareSlots.length > 0));
                  const socketableInv = player.inventory
                    .map((item, index) => ({ item, source: 'inventory', index }))
                    .filter((e): e is { item: Item; source: string; index: number } => !!(e.item && e.item.hardwareSlots && e.item.hardwareSlots.length > 0));
                  
                  const allSocketable = [...socketableEq, ...socketableInv];
                  if (allSocketable.length === 0) {
                    return <div className="text-xs text-slate-500 font-mono">{t("Nenhum equipamento Raro ou Épico encontrado.")}</div>;
                  }
                  
                  return allSocketable.map((entry, idx) => (
                    <button 
                      key={idx}
                      id={`btn-socketable-${idx}`}
                      onClick={() => { setSelectedEquipmentForSocketing(entry); setSelectedSocketIndex(null); }}
                      className={`w-full text-left p-2 border rounded flex items-center justify-between ${selectedEquipmentForSocketing?.item?.id === entry.item?.id && selectedEquipmentForSocketing?.source === entry.source ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-900/50 border-slate-700 hover:border-indigo-700'}`}
                    >
                      <div>
                        <div className={`text-sm font-bold truncate ${getRarityStyle(entry.item.rarity).split(' ')[0]}`}>{t(entry.item.name)}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {entry.source === 'inventory' ? t('Inventário') : `${t('Equipado: ')}${entry.source.toUpperCase()}`}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {entry.item.hardwareSlots?.map((slot, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full border ${slot ? 'bg-indigo-400 border-indigo-300' : 'bg-slate-800 border-slate-600'}`}></div>
                        ))}
                      </div>
                    </button>
                  ));
                })()}
              </div>
            </div>
            
            <div className="bg-slate-950 border-2 border-indigo-900/30 rounded p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]" id="socketing-workbench">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(99, 102, 241, 0.5) 2px, transparent 0)', backgroundSize: '20px 20px' }}></div>
              
              {selectedEquipmentForSocketing && selectedEquipmentForSocketing.item ? (
                <div className="relative z-10 w-full flex flex-col items-center">
                  <h4 className={`text-lg font-bold mb-6 text-center ${getRarityStyle(selectedEquipmentForSocketing.item.rarity).split(' ')[0]}`}>
                    {selectedEquipmentForSocketing.item.name}
                  </h4>
                  
                  <div className="flex gap-8 justify-center">
                    {selectedEquipmentForSocketing.item.hardwareSlots?.map((slotItem, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3">
                        <button 
                          id={`btn-socket-slot-${idx}`}
                          onClick={() => setSelectedSocketIndex(idx)}
                          className={`w-16 h-16 rounded border-2 flex items-center justify-center transition-all ${selectedSocketIndex === idx ? 'border-indigo-400 bg-indigo-900/40 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : slotItem ? 'border-indigo-600/50 bg-slate-900' : 'border-slate-700 border-dashed bg-slate-900/50 hover:border-indigo-500'}`}
                        >
                          {slotItem ? (
                            <Cpu className="w-8 h-8 text-indigo-400" />
                          ) : (
                            <div className="text-[10px] font-mono text-slate-500 uppercase text-center leading-tight">{t("Slot Vazio")}</div>
                          )}
                        </button>
                        {slotItem ? (
                          <div className="text-center">
                            <div className="text-[10px] font-bold text-indigo-300 truncate w-24" title={slotItem.name}>{t(slotItem.name)} {slotItem.level ? `[Nv.${slotItem.level}]` : ''}</div>
                            {renderStatModifiers(slotItem)}
                            
                            <button 
                              id={`btn-unsocket-${idx}`}
                              onClick={() => {
                                const updated = handleUnsocketModule(idx, selectedEquipmentForSocketing);
                                if (updated) {
                                  setSelectedEquipmentForSocketing({
                                    ...selectedEquipmentForSocketing,
                                    item: updated,
                                  });
                                }
                              }} 
                              className="mt-2 text-[8px] uppercase tracking-widest bg-red-950/80 text-red-400 px-2 py-1 rounded border border-red-900 hover:bg-red-900 transition-colors"
                            >
                              {t("Remover")}
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 font-mono">{t("Disponível")}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-indigo-500/30">
                  <Cpu className="w-16 h-16 mb-2" />
                  <span className="font-mono text-sm uppercase tracking-widest">{t("Aguardando Conexão")}</span>
                </div>
              )}
            </div>
          </div>
          
          {selectedEquipmentForSocketing && selectedSocketIndex !== null && (
            <div className="border-t border-indigo-900/30 p-4 bg-indigo-950/20" id="modules-list-container">
              <h4 className="text-xs uppercase font-mono text-indigo-400 mb-3">{t("Módulos no Inventário")}</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {player.inventory.map((item, idx) => {
                  if (item.type !== 'circuit_module') return null;
                  return (
                    <div key={idx} className="shrink-0 bg-slate-900 border border-indigo-900/50 rounded p-2 flex flex-col w-40 justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-indigo-300 truncate">{t(item.name)} {item.level ? `[Nv.${item.level}]` : ''}</div>
                        <div className="text-[9px] text-slate-400 mb-2">{t(item.description)}</div>
                        {renderStatModifiers(item)}
                      </div>
                      <button 
                        id={`btn-socket-module-${idx}`}
                        onClick={() => {
                          const updated = handleSocketModule(item, idx, selectedEquipmentForSocketing, selectedSocketIndex);
                          if (updated) {
                            setSelectedEquipmentForSocketing({
                              ...selectedEquipmentForSocketing,
                              item: updated,
                            });
                            setSelectedSocketIndex(null);
                          }
                        }}
                        className="mt-2 text-[10px] uppercase font-bold tracking-widest bg-indigo-900 hover:bg-indigo-800 text-indigo-200 py-1 rounded w-full transition-colors"
                      >
                        {t("Soldar")}
                      </button>
                    </div>
                  );
                })}
                {!player.inventory.some(i => i.type === 'circuit_module') && (
                  <div className="text-xs text-slate-500 font-mono w-full text-center py-4">{t("Nenhum módulo de circuito no inventário.")}</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {soldagemSubTab === 'merge' && (
        <div className="p-4" id="merge-modules-container">
          <div className="bg-slate-950 border border-indigo-900/50 rounded p-4 mb-6 relative overflow-hidden text-center">
            <Cpu className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">{t("Fundição de Componentes")}</h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              {t("Combine 3 módulos de circuito idênticos (mesmo tipo e nível) para criar uma versão superior, pagando uma taxa em Ouro.")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(() => {
              // Group circuit modules in inventory by id + level
              const groups: Record<string, { item: Item; count: number }> = player.inventory
                .filter(i => i.type === 'circuit_module')
                .reduce((acc, item) => {
                  const key = `${item.id}_${item.level || 1}`;
                  if (!acc[key]) acc[key] = { item, count: 0 };
                  acc[key].count++;
                  return acc;
                }, {} as Record<string, { item: Item; count: number }>);
                
              const groupList: { item: Item; count: number }[] = Object.values(groups);
              
              if (groupList.length === 0) {
                return <div className="col-span-full text-center text-xs text-slate-500 font-mono py-8">{t("Nenhum módulo no inventário.")}</div>;
              }
              
              return groupList.map((g, idx) => {
                const canMerge = g.count >= 3;
                const mergeCost = 50 * (g.item.level || 1);
                return (
                  <div key={idx} className={`bg-slate-900 border ${canMerge ? 'border-indigo-500' : 'border-slate-700'} rounded p-3 flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-indigo-300">{t(g.item.name)} {g.item.level ? `[Nv.${g.item.level}]` : ''}</div>
                        <div className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${canMerge ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                          {g.count}/3
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-400 mb-2">{t(g.item.description)}</div>
                      {renderStatModifiers(g.item)}
                    </div>
                    
                    <motion.button
                      id={`btn-merge-module-${idx}`}
                      whileHover={canMerge && player.gold >= mergeCost ? { scale: 1.02 } : {}}
                      whileTap={canMerge && player.gold >= mergeCost ? { scale: 0.95 } : {}}
                      onClick={() => {
                        const upgraded = handleMergeChips(g.item);
                        if (upgraded) {
                          setRevealedItem(upgraded);
                        }
                      }}
                      disabled={!canMerge || player.gold < mergeCost}
                      className={`mt-3 text-[10px] uppercase font-bold tracking-widest py-1.5 rounded w-full transition-colors flex justify-center items-center gap-1 ${canMerge && player.gold >= mergeCost ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      {t("Fundir")} ({mergeCost}G)
                    </motion.button>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
      
      {revealedItem && (
        <ItemRevealModal item={revealedItem} onClose={() => setRevealedItem(null)} title={t("Fusão Concluída")} />
      )}
    </div>
  );
};
