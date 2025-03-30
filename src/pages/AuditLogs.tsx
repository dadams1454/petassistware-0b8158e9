
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, UnauthorizedState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import { 
  AuditLogEntry, 
  AuditLogFilters, 
  useAuditLogs, 
  useAuditLogTypes 
} from '@/hooks/useAuditLogs';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { AuditLogFiltersComponent } from '@/components/audit/AuditLogFilters';
import { AuditLogDetails } from '@/components/audit/AuditLogDetails';
import { Download, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AuditLogs: React.FC = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  
  const { auditLogs, isLoading, page, setPage, refetch } = useAuditLogs(filters);
  const { entityTypes, actionTypes } = useAuditLogTypes();

  const resetFilters = () => {
    setFilters({});
  };

  const viewLogDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const exportAuditLogs = () => {
    try {
      const dataStr = JSON.stringify(auditLogs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Audit logs exported',
        description: `Exported ${auditLogs.length} audit logs to ${exportFileDefaultName}`,
      });
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting audit logs',
        variant: 'destructive',
      });
    }
  };

  // Check permissions - only admins should be able to view audit logs
  const isAdmin = userRole === 'admin' || userRole === 'owner';
  
  if (!isAdmin) {
    return (
      <PageContainer>
        <UnauthorizedState 
          title="Access Denied" 
          description="Only administrators can access audit logs"
          backPath="/dashboard"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <PageHeader
            title="Audit Logs"
            subtitle="View a comprehensive history of all system changes"
            backLink="/dashboard"
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={exportAuditLogs}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <AuditLogFiltersComponent
          filters={filters}
          setFilters={setFilters}
          entityTypes={entityTypes}
          actionTypes={actionTypes}
          onResetFilters={resetFilters}
        />
        
        <AuditLogTable
          logs={auditLogs}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          onViewDetails={viewLogDetails}
        />
        
        <AuditLogDetails
          log={selectedLog}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </PageContainer>
  );
};

export default AuditLogs;
