
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DogDetailPage from '@/pages/DogDetail';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Dogs from '@/pages/Dogs';
import WeightTracking from '@/pages/WeightTracking';
import Customers from '@/pages/Customers';
import Litters from '@/pages/Litters';
import Calendar from '@/pages/Calendar';
import Communications from '@/pages/Communications';
import AdminSetup from '@/pages/AdminSetup';
import Users from '@/pages/Users';

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
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      } />
      
      <Route path="/litters" element={
        <ProtectedRoute>
          <Litters />
        </ProtectedRoute>
      } />
      
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      
      <Route path="/communications" element={
        <ProtectedRoute>
          <Communications />
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      
      <Route path="/admin-setup" element={
        <ProtectedRoute>
          <AdminSetup />
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
