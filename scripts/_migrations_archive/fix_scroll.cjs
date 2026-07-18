const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldEffect = `  useEffect(() => {
    if (scene === 'combat') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatState?.logs, scene]);`;

const newEffect = `  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scene === 'combat') {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }
  }, [combatState?.logs, scene]);`;

content = content.replace(oldEffect, newEffect);

const oldLogContainer = `<div className="p-4 overflow-y-auto max-h-64 font-mono text-[11px] leading-relaxed space-y-1.5 flex-1 custom-scrollbar">`;
const newLogContainer = `<div ref={logContainerRef} className="p-4 overflow-y-auto max-h-64 font-mono text-[11px] leading-relaxed space-y-1.5 flex-1 custom-scrollbar">`;
content = content.replace(oldLogContainer, newLogContainer);

// also handle the one before the previous update
const oldLogContainerFallback = `<div className="p-4 overflow-y-auto max-h-64 font-mono text-xs md:text-sm space-y-1 flex-1 custom-scrollbar">`;
const newLogContainerFallback = `<div ref={logContainerRef} className="p-4 overflow-y-auto max-h-64 font-mono text-xs md:text-sm space-y-1 flex-1 custom-scrollbar">`;
content = content.replace(oldLogContainerFallback, newLogContainerFallback);

fs.writeFileSync('src/App.tsx', content);
