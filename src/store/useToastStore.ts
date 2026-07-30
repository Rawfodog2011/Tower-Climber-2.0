import { create } from 'zustand';
import { AudioManager } from '../core/engine/audio';
import { random } from '../core/engine/rng';

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  triggerToast: (message: string) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  triggerToast: (message: string) => {
    const id = Date.now() + random();
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));

    if (
      message.includes('⚠️') ||
      message.includes('⚡') ||
      message.includes('AVISO') ||
      message.includes('Erro') ||
      message.includes('Pendente') ||
      message.includes('pendente')
    ) {
      AudioManager.playSfx('ui.error');
    } else {
      AudioManager.playSfx('ui.notification');
    }

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id: number) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
