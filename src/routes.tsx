
import React from 'react';
import { Route } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import DashboardPage from '@/pages/Dashboard';
import WeightTrackingPage from '@/pages/WeightTracking';
import IndexPage from '@/pages/Index';
import NotFoundPage from '@/pages/NotFound';
import CompliancePage from '@/pages/Compliance';
import CalendarPage from '@/pages/Calendar';
import CommunicationsPage from '@/pages/Communications';
import ContractsPage from '@/pages/Contracts';
import FinancesPage from '@/pages/Finances';
import FacilityPage from '@/pages/Facility';
import BreedingPrepPage from '@/pages/BreedingPrepPage';
import UsersPage from '@/pages/Users';
import AuditLogsPage from '@/pages/AuditLogs';
import SettingsPage from '@/pages/Settings';
import ReservationsPage from '@/pages/Reservations';
import CustomersPage from '@/pages/Customers';
import ProfilePage from '@/pages/Profile';
import LittersPage from '@/pages/Litters';
import LitterDetailPage from '@/pages/LitterDetail';
import BatchPuppyEntryPage from '@/pages/BatchPuppyEntry';
import PuppyTestingPage from '@/pages/PuppyTestingDashboard';

// Import consolidated Dogs Module
import {
  DogListPage,
  DogAddPage,
  DogDetailPage,
  DogEditPage,
  DogWeightPage
} from '@/modules/dogs';

// Import Welping Module
import {
  WelpingDashboardPage,
  WelpingCreatePage,
  WelpingDetailPage,
  WelpingEditPage,
  WelpingLogPage
} from '@/pages/Welping';

// Placeholder components for routes that aren't implemented yet
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;

export const appRoutes = (
  <Route>
    {/* Auth routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* Public landing page */}
      <Route path="/" element={<IndexPage />} />
    </Route>
    
    {/* Protected routes */}
    <Route element={<MainLayout />}>
      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* Profile */}
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* Dogs routes - now using the consolidated Dogs Module */}
      <Route path="/dogs" element={<DogListPage />} />
      <Route path="/dogs/add" element={<DogAddPage />} />
      <Route path="/dogs/:id" element={<DogDetailPage />} />
      <Route path="/dogs/:id/edit" element={<DogEditPage />} />
      <Route path="/dogs/:id/weight" element={<DogWeightPage />} />
      
      {/* Litters routes */}
      <Route path="/litters" element={<LittersPage />} />
      <Route path="/litters/:id" element={<LitterDetailPage />} />
      <Route path="/litter/:litterId/add-puppies" element={<BatchPuppyEntryPage />} />
      <Route path="/litter/:litterId/puppy-testing" element={<PuppyTestingPage />} />
      
      {/* Welping routes - now using the consolidated Welping Module */}
      <Route path="/welping" element={<WelpingDashboardPage />} />
      <Route path="/welping/new" element={<WelpingCreatePage />} />
      <Route path="/welping/:id" element={<WelpingDetailPage />} />
      <Route path="/welping/:id/edit" element={<WelpingEditPage />} />
      <Route path="/welping/:id/logs" element={<WelpingLogPage />} />
      
      {/* Operations routes */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/communications" element={<CommunicationsPage />} />
      <Route path="/contracts" element={<ContractsPage />} />
      <Route path="/finances" element={<FinancesPage />} />
      <Route path="/facility" element={<FacilityPage />} />
      <Route path="/breeding-prep" element={<BreedingPrepPage />} />
      
      {/* Compliance route */}
      <Route path="/compliance" element={<CompliancePage />} />
      
      {/* Administration routes */}
      <Route path="/users" element={<UsersPage />} />
      <Route path="/audit-logs" element={<AuditLogsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      
      {/* Reservations routes */}
      <Route path="/reservations" element={<ReservationsPage />} />
      
      {/* Customers routes */}
      <Route path="/customers" element={<CustomersPage />} />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Route>
);

export default appRoutes;
