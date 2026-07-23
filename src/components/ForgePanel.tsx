import React, { useState, useMemo } from 'react';
import { Player, Item, Rarity } from '../types';
import { CLASSES } from '../core/entities/classes';
import { CRAFTING_COSTS, MATERIAL_NAMES, GOLD_VALUES } from '../core/engine/crafting';
import { useTranslation } from '../core/engine/translation';
import { Wrench } from 'lucide-react';

interface Props {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  handleCraft: (rarity: Rarity) => void;
  handleConvertMaterials: (direction: 'common_to_rare' | 'rare_to_epic', quantity?: number) => void;
  handleDismantle: (index: number) => void;
  handleSell: (index: number) => void;
  handleDismantleBatch: (items: Item[]) => void;
  handleSellBatch: (items: Item[]) => void;
  inventoryMessage: { type: 'error' | 'success'; text: string } | null;
  getRarityStyle: (rarity: string) => string;
  getRarityGradient: (rarity: string) => string;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  renderManufacturerBadge: (item: Item) => React.ReactNode;
}

export const ForgePanel: React.FC<Props> = ({
  player,
  setPlayer,
  handleCraft,
  handleConvertMaterials,
  handleDismantle,
  handleSell,
  handleDismantleBatch,
  handleSellBatch,
  inventoryMessage,
  getRarityStyle,
  getRarityGradient,
  getItemIcon,
  renderManufacturerBadge,
}) => {
  const { t } = useTranslation();

  // State moved inside the panel
  const [commonToRareQty, setCommonToRareQty] = useState<number>(1);
  const [rareToEpicQty, setRareToEpicQty] = useState<number>(1);
  const [batchFilterRarities, setBatchFilterRarities] = useState<string[]>(['common', 'rare', 'epic', 'legendary', 'mythic']);
  const [batchFilterClasses, setBatchFilterClasses] = useState<string[]>(['any', 'ciborgue_foragido', 'nomade_silicio', 'quimico_sintetico', 'mercenario_elite']);
  const [batchFilterTypes, setBatchFilterTypes] = useState<string[]>(['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory', 'circuit_module', 'consumable']);

  // Memoized filtered inventory for forge operations
  const forgeFilteredInventory = useMemo(() => {
    return player.inventory
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => {
        if (!batchFilterRarities.includes(item.rarity)) return false;
        const isGeneral = !item.allowedClassIds || item.allowedClassIds.length === 0;
        if (isGeneral) {
          if (!batchFilterClasses.includes('any')) return false;
        } else {
          const hasAllowedMatch = item.allowedClassIds.some(cId => batchFilterClasses.includes(cId));
          if (!hasAllowedMatch) return false;
        }
        if (!batchFilterTypes.includes(item.type)) return false;
        return true;
      });
  }, [player.inventory, batchFilterRarities, batchFilterClasses, batchFilterTypes]);

  return (
 
    <>
      {/* Forge Panels */}
      <div className="system-panel">
        <div className="tech-panel-header px-4 py-3">
          <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">
            {t("Criação de Itens")} ({t("Classe")}: {t(CLASSES[player.currentClassId].name)})
          </span>
        </div>
        <div className="p-4 space-y-4">
          
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-slate-950/40 p-2 rounded border border-slate-600 flex flex-col justify-between items-center shadow-[inset_0_0_10px_rgba(100,116,139,0.1)]">
              <span className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-1">{t("Fragmentos")}</span>
              <span className="text-slate-100 font-bold">{player.materials.common}</span>
            </div>
            <div className="flex-1 bg-cyan-950/20 p-2 rounded border border-cyan-500 flex flex-col justify-between items-center shadow-[inset_0_0_15px_rgba(34,211,238,0.15)]">
              <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-1">{t("Essências")}</span>
              <span className="text-cyan-100 font-bold">{player.materials.rare}</span>
            </div>
            <div className="flex-1 bg-purple-950/20 p-2 rounded border border-purple-500 flex flex-col justify-between items-center shadow-[inset_0_0_20px_rgba(192,132,252,0.25)]">
              <span className="text-purple-400 text-[10px] font-mono uppercase tracking-widest mb-1">{t("Núcleos")}</span>
              <span className="text-purple-100 font-bold">{player.materials.epic}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {(['common', 'rare', 'epic', 'legendary', 'mythic'] as const).map(rarity => {
              const cost = CRAFTING_COSTS[rarity];
              const matType = cost.materialType;
              const canCraft = player.materials[matType] >= cost.materials && player.gold >= cost.gold;
              const rarityStyle = getRarityStyle(rarity);

              return (
 
                <button
                  key={rarity}
                  onClick={() => handleCraft(rarity)}
                  disabled={!canCraft}
                  className={`flex flex-col items-center justify-center p-3 rounded border transition-all relative overflow-hidden ${rarityStyle} ${canCraft ? 'cursor-pointer active:scale-95 hover:brightness-125' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <span className="font-bold uppercase tracking-widest text-[10px] mb-2 relative z-10 text-center">
                    {t("FORJAR")} {
                      (rarity === 'common' ? t('Padrão') : 
                       rarity === 'rare' ? t('Avançado') : 
                       rarity === 'epic' ? t('Protótipo') : 
                       rarity === 'legendary' ? t('Lendário') : t('Mítico')).toUpperCase()
                    }
                  </span>
                  <div className="text-[10px] font-mono opacity-85 space-y-1 relative z-10 text-center">
                    <div>- {cost.materials} {MATERIAL_NAMES[matType]}</div>
                    <div>- {cost.gold} CRD</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversão de Materiais */}
      {(() => {
        const maxCommonToRare = Math.max(1, Math.min(Math.floor(player.materials.common / 5), Math.floor(player.gold / 100)));
        const maxRareToEpic = Math.max(1, Math.min(Math.floor(player.materials.rare / 5), Math.floor(player.gold / 500)));
        
        const activeCommonQty = Math.max(1, Math.min(maxCommonToRare, commonToRareQty));
        const activeRareQty = Math.max(1, Math.min(maxRareToEpic, rareToEpicQty));

        return (
 
          <div className="system-panel">
            <div className="tech-panel-header px-4 py-3">
              <span className="font-bold text-cyan-400 tracking-widest uppercase text-sm">{t("Conversor de Matéria Arcana")}</span>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                {t("A Forja Arcana permite fundir recursos brutos em estados mais refinados de energia a uma taxa de")} <span className="text-cyan-400 font-bold">5 {t("para")} 1</span>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fragmento -> Essência */}
                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between items-center text-center gap-3">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-slate-400 font-mono text-xs">5x {t("Fragmentos Comuns")}</span>
                    <span className="text-cyan-400 font-bold">➔</span>
                    <span className="text-cyan-400 font-mono text-xs">1x {t("Essência Rara")}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between gap-1 bg-slate-900/60 border border-slate-800 rounded p-1">
                      <span className="text-[10px] text-slate-500 font-mono pl-1">QTD:</span>
                      <input 
                        type="number" 
                        min={1}
                        max={maxCommonToRare}
                        value={activeCommonQty} 
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(maxCommonToRare, parseInt(e.target.value) || 1));
                          setCommonToRareQty(val);
                        }}
                        className="w-14 bg-slate-950 text-white border border-slate-800 text-center font-mono text-xs rounded py-0.5"
                      />
                      <button 
                        type="button"
                        onClick={() => setCommonToRareQty(prev => Math.min(maxCommonToRare, prev + 1))}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 font-mono text-[10px] text-slate-300 rounded transition-colors"
                      >
                        +1
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCommonToRareQty(prev => Math.min(maxCommonToRare, prev + 10))}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 font-mono text-[10px] text-slate-300 rounded transition-colors"
                      >
                        +10
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCommonToRareQty(maxCommonToRare)}
                        className="px-1.5 py-0.5 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/40 font-mono text-[10px] rounded transition-colors"
                      >
                        Máx
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                      <span>Total: {activeCommonQty * 5} Frags</span>
                      <span>Custo: {activeCommonQty * 100} CRD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleConvertMaterials('common_to_rare', activeCommonQty);
                      setCommonToRareQty(1);
                    }}
                    disabled={player.materials.common < 5 * activeCommonQty || player.gold < 100 * activeCommonQty}
                    className={`w-full py-2 rounded font-bold font-mono text-xs uppercase tracking-wider transition-all border ${
                      player.materials.common >= 5 * activeCommonQty && player.gold >= 100 * activeCommonQty
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {t("Refinar Essência")} (-{activeCommonQty * 5} {t("Frag")}, -{activeCommonQty * 100} CRD)
                  </button>
                </div>

                {/* Essência -> Núcleo */}
                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between items-center text-center gap-3">
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-cyan-400 font-mono text-xs">5x {t("Essências Raras")}</span>
                    <span className="text-purple-400 font-bold">➔</span>
                    <span className="text-purple-400 font-mono text-xs">1x {t("Núcleo Épico")}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between gap-1 bg-slate-900/60 border border-slate-800 rounded p-1">
                      <span className="text-[10px] text-slate-500 font-mono pl-1">QTD:</span>
                      <input 
                        type="number" 
                        min={1}
                        max={maxRareToEpic}
                        value={activeRareQty} 
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(maxRareToEpic, parseInt(e.target.value) || 1));
                          setRareToEpicQty(val);
                        }}
                        className="w-14 bg-slate-950 text-white border border-slate-800 text-center font-mono text-xs rounded py-0.5"
                      />
                      <button 
                        type="button"
                        onClick={() => setRareToEpicQty(prev => Math.min(maxRareToEpic, prev + 1))}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 font-mono text-[10px] text-slate-300 rounded transition-colors"
                      >
                        +1
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRareToEpicQty(prev => Math.min(maxRareToEpic, prev + 10))}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 font-mono text-[10px] text-slate-300 rounded transition-colors"
                      >
                        +10
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRareToEpicQty(maxRareToEpic)}
                        className="px-1.5 py-0.5 bg-purple-950/40 text-purple-400 hover:bg-purple-900/40 font-mono text-[10px] rounded transition-colors"
                      >
                        Máx
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                      <span>Total: {activeRareQty * 5} Ess</span>
                      <span>Custo: {activeRareQty * 500} CRD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleConvertMaterials('rare_to_epic', activeRareQty);
                      setRareToEpicQty(1);
                    }}
                    disabled={player.materials.rare < 5 * activeRareQty || player.gold < 500 * activeRareQty}
                    className={`w-full py-2 rounded font-bold font-mono text-xs uppercase tracking-wider transition-all border ${
                      player.materials.rare >= 5 * activeRareQty && player.gold >= 500 * activeRareQty
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {t("Refinar Núcleo")} (-{activeRareQty * 5} {t("Ess")}, -{activeRareQty * 500} CRD)
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dismantle Inventory Panel with Batch Options */}
      <div className="system-panel overflow-hidden flex flex-col min-h-[500px]">
        <div className="tech-panel-header px-4 py-3 flex justify-between items-center shrink-0">
          <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">{t("Central de Reciclagem & Liquidação")} ({player.inventory.length} {t("Itens")})</span>
          {inventoryMessage && (
            <span className={`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wider border ${inventoryMessage.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' : 'bg-emerald-950/50 text-emerald-400 border-emerald-900'}`}>
              {t(inventoryMessage.text)}
            </span>
          )}
        </div>
        
        {/* Filters and Batch Actions Area */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40 space-y-4">
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Rarities Filter */}
            <div>
              <div className="text-[10px] text-amber-500 font-mono uppercase tracking-wider mb-1.5 flex justify-between">
                <span>{t("Raridades")}</span>
                <div className="space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setBatchFilterRarities(['common', 'rare', 'epic', 'legendary', 'mythic'])}
                    className="hover:text-amber-300 text-[9px] font-mono cursor-pointer"
                  >
                    [{t("Todos")}]
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBatchFilterRarities([])}
                    className="hover:text-amber-300 text-[9px] font-mono cursor-pointer"
                  >
                    [{t("Nenhum")}]
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['common', 'rare', 'epic', 'legendary', 'mythic'] as const).map(rarity => {
                  const active = batchFilterRarities.includes(rarity);
                  const label = rarity === 'common' ? t('Padrão') : rarity === 'rare' ? t('Avançado') : rarity === 'epic' ? t('Protótipo') : rarity === 'legendary' ? t('Lendário') : t('Mítico');
                  return (
 
                    <button
                      key={rarity}
                      type="button"
                      onClick={() => {
                        setBatchFilterRarities(prev => 
                          prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
                        );
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        active 
                          ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                          : 'bg-slate-950/60 text-slate-500 border-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allowed Classes Filter */}
            <div>
              <div className="text-[10px] text-amber-500 font-mono uppercase tracking-wider mb-1.5 flex justify-between">
                <span>{t("Proficiências de Classe")}</span>
                <div className="space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setBatchFilterClasses(['any', 'ciborgue_foragido', 'nomade_silicio', 'quimico_sintetico', 'mercenario_elite'])}
                    className="hover:text-amber-300 text-[9px] font-mono cursor-pointer"
                  >
                    [{t("Todos")}]
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBatchFilterClasses([])}
                    className="hover:text-amber-300 text-[9px] font-mono cursor-pointer"
                  >
                    [{t("Nenhum")}]
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { id: 'any', name: 'Geral' },
                  { id: 'ciborgue_foragido', name: 'Ciborgue' },
                  { id: 'nomade_silicio', name: 'Nômade' },
                  { id: 'quimico_sintetico', name: 'Químico' },
                  { id: 'mercenario_elite', name: 'Mercenário' }
                ]).map(cls => {
                  const active = batchFilterClasses.includes(cls.id);
                  return (
 
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => {
                        setBatchFilterClasses(prev => 
                          prev.includes(cls.id) ? prev.filter(c => c !== cls.id) : [...prev, cls.id]
                        );
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        active 
                          ? 'bg-cyan-950/40 text-cyan-300 border-cyan-600/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]' 
                          : 'bg-slate-950/60 text-slate-500 border-slate-800'
                      }`}
                    >
                      {t(cls.name)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Types Filter */}
            <div>
              <div className="text-[10px] text-amber-500 font-mono uppercase tracking-wider mb-1.5 flex justify-between">
                <span>{t("Tipo de Item")}</span>
                <div className="space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setBatchFilterTypes(['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory', 'circuit_module', 'consumable'])}
                    className="hover:text-amber-300 text-[9px] font-mono cursor-pointer"
                  >
                    [{t("Todos")}]
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBatchFilterTypes([])}
                    className="hover:text-amber-300 text-[9px] font-mono cursor-pointer"
                  >
                    [{t("Nenhum")}]
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {([
                  { id: 'weapon', name: 'Arma' },
                  { id: 'armor', name: 'Peitoral' },
                  { id: 'helmet', name: 'Elmo' },
                  { id: 'pants', name: 'Pernas' },
                  { id: 'boots', name: 'Botas' },
                  { id: 'bracers', name: 'Braços' },
                  { id: 'accessory', name: 'Acess.' },
                  { id: 'circuit_module', name: 'Mod.' },
                  { id: 'consumable', name: 'Cons.' }
                ]).map(tItem => {
                  const active = batchFilterTypes.includes(tItem.id);
                  return (
 
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => {
                        setBatchFilterTypes(prev => 
                          prev.includes(tItem.id) ? prev.filter(type => type !== tItem.id) : [...prev, tItem.id]
                        );
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all cursor-pointer ${
                        active 
                          ? 'bg-purple-950/40 text-purple-300 border-purple-600/50 shadow-[0_0_8px_rgba(168,85,247,0.2)]' 
                          : 'bg-slate-950/60 text-slate-500 border-slate-800'
                      }`}
                    >
                      {t(tItem.name)}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Filtered Count and Batch Buttons */}
          {(() => {
            const filteredInventory = forgeFilteredInventory;
            const filteredItemsOnly = filteredInventory.map(x => x.item);
            const totalBatchGold = filteredInventory.reduce((acc, { item }) => acc + (item.value || GOLD_VALUES[item.rarity] || 5), 0);
            return (<>
 
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="text-xs font-mono text-slate-400">
                  {t("Selecionados:")} <span className="text-amber-400 font-bold">{filteredInventory.length}</span> / {player.inventory.length} {t("item(ns)")}
                  {filteredInventory.length > 0 && (
                    <span className="ml-2">
                      ({t("Valor Est.:")} <span className="text-yellow-400 font-bold">{totalBatchGold} CRD</span>)
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`${t("Deseja DESMANCHAR todos os")} ${filteredInventory.length} ${t("itens filtrados?")}`)) {
                        handleDismantleBatch(filteredItemsOnly);
                      }
                    }}
                    disabled={filteredInventory.length === 0}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded text-xs font-bold font-mono tracking-wider uppercase transition-all border cursor-pointer ${
                      filteredInventory.length > 0
                        ? 'bg-amber-900/30 text-amber-400 border-amber-600/50 hover:bg-amber-900/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {t("Desmanchar")} {filteredInventory.length === player.inventory.length ? t('Tudo') : t('Filtrados')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`${t("Deseja VENDER todos os")} ${filteredInventory.length} ${t("itens filtrados por")} ${totalBatchGold} CRD?`)) {
                        handleSellBatch(filteredItemsOnly);
                      }
                    }}
                    disabled={filteredInventory.length === 0}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded text-xs font-bold font-mono tracking-wider uppercase transition-all border cursor-pointer ${
                      filteredInventory.length > 0
                        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-600/50 hover:bg-emerald-900/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {t("Vender")} {filteredInventory.length === player.inventory.length ? t('Tudo') : t('Filtrados')}
                  </button>
                </div>
              </div>
              
              {/* Settings Auto-Dismantle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-slate-500" />
                  {t("Auto-Desmanche (Pós-Combate)")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['common', 'rare', 'epic'].map(r => {
                      const rarity = r as import('../types').Rarity;
                      const isActive = player.settings?.autoDismantleRarities?.includes(rarity);
                      return (
 
                        <button
                          key={rarity}
                          type="button"
                          onClick={() => {
                            const current = player.settings?.autoDismantleRarities || [];
                            const next = isActive ? current.filter(x => x !== rarity) : [...current, rarity];
                            setPlayer({ ...player, settings: { ...player.settings, autoDismantleRarities: next }});
                          }}
                          className={`px-3 py-1 rounded text-[10px] uppercase font-bold border transition-colors cursor-pointer ${isActive ? 'bg-amber-900/40 text-amber-300 border-amber-500/50' : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'}`}
                        >
                          {t(rarity)}
                        </button>
                      )
                  })}
                </div>
              </div>
          </>
          );
        })()}
        </div>

        {/* Filtered Inventory Items List */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar" style={{ maxHeight: '350px' }}>
          {(() => {
            const filteredInventory = forgeFilteredInventory;

            if (filteredInventory.length === 0) {
              return (
 
                <div className="h-32 flex items-center justify-center text-slate-500 text-sm font-mono uppercase tracking-widest border border-dashed border-slate-800 rounded bg-slate-900/10">
                  {t("Nenhum item corresponde aos filtros selecionados")}
                </div>
              );
            }

            return (
 
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredInventory.map(({ item, originalIndex }) => {
                  const goldEarned = item.value || GOLD_VALUES[item.rarity] || 5;
                  return (
 
                    <li key={originalIndex} className={`flex justify-between items-center text-sm p-2 rounded border ${getRarityStyle(item.rarity)} hover:brightness-110 transition-all group relative overflow-hidden bg-slate-950/40`}>
                      <div className="flex items-center gap-3 overflow-hidden mr-2 relative z-10">
                        <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center ${getRarityGradient(item.rarity)}`}>
                          {getItemIcon(item.type, "w-5 h-5 text-slate-100 drop-shadow")}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-bold tracking-wide text-slate-200">{item.name}</span>
                            {renderManufacturerBadge(item)}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] uppercase font-mono text-slate-500 font-semibold">{item.type}</span>
                            <span className="text-[9px] font-mono text-yellow-500/90 font-bold">${goldEarned} CRD</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1.5 shrink-0 relative z-10">
                        <button 
                          onClick={() => handleDismantle(originalIndex)}
                          className="bg-amber-950/80 text-amber-400 border border-amber-800/80 hover:bg-amber-900 hover:text-amber-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] active:scale-95 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                        >
                          {t("DESMANCHAR")}
                        </button>
                        <button 
                          onClick={() => handleSell(originalIndex)}
                          className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900/90 hover:text-emerald-100 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] active:scale-95 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                        >
                          {t("VENDER")}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          })()}
        </div>
      </div>
    </>
  );
};
