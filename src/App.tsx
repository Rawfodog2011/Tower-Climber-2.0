import React, { useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CLASSES } from './core/entities/classes';

// Components
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { IntroSequence } from './components/IntroSequence';
import { EndingScreen } from './components/EndingScreen';
import { TimelineClosureScreen } from './components/TimelineClosureScreen';
import { ClassEvolutionModal } from './components/ClassEvolutionModal';
import { MemoryFragmentScreen } from './components/MemoryFragmentScreen';
import { TutorialManager } from './components/TutorialManager';
import { ToastContainer } from './components/ToastContainer';

// Lazy-loaded Scenes for Code Splitting
const HubScene = lazy(() => import('./pages/HubScene').then(m => ({ default: m.HubScene })));
const CombatScene = lazy(() => import('./pages/CombatScene').then(m => ({ default: m.CombatScene })));
const EnvIntroScene = lazy(() => import('./pages/EnvIntroScene').then(m => ({ default: m.EnvIntroScene })));
const EventScene = lazy(() => import('./pages/EventScene').then(m => ({ default: m.EventScene })));
const PuzzleScene = lazy(() => import('./pages/PuzzleScene').then(m => ({ default: m.PuzzleScene })));

const SceneLoadingFallback = () => (
  <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center font-mono text-cyan-400 z-50">
    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
    <div className="text-sm tracking-widest uppercase animate-pulse">Carregando Módulo...</div>
  </div>
);

// Hooks
import { useGameEffects } from './hooks/useGameEffects';

// Stores
import { usePlayerStore } from './store/usePlayerStore';
import { useGameUIStore } from './store/useGameUIStore';

export default function App() {
  const { player, loadPlayer } = usePlayerStore();

  const {
    scene, setScene, 
    activeEvolutionNarrative, setActiveEvolutionNarrative, 
    activeMemoryKey, setActiveMemoryKey,
  } = useGameUIStore();


  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  useGameEffects();


  const renderScene = () => {
    switch (scene) {
      case 'main_menu':
        return (
          <MainMenu />
        );
      case 'character_creation':
        return (
          <CharacterCreation />
        );
      case 'intro':
        return <IntroSequence />;
      case 'hub':
        return <HubScene />;
      case 'env_intro':
        return <EnvIntroScene />;
      case 'combat':
        return <CombatScene />;
      case 'event':
        return <EventScene />;
      case 'puzzle':
        return <PuzzleScene />;
      case 'ending':
        return <EndingScreen />;
      case 'timeline_closure':
        return <TimelineClosureScreen />;
      default:
        return <div>Loading...</div>;
    }
  };

  
  return (
    <>
      <Suspense fallback={<SceneLoadingFallback />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full min-h-screen"
          >
            {renderScene()}
          </motion.div>
        </AnimatePresence>
      </Suspense>
      <AnimatePresence>
        {activeEvolutionNarrative && (
          <ClassEvolutionModal
            classId={activeEvolutionNarrative.classId}
            className={CLASSES[activeEvolutionNarrative.classId as keyof typeof CLASSES]?.name || 'Nova Classe'}
            narrativeText={activeEvolutionNarrative.text}
            onClose={() => setActiveEvolutionNarrative(null)}
          />
        )}
        {activeMemoryKey && (
          <MemoryFragmentScreen
            memoryKey={activeMemoryKey}
            onComplete={() => setActiveMemoryKey(null)}
          />
        )}
      </AnimatePresence>
      {['hub', 'env_intro', 'combat', 'event', 'puzzle'].includes(scene) && (
        <TutorialManager />
      )}
      <ToastContainer />
    </>
  );
}
