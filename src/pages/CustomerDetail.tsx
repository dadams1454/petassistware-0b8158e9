
import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/standardized';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Customer Details"
        description="View and manage customer information"
      />
      <div>
        <p>Customer ID: {id}</p>
        {/* Customer details will be implemented here */}
      </div>
    </div>
  );
};

export default CustomerDetailPage;
