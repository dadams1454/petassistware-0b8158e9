
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/common/PageContainer';

const AdminLoadingState: React.FC = () => {
  return (
    <PageContainer>
      <Card className="mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center py-10">
            <p>Loading admin settings...</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default AdminLoadingState;
