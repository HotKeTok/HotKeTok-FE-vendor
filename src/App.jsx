import { ThemeProvider } from 'styled-components';
import AppRouter from './Router';
import { theme } from './styles/theme';
import ResetStyle from './styles/ResetStyle';
import Globalstyle from './styles/GlobalStyle';
import React from 'react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyle />
      <Globalstyle />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
