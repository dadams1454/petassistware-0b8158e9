import React, { Suspense } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useLocation,
  Navigate
} from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import DogsList from './components/dogs/DogsList';
import DogDetails from './components/dogs/DogDetails';
import LittersPage from './pages/LittersPage';
import LitterDetail from './pages/LitterDetail';
import PuppyDashboard from './pages/puppies/PuppyDashboard';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import { useAuth } from './contexts/AuthProvider';
import CustomersList from './pages/customers/CustomersList';
import CustomerDetail from './pages/customers/CustomerDetail';
import BreedingPage from './pages/breeding/BreedingPage';
import BreedingPlanDetail from './pages/breeding/BreedingPlanDetail';
import ContractsPage from './pages/contracts/ContractsPage';
import ContractDetail from './pages/contracts/ContractDetail';
import FinancePage from './pages/finance/FinancePage';
import ExpensesPage from './pages/finance/ExpensesPage';
import IncomePage from './pages/finance/IncomePage';
import ReportsPage from './pages/reports/ReportsPage';
import CalendarPage from './pages/calendar/CalendarPage';
import TasksPage from './pages/tasks/TasksPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import MessagesPage from './pages/messages/MessagesPage';
import HelpPage from './pages/help/HelpPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import HealthRecordsPage from './pages/health/HealthRecordsPage';
import VaccinationsPage from './pages/health/VaccinationsPage';
import MedicationsPage from './pages/health/MedicationsPage';
import GeneticsPage from './pages/genetics/GeneticsPage';
import PedigreeViewerPage from './pages/genetics/PedigreeViewerPage';
import COICalculatorPage from './pages/genetics/COICalculatorPage';
import ColorCalculatorPage from './pages/genetics/ColorCalculatorPage';
import InventoryPage from './pages/inventory/InventoryPage';
import SuppliesPage from './pages/inventory/SuppliesPage';
import FoodPage from './pages/inventory/FoodPage';
import MedicationInventoryPage from './pages/inventory/MedicationInventoryPage';
import CompliancePage from './pages/compliance/CompliancePage';
import LicensesPage from './pages/compliance/LicensesPage';
import InspectionsPage from './pages/compliance/InspectionsPage';
import MarketingPage from './pages/marketing/MarketingPage';
import WebsitePage from './pages/marketing/WebsitePage';
import SocialMediaPage from './pages/marketing/SocialMediaPage';
import AdvertisingPage from './pages/marketing/AdvertisingPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import DashboardAnalyticsPage from './pages/analytics/DashboardAnalyticsPage';
import SalesAnalyticsPage from './pages/analytics/SalesAnalyticsPage';
import BreedingAnalyticsPage from './pages/analytics/BreedingAnalyticsPage';
import HealthAnalyticsPage from './pages/analytics/HealthAnalyticsPage';
import IntegrationsPage from './pages/integrations/IntegrationsPage';
import ApiKeysPage from './pages/integrations/ApiKeysPage';
import WebhooksPage from './pages/integrations/WebhooksPage';
import ImportExportPage from './pages/integrations/ImportExportPage';
import DailyCarePage from './pages/care/DailyCarePage';
import GroomingPage from './pages/care/GroomingPage';
import ExercisePage from './pages/care/ExercisePage';
import FeedingPage from './pages/care/FeedingPage';
import TrainingPage from './pages/training/TrainingPage';
import BehaviorPage from './pages/training/BehaviorPage';
import ObediencePage from './pages/training/ObediencePage';
import SpecialtyPage from './pages/training/SpecialtyPage';
import ShowPage from './pages/show/ShowPage';
import ShowResultsPage from './pages/show/ShowResultsPage';
import ShowCalendarPage from './pages/show/ShowCalendarPage';
import ShowPreparationPage from './pages/show/ShowPreparationPage';
import TransportPage from './pages/transport/TransportPage';
import VehiclesPage from './pages/transport/VehiclesPage';
import RoutesPage from './pages/transport/RoutesPage';
import SchedulePage from './pages/transport/SchedulePage';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import KennelsPage from './pages/facilities/KennelsPage';
import YardsPage from './pages/facilities/YardsPage';
import MaintenancePage from './pages/facilities/MaintenancePage';
import StaffPage from './pages/staff/StaffPage';
import SchedulingPage from './pages/staff/SchedulingPage';
import PerformancePage from './pages/staff/PerformancePage';
import TrainingModulesPage from './pages/staff/TrainingModulesPage';
import EmergencyPage from './pages/emergency/EmergencyPage';
import ContactsPage from './pages/emergency/ContactsPage';
import ProceduresPage from './pages/emergency/ProceduresPage';
import EvacuationPage from './pages/emergency/EvacuationPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import TemplatesPage from './pages/documents/TemplatesPage';
import FormsPage from './pages/documents/FormsPage';
import ArchivePage from './pages/documents/ArchivePage';

const Router = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dogs" element={<DogsList />} />
          <Route path="/dogs/:id" element={<DogDetails />} />
          <Route path="/litters" element={<LittersPage />} />
          <Route path="/litters/:id" element={<LitterDetail />} />
          
          {/* Add new puppies routes */}
          <Route path="/puppies" element={<PuppyDashboard />} />
          <Route path="/puppies/:id" element={<PuppyDashboard />} />
          
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Router;
