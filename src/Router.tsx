
import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import DogsList from './components/dogs/DogsList';
import DogDetails from './components/dogs/DogDetails';
import Litters from './pages/Litters';
import LitterDetail from './pages/LitterDetail';
import PuppyDashboard from './pages/puppies/PuppyDashboard';
import NotFound from './pages/NotFound';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AuthLayout />}>
          {/* Auth routes */}
          <Route path="/auth" element={<div>Login Page</div>} />
          {/* Public landing page */}
          <Route path="/" element={<div>Home Page</div>} />
        </Route>
        
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Dogs routes */}
          <Route path="/dogs" element={<DogsList />} />
          <Route path="/dogs/:id" element={<DogDetails dog={{}} />} />
          
          {/* Litters routes */}
          <Route path="/litters" element={<Litters />} />
          <Route path="/litters/:id" element={<LitterDetail />} />
          
          {/* Puppies routes */}
          <Route path="/puppies" element={<PuppyDashboard />} />
          <Route path="/puppies/:id" element={<PuppyDashboard />} />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default Router;
