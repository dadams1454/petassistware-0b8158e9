
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { AuditLogTable, AuditLog } from '@/components/audit/AuditLogTable';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    entityType: '',
    dateRange: [null, null] as [Date | null, Date | null]
  });

  const handleViewDetails = (log: AuditLog) => {
    console.log('View details for log:', log);
  };

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
            filters={filters}
            onFiltersChange={setFilters}
          />
          <AuditLogTable 
            logs={logs}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default AuditLogs;
