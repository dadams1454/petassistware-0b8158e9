import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import DogsPage from './pages/DogsPage';
import NewDogPage from './pages/NewDogPage';
import DogDetailPage from './pages/DogDetailPage';
import LittersPage from './pages/LittersPage';
import LitterDetail from './pages/LitterDetail';
import NewLitterPage from './pages/NewLitterPage';
import BreedingPrepPage from './pages/BreedingPrepPage';
import WelpingPage from './pages/WelpingPage';
import FinancesPage from './pages/FinancesPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add the new page to the routes
import ReproductiveManagementPage from './pages/ReproductiveManagementPage';

const queryClient = new QueryClient();

function App() {
  const showDevtools = process.env.NODE_ENV === 'development';
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
              
              <Route path="/dogs" element={<ProtectedRoute><DogsPage /></ProtectedRoute>} />
              <Route path="/dogs/new" element={<ProtectedRoute><NewDogPage /></ProtectedRoute>} />
              <Route path="/dogs/:id" element={<ProtectedRoute><DogDetailPage /></ProtectedRoute>} />
              
              <Route path="/litters" element={<ProtectedRoute><LittersPage /></ProtectedRoute>} />
              <Route path="/litters/new" element={<ProtectedRoute><NewLitterPage /></ProtectedRoute>} />
              <Route path="/litters/:id" element={<ProtectedRoute><LitterDetail /></ProtectedRoute>} />
              <Route path="/breeding-prep" element={<ProtectedRoute><BreedingPrepPage /></ProtectedRoute>} />
              <Route path="/welping/:id" element={<ProtectedRoute><WelpingPage /></ProtectedRoute>} />
              
              <Route path="/finances" element={<ProtectedRoute><FinancesPage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              
              {/* Add the new reproductive management route */}
              <Route path="/dogs/:dogId/reproductive" element={<ProtectedRoute><ReproductiveManagementPage /></ProtectedRoute>} />
            </Routes>
          </MainLayout>
        </Router>
        <ToastContainer position="bottom-right" autoClose={5000} />
      </AuthProvider>
      {showDevtools ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}

export default App;
