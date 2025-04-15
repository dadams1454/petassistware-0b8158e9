
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from "@/contexts/ThemeProvider";
import AuthProvider from '@/contexts/AuthProvider';
import Router from '@/Router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
