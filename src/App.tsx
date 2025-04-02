import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import DashboardPage from './pages/DashboardPage';
import DogProfilePage from './pages/DogProfilePage';
import DogManagementPage from './pages/DogManagementPage';
import NewDogPage from './pages/NewDogPage';
import EditDogPage from './pages/EditDogPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import NewCustomerPage from './pages/NewCustomerPage';
import EditCustomerPage from './pages/EditCustomerPage';
import CommunicationTemplatesPage from './pages/CommunicationTemplatesPage';
import NewCommunicationTemplatePage from './pages/NewCommunicationTemplatePage';
import EditCommunicationTemplatePage from './pages/EditCommunicationTemplatePage';
import SendCommunicationsPage from './pages/SendCommunicationsPage';
import ComplianceManagementPage from './pages/ComplianceManagementPage';
import NewComplianceRequirementPage from './pages/NewComplianceRequirementPage';
import EditComplianceRequirementPage from './pages/EditComplianceRequirementPage';
import FinanceDashboardPage from './pages/FinanceDashboardPage';
import FinanceTransactionsPage from './pages/FinanceTransactionsPage';
import FinanceSettingsPage from './pages/FinanceSettingsPage';
import LitterManagementPage from './modules/Reproduction/pages/LitterManagementPage';
import NewLitterPage from './pages/NewLitterPage';
import LitterDetailPage from './pages/LitterDetailPage';
import PuppyDetailPage from './pages/PuppyDetailPage';
import WelpingManagementPage from './modules/Reproduction/pages/WelpingManagementPage';
import WelpingPage from './pages/WelpingPage';
import PuppyTrackingPage from './pages/PuppyTrackingPage';
import PuppyWeightTrackingPage from './pages/PuppyWeightTrackingPage';
import PuppyCareLogPage from './pages/PuppyCareLogPage';
import PuppyPhotosPage from './pages/PuppyPhotosPage';
import BreedingManagementPage from './modules/Reproduction/pages/BreedingManagementPage';
import ReproductiveCyclePage from './modules/Reproduction/pages/ReproductiveCyclePage';
import SettingsPage from './pages/SettingsPage';
import LicenseManagementPage from './pages/LicenseManagementPage';
import NewLicensePage from './pages/NewLicensePage';
import EditLicensePage from './pages/EditLicensePage';
import InspectionManagementPage from './pages/InspectionManagementPage';
import NewInspectionPage from './pages/NewInspectionPage';
import EditInspectionPage from './pages/EditInspectionPage';
import EventManagementPage from './pages/EventManagementPage';
import NewEventPage from './pages/NewEventPage';
import EditEventPage from './pages/EditEventPage';
import WaitlistManagementPage from './pages/WaitlistManagementPage';
import NewWaitlistEntryPage from './pages/NewWaitlistEntryPage';
import EditWaitlistEntryPage from './pages/EditWaitlistEntryPage';

// Import the WhelpingLiveSession component
import WhelpingLiveSession from './modules/Reproduction/components/welping/WhelpingLiveSession';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            
            {/* Dog Management */}
            <Route path="/dogs" element={<DogManagementPage />} />
            <Route path="/dogs/new" element={<NewDogPage />} />
            <Route path="/dogs/:id" element={<DogProfilePage />} />
            <Route path="/dogs/:id/edit" element={<EditDogPage />} />
            
            {/* Customer Management */}
            <Route path="/customers" element={<CustomerManagementPage />} />
            <Route path="/customers/new" element={<NewCustomerPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
            
            {/* Communication Templates */}
            <Route path="/communications/templates" element={<CommunicationTemplatesPage />} />
            <Route path="/communications/templates/new" element={<NewCommunicationTemplatePage />} />
            <Route path="/communications/templates/:id/edit" element={<EditCommunicationTemplatePage />} />
            
            {/* Send Communications */}
            <Route path="/communications/send" element={<SendCommunicationsPage />} />
            
            {/* Compliance Management */}
            <Route path="/compliance" element={<ComplianceManagementPage />} />
            <Route path="/compliance/new" element={<NewComplianceRequirementPage />} />
            <Route path="/compliance/:id/edit" element={<EditComplianceRequirementPage />} />
            
            {/* Finance Management */}
            <Route path="/finance" element={<FinanceDashboardPage />} />
            <Route path="/finance/transactions" element={<FinanceTransactionsPage />} />
            <Route path="/finance/settings" element={<FinanceSettingsPage />} />
            
            {/* Litter Management */}
            <Route path="/litters" element={<LitterManagementPage />} />
            <Route path="/litters/new" element={<NewLitterPage />} />
            <Route path="/litters/:id" element={<LitterDetailPage />} />
            <Route path="/puppies/:id" element={<PuppyDetailPage />} />
            
            {/* Welping Management */}
            <Route path="/reproduction" element={<WelpingManagementPage />} />
            <Route path="/welping/new" element={<WelpingPage />} />
            <Route path="/welping/:id" element={<WelpingPage />} />
            
            {/* Puppy Tracking */}
            <Route path="/puppy-tracking" element={<PuppyTrackingPage />} />
            <Route path="/puppy/:id/weight" element={<PuppyWeightTrackingPage />} />
            <Route path="/puppy/:id/care" element={<PuppyCareLogPage />} />
            <Route path="/puppy/:id/photos" element={<PuppyPhotosPage />} />
            
            {/* Breeding Management */}
            <Route path="/breeding" element={<BreedingManagementPage />} />
            <Route path="/dogs/:dogId/reproductive-cycle" element={<ReproductiveCyclePage />} />
            
            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* License Management */}
            <Route path="/licenses" element={<LicenseManagementPage />} />
            <Route path="/licenses/new" element={<NewLicensePage />} />
            <Route path="/licenses/:id/edit" element={<EditLicensePage />} />
            
            {/* Inspection Management */}
            <Route path="/inspections" element={<InspectionManagementPage />} />
            <Route path="/inspections/new" element={<NewInspectionPage />} />
            <Route path="/inspections/:id/edit" element={<EditInspectionPage />} />
            
            {/* Event Management */}
            <Route path="/events" element={<EventManagementPage />} />
            <Route path="/events/new" element={<NewEventPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
            
            {/* Waitlist Management */}
            <Route path="/waitlist" element={<WaitlistManagementPage />} />
            <Route path="/waitlist/new" element={<NewWaitlistEntryPage />} />
            <Route path="/waitlist/:id/edit" element={<EditWaitlistEntryPage />} />
            
            {/* Add the new live whelping route */}
            <Route path="/welping/:id/live" element={<WhelpingLiveSession />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
