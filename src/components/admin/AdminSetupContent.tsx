
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminSetup } from '@/hooks/useAdminSetup';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from './AdminHeader';
import AdminTabsContent from './AdminTabsContent';
import { AdminErrorAlert, SetupRequiredAlert } from './alerts/AdminAlerts';

const AdminSetupContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    tenantSettings, 
    error, 
    reloadSettings 
  } = useAdminSetup();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewAuditLogs = () => {
    navigate('/audit-logs');
  };

  const handleRetry = () => {
    reloadSettings();
    toast({
      title: 'Refreshing...',
      description: 'Attempting to reload admin settings'
    });
  };

  return (
    <div className="space-y-6 w-full">
      <AdminHeader 
        onViewAuditLogs={handleViewAuditLogs}
        onBackToDashboard={handleBackToDashboard}
      />
      
      <AdminErrorAlert 
        error={error} 
        tenantSettings={tenantSettings} 
        onRetry={handleRetry} 
      />
      
      <SetupRequiredAlert 
        needsSetup={tenantSettings?.needsSetup && !error} 
      />
      
      <AdminTabsContent tenantSettings={tenantSettings} />
    </div>
  );
};

export default AdminSetupContent;
