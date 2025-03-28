
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthProvider';
import { RefreshProvider } from '@/contexts/RefreshContext';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import Dogs from '@/pages/Dogs';
import DogDetail from '@/pages/DogDetail';
import Customers from '@/pages/Customers';
import Litters from '@/pages/Litters';
import LitterDetail from '@/pages/LitterDetail';
import AddLitter from '@/pages/AddLitter';
import Calendar from '@/pages/Calendar';
import Communications from '@/pages/Communications';
import WelpingPage from '@/pages/WelpingPage';
import DogProfile from '@/pages/DogProfile';
import DailyCare from '@/pages/DailyCare';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Index from '@/pages/Index';
import UserManagement from '@/pages/UserManagement';
import AdminSetup from '@/pages/AdminSetup';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  console.log('App rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RefreshProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes with shared layout */}
              <Route element={<AuthLayout />}>
                {/* All-access routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                
                {/* Permission-based routes */}
                <Route element={<ProtectedRoute resource="dogs" />}>
                  <Route path="/dogs" element={<Dogs />} />
                  <Route path="/dogs/:id" element={<DogDetail />} />
                  <Route path="/dog/:id" element={<DogDetail />} />
                  <Route path="/profile/dog/:id" element={<DogProfile />} />
                  <Route path="/daily-care" element={<DailyCare />} />
                </Route>
                
                <Route element={<ProtectedRoute resource="customers" />}>
                  <Route path="/customers" element={<Customers />} />
                </Route>
                
                <Route element={<ProtectedRoute resource="litters" />}>
                  <Route path="/litters" element={<Litters />} />
                  <Route path="/litters/new" element={<AddLitter />} />
                  <Route path="/litters/:id" element={<LitterDetail />} />
                </Route>
                
                <Route element={<ProtectedRoute resource="calendar" />}>
                  <Route path="/calendar" element={<Calendar />} />
                </Route>
                
                <Route element={<ProtectedRoute resource="communications" />}>
                  <Route path="/communications" element={<Communications />} />
                </Route>
                
                <Route element={<ProtectedRoute resource="welping" />}>
                  <Route path="/welping" element={<WelpingPage />} />
                  <Route path="/welping/:id" element={<WelpingPage />} />
                </Route>
                
                <Route element={<ProtectedRoute resource="users" />}>
                  <Route path="/users" element={<UserManagement />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </RefreshProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
