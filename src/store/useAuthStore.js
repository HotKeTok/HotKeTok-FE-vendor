import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

const initialState = {
  userId: '',
};

export const useAuthStore = create(
  subscribeWithSelector(
    persist(
      set => ({
        ...initialState,
        setUserId: userId => set({ userId }),
        clearAuth: () => set({ ...initialState }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
