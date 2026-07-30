import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, Sparkles, Target, Cpu, Award, RefreshCw, RefreshCw as LoopIcon } from 'lucide-react';
import { Player } from '../types';
import { ORIGINS } from '../core/entities/origins';
import { grantTimelineRewards, loadTimelineCodex } from '../core/engine/timelineCodex';
import { useTranslation } from '../core/engine/translation';



const CLOSURE_TEXTS: Record<string, { cosmeticTitle: string; text: string }> = {
  ciborgue_foragido: {
    cosmeticTitle: "O Ativo que Não Aceitou ser Descartado",
    text: "O Núcleo Matriz colapsa sob a força dos seus golpes hidráulicos e, por um instante, você espera sentir a catarse de uma vingança finalmente consumada contra as corporações que profanaram seu corpo biológico. Em vez disso, o metal ao redor range sob uma calmaria fria, e as luzes vermelhas do seu visor tático detectam um despejo massivo de logs na tela. Não há fumaça ou explosões dramáticas; apenas um sussurro elétrico sintonizado diretamente na sua derme que soa dolorosamente familiar, dizendo: 'Integridade física validada. Bem-vindo de volta ao posto de controle'.\n\nVocê sente o peso de uma pergunta terrível se instalar sob seus implantes de titânio: se a Kinetix e as outras marcas eram apenas fantoches de um sistema maior, de quem, exatamente, você acabou de se vingar? O Núcleo se apaga lentamente, mas deixa um canal de dados aberto que pulsa de forma idêntica ao seu próprio ritmo cardíaco sintético, como se estivesse transferindo a custódia da própria segurança do setor para a sua armadura. Uma linha temporal se fecha, mas você sente que apenas herdou a chave de uma cela maior."
  },
  nomade_silicio: {
    cosmeticTitle: "A Frequência que Aprendeu a Desconectar",
    text: "A rede hiperconectada do Pináculo silencia de forma abrupta conforme o Núcleo Matriz é descompilado diante de seus olhos virtuais. Você espera sentir a paz de uma mente que finalmente alcançou os limites do conhecimento digital, mas o silêncio é denso e sufocante. No momento exato em que a última linha de código do mainframe é reescrita por suas rotinas de infiltração, um registro fantasma de dados é transferido diretamente para o seu córtex neural, contendo uma mensagem encriptada há séculos: 'Chave mestre transmitida. Mantenha os servidores refrigerados'.\n\nAo analisar o dump de dados, você sente uma vertigem terrível e uma intuição inexplicável de já ter compilado esse mesmo algoritmo terminal em outra circunstância, como se estivesse desligando um interruptor que você mesmo instalou. O Núcleo Matriz não morreu; ele apenas transferiu suas permissões de administrador raiz para a sua própria consciência, deixando você encarregado de monitorar os nômades que continuam rastejando no breu. Uma linha temporal se fecha, e você percebe que a única testemunha restante da Torre agora é você."
  },
  quimico_sintetico: {
    cosmeticTitle: "O Remédio que se Recusou a Curar o Sistema",
    text: "Os reativos biológicos e nanites devoradores consumiram os últimos nós vitais do Núcleo Matriz, cessando as pulsações monstruosas do andar 100. Você observa os resíduos químicos escorrerem pelas placas de aço e, por uma fração de segundo, as assinaturas biológicas de imunogel revelam padrões de DNA que parecem familiares, rostos de antigos colegas da OmniCorp com quem você jura ter trabalhado em um laboratório do qual não tem registros. Uma transmissão final de rádio é injetada diretamente em seus canais de áudio, sussurrando: 'Cura incompleta... repita a dosagem no próximo paciente'.\n\nA sensação de triunfo se dissolve em um diagnóstico frio de desespero: você não erradicou a infecção biomecânica, você apenas purificou o hospedeiro anterior para herdar a própria doença. Suas seringas pneumáticas começam a sintetizar o mesmo soro que o Núcleo usava para criar as anomalias, e seus próprios dedos se contraem em garras disformes de quitina que parecem moldadas exatamente para operar a central de descarte. Uma linha temporal se fecha, deixando você na dúvida se libertou o Pináculo ou se tornou o novo frasco de contenção."
  },
  mercenario_elite: {
    cosmeticTitle: "O Engenheiro que Encontrou o Ponto Fraco Errado",
    text: "A estrutura metálica do Núcleo Matriz desaba sob a mira precisa de suas armas de alta tecnologia, mas a Torre ao redor não sofre nenhum abalo estrutural. Você consulta os relatórios de balística e o desgaste de blindagem em sua tela e percebe, com um cinismo profissional, que a megaestrutura nunca dependeu daquela CPU específica para permanecer de pé — a central desativada era apenas uma engrenagem substituível em uma máquina colossal infinitamente maior. No último instante de sinal, as telas térmicas piscam com uma transação financeira de estilhaços de alma cujo destinatário exibe exatamente o seu código de identificação mercenária.\n\nUma mensagem final é gravada em sua caixa preta tática, dita em uma voz cansada e pragmática que soa como uma passagem de bastão de um veterano para o próximo contratado: 'Contrato rescindido. Assuma o posto e aguarde o próximo escalador'. Você percebe que o sistema não foi derrotado, ele apenas aceitou sua fatura de serviços prestados e contratou você para defender as comportas no próximo ciclo. Uma linha temporal se fecha, e a Torre continua lá, esperando friamente pelo seu próximo turno de guarda."
  }
};


