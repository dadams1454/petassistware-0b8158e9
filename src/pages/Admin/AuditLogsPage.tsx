
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';

const AuditLogsPage = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Audit Logs"
          subtitle="Track system activities and changes" 
        />
        
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <p className="text-center text-gray-500">Audit logs feature is coming soon.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default AuditLogsPage;
