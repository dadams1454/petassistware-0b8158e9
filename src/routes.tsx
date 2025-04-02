
import React from 'react';
import { Route } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import DogDetail from '@/pages/DogDetail';
import DogProfile from '@/pages/DogProfile';
import WeightTracking from '@/pages/WeightTracking';
import WelpingDashboard from '@/pages/WelpingDashboard';
import WelpingPage from '@/pages/WelpingPage';
import PuppyDashboard from '@/pages/puppies/PuppyDashboard';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Compliance from '@/pages/Compliance';
import Calendar from '@/pages/Calendar';
import Communications from '@/pages/Communications';
import Contracts from '@/pages/Contracts';
import Finances from '@/pages/Finances';
import Facility from '@/pages/Facility';
import BreedingPrepPage from '@/pages/BreedingPrepPage';
import Users from '@/pages/Users';
import AuditLogs from '@/pages/AuditLogs';
import Settings from '@/pages/Settings';
import Reservations from '@/pages/Reservations';
import Customers from '@/pages/Customers';
import Profile from '@/pages/Profile';
import Litters from '@/pages/Litters';
import LitterDetail from '@/pages/LitterDetail';
import BatchPuppyEntry from '@/pages/BatchPuppyEntry';
import PuppyTestingDashboard from '@/pages/PuppyTestingDashboard';
import Whelping from '@/pages/Whelping';

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
      <Route path="/" element={<Index />} />
    </Route>
    
    {/* Protected routes */}
    <Route element={<MainLayout />}>
      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Profile */}
      <Route path="/profile" element={<Profile />} />
      
      {/* Dogs routes */}
      <Route path="/dogs" element={<DogsPage />} />
      <Route path="/dogs/add" element={<AddDogPage />} />
      <Route path="/dogs/:id" element={<DogDetail />} />
      <Route path="/dogs/:id/edit" element={<EditDogPage />} />
      <Route path="/dogs/:id/profile" element={<DogProfile />} />
      <Route path="/dogs/:id/weight" element={<WeightTracking />} />
      <Route path="/dogs/add-multiple" element={<AddDogsPage />} />
      
      {/* Litters routes */}
      <Route path="/litters" element={<Litters />} />
      <Route path="/litters/:id" element={<LitterDetail />} />
      <Route path="/litter/:litterId/add-puppies" element={<BatchPuppyEntry />} />
      <Route path="/litter/:litterId/puppy-testing" element={<PuppyTestingDashboard />} />
      
      {/* Puppies routes */}
      <Route path="/puppies/:id" element={<PuppyDashboard />} />
      
      {/* Breeding/Welping routes */}
      <Route path="/breeding-prep" element={<BreedingPrepPage />} />
      <Route path="/welping-dashboard" element={<WelpingDashboard />} />
      <Route path="/welping/:id" element={<WelpingPage />} />
      <Route path="/welping" element={<Whelping />} />
      
      {/* Operations routes */}
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/communications" element={<Communications />} />
      <Route path="/contracts" element={<Contracts />} />
      <Route path="/finances" element={<Finances />} />
      <Route path="/facility" element={<Facility />} />
      
      {/* Compliance route */}
      <Route path="/compliance" element={<Compliance />} />
      
      {/* Administration routes */}
      <Route path="/users" element={<Users />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Reservations routes */}
      <Route path="/reservations" element={<Reservations />} />
      
      {/* Customers routes */}
      <Route path="/customers" element={<Customers />} />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Route>
);

export default appRoutes;
