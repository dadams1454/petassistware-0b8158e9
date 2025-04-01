
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import DogsPage from './pages/Dogs';
import DogProfilePage from './pages/DogProfile';
import LittersPage from './pages/Litters';
import LitterDetail from './pages/LitterDetail';
import AddLitter from './pages/AddLitter';
import BreedingPrepPage from './pages/BreedingPrepPage';
import WelpingPage from './pages/WelpingPage';
import Finances from './pages/Finances';
import Users from './pages/Users';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Import the reproductive management page
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
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              <Route path="/dogs" element={<ProtectedRoute><DogsPage /></ProtectedRoute>} />
              <Route path="/dogs/new" element={<ProtectedRoute><DogsPage /></ProtectedRoute>} />
              <Route path="/dogs/:id" element={<ProtectedRoute><DogProfilePage /></ProtectedRoute>} />
              
              <Route path="/litters" element={<ProtectedRoute><LittersPage /></ProtectedRoute>} />
              <Route path="/litters/new" element={<ProtectedRoute><AddLitter /></ProtectedRoute>} />
              <Route path="/litters/:id" element={<ProtectedRoute><LitterDetail /></ProtectedRoute>} />
              <Route path="/breeding-prep" element={<ProtectedRoute><BreedingPrepPage /></ProtectedRoute>} />
              <Route path="/welping/:id" element={<ProtectedRoute><WelpingPage /></ProtectedRoute>} />
              
              <Route path="/finances" element={<ProtectedRoute><Finances /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              
              {/* Add the reproductive management route */}
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
