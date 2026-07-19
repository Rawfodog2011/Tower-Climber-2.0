import React, { useState, useEffect } from 'react';
import { Item, Player, ClassDefinition } from '../../types';
import { ExosuitSilhouette } from './ExosuitSilhouette';
import { EquipmentSlot } from './EquipmentSlot';
import { ItemInspectionPanel } from './ItemInspectionPanel';
import { CargoGrid } from './CargoGrid';
import { StatusPanel } from './StatusPanel';
import { useTranslation } from '../../core/engine/translation';
import { useAudio } from '../../core/engine/useAudio';

interface Props {
  player: Player;
  stats: { hp: number, mp: number, atk: number, def: number, spd: number };
  CLASSES: Record<string, ClassDefinition>;
  inventoryMessage: { type: 'error'|'success', text: string } | null;
  handleEquip: (item: Item) => void;
  handleUnequip: (slotId: keyof Player['equipment']) => void;
  handleAutoEquip: () => void;
  canClassEquipItem: (classId: string, item: Item) => boolean;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  getRarityStyle: (rarity: string) => string;
  getRarityGradient: (rarity: string) => string;
  renderManufacturerBadge: (item: Item) => React.ReactNode;
}

export const EquipmentTerminal: React.FC<Props> = ({
  player, stats, CLASSES, inventoryMessage, handleEquip, handleUnequip, handleAutoEquip,
  canClassEquipItem, getItemIcon, getRarityStyle, getRarityGradient, renderManufacturerBadge
}) => {
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const { t } = useTranslation();
  const { playSfx } = useAudio();

  useEffect(() => {
    playSfx('ui.panel_open');
    return () => {
      playSfx('ui.panel_close');
    };
  }, [playSfx]);

  const onHover = (item?: Item) => {
    if (item) {
      setHoveredItem(item);
      playSfx('ui.hover');
    }
  };

  const getSlotLabel = (type: string): string => {
    switch (type) {
      case 'weapon': return t('Arma');
      case 'armor': return t('Peitoral');
      case 'helmet': return t('Capacete');
      case 'pants': return t('Pernas');
      case 'boots': return t('Botas');
      case 'bracers': return t('Braços');
      case 'accessory': return t('Acessório');
      default: return t('Equipamento');
    }
  };

  const getEquippedItemForComparison = (): { item: Item | null; slotLabel: string } | null => {
    if (!hoveredItem || hoveredItem.type === 'consumable' || hoveredItem.type === 'circuit_module') {
      return null;
    }

    const isCurrentlyEquipped = (Object.values(player.equipment) as (Item | undefined)[]).some(eqItem => eqItem?.id === hoveredItem.id);
    if (isCurrentlyEquipped) {
      return null;
    }

    const slotLabel = getSlotLabel(hoveredItem.type);

    if (hoveredItem.type === 'accessory') {
      const eqAcc = player.equipment.accessory1 || player.equipment.accessory2 || player.equipment.accessory3 || null;
      return { item: eqAcc, slotLabel };
    }

    const slotKey = hoveredItem.type as keyof Player['equipment'];
    const eqItem = player.equipment[slotKey] || null;
    return { item: eqItem, slotLabel };
  };

  const comparisonData = getEquippedItemForComparison();
  const isComparing = comparisonData !== null;

  return (
    <div className="w-full min-h-[800px] bg-[#020617] border border-cyan-900/30 flex flex-col p-4 relative overflow-hidden font-sans shadow-2xl animate-in fade-in duration-500">
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 z-50 mix-blend-overlay" />
      
      {/* Header Telemetry */}
      <div className="w-full flex justify-between items-center pb-2 mb-4 border-b border-cyan-900/40">
        <div className="flex items-center gap-4">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" /> {t("LINK ESTABELECIDO")}
          </div>
          <div className="text-cyan-700 font-mono text-[10px] tracking-[0.2em]">{t("CORE ONLINE")}</div>
        </div>
        
        <h1 className="text-cyan-100 font-bold tracking-[0.3em] uppercase text-sm md:text-base drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          {t("Terminal Tático")}
        </h1>

        <div className="flex items-center gap-4">
          <div className="text-cyan-700 font-mono text-[10px] tracking-[0.2em]">FW 9.4.2</div>
          <div className="text-cyan-700 font-mono text-[10px] tracking-[0.2em]">UTC {new Date().toISOString().substring(11, 19)}</div>
        </div>
      </div>

      {/* Modern 2-Column Grid Layout for the entire terminal */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
         
         {/* Left Column: Exosuit Silhouette and Status Panel */}
         <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col gap-6">
           
           {/* Character Silhouette Area */}
           <div className="w-full relative flex items-center justify-center min-h-[500px] overflow-hidden bg-slate-950/20 rounded-xl border border-cyan-900/20 p-4">
             {/* Constrain Exosuit to exact aspect ratio to align slots perfectly */}
             <div className="relative w-full max-w-[240px] aspect-[1/2] flex items-center justify-center">
               
               {/* Exosuit SVG */}
               <div className="absolute inset-0 z-0">
                  <ExosuitSilhouette player={player} />
               </div>

               {/* Equipment Slots overlay */}
               <div className="absolute inset-0 z-10">
                  
                  {/* Left side: Weapon */}
                  <div className="absolute top-[40%] left-[-15%] origin-left scale-90">
                    <EquipmentSlot 
                      slotId="weapon" label={t("Arma")} item={player.equipment.weapon} shape="vertical"
                      onHover={onHover} onClick={handleUnequip}
                      getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                    />
                  </div>

                  {/* Right side: Bracers */}
                  <div className="absolute top-[38%] right-[-15%] origin-right scale-90">
                    <EquipmentSlot 
                      slotId="bracers" label={t("Braços")} item={player.equipment.bracers} shape="square"
                      onHover={onHover} onClick={handleUnequip}
                      getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                    />
                  </div>

                  {/* Center slots */}
                  <div className="absolute top-[5%] left-1/2 -translate-x-1/2 scale-90">
                    <EquipmentSlot 
                      slotId="helmet" label={t("Capacete")} item={player.equipment.helmet} shape="hexagon"
                      onHover={onHover} onClick={handleUnequip}
                      getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                    />
                  </div>
                  <div className="absolute top-[26%] left-1/2 -translate-x-1/2 scale-90">
                    <EquipmentSlot 
                      slotId="armor" label={t("Peitoral")} item={player.equipment.armor} shape="square"
                      onHover={onHover} onClick={handleUnequip}
                      getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                    />
                  </div>
                  <div className="absolute top-[54%] left-1/2 -translate-x-1/2 scale-90">
                    <EquipmentSlot 
                      slotId="pants" label={t("Pernas")} item={player.equipment.pants} shape="vertical"
                      onHover={onHover} onClick={handleUnequip}
                      getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                    />
                  </div>
                  <div className="absolute top-[78%] left-1/2 -translate-x-1/2 scale-90">
                    <EquipmentSlot 
                      slotId="boots" label={t("Botas")} item={player.equipment.boots} shape="double"
                      onHover={onHover} onClick={handleUnequip}
                      getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                    />
                  </div>
               </div>
             </div>

             {/* Accessories Grouped Side-by-Side (Floating Bottom Center) */}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-cyan-900/30 backdrop-blur-sm shadow-md z-20 scale-90">
                 <EquipmentSlot 
                     slotId="accessory1" label={t("Sec.")} item={player.equipment.accessory1} shape="square"
                     onHover={onHover} onClick={handleUnequip}
                     getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                 />
                 <EquipmentSlot 
                     slotId="accessory2" label={t("Mod.")} item={player.equipment.accessory2} shape="square"
                     onHover={onHover} onClick={handleUnequip}
                     getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                 />
                 <EquipmentSlot 
                     slotId="accessory3" label={t("Anel")} item={player.equipment.accessory3} shape="square"
                     onHover={onHover} onClick={handleUnequip}
                     getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
                 />
             </div>
           </div>

           {/* Status Panel */}
           <StatusPanel player={player} stats={stats} />
         </div>

         {/* Right Column: Cargo Grid and Inspection Panel */}
         <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* Cargo Grid (Inventory) */}
            <div className="w-full">
               <CargoGrid 
                   inventory={player.inventory}
                   onHover={onHover}
                   onClick={handleEquip}
                   canEquip={(item) => canClassEquipItem(player.currentClassId, item)}
                   getItemIcon={getItemIcon}
                   getRarityStyle={getRarityStyle}
                   getRarityGradient={getRarityGradient}
                   inventoryMessage={inventoryMessage}
                   handleAutoEquip={handleAutoEquip}
                   player={player}
               />
            </div>

            {/* Inspection / Comparison Panel */}
            <div className="w-full min-h-[520px]">
               {isComparing ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full relative">
                   {/* Left Panel: Equipped Item */}
                   <div className="relative h-full">
                     <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700/50 px-3 py-0.5 rounded-full z-20 shadow-md">
                       <span className="font-mono text-[9px] tracking-widest text-slate-400 font-bold uppercase">{t("Equipado")}</span>
                     </div>
                     {comparisonData.item ? (
                       <ItemInspectionPanel 
                         item={comparisonData.item} 
                         player={player} 
                         CLASSES={CLASSES} 
                         canClassEquipItem={canClassEquipItem} 
                         getItemIcon={getItemIcon}
                         renderManufacturerBadge={renderManufacturerBadge}
                       />
                     ) : (
                       <div className="w-full h-[520px] border border-dashed border-slate-800 bg-[#060b13]/40 flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
                         {/* Decorative corners */}
                         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700/50" />
                         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700/50" />
                         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700/50" />
                         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700/50" />

                         <div className="w-10 h-10 rounded-full border border-dashed border-slate-800 flex items-center justify-center mb-3">
                           <div className="w-5 h-5 border border-slate-800/50 rotate-45" />
                         </div>
                         <span className="font-mono text-slate-500 text-[10px] tracking-[0.2em] uppercase mb-1">
                           {t("Slot Vazio")}
                         </span>
                         <span className="font-mono text-slate-600 text-xs tracking-wider uppercase text-center px-4 max-w-[200px]">
                           {t("Nenhum(a)")} {comparisonData.slotLabel} {t("equipado(a)")}
                         </span>
                       </div>
                     )}
                   </div>

                   {/* Right Panel: Hovered Item */}
                   <div className="relative h-full">
                     <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-cyan-950/95 border border-cyan-500/50 px-3 py-0.5 rounded-full z-20 shadow-md animate-pulse">
                       <span className="font-mono text-[9px] tracking-widest text-cyan-400 font-bold uppercase">{t("Novo")}</span>
                     </div>
                     <ItemInspectionPanel 
                       item={hoveredItem} 
                       player={player} 
                       CLASSES={CLASSES} 
                       canClassEquipItem={canClassEquipItem} 
                       getItemIcon={getItemIcon}
                       renderManufacturerBadge={renderManufacturerBadge}
                     />
                   </div>
                 </div>
               ) : (
                 <ItemInspectionPanel 
                   item={hoveredItem} 
                   player={player} 
                   CLASSES={CLASSES} 
                   canClassEquipItem={canClassEquipItem} 
                   getItemIcon={getItemIcon}
                   renderManufacturerBadge={renderManufacturerBadge}
                 />
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
