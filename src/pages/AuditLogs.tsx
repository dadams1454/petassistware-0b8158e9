
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { AuditLogTable, AuditLog } from '@/components/audit/AuditLogTable';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';
import { useAuditLogs, AuditLogFilters as AuditLogFilterType } from '@/hooks/useAuditLogs';
import { AuditLogDetails } from '@/components/audit/AuditLogDetails';
import { useToast } from '@/hooks/use-toast';

const AuditLogs: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilterType>({
    searchTerm: '',
    action: '',
    entity_type: '',
    startDate: undefined,
    endDate: undefined
  });
  
  const { toast } = useToast();
  const { 
    auditLogs, 
    isLoading, 
    page, 
    setPage,
    refetch 
  } = useAuditLogs(filters);

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters({
      searchTerm: newFilters.search,
      action: newFilters.action,
      entity_type: newFilters.entityType,
      startDate: newFilters.dateRange[0] || undefined,
      endDate: newFilters.dateRange[1] || undefined
    });
    setPage(1); // Reset to first page when filters change
  };

  useEffect(() => {
    // Refresh data when component mounts
    refetch().catch(error => {
      toast({
        title: "Error loading audit logs",
        description: error.message,
        variant: "destructive"
      });
    });
  }, [refetch, toast]);

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Audit Logs"
          subtitle="View system activity and changes"
          className="mb-6"
        />
        
        <div className="space-y-4">
          <AuditLogFilters 
            filters={{
              search: filters.searchTerm || '',
              action: filters.action || '',
              entityType: filters.entity_type || '',
              dateRange: [
                filters.startDate ? new Date(filters.startDate) : null,
                filters.endDate ? new Date(filters.endDate) : null
              ]
            }}
            onFiltersChange={handleFiltersChange}
          />
          <AuditLogTable 
            logs={auditLogs}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      <AuditLogDetails 
        log={selectedLog}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </PageContainer>
  );
};

export default AuditLogs;
