
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
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
import Reservations from '@/pages/Reservations';
import Finances from '@/pages/Finances';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Authentication route - direct path without protection */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected routes */}
      <Route element={<AuthLayout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dogs" element={
          <ProtectedRoute>
            <MainLayout>
              <Dogs />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/customers" element={
          <ProtectedRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/litters" element={
          <ProtectedRoute>
            <MainLayout>
              <Litters />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reservations" element={
          <ProtectedRoute>
            <MainLayout>
              <Reservations />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reservations/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <Reservations />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <MainLayout>
              <Calendar />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/communications" element={
          <ProtectedRoute>
            <MainLayout>
              <Communications />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/finances" element={
          <ProtectedRoute>
            <MainLayout>
              <Finances />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin-setup" element={
          <ProtectedRoute>
            <MainLayout>
              <AdminSetup />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/audit-logs" element={
          <ProtectedRoute requiredRoles={['admin', 'owner']}>
            <MainLayout>
              <AuditLogs />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Dog routes */}
        <Route path="/dogs/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <DogProfilePage />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dogs/:id/weight" element={
          <ProtectedRoute>
            <MainLayout>
              <WeightTracking />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
