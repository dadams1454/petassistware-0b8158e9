
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dna, AlertCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import InteractivePedigree from '@/components/genetics/components/InteractivePedigree';
import DogGenotypeCard from '@/components/genetics/DogGenotypeCard';
import { SectionHeader, LoadingState, ErrorState } from '@/components/ui/standardized';

export interface GeneticAnalysisTabProps {
  dogId: string;
  currentDog: any;
}

const GeneticAnalysisTab: React.FC<GeneticAnalysisTabProps> = ({ dogId, currentDog }) => {
  const { toast } = useToast();
  
  // Fetch COI (Coefficient of Inbreeding) data
  const { data: coiData, isLoading: coiLoading } = useQuery({
    queryKey: ['dog-coi', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_genetic_calculations')
        .select('*')
        .eq('dog_id', dogId)
        .eq('calculation_type', 'COI')
        .order('calculation_date', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0] || null;
    },
  });

  // Calculate COI alert level
  const getCoiAlertLevel = (coi: number) => {
    if (coi < 5) return { level: 'low', color: 'text-green-600' };
    if (coi < 10) return { level: 'moderate', color: 'text-yellow-600' };
    if (coi < 20) return { level: 'high', color: 'text-orange-600' };
    return { level: 'very high', color: 'text-red-600' };
  };

  // Handle sharing genetic profile
  const handleShareGeneticProfile = () => {
    // In a real app, this would generate a shareable link
    toast({
      title: "Share link generated",
      description: "A shareable link to this genetic profile has been copied to clipboard."
    });
  };

  const coiValue = coiData?.value || null;
  const coiAlert = coiValue ? getCoiAlertLevel(coiValue) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <SectionHeader
          title="Genetic Analysis"
          description="Explore genetic information, pedigree, and health markers"
        />
        <Button variant="outline" size="sm" onClick={handleShareGeneticProfile}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </div>

      <Tabs defaultValue="pedigree">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
          <TabsTrigger value="genetic-profile">Genetic Profile</TabsTrigger>
          <TabsTrigger value="breeding-analysis">Breeding Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pedigree" className="space-y-4 pt-4">
          <InteractivePedigree dogId={dogId} currentDog={currentDog} generations={3} />
          
          {coiData && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Coefficient of Inbreeding (COI)</CardTitle>
                <CardDescription>
                  A measure of genetic relatedness in the dog's ancestry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-3 flex items-baseline">
                    {coiValue?.toFixed(2)}%
                    <span className="text-sm font-normal text-muted-foreground ml-1">COI</span>
                  </div>
                  <Alert className="flex-1 ml-4">
                    <Dna className="h-4 w-4 mr-2" />
                    <AlertDescription className="flex flex-col">
                      <span>This dog has a <span className={coiAlert?.color}>{coiAlert?.level}</span> coefficient of inbreeding.</span>
                      <span className="text-xs text-muted-foreground">
                        {coiValue < 5 ? 
                          "Low COI indicates diverse ancestry with minimal genetic health risks." : 
                          coiValue < 10 ? 
                            "Moderate COI indicates some relatedness in the ancestry." : 
                            "Higher COI values indicate potential risks from inbreeding."
                        }
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="genetic-profile" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <DogGenotypeCard dogId={dogId} showHealthTests={true} showColorTraits={true} />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Dna className="h-5 w-5 mr-2" />
                  Health Markers
                </CardTitle>
                <CardDescription>
                  Genetic health screening results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Always consult with a veterinary specialist before making breeding decisions based on genetic data.
                    </AlertDescription>
                  </Alert>
                  <Separator />
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      These genetic health markers represent known genetic mutations that can influence health. 
                      For a comprehensive health profile, combine this data with regular veterinary examinations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breeding-analysis" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Compatibility</CardTitle>
              <CardDescription>
                Analysis tools to evaluate potential breeding pairs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="default" className="bg-muted">
                <AlertDescription>
                  Select another dog to analyze genetic compatibility for breeding.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneticAnalysisTab;
