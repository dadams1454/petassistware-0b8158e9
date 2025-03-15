
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Profile from "./pages/Profile";
import Dogs from "./pages/Dogs";
import DogDetail from "./pages/DogDetail";
import Calendar from "./pages/Calendar";
import Litters from "./pages/Litters";
import LitterDetail from "./pages/LitterDetail";
import AddLitter from "./pages/AddLitter";
import Customers from "./pages/Customers";
import Communications from "./pages/Communications";
import WelpingPage from "./pages/WelpingPage";
import { DailyCareProvider } from "./contexts/DailyCareProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dogs" element={<Dogs />} />
                <Route path="/dogs/:id" element={<DogDetail />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/communications" element={<Communications />} />
                <Route path="/litters" element={<Litters />} />
                <Route path="/litters/new" element={<AddLitter />} />
                <Route path="/litters/:id" element={<LitterDetail />} />
                <Route path="/welping/:id" element={<WelpingPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
