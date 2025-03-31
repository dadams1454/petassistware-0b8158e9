
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
import DailyCare from '@/pages/DailyCare';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Authentication route - direct path without protection */}
      <Route path="/auth" element={<Auth />} />
      
      {/* All protected routes are inside MainLayout */}
      <Route element={<AuthLayout />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/dogs/:id" element={<DogProfilePage />} />
          <Route path="/dogs/:id/weight" element={<WeightTracking />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/litters" element={<Litters />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/:id" element={<Reservations />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/contracts" element={<Calendar />} /> {/* Temporarily mapping to Calendar until Contracts page is implemented */}
          <Route path="/finances" element={<Finances />} />
          <Route path="/facility" element={<Dashboard />} /> {/* Temporarily mapping to Dashboard until Facility page is implemented */}
          <Route path="/users" element={<Users />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/daily-care" element={<DailyCare />} />
        </Route>
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
