
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
import UsersPage from '@/pages/Users';
import AuditLogsPage from '@/pages/AuditLogs';
import SettingsPage from '@/pages/Settings';
import ReservationsPage from '@/pages/Reservations';
import CustomersPage from '@/pages/Customers';
import ProfilePage from '@/pages/Profile';
import BatchPuppyEntryPage from '@/pages/BatchPuppyEntry';
import PuppyTestingPage from '@/pages/PuppyTestingDashboard';
import LoginPage from '@/pages/Login';
import SecurityTestPage from '@/pages/SecurityTest';

// Import consolidated Dogs Module
import {
  DogListPage,
  DogAddPage,
  DogDetailPage,
  DogEditPage,
  DogWeightPage
} from '@/modules/dogs';

// Import Reproduction Module
import {
  ReproductiveCyclePage,
  BreedingManagementPage,
  LitterManagementPage,
  WelpingManagementPage
} from '@/modules/Reproduction';

// Import Whelping components
import WhelpingLiveSession from '@/modules/Reproduction/components/welping/WhelpingLiveSession';

// Import LitterDetail component for consistent routing
import LitterDetail from '@/pages/LitterDetail';

// Importing components for routes previously defined in App.tsx
import CustomerDetails from '@/components/customers/CustomerDetails';
import CustomerForm from '@/components/customers/CustomerForm';
import CustomerDialog from '@/components/customers/CustomerDialog';
import ContractsList from '@/components/contracts/ContractsList';
import ContractForm from '@/components/contracts/ContractForm';
import ContractPreviewDialog from '@/components/contracts/ContractPreviewDialog';
import VaccinationsTab from '@/components/dogs/components/VaccinationsTab';
import ReproductionRoutes from '@/modules/Reproduction/routes';
import UserManagement from '@/pages/UserManagement';
import ReproductiveManagementPage from '@/pages/ReproductiveManagementPage';

