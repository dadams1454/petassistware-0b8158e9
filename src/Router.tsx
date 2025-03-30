
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Dogs from '@/pages/Dogs';
import DogProfilePage from '@/pages/DogProfile';
import WeightTracking from '@/pages/WeightTracking';
import Customers from '@/pages/Customers';
import Litters from '@/pages/Litters';
import Calendar from '@/pages/Calendar';
import Communications from '@/pages/Communications';
import AdminSetup from '@/pages/AdminSetup';
import Users from '@/pages/Users';
import AuditLogs from '@/pages/AuditLogs';

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
      
      <Route path="/audit-logs" element={
        <ProtectedRoute requiredRoles={['admin', 'owner']}>
          <AuditLogs />
        </ProtectedRoute>
      } />
      
      {/* Dog routes */}
      <Route path="/dogs/:id" element={
        <ProtectedRoute>
          <DogProfilePage />
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
