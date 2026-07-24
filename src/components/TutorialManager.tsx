import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { getPendingTutorials } from '../core/engine/tutorial';
import { TutorialOverlay } from './TutorialOverlay';

export const TutorialManager: React.FC = () => {
  const { player } = usePlayerStore();
  const pendingTutorials = getPendingTutorials(player);

  if (pendingTutorials.length === 0) return null;

  return <TutorialOverlay tutorialKey={pendingTutorials[0]} />;
};
