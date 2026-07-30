import React from 'react';

// Data-driven Asset Dictionary mapping IDs to optimized SVG components or image URLs.
// Designed with a cyberpunk aesthetic (slate/cyan/purple/amber/red).

const CyberpunkBg = ({ color, pattern }: { color: string, pattern: React.ReactNode }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`glow-${color}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor="#020617" stopOpacity="1" />
      </radialGradient>
      <pattern id={`grid-${color}`} width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#020617" />
    <rect width="100%" height="100%" fill={`url(#glow-${color})`} />
    <rect width="100%" height="100%" fill={`url(#grid-${color})`} />
    {pattern}
  </svg>
);

export const AssetDictionary = {
  backgrounds: {
    toxic_refinery: () => (
      <CyberpunkBg color="#22c55e" pattern={
        <g opacity="0.3">
          <circle cx="1500" cy="800" r="300" fill="#15803d" filter="blur(40px)" />
          <path d="M 0 800 Q 400 700 960 900 T 1920 800 L 1920 1080 L 0 1080 Z" fill="#166534" />
          <rect x="200" y="400" width="100" height="400" fill="#14532d" />
          <rect x="400" y="300" width="150" height="500" fill="#14532d" />
        </g>
      } />
    ),
    frozen_datacore: () => (
      <CyberpunkBg color="#06b6d4" pattern={
        <g opacity="0.3">
          <circle cx="400" cy="200" r="400" fill="#0891b2" filter="blur(50px)" />
          <path d="M 200 0 L 200 1080 M 600 0 L 600 1080 M 1000 0 L 1000 1080 M 1400 0 L 1400 1080" stroke="#06b6d4" strokeWidth="10" strokeOpacity="0.2" />
          <rect x="800" y="200" width="300" height="600" fill="#164e63" />
        </g>
      } />
    ),
    plasma_furnace: () => (
      <CyberpunkBg color="#f97316" pattern={
        <g opacity="0.4">
          <circle cx="960" cy="540" r="250" fill="#ea580c" filter="blur(30px)" />
          <circle cx="960" cy="540" r="150" fill="#fef08a" filter="blur(15px)" />
          <path d="M 0 540 L 1920 540 M 960 0 L 960 1080" stroke="#c2410c" strokeWidth="20" strokeOpacity="0.5" />
        </g>
      } />
    ),
    none: () => (
      <CyberpunkBg color="#6366f1" pattern={
        <g opacity="0.2">
          <path d="M 0 100 L 1920 100 M 0 300 L 1920 300 M 0 500 L 1920 500 M 0 700 L 1920 700 M 0 900 L 1920 900" stroke="#4f46e5" strokeWidth="2" />
          <polygon points="1200,1080 1400,200 1600,1080" fill="#312e81" />
        </g>
      } />
    ),
  },
  portraits: {
    mercenario: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#0f172a" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.3" />
        <path d="M 60 180 L 60 120 L 100 80 L 140 120 L 140 180 Z" fill="#7f1d1d" />
        <circle cx="100" cy="70" r="30" fill="#450a0a" stroke="#f87171" strokeWidth="2" />
        <rect x="80" y="60" width="40" height="10" fill="#ef4444" />
      </svg>
    ),
    hacker: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#0f172a" />
        <path d="M 20 100 L 180 100 M 100 20 L 100 180" stroke="#06b6d4" strokeWidth="1" opacity="0.2" />
        <path d="M 50 180 Q 100 120 150 180 Z" fill="#164e63" />
        <circle cx="100" cy="90" r="35" fill="#083344" />
        <path d="M 75 85 L 125 85 L 115 100 L 85 100 Z" fill="#06b6d4" opacity="0.8" />
      </svg>
    ),
    nomade: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#0f172a" />
        <path d="M 0 200 L 100 100 L 200 200 Z" fill="#78350f" opacity="0.5" />
        <path d="M 40 180 L 100 90 L 160 180 Z" fill="#451a03" />
        <circle cx="100" cy="80" r="30" fill="#f59e0b" opacity="0.2" />
        <circle cx="100" cy="80" r="25" fill="#1c1917" stroke="#d97706" strokeWidth="2" />
        <path d="M 75 80 Q 100 100 125 80" fill="none" stroke="#d97706" strokeWidth="3" />
      </svg>
    ),
    aristocrata: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#0f172a" />
        <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.2" />
        <path d="M 70 180 L 70 110 L 100 140 L 130 110 L 130 180 Z" fill="#3b0764" />
        <circle cx="100" cy="70" r="25" fill="#17012a" stroke="#d8b4fe" strokeWidth="1" />
        <polygon points="90,60 110,60 100,45" fill="#a855f7" />
      </svg>
    ),
    fantasma: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#0f172a" />
        <path d="M 60 180 Q 100 80 140 180 Z" fill="#1e1b4b" />
        <circle cx="100" cy="90" r="30" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.4" filter="blur(2px)" />
        <circle cx="100" cy="90" r="20" fill="#0f172a" />
        <circle cx="90" cy="85" r="4" fill="#818cf8" />
        <circle cx="110" cy="85" r="4" fill="#818cf8" />
      </svg>
    ),
    default: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#0f172a" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="10 5" opacity="0.5" />
        <path d="M 70 180 L 70 140 A 30 30 0 0 1 130 140 L 130 180 Z" fill="#1e293b" />
        <circle cx="100" cy="90" r="30" fill="#1e293b" />
        <path d="M 90 90 L 110 90 M 100 80 L 100 100" stroke="#475569" strokeWidth="2" />
      </svg>
    ),
  },
  icons: {
    weapon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6" />
        <path d="M21 3L18 6" />
        <path d="M16 11l5 5-2 2-5-5" />
        <path d="M8.5 13.5L5 17l-2-2" />
        <circle cx="18" cy="6" r="3" />
      </svg>
    ),
    armor: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8H4v4" />
        <path d="M12 22V8" />
        <path d="M8 8V4h8v4" />
        <path d="M4 12q8 5 8 10 0-5 8-10" />
      </svg>
    ),
    helmet: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8v4h16v-4a8 8 0 0 0-8-8Z" />
        <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        <path d="M8 14h8" />
        <path d="M12 10v4" />
      </svg>
    ),
    pants: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h12l-2 18h-3l-1-8-1 8H8L6 4z" />
        <path d="M8 12h8" />
      </svg>
    ),
    boots: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V8H6v12" />
        <path d="M6 14h12" />
        <path d="M9 20v2" />
        <path d="M15 20v2" />
        <path d="M4 8l2-4h12l2 4" />
      </svg>
    ),
    bracers: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16" />
        <path d="M6 8h12M6 16h12" />
        <path d="M9 4v16M15 4v16" />
      </svg>
    ),
    accessory: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="6" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    consumable: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v4M14 2v4" />
        <rect x="7" y="6" width="10" height="16" rx="2" />
        <path d="M7 14h10" />
        <path d="M12 10v8" />
      </svg>
    ),
    circuit_module: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <path d="M9 9h6v6H9z" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    material: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  }
};
