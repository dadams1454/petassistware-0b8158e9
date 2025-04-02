
import React from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import WelpingDashboard from '@/components/puppies/dashboard/WelpingDashboard';

const Whelping: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <WelpingDashboard litterId={id} />
      </div>
    </PageContainer>
  );
};

export default Whelping;
