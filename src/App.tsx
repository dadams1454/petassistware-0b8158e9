
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Dogs from '@/pages/Dogs';
import Calendar from '@/pages/Calendar';
import Litters from '@/pages/Litters';
import AddLitter from '@/pages/AddLitter';
import LitterDetail from '@/pages/LitterDetail';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthProvider';
import PuppyDetail from '@/pages/PuppyDetail';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/litters" element={<Litters />} />
          <Route path="/litters/add" element={<AddLitter />} />
          <Route path="/litters/:id" element={<LitterDetail />} />
          <Route path="/puppies/:id" element={<PuppyDetail />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
