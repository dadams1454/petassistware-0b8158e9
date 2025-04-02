
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';

const AuditLogs: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Audit Logs"
          subtitle="View system activity and changes"
          className="mb-6"
        />
        
        <div className="space-y-4">
          <AuditLogFilters />
          <AuditLogTable />
        </div>
      </div>
    </PageContainer>
  );
};

export default AuditLogs;
