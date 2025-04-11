
import { Route, Routes } from "react-router-dom";

// ✅ Auth Pages
// Use the Auth component directly, which already exports Login, Register, etc.
import Auth from "@/pages/Auth";

// ✅ Main Dashboard
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import ProfilePage from "@/modules/dashboard/pages/ProfilePage";

// ✅ Dog Management
import { 
  DogListPage,
  DogAddPage,
  DogDetailPage,
  DogEditPage,
  DogWeightPage,
  ReproductiveCyclePage
} from "@/modules/dogs";

// ✅ Reproduction Module
// Updated imports based on actual file locations
import WelpingManagementPage from "@/modules/Reproduction/pages/WelpingManagementPage";
import BreedingManagementPage from "@/modules/Reproduction/pages/BreedingManagementPage";
import LitterManagementPage from "@/modules/Reproduction/pages/LitterManagementPage";
import WhelpingLiveSession from "@/modules/Reproduction/components/welping/WhelpingLiveSession";
import LitterDetail from "@/pages/LitterDetail";

// ✅ Customer & Contracts
import CustomersPage from "@/modules/customers/pages/CustomersPage";
import CustomerDialog from "@/modules/customers/components/CustomerDialog";
import CustomerDetails from "@/modules/customers/components/CustomerDetails";
import CustomerForm from "@/modules/customers/components/CustomerForm";

import ContractsList from "@/modules/contracts/components/ContractsList";
import ContractForm from "@/modules/contracts/components/ContractForm";
import ContractPreviewDialog from "@/modules/contracts/components/ContractPreviewDialog";

// ✅ Operations
import CalendarPage from "@/modules/operations/pages/CalendarPage";
import CommunicationsPage from "@/modules/operations/pages/CommunicationsPage";
import FinancesPage from "@/modules/operations/pages/FinancesPage";
import FacilityPage from "@/modules/operations/pages/FacilityPage";
import ReservationsPage from "@/modules/operations/pages/ReservationsPage";
import CompliancePage from "@/modules/operations/pages/CompliancePage";

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
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/forgot-password" element={<Auth />} />
      <Route path="/reset-password" element={<Auth />} />

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
      {/* Temporarily comment out routes that reference components we couldn't find */}
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
