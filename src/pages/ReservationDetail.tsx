
import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/standardized';

const ReservationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reservation Details"
        description="View and manage reservation information"
      />
      <div>
        <p>Reservation ID: {id}</p>
        {/* Reservation details will be implemented here */}
      </div>
    </div>
  );
};

export default ReservationDetailPage;
