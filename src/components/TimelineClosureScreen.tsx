import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, Sparkles, Target, Cpu, Award, RefreshCw, RefreshCw as LoopIcon } from 'lucide-react';
import { Player } from '../types';
import { ORIGINS } from '../core/entities/origins';
import { grantTimelineRewards, loadTimelineCodex } from '../core/engine/timelineCodex';
import { useTranslation } from '../core/engine/translation';

interface Props {
  player: Player;
  justCompletedAll: boolean;
  onComplete: () => void;
}

const CLOSURE_TEXTS: Record<string, { cosmeticTitle: string; text: string }> = {
  ciborgue_foragido: {
    cosmeticTitle: "O Ativo que Não Aceitou ser Descartado",
    text: "O Núcleo Matriz cai, e por um instante você espera sentir alívio. Sente só o peso de uma pergunta nova: se a Kinetix estava só executando ordens de algo maior, quem, exatamente, você acabou de vingar? Você guarda essa dúvida junto com a vitória. Uma linha temporal se fecha. Você sente que só fechou o capítulo errado."
  },
  nomade_silicio: {
    cosmeticTitle: "A Frequência que Aprendeu a Desconectar",
    text: "A rede fica em silêncio pela primeira vez desde que você se conectou a ela. Não é paz. É ausência. Você desligou algo que estava sozinho há tempo demais pra lembrar por que começou — e nunca chegou a perguntar. Uma linha temporal se fecha. Você não sabe se salvou alguém ou apagou a última testemunha."
  },
  quimico_sintetico: {
    cosmeticTitle: "O Remédio que se Recusou a Curar o Sistema",
    text: "As últimas anomalias caem junto com o núcleo que as sustentava, e por um segundo você reconhece, em cada uma delas, um rosto que talvez tenha cruzado nos corredores da OmniCorp antes de tudo isso. Você não tem certeza se libertou alguém ou terminou o que outros começaram. Uma linha temporal se fecha. As perguntas continuam abertas."
  },
  mercenario_elite: {
    cosmeticTitle: "O Engenheiro que Encontrou o Ponto Fraco Errado",
    text: "A estrutura ao redor do núcleo derrotado range, mas não desaba — porque, você percebe tarde demais, ela nunca dependia dele pra ficar de pé. Você venceu uma batalha contra o que sustenta a Torre. Não contra a Torre em si. Uma linha temporal se fecha. As fundações continuam lá embaixo, esperando a próxima."
  }
};

