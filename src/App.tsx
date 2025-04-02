import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardPage from './pages/DashboardPage';
import DailyCare from './pages/DailyCare';
import BatchPuppyEntry from './pages/BatchPuppyEntry';
import PuppyTestingDashboard from './pages/PuppyTestingDashboard';
import DogsList from './components/dogs/DogsList';
import DogDetails from './components/dogs/DogDetails';
import Litters from './pages/Litters';
import LitterDetail from './pages/LitterDetail';
import PuppyDashboard from './pages/puppies/PuppyDashboard';
import NotFound from './pages/NotFound';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Index from './pages/Index';
import WelpingDashboard from './pages/WelpingDashboard';
import WelpingPage from './pages/WelpingPage';
import Compliance from './pages/Compliance';
import Calendar from './pages/Calendar';
import Communications from './pages/Communications';
import Contracts from './pages/Contracts';
import Finances from './pages/Finances';
import Facility from './pages/Facility';
import BreedingPrepPage from './pages/BreedingPrepPage';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Reservations from './pages/Reservations';
import Customers from './pages/Customers';
import Profile from './pages/Profile';
import React from 'react';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/daily-care" element={<DailyCare />} />
        <Route path="/litter/:litterId/add-puppies" element={<BatchPuppyEntry />} />
        <Route path="/litter/:litterId/puppy-testing" element={<PuppyTestingDashboard />} />
        <Route element={<AuthLayout />}>
          {/* Auth routes */}
          <Route path="/auth" element={<div>Login Page</div>} />
          {/* Public landing page */}
          <Route path="/" element={<Index />} />
        </Route>
        
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Dogs routes */}
          <Route path="/dogs" element={<DogsList />} />
          <Route path="/dogs/:id" element={<DogDetails dog={{}} />} />
          
          {/* Litters routes */}
          <Route path="/litters" element={<Litters />} />
          <Route path="/litters/:id" element={<LitterDetail />} />
          
          {/* Reservations routes */}
          <Route path="/reservations" element={<Reservations />} />
          
          {/* Customers routes */}
          <Route path="/customers" element={<Customers />} />
          
          {/* Puppies routes */}
          <Route path="/puppies" element={<PuppyDashboard />} />
          <Route path="/puppies/:id" element={<PuppyDashboard />} />
          
          {/* Operations routes */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/facility" element={<Facility />} />
          
          {/* Compliance route */}
          <Route path="/compliance" element={<Compliance />} />
          
          {/* Breeding/Welping routes */}
          <Route path="/breeding-prep" element={<BreedingPrepPage />} />
          <Route path="/welping" element={<WelpingDashboard />} />
          <Route path="/welping/:id" element={<WelpingPage />} />
          
          {/* Administration routes */}
          <Route path="/users" element={<Users />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Redirect from root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
