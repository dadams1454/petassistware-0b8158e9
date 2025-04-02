
import React from 'react';
import { Route } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import DogDetailPage from '@/pages/DogDetail';
import DogProfilePage from '@/pages/DogProfile';
import WeightTrackingPage from '@/pages/WeightTracking';
import WelpingDashboardPage from '@/pages/WelpingDashboard';
import WelpingPage from '@/pages/WelpingPage';
import PuppyDashboardPage from '@/pages/puppies/PuppyDashboard';
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
import PuppyTestingDashboardPage from '@/pages/PuppyTestingDashboard';
import WelpingLandingPage from '@/pages/Whelping';

// Placeholder components for routes that aren't implemented yet
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;
const AddDogPage = () => <div>Add Dog Page</div>;
const EditDogPage = () => <div>Edit Dog Page</div>;
const DogsPage = () => <div>Dogs Page</div>;
const AddDogsPage = () => <div>Add Dogs Page</div>;

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
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Profile */}
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* Dogs routes */}
      <Route path="/dogs" element={<DogsPage />} />
      <Route path="/dogs/add" element={<AddDogPage />} />
      <Route path="/dogs/:id" element={<DogDetailPage />} />
      <Route path="/dogs/:id/edit" element={<EditDogPage />} />
      <Route path="/dogs/:id/profile" element={<DogProfilePage />} />
      <Route path="/dogs/:id/weight" element={<WeightTrackingPage />} />
      <Route path="/dogs/add-multiple" element={<AddDogsPage />} />
      
      {/* Litters routes */}
      <Route path="/litters" element={<LittersPage />} />
      <Route path="/litters/:id" element={<LitterDetailPage />} />
      <Route path="/litter/:litterId/add-puppies" element={<BatchPuppyEntryPage />} />
      <Route path="/litter/:litterId/puppy-testing" element={<PuppyTestingDashboardPage />} />
      
      {/* Puppies routes */}
      <Route path="/puppies/:id" element={<PuppyDashboardPage />} />
      
      {/* Breeding/Welping routes */}
      <Route path="/breeding-prep" element={<BreedingPrepPage />} />
      <Route path="/welping-dashboard" element={<WelpingDashboardPage />} />
      <Route path="/welping/:id" element={<WelpingPage />} />
      <Route path="/welping" element={<WelpingLandingPage />} />
      
      {/* Operations routes */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/communications" element={<CommunicationsPage />} />
      <Route path="/contracts" element={<ContractsPage />} />
      <Route path="/finances" element={<FinancesPage />} />
      <Route path="/facility" element={<FacilityPage />} />
      
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
