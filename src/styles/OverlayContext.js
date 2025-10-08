import { createContext } from 'react';

export const OverlayContext = createContext({
  isOpen: false,
  setOverlayContent: () => {},
  clearOverlay: () => {},
});
