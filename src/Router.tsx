
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DogDetailPage from '@/pages/DogDetail';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Dog routes */}
      <Route path="/dogs/:id" element={<DogDetailPage />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
