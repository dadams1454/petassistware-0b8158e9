
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { DogGenotypeCard } from '@/components/genetics/DogGenotypeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Edit, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface GeneticsTabProps {
  dogId: string;
  dogName?: string;
}

const GeneticsTab: React.FC<GeneticsTabProps> = ({ dogId, dogName }) => {
  const navigate = useNavigate();
  const { geneticData, loading, error } = useDogGenetics(dogId);
  
  const navigateToPairingTool = () => {
    navigate('/genetics/pairing');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <DogGenotypeCard dogId={dogId} showHealthTests showColorTraits />
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Genetic Tests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : error || !geneticData ? (
                <div className="text-center p-4">
                  <AlertCircle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <p className="text-sm text-gray-600">No genetic tests recorded for this dog.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Test Results
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {geneticData.testResults.map((test, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{test.testType}</div>
                          <div className="text-sm text-gray-500">
                            {test.labName} • {new Date(test.testDate).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="outline">{test.result.split(' ')[0]}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Test Results
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Breeding Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Analyze genetic compatibility with potential mates to predict offspring traits
              and assess health risks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={navigateToPairingTool}>
                Find Compatible Matches
              </Button>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Genetic Information
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneticsTab;
