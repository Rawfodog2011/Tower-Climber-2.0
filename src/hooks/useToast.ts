import { useState, useCallback } from 'react';
import { AudioManager } from '../core/engine/audio';
import { random } from '../core/engine/rng';

export const useToast = () => {
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);

  const triggerToast = useCallback((message: string) => {
    const id = Date.now() + random();
    setToasts(prev => [...prev, { id, message }]);
    
    if (message.includes('⚠️') || message.includes('⚡') || message.includes('AVISO') || message.includes('Erro') || message.includes('Pendente') || message.includes('pendente')) {
      AudioManager.playSfx('ui.error');
    } else {
      AudioManager.playSfx('ui.notification');
    }
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, triggerToast };
};
