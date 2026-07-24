import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../core/engine/translation';
import { 
  Flame, User, Briefcase, Activity, Trophy, Settings, 
  Zap, Cpu, BookOpen, Shield, ShoppingCart, Crosshair,
  ChevronRight, ChevronLeft, Sparkles, HelpCircle, Terminal
} from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  visual?: React.ReactNode | ((t: any) => React.ReactNode);
}

interface TutorialData {
  title: string;
  subtitle: string;
  steps: TutorialStep[];
}

const TUTORIALS_DATABASE: Record<string, TutorialData> = {
  initial: {
    title: 'SISTEMA OPERACIONAL BABEL v1.0',
    subtitle: 'Inicializando Protocolo de Integração de Neófito',
    steps: [
      {
        title: 'Bem-vindo à Escalada',
        description: 'Você acaba de se conectar à infraestrutura da Torre de Babel. Como um operador cibernético de elite, seu objetivo é hackear e combater seu caminho através dos andares analógicos e virtuais da torre.',
        icon: Terminal,
        color: 'text-cyan-400 border-cyan-500/30',
        visual: (
          <div className="flex flex-col items-center justify-center p-4 rounded bg-slate-900/60 border border-cyan-500/20 font-mono text-xs text-cyan-300 space-y-1.5 w-full">
            <span className="animate-pulse">▶ BOOT_SEQUENCE: SUCCESS</span>
            <span>▶ HARDWARE_INIT: COMPLIANT</span>
            <span className="text-emerald-400">▶ OPERATOR_LEVEL: 01 (READY)</span>
          </div>
        )
      },
      {
        title: 'Painel de Expedição',
        description: 'A aba "Expedição" é onde a ação principal acontece. Escolha seu andar atual para iniciar uma incursão. Cada andar reserva batalhas contra sentinelas mecânicas, anomalias sistêmicas ou eventos misteriosos onde suas escolhas determinam seu destino.',
        icon: Flame,
        color: 'text-orange-400 border-orange-500/30',
        visual: (t: any) => (
          <div className="flex items-center justify-center gap-3 p-4 rounded bg-slate-900/60 border border-orange-500/20 w-full">
            <div className="p-3 bg-orange-950/40 rounded-full border border-orange-500/30">
              <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-orange-300 uppercase tracking-widest font-mono">{t("ADENTRAR A TORRE")}</div>
              <div className="text-[10px] text-slate-400 font-mono">{t("Iniciar Calibração de Andar")}</div>
            </div>
          </div>
        )
      },
      {
        title: 'Perfil do Operador',
        description: 'No "Perfil", você pode monitorar sua integridade (HP), fluxo de energia (EP/MP) e atributos de processamento (Ataque, Defesa, Velocidade). Aqui você também escolhe novos caminhos de evolução quando sobe de classe!',
        icon: User,
        color: 'text-emerald-400 border-emerald-500/30',
        visual: (t: any) => (
          <div className="grid grid-cols-2 gap-2 p-3 rounded bg-slate-900/60 border border-emerald-500/20 font-mono text-[10px] w-full text-emerald-300">
            <div className="flex justify-between border-b border-emerald-950/40 pb-1"><span>{t("HP (Integridade):")}</span> <span>100%</span></div>
            <div className="flex justify-between border-b border-emerald-950/40 pb-1"><span>{t("MP (Energia):")}</span> <span>100%</span></div>
            <div className="flex justify-between pb-1"><span>{t("Classe:")}</span> <span className="text-cyan-400">{t("Tecno-Aprendiz")}</span></div>
            <div className="flex justify-between pb-1"><span>{t("Nível:")}</span> <span className="text-yellow-400">1</span></div>
          </div>
        )
      },
      {
        title: 'Inventário Geral',
        description: 'A aba "Geral" exibe suas armas, armaduras e chips de hardware. Você possui slots de equipamento para Arma, Armadura, Capacete, Calça, Botas, Braçadeiras e até 3 Acessórios. Equipar itens melhores é a chave para sobreviver nos andares superiores!',
        icon: Briefcase,
        color: 'text-purple-400 border-purple-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-4 p-3 rounded bg-slate-900/60 border border-purple-500/20 w-full text-left font-mono text-[10px]">
            <div className="w-10 h-10 border border-purple-500/30 rounded flex items-center justify-center bg-purple-950/30">
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-purple-300 font-bold">{t("Lâmina Mono-Molecular")}</div>
              <div className="text-slate-400 text-[9px]">{t("Dano Físico +12 | Critico +5%")}</div>
            </div>
          </div>
        )
      }
    ]
  },
  adaptacoes: {
    title: 'SISTEMA BIÔNICO COGNITIVO',
    subtitle: 'Calibração de Adaptadores Neurais Ativada',
    steps: [
      {
        title: 'Adaptações Cibernéticas',
        description: 'Você desbloqueou o painel de Adaptações! Aqui você pode injetar modificações corporais permanentes (como Blindagem Reativa ou Overclock de Combate) usando seu Ouro e Estilhaços de Alma.',
        icon: Activity,
        color: 'text-cyan-400 border-cyan-500/30',
        visual: (t: any) => (
          <div className="flex flex-col gap-2 p-3 rounded bg-slate-900/60 border border-cyan-500/20 w-full font-mono text-[10px]">
            <div className="flex justify-between text-cyan-300 font-bold border-b border-cyan-950/30 pb-1">
              <span>{t("🛡️ Blindagem Reativa")}</span>
              <span>{t("Nível 01")}</span>
            </div>
            <div className="text-[9px] text-slate-400">{t("Aumenta Defesa passiva em +5% por nível.")}</div>
          </div>
        )
      }
    ]
  },
  conquistas: {
    title: 'REGISTRO DE CONQUISTAS',
    subtitle: 'Módulo de Reconhecimento de Façanhas Ativo',
    steps: [
      {
        title: 'Verificação de Conquistas',
        description: 'Seus feitos gloriosos na Torre agora são imortalizados e rastreados! O painel de Conquistas lista desafios adicionais que certificam suas habilidades de sobrevivência e mostram suas estatísticas acumuladas de jogo.',
        icon: Trophy,
        color: 'text-yellow-400 border-yellow-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-yellow-500/20 w-full">
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            <div className="text-left font-mono text-[10px]">
              <div className="text-yellow-300 font-bold">{t("Mergulho Profundo I")}</div>
              <div className="text-slate-400">{t("Adentre o andar 3 da Torre de Babel.")}</div>
            </div>
          </div>
        )
      }
    ]
  },
  forja: {
    title: 'IMPRESSORA 3D DE SUCATA',
    subtitle: 'Manufatura de Hardware Reconfigurada',
    steps: [
      {
        title: 'Forja de Equipamento',
        description: 'Você desbloqueou a Forja! Destruindo sentinelas, você obtém Sucatas (Comuns, Raras, Épicas). Na Forja, você pode alimentar a impressora molecular de alta tecnologia para forjar Armas e Armaduras de alta raridade com bônus e atributos gerados dinamicamente!',
        icon: Settings,
        color: 'text-amber-500 border-amber-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-amber-500/20 w-full">
            <Settings className="w-8 h-8 text-amber-500 animate-spin-slow" />
            <div className="text-left font-mono text-[10px]">
              <div className="text-amber-400 font-bold">{t("FORJAR EQUIPAMENTO ÉPICO")}</div>
              <div className="text-slate-400">{t("Custo: 10 Sucatas Raras + 2 Épicas")}</div>
            </div>
          </div>
        )
      }
    ]
  },
  contratos: {
    title: 'TERMINAL DE MISSÕES CORPORATIVAS',
    subtitle: 'Rede de Contratos Criptografada Ativa',
    steps: [
      {
        title: 'Contratos e Patrocínios',
        description: 'As três megacorporações rivais que controlam a torre (Kinetix, AeroDynamics e OmniCorp) agora oferecem tarefas remuneradas. Complete missões de caça, exploração ou catalogação para ganhar fortunas em ouro e materiais valiosos para forja!',
        icon: Zap,
        color: 'text-blue-400 border-blue-500/30',
        visual: (t: any) => (
          <div className="flex flex-col gap-1 p-3 rounded bg-slate-900/60 border border-blue-500/20 w-full font-mono text-[10px] text-left">
            <span className="text-blue-300 font-bold">{t("🎯 Caçador de Drones (AeroDynamics)")}</span>
            <span className="text-slate-400">{t("Progresso: 0 / 5 eliminados")}</span>
            <span className="text-emerald-400 font-semibold">{t("Recompensa: +350 Ouro, +5 Sucata Rara")}</span>
          </div>
        )
      }
    ]
  },
  soldagem: {
    title: 'TERMINAL DE MICRO-ENGANCHE',
    subtitle: 'Soldagem e Upgrade de Micro-Componentes',
    steps: [
      {
        title: 'Encaixe de Chips e Fusão',
        description: 'Equipamentos de alta raridade (Raro e Épico) possuem slots de silício vazios. Soldagem permite fundir módulos de chips impressos nestes slots para injetar atributos poderosos! Além disso, você pode mesclar equipamentos duplicados na Fusão para amplificar seus poderes permanentemente.',
        icon: Cpu,
        color: 'text-indigo-400 border-indigo-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-4 p-3 rounded bg-slate-900/60 border border-indigo-500/20 w-full font-mono text-[10px]">
            <div className="p-1 border border-indigo-500/40 rounded bg-indigo-950/30 text-indigo-400 font-bold">
              [ 🔲 CHIP SLOT ]
            </div>
            <div className="text-left text-indigo-300">
              <div>{t("Inserir Chip de Silício")}</div>
              <div className="text-slate-400 text-[9px]">{t("Garante +8 de Velocidade de Processamento")}</div>
            </div>
          </div>
        )
      }
    ]
  },
  habilidades: {
    title: 'MATRIZ DE CALIBRAÇÃO NEURAL',
    subtitle: 'Evolução de Classe e Habilidades Digitais',
    steps: [
      {
        title: 'Matriz de Habilidades',
        description: 'Sua arquitetura neural atingiu o limite de classe básico. Agora você pode ascender para classes avançadas no painel de Habilidades e usar seus pontos de Matriz para aprender novas ações ativas de combate devastadoras que consomem EP!',
        icon: BookOpen,
        color: 'text-emerald-400 border-emerald-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-emerald-500/20 w-full text-left font-mono text-[10px]">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-emerald-300 font-bold">{t("Ataque Crítico Virtual (EP: 25)")}</div>
              <div className="text-slate-400">{t("Injeta 180% do ataque físico na sentinela inimiga.")}</div>
            </div>
          </div>
        )
      }
    ]
  },
  reliquias: {
    title: 'DECODIFICADOR DE ARTEFATOS',
    subtitle: 'Dispositivo de Captura de Relíquias Iniciado',
    steps: [
      {
        title: 'Relíquias da Antiga Rede',
        description: 'Relíquias são softwares legados ultra-raros que operam em segundo plano na sua memória, concedendo bônus cumulativos passivos incríveis por toda a torre (ex: bônus de drop de itens, dano adicional de sobrecarga ou regeneração). Elas mudam as regras do jogo!',
        icon: Shield,
        color: 'text-rose-400 border-rose-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-rose-500/20 w-full">
            <Shield className="w-8 h-8 text-rose-400 animate-pulse" />
            <div className="text-left font-mono text-[10px]">
              <div className="text-rose-300 font-bold">Otimizador_Drop.dll</div>
              <div className="text-slate-400">{t("Aumenta taxa de drop de itens na torre em +15%.")}</div>
            </div>
          </div>
        )
      }
    ]
  },
  mercado: {
    title: 'REDE MERCANTIL CLANDESTINA',
    subtitle: 'Acesso Remoto Estabelecido',
    steps: [
      {
        title: 'Mercado Clandestino',
        description: 'Você hackeou a rede secreta de contrabandistas de hardware! Compre diretamente equipamentos exóticos de alta patente, chips raros de circuitos, materiais escassos de calibração ou relíquias raras usando seu ouro. O estoque se renova e muda de preços a cada rotação!',
        icon: ShoppingCart,
        color: 'text-violet-400 border-violet-500/30',
        visual: (t: any) => (
          <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-violet-500/20 w-full text-left font-mono text-[10px]">
            <ShoppingCart className="w-6 h-6 text-violet-400" />
            <div className="flex-1">
              <div className="text-violet-300 font-bold">{t("Núcleo Épico de Silício")}</div>
              <div className="text-yellow-400">{t("Preço: 2,500 Ouro")}</div>
            </div>
            <span className="text-rose-400 font-bold uppercase text-[9px] border border-rose-900 px-1 py-0.5 rounded">{t("EXÓTICO")}</span>
          </div>
        )
      }
    ]
  },
  auto: {
    title: 'DISSIPADOR DE AUTO-COMBATE',
    subtitle: 'Protocolo de Automação Algorítmica Online',
    steps: [
      {
        title: 'Programação de Regras',
        description: 'Você destravou o núcleo lógico de Inteligência de Combate! Agora, você pode configurar regras condicionais lógicas (ex: Usar Cura Se HP < 50%) para programar a IA a agir de maneira tática sem que você precise clicar.',
        icon: Crosshair,
        color: 'text-orange-400 border-orange-500/30',
        visual: (t: any) => (
          <div className="flex flex-col gap-1 p-2 rounded bg-slate-900/60 border border-orange-500/20 w-full text-left font-mono text-[9px] text-orange-300">
            <div>⚙ {t("SE")} <span className="text-cyan-400">{t("HP Operador")} &lt; 50%</span> ➔ {t("ENTÃO")} <span className="text-emerald-400">{t("Usar Habilidade de Cura")}</span></div>
            <div>⚙ {t("SE")} <span className="text-cyan-400">{t("Sempre")}</span> ➔ {t("ENTÃO")} <span className="text-emerald-400">{t("Ataque Padrão")}</span></div>
          </div>
        )
      },
      {
        title: 'Módulo de Auto-Farm',
        description: 'Além do combate automatizado, você pode acionar o "Auto-Farm". Isso programará o terminal para repetir o andar selecionado indefinidamente. O robô lutará, coletará recompensas e iniciará novas incursões automaticamente até que seu HP se esgote, permitindo progresso passivo massivo!',
        icon: Settings,
        color: 'text-cyan-400 border-cyan-500/30',
        visual: (t: any) => (
          <div className="flex items-center justify-center gap-3 p-3 rounded bg-cyan-950/20 border border-cyan-500/30 w-full animate-pulse">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">{t("AUTO-FARM SEQUENCIAL ATIVO")}</span>
          </div>
        )
      }
    ]
  }
};

