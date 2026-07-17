import React from 'react';
import { Player } from '../../types';

interface Props {
  player: Player;
}

export const ExosuitSilhouette: React.FC<Props> = ({ player }) => {
  const eq = player.equipment;
  
  return (
    <svg viewBox="0 0 400 800" className="w-full h-full max-h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)] overflow-visible">
      <defs>
        <linearGradient id="glowEquipped" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.6)" />
          <stop offset="100%" stopColor="rgba(34, 211, 238, 0.1)" />
        </linearGradient>
        <linearGradient id="glowBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0.9)" />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0.7)" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Connection Lines (rendered behind) */}
      <g stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" fill="none" filter="url(#subtleGlow)">
        {/* Helmet -> Head */}
        <path d="M 200,90 L 200,50 L 150,50" />
        {/* Armor -> Chest */}
        <path d="M 200,220 L 200,190 L 270,190" />
        {/* Weapon -> Right Hand */}
        <path d="M 120,400 L 90,400 L 90,300" />
        {/* Bracers -> Left Arm */}
        <path d="M 290,320 L 320,320 L 320,250" />
        {/* Drone -> Shoulder */}
        <path d="M 130,170 L 100,170 L 100,120" />
        {/* Pants -> Waist/Legs */}
        <path d="M 200,450 L 200,480 L 270,480" />
        {/* Boots -> Feet */}
        <path d="M 200,680 L 200,720 L 280,720" />
        {/* Module -> Chest Core */}
        <path d="M 200,260 L 280,260" />
        {/* Ring -> Left Hand */}
        <path d="M 300,420 L 340,420 L 340,480" />
      </g>

      <g stroke="#1e293b" strokeWidth="2">
        {/* Head */}
        <path d="M175 80 L225 80 L235 130 L200 160 L165 130 Z" 
              fill={eq.helmet ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.helmet ? "#22d3ee" : "#334155"}
              filter={eq.helmet ? "url(#neonGlow)" : ""} />
        
        {/* Core/Neck */}
        <path d="M185 165 L215 165 L225 190 L175 190 Z" fill="#020617" stroke="#1e293b" />

        {/* Chest/Armor */}
        <path d="M140 195 L260 195 L280 270 L240 380 L160 380 L120 270 Z" 
              fill={eq.armor ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.armor ? "#22d3ee" : "#334155"}
              filter={eq.armor ? "url(#neonGlow)" : ""} />

        {/* Shoulders */}
        <path d="M110 205 L135 195 L125 260 L90 260 Z" 
              fill={eq.accessory1 ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.accessory1 ? "#22d3ee" : "#334155"} />
        <path d="M290 205 L265 195 L275 260 L310 260 Z" 
              fill={eq.accessory1 ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.accessory1 ? "#22d3ee" : "#334155"} />

        {/* Arms */}
        <path d="M90 270 L120 270 L105 350 L75 350 Z" fill="url(#glowBase)" stroke="#334155" />
        <path d="M310 270 L280 270 L295 350 L325 350 Z" fill="url(#glowBase)" stroke="#334155" />

        {/* Bracers/Forearms */}
        <path d="M75 360 L105 360 L95 440 L60 440 Z" 
              fill={eq.bracers ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.bracers ? "#22d3ee" : "#334155"}
              filter={eq.bracers ? "url(#neonGlow)" : ""} />
        <path d="M325 360 L295 360 L305 440 L340 440 Z" 
              fill={eq.bracers ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.bracers ? "#22d3ee" : "#334155"}
              filter={eq.bracers ? "url(#neonGlow)" : ""} />

        {/* Hands */}
        <path d="M60 450 L90 450 L80 490 L50 490 Z" 
              fill={eq.weapon ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.weapon ? "#22d3ee" : "#334155"} />
        <path d="M340 450 L310 450 L320 490 L350 490 Z" 
              fill={eq.accessory3 ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.accessory3 ? "#22d3ee" : "#334155"} />

        {/* Belt/Pelvis */}
        <path d="M150 390 L250 390 L230 440 L170 440 Z" fill="url(#glowBase)" stroke="#334155" />

        {/* Thighs (Pants) */}
        <path d="M165 450 L195 450 L185 580 L140 580 Z" 
              fill={eq.pants ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.pants ? "#22d3ee" : "#334155"}
              filter={eq.pants ? "url(#neonGlow)" : ""} />
        <path d="M205 450 L235 450 L260 580 L215 580 Z" 
              fill={eq.pants ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.pants ? "#22d3ee" : "#334155"}
              filter={eq.pants ? "url(#neonGlow)" : ""} />

        {/* Calves/Boots */}
        <path d="M135 590 L180 590 L190 730 L120 730 Z" 
              fill={eq.boots ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.boots ? "#22d3ee" : "#334155"}
              filter={eq.boots ? "url(#neonGlow)" : ""} />
        <path d="M220 590 L265 590 L280 730 L210 730 Z" 
              fill={eq.boots ? "url(#glowEquipped)" : "url(#glowBase)"}
              stroke={eq.boots ? "#22d3ee" : "#334155"}
              filter={eq.boots ? "url(#neonGlow)" : ""} />
      </g>

      {/* Chest Core (Module) */}
      <circle cx="200" cy="260" r="15" 
              fill={eq.accessory2 ? "#22d3ee" : "#0f172a"} 
              stroke={eq.accessory2 ? "#fff" : "#334155"} 
              filter={eq.accessory2 ? "url(#neonGlow)" : ""} />

      {/* Tech Overlay Details */}
      <g stroke="#0ea5e9" strokeWidth="1" fill="none" opacity="0.5">
        <line x1="200" y1="195" x2="200" y2="245" />
        <line x1="200" y1="275" x2="200" y2="380" />
        <line x1="160" y1="320" x2="240" y2="320" />
        <circle cx="200" cy="115" r="5" fill="#0ea5e9" opacity="0.3" />
      </g>
    </svg>
  );
};
