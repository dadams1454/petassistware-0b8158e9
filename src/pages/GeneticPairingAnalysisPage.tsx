
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageContainer from '@/components/common/PageContainer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import DogSelector from '@/components/genetics/DogSelector';
import { Beaker, ArrowRight } from 'lucide-react';

const GeneticPairingAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');

  const handleAnalyze = () => {
    if (sireId && damId) {
      navigate(`/breeding/genetic-analysis?sireId=${sireId}&damId=${damId}`);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Genetic Pairing Analysis</h1>
          <p className="text-muted-foreground">
            Analyze genetic compatibility between potential breeding pairs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Dogs for Analysis</CardTitle>
            <CardDescription>
              Choose a sire and dam to analyze their genetic compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Sire (Male)</label>
                <DogSelector
                  value={sireId}
                  onChange={setSireId}
                  placeholder="Select sire"
                  genderFilter="Male"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dam (Female)</label>
                <DogSelector
                  value={damId}
                  onChange={setDamId}
                  placeholder="Select dam"
                  genderFilter="Female"
                />
              </div>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={!sireId || !damId}
              className="w-full"
            >
              <Beaker className="mr-2 h-4 w-4" />
              Analyze Genetic Compatibility
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default GeneticPairingAnalysisPage;
