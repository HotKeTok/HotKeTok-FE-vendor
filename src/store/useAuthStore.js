import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

const initialState = {
  userId: '',
  vendorId: '',
};

const useAuthStore = create(
  subscribeWithSelector(
    persist(
      set => ({
        ...initialState,
        setUserId: userId => set({ userId }),
        setVendorId: vendorId => set({ vendorId }),
        clearAuth: () => set({ ...initialState }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);

export default useAuthStore;
