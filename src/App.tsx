
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Profile from "./pages/Profile";
import Dogs from "./pages/Dogs";
import Calendar from "./pages/Calendar";
import Litters from "./pages/Litters";
import LitterDetail from "./pages/LitterDetail";
import AddLitter from "./pages/AddLitter";
import Customers from "./pages/Customers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dogs" element={<Dogs />} />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/litters" element={
              <ProtectedRoute>
                <Litters />
              </ProtectedRoute>
            } />
            <Route path="/litters/new" element={
              <ProtectedRoute>
                <AddLitter />
              </ProtectedRoute>
            } />
            <Route path="/litters/:id" element={
              <ProtectedRoute>
                <LitterDetail />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
