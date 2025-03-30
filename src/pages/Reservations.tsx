
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { ReservationList } from '@/components/reservations/ReservationList';
import { ReservationDetails } from '@/components/reservations/ReservationDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const handleViewReservation = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
  };
  
  const handleCreateReservation = () => {
    // Navigate to create reservation page or open a modal
    console.log('Create reservation');
  };
  
  const handleBackToList = () => {
    navigate('/reservations');
  };
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        {id ? (
          <>
            <div className="mb-6">
              <Button variant="outline" onClick={handleBackToList} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reservations
              </Button>
              <PageHeader
                title="Reservation Details"
                subtitle="View and manage reservation details"
              />
            </div>
            <ReservationDetails reservationId={id} />
          </>
        ) : (
          <>
            <PageHeader
              title="Reservations"
              subtitle="Manage puppy reservations and deposits"
              className="mb-6"
            />
            <ReservationList
              onViewReservation={handleViewReservation}
              onCreateReservation={handleCreateReservation}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default ReservationsPage;
