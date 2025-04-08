
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/ui/standardized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const GeneticPairingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to the new fixed page
  useEffect(() => {
    navigate('/reproduction/breeding/pairing-analysis');
  }, [navigate]);
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader
          title="Genetic Pairing Analysis"
          description="Redirecting to the genetic pairing analysis tool..."
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Redirecting</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default GeneticPairingPage;