import { usePlayerStore } from '../store/usePlayerStore';
import { Player } from '../types';

export const TutorialOverlay: React.FC<{ tutorialKey: string }> = ({ tutorialKey }) => {
  const { setPlayer } = usePlayerStore();
  const onComplete = () => {
    setPlayer((prev: Player) => ({
      ...prev,
      completedTutorials: [...(prev.completedTutorials || []), tutorialKey]
    }));
  };
  const tutorial = TUTORIALS_DATABASE[tutorialKey];
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  if (!tutorial) {
    // If the key doesn't match any tutorial, auto-complete
    React.useEffect(() => {
      onComplete();
    }, [tutorialKey]);
    return null;
  }

  const stepsCount = tutorial.steps.length;
  const step = tutorial.steps[currentStep];

  if (!step) {
    React.useEffect(() => {
      onComplete();
    }, [tutorialKey]);
    return null;
  }

  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < stepsCount - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      {/* Background Animated Matrix Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-lg w-full bg-slate-950 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden flex flex-col"
        >
          {/* Cyan Glow Bar Top */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 animate-pulse" />
          
          <div className="px-6 py-4 border-b border-slate-900 flex justify-between items-center bg-slate-950/50">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase">{t(tutorial.subtitle)}</span>
              <h3 className="text-sm font-bold text-slate-100 tracking-widest font-mono uppercase">{t(tutorial.title)}</h3>
            </div>
            <div className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-900 bg-slate-950">
              {t("PASSO")} {currentStep + 1} / {stepsCount}
            </div>
          </div>

          <div className="p-6 flex flex-col space-y-6 flex-1">
            {/* Step Icon and Title */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border bg-slate-950 ${step.color} shadow-[0_0_15px_rgba(34,211,238,0.05)] shrink-0`}>
                <StepIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  {t("Módulo de Calibração")}
                </div>
                <h4 className="text-lg font-bold text-slate-50 font-sans tracking-tight">{t(step.title)}</h4>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed font-sans font-normal border-l-2 border-cyan-500/30 pl-4 bg-cyan-950/5 py-1.5 rounded-r">
              {t(step.description)}
            </p>

            {/* Simulated Visual Preview */}
            {step.visual && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">{t("REPRESENTAÇÃO SISTÊMICA:")}</span>
                <div className="relative overflow-hidden rounded-lg bg-slate-950 border border-slate-900 p-1 flex items-center justify-center">
                  {typeof step.visual === 'function' ? step.visual(t) : step.visual}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 border-t border-slate-900 bg-slate-950/80 flex items-center justify-between">
            {stepsCount > 1 ? (
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`px-4 py-2 border rounded font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  currentStep === 0 
                    ? 'border-slate-900/30 text-slate-700 cursor-not-allowed' 
                    : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {t("Anterior")}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
                {t("Dica: Requisitos visíveis no menu do Hub")}
              </div>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 hover:border-cyan-500 text-cyan-100 hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {currentStep === stepsCount - 1 ? t('Entendido') : t('Próximo')}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
