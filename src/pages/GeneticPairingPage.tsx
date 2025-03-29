
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DogSelector } from '@/components/genetics/DogSelector';
import { GeneticCompatibilityAnalyzer } from '@/components/genetics/GeneticCompatibilityAnalyzer';
import { TraitProbabilityChart } from '@/components/genetics/TraitProbabilityChart';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DogProfile } from '@/types/dog';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';

const GeneticPairingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('health');
  
  // Fetch dog details if provided in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlSireId = urlParams.get('sireId');
  const urlDamId = urlParams.get('damId');
  
  // Set initial values from URL if available
  React.useEffect(() => {
    if (urlSireId) setSireId(urlSireId);
    if (urlDamId) setDamId(urlDamId);
  }, [urlSireId, urlDamId]);
  
  // Fetch genetic data for the selected dogs
  const { geneticData: sireGenetics, loading: sireLoading } = useDogGenetics(sireId);
  const { geneticData: damGenetics, loading: damLoading } = useDogGenetics(damId);
  
  // Fetch dog profile details
  const { dog: sireDetails } = useDogDetail(sireId);
  const { dog: damDetails } = useDogDetail(damId);
  
  // Save breeding plan
  const savePairingPlan = () => {
    toast({
      title: "Breeding Plan Saved",
      description: `Breeding plan for ${sireDetails?.name || 'Unknown'} × ${damDetails?.name || 'Unknown'} has been saved.`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Genetic Pairing Tool</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Dogs to Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DogSelector
                value={sireId}
                onChange={setSireId}
                placeholder="Select Sire..."
                filterSex="male"
                label="Sire (Male)"
              />
            </div>
            
            <div>
              <DogSelector
                value={damId}
                onChange={setDamId}
                placeholder="Select Dam..."
                filterSex="female"
                label="Dam (Female)"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {sireId && damId ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Genetic Compatibility Analysis
                {sireDetails && damDetails && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {sireDetails.name} × {damDetails.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="health" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="traits">Traits</TabsTrigger>
                  <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
                </TabsList>
                
                <TabsContent value="health">
                  <GeneticCompatibilityAnalyzer
                    sireId={sireId}
                    damId={damId}
                    showHealthWarnings={true}
                  />
                </TabsContent>
                
                <TabsContent value="traits">
                  {sireLoading || damLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-64 bg-gray-200 rounded-md"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                    </div>
                  ) : sireGenetics && damGenetics ? (
                    <div className="space-y-6">
                      <TraitProbabilityChart
                        sireGenotype={sireGenetics}
                        damGenotype={damGenetics}
                        traitType="color"
                        title="Offspring Color Probability"
                      />
                      
                      <div>
                        <h3 className="text-lg font-bold mb-4">Other Trait Predictions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-md font-semibold mb-2">Size Estimate</h4>
                            <p className="text-gray-700">Males: 145-160 lbs</p>
                            <p className="text-gray-700">Females: 115-130 lbs</p>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-md font-semibold mb-2">Coat Type</h4>
                            <p className="text-gray-700">Straight coat, standard length</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      Unable to load genetic data for one or both dogs.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pedigree">
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-700">
                      Pedigree analysis would show the combined ancestry
                      and highlight any common ancestors.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex justify-center">
                <Button onClick={savePairingPlan}>
                  Save Breeding Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center p-12">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">
              Select Both Sire and Dam
            </h3>
            <p className="text-gray-500 mb-4">
              Choose a sire (male) and dam (female) to analyze genetic compatibility
              and predict offspring traits.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneticPairingPage;
