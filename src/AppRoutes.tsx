
import { Route, Routes } from "react-router-dom";

// ✅ Auth Pages
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import LandingPage from "@/pages/Auth/LandingPage";

// ✅ Main Dashboard
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import ProfilePage from "@/pages/Dashboard/ProfilePage";

// ✅ Dog Management
import DogListPage from "@/pages/Dogs/DogListPage";
import DogAddPage from "@/pages/Dogs/DogAddPage";
import DogDetailPage from "@/pages/Dogs/DogDetailPage";
import DogEditPage from "@/pages/Dogs/DogEditPage";
import DogWeightPage from "@/pages/Dogs/DogWeightPage";
import ReproductiveCyclePage from "@/pages/Dogs/ReproductiveCyclePage";

// ✅ Reproduction Module
// Updated imports based on actual file locations
import WelpingManagementPage from "@/modules/Reproduction/pages/WelpingManagementPage";
import BreedingManagementPage from "@/modules/Reproduction/pages/BreedingManagementPage";
import LitterManagementPage from "@/modules/Reproduction/pages/LitterManagementPage";
import WhelpingLiveSession from "@/modules/Reproduction/components/welping/WhelpingLiveSession";
import LitterDetail from "@/pages/LitterDetail";
// Commented out imports for components that couldn't be found
// import BatchPuppyEntryPage from "@/pages/BatchPuppyEntry";
// import PuppyTestingPage from "@/pages/PuppyTestingDashboard";

// ✅ Customer & Contracts
import CustomersPage from "@/pages/Customers/CustomersPage";
import CustomerDialog from "@/pages/Customers/CustomerDialog";
import CustomerDetails from "@/pages/Customers/CustomerDetails";
import CustomerForm from "@/pages/Customers/CustomerForm";

import ContractsList from "@/pages/Contracts/ContractsList";
import ContractForm from "@/pages/Contracts/ContractForm";
import ContractPreviewDialog from "@/pages/Contracts/ContractPreviewDialog";

// ✅ Operations
import CalendarPage from "@/pages/Operations/CalendarPage";
import CommunicationsPage from "@/pages/Operations/CommunicationsPage";
import FinancesPage from "@/pages/Operations/FinancesPage";
import FacilityPage from "@/pages/Operations/FacilityPage";
import ReservationsPage from "@/pages/Operations/ReservationsPage";
import CompliancePage from "@/pages/Operations/CompliancePage";

// ✅ Admin Tools
import {
  UsersPage,
  AuditLogsPage,
  SettingsPage,
  AdminSecurityPage,
  AdminSchemaPage,
  AdminRolesPage,
} from "@/pages/Admin";

export function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🏠 Main App */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* 🐶 Dog Management */}
      <Route path="/dogs" element={<DogListPage />} />
      <Route path="/dogs/new" element={<DogAddPage />} />
      <Route path="/dogs/:id" element={<DogDetailPage />} />
      <Route path="/dogs/:id/edit" element={<DogEditPage />} />
      <Route path="/dogs/:id/weight" element={<DogWeightPage />} />
      <Route path="/dogs/:id/reproductive" element={<ReproductiveCyclePage />} />

      {/* 🧬 Reproduction (Whelping, Litters, Breeding) */}
      <Route path="/reproduction" element={<WelpingManagementPage />} />
      <Route path="/reproduction/breeding" element={<BreedingManagementPage />} />
      <Route path="/reproduction/litters" element={<LitterManagementPage />} />
      <Route path="/reproduction/litters/:id" element={<LitterDetail />} />
      {/* Commented out routes for components that couldn't be found */}
      {/* <Route path="/reproduction/litters/:id/add-puppies" element={<BatchPuppyEntryPage />} /> */}
      {/* <Route path="/reproduction/litters/:id/puppy-testing" element={<PuppyTestingPage />} /> */}
      <Route path="/reproduction/whelping/:id/live" element={<WhelpingLiveSession />} />

      {/* 🧑‍🤝‍🧑 Customers & Reservations */}
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/customers/new" element={<CustomerDialog />} />
      <Route path="/customers/:customerId" element={<CustomerDetails />} />
      <Route path="/customers/:customerId/edit" element={<CustomerForm />} />
      <Route path="/contracts" element={<ContractsList />} />
      <Route path="/contracts/new" element={<ContractForm />} />
      <Route path="/contracts/:contractId" element={<ContractPreviewDialog />} />

      {/* 🧹 Ops: Calendar, Facility, Finances */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/communications" element={<CommunicationsPage />} />
      <Route path="/finances" element={<FinancesPage />} />
      <Route path="/facility" element={<FacilityPage />} />
      <Route path="/reservations" element={<ReservationsPage />} />
      <Route path="/compliance" element={<CompliancePage />} />

      {/* 🛠️ Admin Panel */}
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/security" element={<AdminSecurityPage />} />
      <Route path="/admin/schema" element={<AdminSchemaPage />} />
      <Route path="/admin/roles" element={<AdminRolesPage />} />
    </Routes>
  );
}
