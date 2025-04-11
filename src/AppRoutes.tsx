
import { Route, Routes } from "react-router-dom";

// ✅ Auth Pages
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  LandingPage,
} from "@/pages/Auth";

// ✅ Main Dashboard
import { DashboardPage, ProfilePage } from "@/pages/Dashboard";

// ✅ Dog Management
import {
  DogListPage,
  DogAddPage,
  DogDetailPage,
  DogEditPage,
  DogWeightPage,
  ReproductiveCyclePage,
} from "@/pages/Dogs";

// ✅ Reproduction Module
import {
  WelpingManagementPage,
  WhelpingLiveSession,
  BreedingManagementPage,
  LitterManagementPage,
  LitterDetail,
  BatchPuppyEntryPage,
  PuppyTestingPage,
} from "@/pages/Reproduction";

// ✅ Customer & Contracts
import {
  CustomersPage,
  CustomerDialog,
  CustomerDetails,
  CustomerForm,
} from "@/pages/Customers";

import {
  ContractsList,
  ContractForm,
  ContractPreviewDialog,
} from "@/pages/Contracts";

// ✅ Operations
import {
  CalendarPage,
  CommunicationsPage,
  FinancesPage,
  FacilityPage,
  ReservationsPage,
  CompliancePage,
} from "@/pages/Operations";

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
      <Route path="/reproduction/litters/:id/add-puppies" element={<BatchPuppyEntryPage />} />
      <Route path="/reproduction/litters/:id/puppy-testing" element={<PuppyTestingPage />} />
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