// Import ProtectedRoute component for security
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Placeholder components for routes that aren't implemented yet
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
      {/* Security test page - accessible without login */}
      <Route path="/security-test" element={<SecurityTestPage />} />
    </Route>
    
    {/* Protected routes */}
    <Route element={<MainLayout />}>
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      {/* Profile */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Dogs routes - now using the consolidated Dogs Module */}
      <Route path="/dogs" element={
        <ProtectedRoute resource="dogs" action="view">
          <DogListPage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/add" element={
        <ProtectedRoute resource="dogs" action="add">
          <DogAddPage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/:id" element={
        <ProtectedRoute resource="dogs" action="view">
          <DogDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/:id/edit" element={
        <ProtectedRoute resource="dogs" action="edit">
          <DogEditPage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/:id/weight" element={
        <ProtectedRoute resource="dogs" action="edit">
          <DogWeightPage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/:dogId/reproductive" element={
        <ProtectedRoute resource="breeding" action="view">
          <ReproductiveCyclePage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/new" element={
        <ProtectedRoute resource="dogs" action="add">
          <DogAddPage />
        </ProtectedRoute>
      } />
      <Route path="/dogs/:dogId/edit" element={
        <ProtectedRoute resource="dogs" action="edit">
          <DogEditPage />
        </ProtectedRoute>
      } />
      <Route path="/reproductive-management/:dogId" element={
        <ProtectedRoute resource="breeding" action="view">
          <ReproductiveManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/vaccinations" element={
        <ProtectedRoute resource="health" action="view">
          <VaccinationsTab dogId="placeholder" />
        </ProtectedRoute>
      } />
      
      {/* CENTRALIZED REPRODUCTION ROUTES */}
      {/* Main Reproduction dashboard */}
      <Route path="/reproduction" element={
        <ProtectedRoute resource="breeding" action="view">
          <WelpingManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/reproduction/*" element={
        <ProtectedRoute resource="breeding" action="view">
          <ReproductionRoutes />
        </ProtectedRoute>
      } />
      
      {/* Breeding Management */}
      <Route path="/reproduction/breeding" element={
        <ProtectedRoute resource="breeding" action="view">
          <BreedingManagementPage />
        </ProtectedRoute>
      } />
      
      {/* Litter Management */}
      <Route path="/reproduction/litters" element={
        <ProtectedRoute resource="litters" action="view">
          <LitterManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/reproduction/litters/:id" element={
        <ProtectedRoute resource="litters" action="view">
          <LitterDetail />
        </ProtectedRoute>
      } />
      <Route path="/reproduction/litters/:litterId/add-puppies" element={
        <ProtectedRoute resource="litters" action="edit">
          <BatchPuppyEntryPage />
        </ProtectedRoute>
      } />
      <Route path="/reproduction/litters/:litterId/puppy-testing" element={
        <ProtectedRoute resource="litters" action="view">
          <PuppyTestingPage />
        </ProtectedRoute>
      } />
      
      {/* Whelping Management */}
      <Route path="/reproduction/welping" element={
        <ProtectedRoute resource="breeding" action="view">
          <WelpingManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/reproduction/welping/:id" element={
        <ProtectedRoute resource="breeding" action="view">
          <WhelpingLiveSession />
        </ProtectedRoute>
      } />
      
      {/* LEGACY ROUTES - Redirects to new structure */}
      {/* These routes will still work for backward compatibility but point to the new components */}
      <Route path="/litters" element={
        <ProtectedRoute resource="litters" action="view">
          <LitterManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/litters/:id" element={
        <ProtectedRoute resource="litters" action="view">
          <LitterDetail />
        </ProtectedRoute>
      } />
      <Route path="/litter/:litterId/add-puppies" element={
        <ProtectedRoute resource="litters" action="edit">
          <BatchPuppyEntryPage />
        </ProtectedRoute>
      } />
      <Route path="/litter/:litterId/puppy-testing" element={
        <ProtectedRoute resource="litters" action="view">
          <PuppyTestingPage />
        </ProtectedRoute>
      } />
      <Route path="/breeding-prep" element={
        <ProtectedRoute resource="breeding" action="view">
          <BreedingManagementPage />
        </ProtectedRoute>
      } />
      
      {/* Legacy Welping routes - for backwards compatibility */}
      <Route path="/welping" element={
        <ProtectedRoute resource="breeding" action="view">
          <WelpingManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/welping/:id" element={
        <ProtectedRoute resource="litters" action="view">
          <LitterDetail />
        </ProtectedRoute>
      } /> 
      <Route path="/welping/:id/live" element={
        <ProtectedRoute resource="breeding" action="view">
          <WhelpingLiveSession />
        </ProtectedRoute>
      } />
      <Route path="/welping/:id/edit" element={
        <ProtectedRoute resource="litters" action="edit">
          <LitterDetail />
        </ProtectedRoute>
      } />
      <Route path="/welping/:id/logs" element={
        <ProtectedRoute resource="litters" action="view">
          <LitterDetail />
        </ProtectedRoute>
      } />
      
      {/* Customer routes */}
      <Route path="/customers" element={
        <ProtectedRoute resource="customers" action="view">
          <CustomersPage />
        </ProtectedRoute>
      } />
      <Route path="/customers/new" element={
        <ProtectedRoute resource="customers" action="add">
          <CustomerDialog 
            isOpen={true} 
            onClose={() => {}} 
            customer={null} 
          />
        </ProtectedRoute>
      } />
      <Route path="/customers/:customerId" element={
        <ProtectedRoute resource="customers" action="view">
          <CustomerDetails />
        </ProtectedRoute>
      } />
      <Route path="/customers/:customerId/edit" element={
        <ProtectedRoute resource="customers" action="edit">
          <CustomerForm 
            onSubmit={() => {}} 
            onCancel={() => {}} 
          />
        </ProtectedRoute>
      } />
      
      {/* Contract routes */}
      <Route path="/contracts" element={
        <ProtectedRoute resource="customers" action="view">
          <ContractsList />
        </ProtectedRoute>
      } />
      <Route path="/contracts/new" element={
        <ProtectedRoute resource="customers" action="add">
          <ContractForm 
            puppyId={null} 
            onSubmit={() => {}} 
            onCancel={() => {}} 
          />
        </ProtectedRoute>
      } />
      <Route path="/contracts/:contractId" element={
        <ProtectedRoute resource="customers" action="view">
          <ContractPreviewDialog 
            isOpen={true} 
            onOpenChange={() => {}} 
            contractId="placeholder"
          />
        </ProtectedRoute>
      } />
      
      {/* Operations routes */}
      <Route path="/calendar" element={
        <ProtectedRoute>
          <CalendarPage />
        </ProtectedRoute>
      } />
      <Route path="/communications" element={
        <ProtectedRoute>
          <CommunicationsPage />
        </ProtectedRoute>
      } />
      <Route path="/contracts" element={
        <ProtectedRoute>
          <ContractsPage />
        </ProtectedRoute>
      } />
      <Route path="/finances" element={
        <ProtectedRoute resource="finance" action="view">
          <FinancesPage />
        </ProtectedRoute>
      } />
      <Route path="/facility" element={
        <ProtectedRoute resource="kennel" action="view">
          <FacilityPage />
        </ProtectedRoute>
      } />
      
      {/* Compliance route */}
      <Route path="/compliance" element={
        <ProtectedRoute>
          <CompliancePage />
        </ProtectedRoute>
      } />
      
      {/* Administration routes */}
      <Route path="/users" element={
        <ProtectedRoute resource="users" action="view">
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/audit-logs" element={
        <ProtectedRoute resource="adminSetup" action="view">
          <AuditLogsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute resource="settings" action="view">
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute resource="settings" action="view">
          <UserManagement />
        </ProtectedRoute>
      } />
      
      {/* Reservations routes */}
      <Route path="/reservations" element={
        <ProtectedRoute resource="customers" action="view">
          <ReservationsPage />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Route>
);

export default appRoutes;
