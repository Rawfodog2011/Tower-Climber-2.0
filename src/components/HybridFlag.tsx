import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

interface HybridFlagProps {
  primaryCountry: keyof typeof Flags;
  secondaryCountry: keyof typeof Flags;
  className?: string;
  title?: string;
}

export const HybridFlag: React.FC<HybridFlagProps> = ({
  primaryCountry,
  secondaryCountry,
  className = '',
  title = '',
}) => {
  const Primary = Flags[primaryCountry];
  const Secondary = Flags[secondaryCountry];

  return (
    <div className={`relative w-14 h-9 overflow-hidden ${className}`} title={title}>
      {/* Primary flag (Bottom Right) */}
      <div className="absolute inset-0">
        <Primary className="w-full h-full object-cover" />
      </div>
      
      {/* Secondary flag (Top Left) */}
      <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
        <Secondary className="w-full h-full object-cover" />
      </div>
      
      {/* Optional diagonal separator line for better visual distinction */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(to bottom left, transparent 48.5%, rgba(0,0,0,0.5) 49%, rgba(0,0,0,0.5) 51%, transparent 51.5%)'
        }}
      />
    </div>
  );
};
