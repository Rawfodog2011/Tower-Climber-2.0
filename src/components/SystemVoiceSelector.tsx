import React, { useState, useEffect } from 'react';
import { Sliders, Volume2, UserCheck } from 'lucide-react';
import { tts, TTSState } from '../core/engine/tts';
import { useTranslation } from '../core/engine/translation';
import { TTSButton } from './TTSButton';

export const SystemVoiceSelector: React.FC = () => {
  const { t, language } = useTranslation();
  const [ttsState, setTtsState] = useState<TTSState>(tts.getState());
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const unsubscribe = tts.subscribe((state) => {
      setTtsState(state);
    });
    setAllVoices(tts.getAllVoices());
    return () => {
      unsubscribe();
    };
  }, []);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'AUTO_MALE') {
      tts.setGenderPreference('male');
    } else if (val === 'AUTO_FEMALE') {
      tts.setGenderPreference('female');
    } else {
      tts.setSelectedVoiceURI(val);
    }
  };

  const selectedValue = ttsState.selectedVoiceURI || (ttsState.gender === 'male' ? 'AUTO_MALE' : 'AUTO_FEMALE');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          {t("Seletor de Voz do Sistema")}
        </label>
        <TTSButton 
          text={t("Testando configuração de voz do sistema e áudio adaptativo.")} 
          id="voice-test-selector"
          label={t("Testar Voz")}
          variant="purple"
          size="sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <select
          value={selectedValue}
          onChange={handleVoiceChange}
          className="w-full bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-200 text-sm rounded px-3 py-2 focus:outline-none focus:border-purple-400 transition-colors"
        >
          <optgroup label={t("Modos Automáticos")}>
            <option value="AUTO_MALE">♂ {t("Modo Automático Masculino")}</option>
            <option value="AUTO_FEMALE">♀ {t("Modo Automático Feminino")}</option>
          </optgroup>
          {allVoices.length > 0 && (
            <optgroup label={`${t("Vozes Instaladas no Seu Dispositivo")} (${allVoices.length})`}>
              {allVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}) {tts.isVoiceMale(v) ? '♂' : '♀'}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <div className="text-[10px] text-slate-400 leading-tight bg-slate-900/40 p-2 rounded border border-slate-800/50">
          {t("Nota: A narração utiliza as vozes sintetizadas instaladas no seu navegador e sistema operacional acompanhada pela trilha sombria.")}
        </div>
      </div>
    </div>
  );
};
