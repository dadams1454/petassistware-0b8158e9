
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Dogs from './pages/Dogs';
import DogDetailPage from './modules/dogs/pages/DogDetailPage';
import Customers from './pages/Customers';
import CustomerDetails from './components/customers/CustomerDetails';
import ReservationPage from './components/reservations/ReservationList';
import NewDogPage from './pages/NewDogPage';
import EditDogPage from './pages/EditDogPage';
import CustomerForm from './components/customers/CustomerForm';
import NewCustomerPage from './components/customers/CustomerDialog';
import BreedingPrepPage from './modules/Reproduction/pages/BreedingManagementPage';
import LitterDetailsPage from './modules/Reproduction/pages/LitterDetailsPage';
import NewLitterPage from './modules/Reproduction/pages/NewLitterPage';
import Breeding from './modules/Reproduction/pages/BreedingDashboard';
import ReproductiveManagementPage from './modules/Reproduction/pages/ReproductionManagementPage';
import ContractsPage from './components/contracts/ContractsList';
import ContractDetailsPage from './components/contracts/ContractPreviewDialog';
import NewContractPage from './components/contracts/ContractForm';
import FacilityPage from './components/facility/FacilityTasksList';
import CommunicationsPage from './components/communications/CommunicationHistory';
import SettingsPage from './components/user-management/UserTable';
import VaccinationsPage from './components/dogs/components/VaccinationsTab';
import ReproductionRoutes from './modules/Reproduction/routes';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dogs" element={<Dogs />} />
            <Route path="dogs/new" element={<NewDogPage />} />
            <Route path="dogs/:dogId" element={<DogDetailPage />} />
            <Route path="dogs/:dogId/edit" element={<EditDogPage />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<NewCustomerPage />} />
            <Route path="customers/:customerId" element={<CustomerDetails />} />
            <Route path="customers/:customerId/edit" element={<CustomerForm />} />
            <Route path="reservations" element={<ReservationPage />} />
            <Route path="reproductive-management/:dogId" element={<ReproductiveManagementPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="contracts/new" element={<NewContractPage />} />
            <Route path="contracts/:contractId" element={<ContractDetailsPage />} />
            <Route path="communications" element={<CommunicationsPage />} />
            <Route path="facility" element={<FacilityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="vaccinations" element={<VaccinationsPage />} />
            
            {/* Centralized Reproduction Module */}
            <Route path="reproduction/*" element={<ReproductionRoutes />} />
            
            {/* Legacy routes that redirect */}
            <Route path="litters" element={<Navigate to="/reproduction/litters" replace />} />
            <Route path="litters/:litterId" element={<Navigate to="/reproduction/litters/:litterId" replace />} />
            <Route path="litters/new" element={<Navigate to="/reproduction/litters/new" replace />} />
            <Route path="breeding" element={<Navigate to="/reproduction/breeding" replace />} />
            <Route path="breeding-prep" element={<Navigate to="/reproduction/breeding" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
