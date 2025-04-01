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
import AddLitter from '@/pages/AddLitter';
import LitterDetail from '@/pages/LitterDetail';
import BreedingPrepPage from '@/pages/BreedingPrepPage';
import WelpingPage from '@/pages/WelpingPage';
import Calendar from '@/pages/Calendar';
import Communications from '@/pages/Communications';
import AdminSetup from '@/pages/AdminSetup';
import Users from '@/pages/Users';
import AuditLogs from '@/pages/AuditLogs';
import Reservations from '@/pages/Reservations';
import ReservationDetail from '@/pages/ReservationDetail';
import CustomerDetail from '@/pages/CustomerDetail';
import Finances from '@/pages/Finances';
import Facility from '@/pages/Facility';
import Compliance from '@/pages/Compliance';
import ReproductiveManagementPage from '@/pages/ReproductiveManagementPage';
import Profile from '@/pages/Profile';

const Router = () => {
  return (
    <Routes>
      {/* All routes go through the AuthLayout for auth checking */}
      <Route element={<AuthLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes with MainLayout (sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Dog routes */}
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/dogs/new" element={<Dogs />} />
          <Route path="/dogs/:id" element={<DogProfilePage />} />
          <Route path="/dogs/:id/weight" element={<WeightTracking />} />
          <Route path="/dogs/:dogId/reproductive" element={<ReproductiveManagementPage />} />
          
          {/* Litter routes */}
          <Route path="/litters" element={<Litters />} />
          <Route path="/litters/new" element={<AddLitter />} />
          <Route path="/litters/:id" element={<LitterDetail />} />
          <Route path="/breeding-prep" element={<BreedingPrepPage />} />
          <Route path="/welping/:id" element={<WelpingPage />} />
          <Route path="/welping/new" element={<WelpingPage />} />
          
          {/* Customer routes */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          
          {/* Reservation routes */}
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/:id" element={<ReservationDetail />} />
          
          {/* Other routes */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/contracts" element={<Calendar />} /> {/* Temporarily mapping to Calendar until Contracts page is implemented */}
          <Route path="/finances" element={<Finances />} />
          <Route path="/facility" element={<Facility />} />
          <Route path="/compliance" element={<Compliance />} />
          
          {/* Admin routes */}
          <Route path="/users" element={
            <ProtectedRoute resource="users" action="view">
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/admin-setup" element={
            <ProtectedRoute resource="adminSetup" action="edit">
              <AdminSetup />
            </ProtectedRoute>
          } />
          <Route path="/audit-logs" element={
            <ProtectedRoute resource="adminSetup" action="view">
              <AuditLogs />
            </ProtectedRoute>
          } />
        </Route>
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
