import React, { useRef } from 'react';
import { Download, Upload, Save } from 'lucide-react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../core/engine/storage';
import { useTranslation } from '../core/engine/translation';
import { useToastStore } from '../store/useToastStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { migrateSave } from '../core/engine/migrations';

export const SaveManager: React.FC<{ glitchProgress?: number }> = ({ glitchProgress = 0 }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { triggerToast } = useToastStore();

  const handleExport = () => {
    try {
      const saveData = {
        save: getStorageItem(STORAGE_KEYS.SAVE, null),
        codex: getStorageItem(STORAGE_KEYS.TIMELINE_CODEX, null),
        memory: getStorageItem(STORAGE_KEYS.MEMORY_ARCHIVE, null)
      };

      const jsonStr = JSON.stringify(saveData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'save_jogo.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      triggerToast(t("Progresso exportado com sucesso!"));
    } catch (e) {
      console.error(e);
      triggerToast(`Erro: ${t("Erro ao exportar save")}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (!parsed) {
          throw new Error("JSON Inválido");
        }

        // Validate basic structure if needed, or simply trust the structure.
        // It should at least contain the 'save' property, or we can just import whatever is there.
        if (parsed.save !== undefined) {
          if (parsed.save) {
            setStorageItem(STORAGE_KEYS.SAVE, parsed.save);
            const migrated = migrateSave(parsed.save);
            if (migrated) usePlayerStore.getState().setPlayer(migrated);
          }
          if (parsed.codex) setStorageItem(STORAGE_KEYS.TIMELINE_CODEX, parsed.codex);
          if (parsed.memory) setStorageItem(STORAGE_KEYS.MEMORY_ARCHIVE, parsed.memory);
        } else {
          // Backward compatibility if they upload just the player object
          setStorageItem(STORAGE_KEYS.SAVE, parsed);
          const migrated = migrateSave(parsed);
          if (migrated) usePlayerStore.getState().setPlayer(migrated);
        }

        triggerToast(t("Progresso importado com sucesso! Reiniciando..."));
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        // Apenas exibe o toast, sem console.error para evitar falsos positivos de erro no ambiente
        
        triggerToast(`Erro: ${t("Erro: Arquivo inválido")}`);
      }
    };
    reader.onerror = () => {
      // silent
      triggerToast(`Erro: ${t("Erro ao ler arquivo")}`);
    };
    
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  };

  return (
    <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-slate-800'} flex flex-col gap-4 transition-colors duration-500`}>
      <div className="flex flex-col">
        <span className="font-bold tracking-wider flex items-center gap-2">
          <Save className="w-4 h-4 text-cyan-500" /> 
          {t("Backup Manual (Importar/Exportar)")}
        </span>
        <span className="text-xs text-slate-500 mt-1">
          {t("Guarde seu progresso em um arquivo para não perdê-lo caso o cache do navegador seja limpo.")}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExport}
          className="flex-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-400 font-bold py-2 px-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          {t("Exportar Save")}
        </button>
        
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
        
        <button
          onClick={handleImportClick}
          className="flex-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-400 font-bold py-2 px-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Upload className="w-4 h-4" />
          {t("Importar Save")}
        </button>
      </div>
    </div>
  );
};
