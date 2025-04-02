
import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import DogsList from './components/dogs/DogsList';
import DogDetails from './components/dogs/DogDetails';
// Commented out imports for non-existent files
// import LittersPage from './pages/LittersPage';
// import LitterDetail from './pages/LitterDetail';
import PuppyDashboard from './pages/puppies/PuppyDashboard';
// import SettingsPage from './pages/SettingsPage';
// import ProfilePage from './pages/ProfilePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import NotFoundPage from './pages/NotFoundPage';
// import PrivateRoute from './components/auth/PrivateRoute';
// import PublicRoute from './components/auth/PublicRoute';
// import Layout from './components/layout/Layout';
// import AuthLayout from './components/layout/AuthLayout';

// Using the existing Litters page instead of the non-existent LittersPage
import Litters from './pages/Litters';
import LitterDetail from './pages/LitterDetail';

// Import the useAuth hook, but comment out its usage until we fix all the issues
// import { useAuth } from './contexts/AuthProvider';

const Router = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dogs" element={<DogsList />} />
          <Route path="/dogs/:id" element={<DogDetails />} />
          <Route path="/litters" element={<Litters />} />
          <Route path="/litters/:id" element={<LitterDetail />} />
          
          {/* Add puppies routes */}
          <Route path="/puppies" element={<PuppyDashboard />} />
          <Route path="/puppies/:id" element={<PuppyDashboard />} />
          
          {/* Comment out routes for components that don't exist yet */}
          {/*
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/breeding" element={<BreedingPage />} />
          <Route path="/breeding/:id" element={<BreedingPlanDetail />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/finance/expenses" element={<ExpensesPage />} />
          <Route path="/finance/income" element={<IncomePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
          <Route path="/health/records" element={<HealthRecordsPage />} />
          <Route path="/health/vaccinations" element={<VaccinationsPage />} />
          <Route path="/health/medications" element={<MedicationsPage />} />
          <Route path="/genetics" element={<GeneticsPage />} />
          <Route path="/genetics/pedigree" element={<PedigreeViewerPage />} />
          <Route path="/genetics/coi" element={<COICalculatorPage />} />
          <Route path="/genetics/color" element={<ColorCalculatorPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/supplies" element={<SuppliesPage />} />
          <Route path="/inventory/food" element={<FoodPage />} />
          <Route path="/inventory/medications" element={<MedicationInventoryPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/compliance/licenses" element={<LicensesPage />} />
          <Route path="/compliance/inspections" element={<InspectionsPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/marketing/website" element={<WebsitePage />} />
          <Route path="/marketing/social" element={<SocialMediaPage />} />
          <Route path="/marketing/advertising" element={<AdvertisingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/dashboard" element={<DashboardAnalyticsPage />} />
          <Route path="/analytics/sales" element={<SalesAnalyticsPage />} />
          <Route path="/analytics/breeding" element={<BreedingAnalyticsPage />} />
          <Route path="/analytics/health" element={<HealthAnalyticsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/integrations/api" element={<ApiKeysPage />} />
          <Route path="/integrations/webhooks" element={<WebhooksPage />} />
          <Route path="/integrations/import-export" element={<ImportExportPage />} />
          <Route path="/care/daily" element={<DailyCarePage />} />
          <Route path="/care/grooming" element={<GroomingPage />} />
          <Route path="/care/exercise" element={<ExercisePage />} />
          <Route path="/care/feeding" element={<FeedingPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/behavior" element={<BehaviorPage />} />
          <Route path="/training/obedience" element={<ObediencePage />} />
          <Route path="/training/specialty" element={<SpecialtyPage />} />
          <Route path="/show" element={<ShowPage />} />
          <Route path="/show/results" element={<ShowResultsPage />} />
          <Route path="/show/calendar" element={<ShowCalendarPage />} />
          <Route path="/show/preparation" element={<ShowPreparationPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/transport/vehicles" element={<VehiclesPage />} />
          <Route path="/transport/routes" element={<RoutesPage />} />
          <Route path="/transport/schedule" element={<SchedulePage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/facilities/kennels" element={<KennelsPage />} />
          <Route path="/facilities/yards" element={<YardsPage />} />
          <Route path="/facilities/maintenance" element={<MaintenancePage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/staff/scheduling" element={<SchedulingPage />} />
          <Route path="/staff/performance" element={<PerformancePage />} />
          <Route path="/staff/training" element={<TrainingModulesPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/emergency/contacts" element={<ContactsPage />} />
          <Route path="/emergency/procedures" element={<ProceduresPage />} />
          <Route path="/emergency/evacuation" element={<EvacuationPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/templates" element={<TemplatesPage />} />
          <Route path="/documents/forms" element={<FormsPage />} />
          <Route path="/documents/archive" element={<ArchivePage />} />
          */}
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Router;
