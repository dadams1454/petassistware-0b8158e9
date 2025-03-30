
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DogDetailPage from '@/pages/DogDetail';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Dogs from '@/pages/Dogs';
import WeightTracking from '@/pages/WeightTracking';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Main routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dogs" element={
        <ProtectedRoute>
          <Dogs />
        </ProtectedRoute>
      } />
      
      {/* Dog routes */}
      <Route path="/dogs/:id" element={
        <ProtectedRoute>
          <DogDetailPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dogs/:id/weight" element={
        <ProtectedRoute>
          <WeightTracking />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
