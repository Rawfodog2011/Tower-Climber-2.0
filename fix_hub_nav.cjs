const fs = require('fs');
let code = fs.readFileSync('src/components/HubNavigation.tsx', 'utf8');

if (!code.includes('onOpenSettings')) {
  code = code.replace(
    "export const HubNavigation: React.FC = () => {",
    "interface HubNavigationProps {\n  onOpenSettings?: () => void;\n}\n\nexport const HubNavigation: React.FC<HubNavigationProps> = ({ onOpenSettings }) => {"
  );
  
  const rightButtonCode = `      <button 
        onClick={() => scroll('right')}
        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors z-10 mx-1 shrink-0 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>`;

  const newRightButtonCode = `      <button 
        onClick={() => scroll('right')}
        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors z-10 mx-1 shrink-0 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="ml-2 p-2 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors shrink-0 active:scale-95 flex items-center justify-center"
          title={t("Configurações e Salvamento")}
        >
          <Settings className="w-5 h-5" />
        </button>
      )}`;

  code = code.replace(rightButtonCode, newRightButtonCode);
  fs.writeFileSync('src/components/HubNavigation.tsx', code);
}
