
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import DogsPage from '@/pages/DogsPage';
import DogDetailPage from '@/pages/DogDetailPage';
import CustomersPage from '@/pages/CustomersPage';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
import CalendarPage from '@/pages/CalendarPage';
import LittersPage from '@/pages/LittersPage';
import LitterDetailPage from '@/pages/LitterDetailPage';
import LitterFormPage from '@/pages/LitterFormPage';
import ReproductionPage from '@/pages/ReproductionPage';
import WhelpingPage from '@/pages/WhelpingPage';
import InventoryPage from '@/pages/InventoryPage';
import SettingsPage from '@/pages/SettingsPage';
import DogFormPage from '@/pages/DogFormPage';
import CustomerFormPage from '@/pages/CustomerFormPage';
import FacilityPage from '@/pages/FacilityPage';
import BreedingRecommendationsPage from '@/pages/BreedingRecommendationsPage';
import GeneticPairingAnalysisPage from '@/pages/GeneticPairingAnalysisPage';
import BreedingGeneticAnalysisPage from '@/pages/BreedingGeneticAnalysisPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="dogs" element={<DogsPage />} />
          <Route path="dogs/:id" element={<DogDetailPage />} />
          <Route path="dogs/add" element={<DogFormPage />} />
          <Route path="dogs/:id/edit" element={<DogFormPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="customers/add" element={<CustomerFormPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="litters" element={<LittersPage />} />
          <Route path="litters/:id" element={<LitterDetailPage />} />
          <Route path="litters/add" element={<LitterFormPage />} />
          <Route path="litters/:id/edit" element={<LitterFormPage />} />
          <Route path="reproduction" element={<ReproductionPage />} />
          <Route path="breeding/recommendations" element={<BreedingRecommendationsPage />} />
          <Route path="breeding/pairing-analysis" element={<GeneticPairingAnalysisPage />} />
          <Route path="breeding/genetic-analysis" element={<BreedingGeneticAnalysisPage />} />
          <Route path="whelping" element={<WhelpingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="facility" element={<FacilityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
