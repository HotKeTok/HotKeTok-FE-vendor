import { createContext } from 'react';

export const MyPageContext = createContext({
  data: null,
  updateData: () => {},
});
