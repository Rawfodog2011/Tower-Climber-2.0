import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CLASSES } from './core/entities/classes';

// Components
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { IntroSequence } from './components/IntroSequence';
import { HubScene } from './pages/HubScene';
import { CombatScene } from './pages/CombatScene';
import { EventScene } from './pages/EventScene';
import { PuzzleScene } from './pages/PuzzleScene';
import { EndingScreen } from './components/EndingScreen';
import { TimelineClosureScreen } from './components/TimelineClosureScreen';
import { EnvIntroScene } from './pages/EnvIntroScene';
import { ClassEvolutionModal } from './components/ClassEvolutionModal';
import { MemoryFragmentScreen } from './components/MemoryFragmentScreen';
import { TutorialManager } from './components/TutorialManager';

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
      {renderScene()}
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
      {!['main_menu', 'character_creation', 'intro', 'timeline_closure'].includes(scene) && (
        <TutorialManager />
      )}
    </>
  );
}
