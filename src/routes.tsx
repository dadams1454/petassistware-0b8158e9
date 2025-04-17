import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Admin pages
import {
  UsersPage,
  AuditLogsPage,
  SettingsPage,
  AdminSecurityPage,
  AdminSchemaPage,
  AdminRolesPage
} from '@/pages/Admin';

// Import other page components as needed
// Example: import Dashboard from '@/pages/Dashboard';

const appRoutes = [
  // Auth routes
  <Route key="auth-layout" element={<AuthLayout />}>
    <Route path="/auth" element={<Auth />} />
    <Route path="/login" element={<Auth />} />
    <Route path="/register" element={<Auth />} />
    
    {/* Main application routes - protected by auth */}
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<ProtectedRoute><div>Dashboard</div></ProtectedRoute>} />
      <Route path="/dogs" element={<ProtectedRoute><div>Dogs</div></ProtectedRoute>} />
      <Route path="/reproduction" element={<ProtectedRoute><div>Reproduction</div></ProtectedRoute>} />
      
      {/* Admin section */}
      <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/admin/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/admin/security" element={<ProtectedRoute><AdminSecurityPage /></ProtectedRoute>} />
      <Route path="/admin/schema" element={<ProtectedRoute><AdminSchemaPage /></ProtectedRoute>} />
      <Route path="/admin/roles" element={<ProtectedRoute><AdminRolesPage /></ProtectedRoute>} />
    </Route>
    
    {/* Main layout routes */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<div>Welcome to PetAssistWare</div>} />
    </Route>
    
    {/* 404 catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Route>
];

export default appRoutes;
