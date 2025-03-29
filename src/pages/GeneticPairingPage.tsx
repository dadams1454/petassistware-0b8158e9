
import React, { useState } from 'react';
import { useGeneticPairing } from '@/hooks/useGeneticPairing';
import { GeneticCompatibilityAnalyzer } from '@/components/genetics/GeneticCompatibilityAnalyzer';
import { TraitProbabilityChart } from '@/components/genetics/TraitProbabilityChart';
import { DogSelector } from '@/components/genetics/DogSelector';
import MainLayout from '@/layouts/MainLayout';
import { PageHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

// Define interface for tab options
interface TabOption {
  id: string;
  label: string;
}

const GeneticPairingPage: React.FC = () => {
  const { toast } = useToast();
  
  // State for selected dogs
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('health');
  
  // Define tabs
  const tabs: TabOption[] = [
    { id: 'health', label: 'Health' },
    { id: 'traits', label: 'Traits' },
    { id: 'pedigree', label: 'Pedigree' }
  ];
  
  // Use our custom hook to get genetic pairing data
  const { 
    analysis, 
    loading, 
    sireGenetics, 
    damGenetics
  } = useGeneticPairing(sireId, damId);
  
  // Function to save breeding plan
  const savePairingPlan = async () => {
    try {
      // In a real implementation, this would call an API
      // For now, just show a toast
      toast({
        title: "Breeding Plan Saved",
        description: `Pairing saved for these dogs.`,
      });
    } catch (error) {
      toast({
        title: "Could not save breeding plan",
        description: "An error occurred while saving the breeding plan.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Genetic Pairing Tool"
          subtitle="Analyze genetic compatibility and predict offspring traits"
          backLink="/dogs"
        />
        
        {/* Dog Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sire Selection */}
            <div>
              <DogSelector 
                value={sireId} 
                onChange={setSireId} 
                placeholder="Select Sire..."
                filterSex="male"
                label="Sire (Male)"
              />
            </div>
            
            {/* Dam Selection */}
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
        </div>
        
        {/* Results Section */}
        {sireId && damId ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Analysis Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Genetic Compatibility Analysis
              </h2>
              {sireGenetics && damGenetics && (
                <p className="text-gray-600">
                  Analyzing compatibility between selected dogs
                </p>
              )}
            </div>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="px-4 border-b border-gray-200">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Tab Content */}
              <div className="p-6">
                {/* Health Tab */}
                <TabsContent value="health">
                  <div className="space-y-6">
                    <GeneticCompatibilityAnalyzer
                      sireId={sireId}
                      damId={damId}
                      showHealthWarnings={true}
                    />
                  </div>
                </TabsContent>
                
                {/* Traits Tab */}
                <TabsContent value="traits">
                  <div className="space-y-6">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : (
                      sireGenetics && damGenetics && (
                        <>
                          <TraitProbabilityChart
                            sireGenotype={sireGenetics}
                            damGenotype={damGenetics}
                            traitType="color"
                            title="Offspring Color Probability"
                          />
                          
                          <div className="mt-8">
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
                        </>
                      )
                    )}
                  </div>
                </TabsContent>
                
                {/* Pedigree Tab */}
                <TabsContent value="pedigree">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-700">
                        Pedigree analysis would show the combined ancestry
                        and highlight any common ancestors.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Action Buttons */}
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={savePairingPlan}
                    className="px-6 py-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Save Breeding Plan
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select Both Sire and Dam
            </h3>
            <p className="text-gray-600">
              Choose a sire (male) and dam (female) to analyze genetic compatibility
              and predict offspring traits.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GeneticPairingPage;