export const TimelineClosureScreen: React.FC<Props> = ({ player, justCompletedAll, onComplete }) => {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'boot' | 'details' | 'celebration'>('boot');
  const [displayedTextIndex, setDisplayedTextIndex] = useState<number>(0);
  const [displayedClosureText, setDisplayedClosureText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const { t } = useTranslation();

  const originId = player.originId || 'ciborgue_foragido';
  const originDef = ORIGINS[originId] || { name: 'Desconhecido', roleName: 'Pária' };
  const rewards = grantTimelineRewards(originId);

  const closureData = CLOSURE_TEXTS[originId] || {
    cosmeticTitle: "Explorador Temporal",
    text: "Sua jornada por esta linha temporal foi arquivada com sucesso."
  };

  const translatedClosureText = t(closureData.text);

  useEffect(() => {
    if (phase !== 'details') return;
    
    let index = 0;
    setDisplayedClosureText('');
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (index <= translatedClosureText.length) {
        setDisplayedClosureText(translatedClosureText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [phase, originId, translatedClosureText]);

  const BOOT_SEQUENCE = [
    `CRITICAL WARNING: MAINFRAME_PRIME OFFLINE.`,
    `INICIANDO EXTRAÇÃO DE CONSCIÊNCIA NEURAL...`,
    `DUMPING MEMORY ADRESSES: 0x7FFA89B001... [OK]`,
    `SALVANDO REGISTROS DE TELEMETRIA DO ANDAR 100... [OK]`,
    `DESCONECTANDO DO NÚCLEO MATRIZ...`,
    `DADOS ENVIADOS PARA O CÓDICE TEMPORAL CORPORATIVO.`,
    `LINHA TEMPORAL CONSOLIDADA COM SUCESSO.`,
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_SEQUENCE.length) {
        setBootLines(prev => [...prev, BOOT_SEQUENCE[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('details');
        }, 1000);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const getOriginIcon = (id: string) => {
    switch (id) {
      case 'ciborgue_foragido':
        return <Shield className="w-8 h-8 text-cyan-400" />;
      case 'nomade_silicio':
        return <Zap className="w-8 h-8 text-amber-400" />;
      case 'quimico_sintetico':
        return <Sparkles className="w-8 h-8 text-emerald-400" />;
      case 'mercenario_elite':
        return <Target className="w-8 h-8 text-rose-400" />;
      default:
        return <Cpu className="w-8 h-8 text-cyan-400" />;
    }
  };

  const handleNextPhase = () => {
    if (justCompletedAll && phase === 'details') {
      setPhase('celebration');
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-emerald-400 font-mono z-50 flex flex-col items-center justify-center p-4 overflow-y-auto select-none">
      {/* Sibling Scanline & Vignette Overlays for authentic retro terminal feel */}
      <div className="absolute inset-0 pointer-events-none crt-scanlines z-30" />
      <div className="absolute inset-0 pointer-events-none crt-vignette z-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none z-20" />

      <div className="max-w-2xl w-full bg-slate-950/90 border border-emerald-500/30 rounded-lg p-6 md:p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-10 space-y-6">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">{t("CÓDICE TEMPORAL // REGISTRO")}</span>
          </div>
          <span className="text-[10px] text-emerald-500/60 font-bold">{t("STATUS: CONSOLIDAÇÃO ATIVA")}</span>
        </div>

        {/* Phase: BOOTING */}
        {phase === 'boot' && (
          <div className="space-y-2 min-h-[220px] flex flex-col justify-end">
            {bootLines.map((line, idx) => (
              <div key={idx} className="text-xs md:text-sm tracking-wide font-mono animate-[fadeIn_0.2s_ease-out]">
                <span className="text-emerald-600/80 mr-2">&gt;</span> {t(line)}
              </div>
            ))}
            <div className="w-3 h-4 bg-emerald-400 animate-pulse inline-block mt-2" />
          </div>
        )}

        {/* Phase: TIMELINE DETAILS */}
        {phase === 'details' && (
          <div className="space-y-6 animate-[fadeIn_0.8s_ease-out]">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-slate-900 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {getOriginIcon(originId)}
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-emerald-200 mt-2">
                {t("Linha Temporal Concluída")}
              </h2>
              <p className="text-xs text-emerald-500/60 uppercase tracking-[0.2em] font-bold">
                {t("Origem")}: {t(originDef.name)} ({t(originDef.roleName)})
              </p>
            </div>

            <div className="bg-slate-900/40 border border-emerald-500/20 p-4 rounded-md space-y-4">
              <div className="text-xs uppercase tracking-widest text-emerald-300 border-b border-emerald-500/10 pb-2 flex items-center gap-2">
                <Award className="w-4 h-4" /> {t("LINHA TEMPORAL CONSOLIDADA — REGISTROS")}
              </div>
              
              <div className="text-sm text-emerald-100 leading-relaxed space-y-3 font-mono">
                <p 
                  className="italic border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-950/10 cursor-pointer select-text text-xs"
                  onClick={() => {
                    if (!isTypingComplete) {
                      setDisplayedClosureText(translatedClosureText);
                      setIsTypingComplete(true);
                    }
                  }}
                  title={t("Clique para completar o texto")}
                >
                  "{displayedClosureText}"
                  {!isTypingComplete && <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block ml-1" />}
                </p>
                <p className="text-xs text-emerald-400/80">
                  {t("Suas ações nesta iteração foram salvas de forma permanente. Sua consciência transcendeu os andares do Pináculo, garantindo benefícios permanentes na subida da rede.")}
                </p>
              </div>

              {/* Reward Placeholders */}
              <div className="pt-2 border-t border-emerald-500/10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/80">{t("Recompensa:")} [placeholder]</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 border border-emerald-500/10 rounded">
                    <span className="text-emerald-500 block text-[10px] uppercase tracking-widest">{t("Título Cosmético")}</span>
                    <span className="text-emerald-200 font-bold">{t(rewards.title)}</span>
                  </div>
                  <div className="bg-slate-950 p-2 border border-emerald-500/10 rounded">
                    <span className="text-emerald-500 block text-[10px] uppercase tracking-widest">{t("Habilidade Passiva Ú")}nica</span>
                    <span className="text-emerald-200 font-bold">{t("Resistência Temporal (A definir)")}</span>
                  </div>
                  <div className="bg-slate-950 p-2 border border-emerald-500/10 rounded col-span-1 md:col-span-2">
                    <span className="text-emerald-500 block text-[10px] uppercase tracking-widest">{t("Bônus Meta-Persistente de Run (Global)")}</span>
                    <span className="text-emerald-200 font-bold">{t("XP / Ouro (A definir em sessão de recompensas dedicada)")}</span>
                  </div>
                </div>
                <div className="text-[9px] text-amber-400/80 mt-1 italic font-mono">
                  {t("// TODO: valores a definir em sessão de recompensas.")}
                </div>
              </div>
            </div>

            <button
              onClick={handleNextPhase}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-950 border border-emerald-500 text-emerald-300 hover:bg-emerald-900 font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              {justCompletedAll ? t("Prosseguir Integração") : t("Iniciar Nova Linha Temporal")}
            </button>
          </div>
        )}

        {/* Phase: CELEBRATION (Unlocked Secret Class) */}
        {phase === 'celebration' && (
          <div className="space-y-6 animate-[fadeIn_0.8s_ease-out]">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-amber-950/50 border border-amber-500/40 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-amber-400 mt-2">
                {t("Conexão Total Estabelecida")}
              </h2>
              <p className="text-xs text-amber-500/70 uppercase tracking-[0.2em] font-bold">
                {t("Frequência Harmônica Unificada")}
              </p>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-md space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-amber-400 font-bold font-mono flex items-center gap-2">
                {t("[ALERTA DE SEGURANÇA MATRIX CENTRAL]")}
              </h3>
              
              <div className="text-sm text-amber-100 leading-relaxed space-y-3 font-sans">
                <p className="font-bold text-amber-300">
                  {t("Todas as 4 linhas temporais originais foram totalmente restauradas e estabilizadas.")}
                </p>
                <p className="text-xs text-amber-400/80 font-mono">
                  &gt; {t("DESCRIPTOGRAFANDO NÚCLEO... CHAVE MESTRA CONTRATUAL ENCONTRADA.")} <br/>
                  &gt; {t("NOVO CÓDIGO DE ORIGEM SECRETA DESBLOQUEADO COM SUCESSO.")} <br/>
                  &gt; {t("ACESSO LIBERADO NA TELA DE SELEÇÃO DE EXPLORADOR.")}
                </p>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-950 border border-amber-500 text-amber-300 hover:bg-amber-900 font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
            >
              {t("Retornar para Seleção de Origem")}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