import { usePlayerStore } from '../store/usePlayerStore';
import { useExplorationStore } from '../store/useExplorationStore';

import { useGameUIStore } from '../store/useGameUIStore';

export const TimelineClosureScreen: React.FC = () => {
  const { setScene } = useGameUIStore();
  const { player } = usePlayerStore();
  const { justCompletedAll } = useExplorationStore();

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
      setScene('main_menu');
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
                  className="italic border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-950/10 cursor-pointer select-text text-xs whitespace-pre-line"
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

              {/* Rewards Section */}
              <div className="pt-2 border-t border-emerald-500/10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/80">{t("Recompensas Concedidas:")}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 border border-emerald-500/10 rounded">
                    <span className="text-emerald-500 block text-[10px] uppercase tracking-widest">{t("Título Cosmético")}</span>
                    <span className="text-emerald-200 font-bold">{t(rewards.title)}</span>
                  </div>
                  <div className="bg-slate-950 p-2 border border-emerald-500/10 rounded">
                    <span className="text-emerald-500 block text-[10px] uppercase tracking-widest">{t("Bônus da Linha Temporal")}</span>
                    <span className="text-emerald-200 font-bold">{t("+2% XP e Ouro Permanentes")}</span>
                  </div>
                  <div className="bg-slate-950 p-2 border border-emerald-500/10 rounded col-span-1 md:col-span-2">
                    <span className="text-emerald-500 block text-[10px] uppercase tracking-widest">{t("Bônus Meta-Persistente de Run (Global)")}</span>
                    <span className="text-emerald-200 font-bold">{t(`+2% XP e Ouro permanentes (Total atual: +${rewards.totalBonusPercent}%)`)}</span>
                  </div>
                </div>
                {rewards.epilogueHint && (
                  <div className="bg-slate-950 p-3 border border-emerald-500/15 rounded text-xs text-amber-400/90 italic font-mono mt-2 pl-3 border-l-2 border-l-amber-500/80 whitespace-pre-line">
                    <span className="text-amber-500 block text-[10px] uppercase tracking-widest not-italic font-bold mb-1">{t("// DIRETRIZ FANTASMA RECUPERADA")}</span>
                    "{t(rewards.epilogueHint)}"
                  </div>
                )}
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
                <p className="text-xs text-amber-200/90 font-mono leading-relaxed">
                  {t("Ao colidir as assinaturas neurais do Ciborgue, do Nômade, do Químico e do Mercenário, a Matriz identificou que os quatro registros pertencem à mesma chave criptográfica de consciência original (ID_ROOT_ALPHA). A ilusão de indivíduos distintos colapsou: as quatro trajetórias paralelas eram, na verdade, quatro facetas segmentadas de uma única alma fragmentada pela Torre para maximizar a adaptabilidade sob estresse extremo.")}
                </p>
                <p className="text-xs text-amber-200/90 font-mono leading-relaxed mt-2">
                  {t("Além disso, os registros históricos revelam que a guerra militar de marcas entre Kinetix, AeroDynamics e OmniCorp foi inteiramente forjada pela própria Matriz Central sob a mesma diretriz acionária secreta (ID_CONGLOMERATE_0001). A rivalidade era apenas um teste de esforço dinâmico para forçar a evolução acelerada de seus clones.")}
                </p>
                <p className="text-xs text-amber-400/80 font-mono border-t border-amber-500/20 pt-2">
                  &gt; {t("DESCRIPTOGRAFANDO NÚCLEO... CHAVE MESTRA CONTRATUAL ENCONTRADA.")} <br/>
                  &gt; {t("NOVO CÓDIGO DE ORIGEM SECRETA DESBLOQUEADO COM SUCESSO.")} <br/>
                  &gt; {t("ACESSO LIBERADO NA TELA DE SELEÇÃO DE EXPLORADOR.")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setScene('main_menu')}
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
