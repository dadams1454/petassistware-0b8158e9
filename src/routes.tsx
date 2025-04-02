
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
      <Route path="/dogs/:dogId/reproductive" element={<ReproductiveCyclePage />} />
      <Route path="/dogs/new" element={<DogAddPage />} />
      <Route path="/dogs/:dogId/edit" element={<DogEditPage />} />
      <Route path="/reproductive-management/:dogId" element={<ReproductiveManagementPage />} />
      <Route path="/vaccinations" element={<VaccinationsTab dogId="placeholder" />} />
      
      {/* CENTRALIZED REPRODUCTION ROUTES */}
      {/* Main Reproduction dashboard */}
      <Route path="/reproduction" element={<WelpingManagementPage />} />
      <Route path="/reproduction/*" element={<ReproductionRoutes />} />
      
      {/* Breeding Management */}
      <Route path="/reproduction/breeding" element={<BreedingManagementPage />} />
      
      {/* Litter Management */}
      <Route path="/reproduction/litters" element={<LitterManagementPage />} />
      <Route path="/reproduction/litters/:id" element={<LitterDetail />} />
      <Route path="/reproduction/litters/:litterId/add-puppies" element={<BatchPuppyEntryPage />} />
      <Route path="/reproduction/litters/:litterId/puppy-testing" element={<PuppyTestingPage />} />
      
      {/* Whelping Management */}
      <Route path="/reproduction/welping" element={<WelpingManagementPage />} />
      <Route path="/reproduction/welping/:id" element={<WhelpingLiveSession />} />
      
      {/* LEGACY ROUTES - Redirects to new structure */}
      {/* These routes will still work for backward compatibility but point to the new components */}
      <Route path="/litters" element={<LitterManagementPage />} />
      <Route path="/litters/:id" element={<LitterDetail />} />
      <Route path="/litter/:litterId/add-puppies" element={<BatchPuppyEntryPage />} />
      <Route path="/litter/:litterId/puppy-testing" element={<PuppyTestingPage />} />
      <Route path="/breeding-prep" element={<BreedingManagementPage />} />
      
      {/* Legacy Welping routes - for backwards compatibility */}
      <Route path="/welping" element={<WelpingManagementPage />} />
      <Route path="/welping/:id" element={<LitterDetail />} /> 
      <Route path="/welping/:id/live" element={<WhelpingLiveSession />} />
      <Route path="/welping/:id/edit" element={<LitterDetail />} />
      <Route path="/welping/:id/logs" element={<LitterDetail />} />
      
      {/* Customer routes */}
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/customers/new" element={
        <CustomerDialog 
          isOpen={true} 
          onClose={() => {}} 
          customer={null} 
        />
      } />
      <Route path="/customers/:customerId" element={<CustomerDetails />} />
      <Route path="/customers/:customerId/edit" element={
        <CustomerForm 
          onSubmit={() => {}} 
          onCancel={() => {}} 
        />
      } />
      
      {/* Contract routes */}
      <Route path="/contracts" element={<ContractsList />} />
      <Route path="/contracts/new" element={
        <ContractForm 
          puppyId={null} 
          onSubmit={() => {}} 
          onCancel={() => {}} 
        />
      } />
      <Route path="/contracts/:contractId" element={
        <ContractPreviewDialog 
          isOpen={true} 
          onOpenChange={() => {}} 
          contractData={null} 
          onSignContract={async (signatureData: string) => Promise.resolve()} 
        />
      } />
      
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
      <Route path="/settings" element={<UserManagement />} />
      
      {/* Reservations routes */}
      <Route path="/reservations" element={<ReservationsPage />} />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Route>
);

export default appRoutes;
