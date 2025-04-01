
import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import WelpingDashboard from '@/pages/WelpingDashboard';
import DogDetail from '@/pages/DogDetail';
import DogProfile from '@/pages/DogProfile';
import WeightTracking from '@/pages/WeightTracking';
import AuthLayout from '@/layouts/AuthLayout';
import PuppyDashboard from '@/pages/puppies/PuppyDashboard';

// Placeholder components for routes that aren't implemented yet
const HomePage = () => <div>Home Page</div>;
const LittersPage = () => <div>Litters Page</div>;
const LitterDetail = () => <div>Litter Detail</div>;
const EditLitter = () => <div>Edit Litter</div>;
const AddLitter = () => <div>Add Litter</div>;
const AddDogsPage = () => <div>Add Dogs Page</div>;
const DogsPage = () => <div>Dogs Page</div>;
const AddDogPage = () => <div>Add Dog Page</div>;
const EditDogPage = () => <div>Edit Dog Page</div>;
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;

export const appRoutes = (
  <Route>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>
    
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Dogs routes */}
      <Route path="/dogs" element={<DogsPage />} />
      <Route path="/dogs/add" element={<AddDogPage />} />
      <Route path="/dogs/:id" element={<DogDetail />} />
      <Route path="/dogs/:id/edit" element={<EditDogPage />} />
      <Route path="/dogs/:id/profile" element={<DogProfile />} />
      <Route path="/dogs/:id/weight" element={<WeightTracking />} />
      <Route path="/dogs/add-multiple" element={<AddDogsPage />} />
      
      {/* Litters routes */}
      <Route path="/litters" element={<LittersPage />} />
      <Route path="/litters/add" element={<AddLitter />} />
      <Route path="/litters/:id" element={<LitterDetail />} />
      <Route path="/litters/:id/edit" element={<EditLitter />} />
      
      {/* Puppies routes */}
      <Route path="/puppies/:id" element={<PuppyDashboard />} />
      
      {/* Welping dashboard */}
      <Route path="/welping-dashboard" element={<WelpingDashboard />} />
    </Route>
  </Route>
);
