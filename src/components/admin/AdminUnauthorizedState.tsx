
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';

interface AdminUnauthorizedStateProps {
  type: 'unauthenticated' | 'unauthorized';
}

const AdminUnauthorizedState: React.FC<AdminUnauthorizedStateProps> = ({ type }) => {
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleNavigateToAuth = () => {
    navigate('/auth');
  };
  
  if (type === 'unauthenticated') {
    return (
      <PageContainer>
        <Card className="mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center py-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="mb-4">You need to be logged in to access admin settings.</p>
              <Button onClick={handleNavigateToAuth}>Login</Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Card className="mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center py-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
            <p>You don't have permission to access admin settings.</p>
            <Button onClick={handleBackToDashboard} className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default AdminUnauthorizedState;
