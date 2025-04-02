
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
