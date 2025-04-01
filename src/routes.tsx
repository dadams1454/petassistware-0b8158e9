
import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/home';
import Dashboard from '@/pages/Dashboard';
import LittersPage from '@/pages/litters/LittersPage';
import LitterDetail from '@/pages/litters/LitterDetail';
import EditLitter from '@/pages/litters/EditLitter';
import AddLitter from '@/pages/litters/AddLitter';
import WelpingDashboard from '@/pages/WelpingDashboard';
import AddDogsPage from '@/pages/AddDogsPage';
import DogsPage from '@/pages/DogsPage';
import DogDetail from '@/pages/DogDetail';
import DogProfile from '@/pages/DogProfile';
import AddDogPage from '@/pages/AddDogPage';
import EditDogPage from '@/pages/EditDogPage';
import WeightTracking from '@/pages/WeightTracking';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import AuthLayout from '@/layouts/AuthLayout';
import PuppyDashboard from '@/pages/puppies/PuppyDashboard';

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
