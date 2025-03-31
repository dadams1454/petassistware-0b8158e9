
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { DogGenotype, MultiTraitMatrixProps } from '@/types/genetics';
import { Dna, AlertCircle } from 'lucide-react';

export const MultiTraitMatrix: React.FC<MultiTraitMatrixProps> = ({
  dogId,
  dogGenetics
}) => {
  const [activeTab, setActiveTab] = useState('color');
  const { geneticData, loading, error } = useDogGenetics(dogId);
  
  // Use the passed genetics data or the fetched data
  const dogData = dogGenetics || geneticData;
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Trait Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !dogData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Trait Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error ? error.message : "Could not load genetic data."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Genetic Trait Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="color">Color Genetics</TabsTrigger>
            <TabsTrigger value="health">Health Markers</TabsTrigger>
            <TabsTrigger value="physical">Physical Traits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="color" className="space-y-4">
            <Alert>
              <Dna className="h-4 w-4 mr-2" />
              <AlertDescription>
                {dogData.name}'s color is influenced by multiple genetic factors.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TraitCard 
                  title="Base Color (E Locus)" 
                  genotype={dogData.baseColor} 
                  description={getBaseColorDescription(dogData.baseColor)}
                />
                
                <TraitCard 
                  title="Brown Dilution (B Locus)" 
                  genotype={dogData.brownDilution}
                  description={getBrownDescription(dogData.brownDilution)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TraitCard 
                  title="Dilution (D Locus)" 
                  genotype={dogData.dilution}
                  description={getDilutionDescription(dogData.dilution)}
                />
                
                <TraitCard 
                  title="Agouti (A Locus)" 
                  genotype={dogData.agouti}
                  description={getAgoutiDescription(dogData.agouti)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <Alert>
              <AlertDescription>
                Health genetic markers are important factors in breeding decisions.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {Object.keys(dogData.healthMarkers).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(dogData.healthMarkers).map(([condition, marker]) => (
                    <HealthMarkerCard
                      key={condition}
                      title={condition}
                      status={(marker as any).status}
                      genotype={(marker as any).genotype}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">No health markers recorded.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="physical" className="space-y-4">
            <Alert>
              <AlertDescription>
                Physical traits are influenced by both genetics and environment.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TraitCard 
                title="Size" 
                genotype="Polygenic" 
                description="Size in Newfoundlands is determined by multiple genes and is polygenic."
              />
              
              <TraitCard 
                title="Coat Type" 
                genotype="Standard" 
                description="Newfoundlands typically have a water-resistant double coat."
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface TraitCardProps {
  title: string;
  genotype: string;
  description: string;
}

const TraitCard: React.FC<TraitCardProps> = ({ title, genotype, description }) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <h3 className="font-medium text-sm">{title}</h3>
      <div className="mt-1 font-bold text-lg">{genotype}</div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
};

interface HealthMarkerCardProps {
  title: string;
  status: 'clear' | 'carrier' | 'affected' | 'unknown';
  genotype: string;
}

const HealthMarkerCard: React.FC<HealthMarkerCardProps> = ({ title, status, genotype }) => {
  const getStatusBg = () => {
    switch (status) {
      case 'clear': return 'bg-green-100 text-green-800';
      case 'carrier': return 'bg-yellow-100 text-yellow-800';
      case 'affected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <h3 className="font-medium text-sm">{title}</h3>
      <div className="mt-1">
        <span className={`${getStatusBg()} text-xs font-medium px-2 py-1 rounded-full`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="mt-2 font-mono text-sm">{genotype}</div>
    </div>
  );
};

// Helper functions for trait descriptions

function getBaseColorDescription(genotype: string): string {
  if (genotype.includes('E')) {
    return "E/E or E/e allows expression of black pigment. This dog can produce black-based colors.";
  } else {
    return "e/e prevents expression of black pigment. This dog will only show red-based colors.";
  }
}

function getBrownDescription(genotype: string): string {
  if (genotype === 'B/B' || genotype === 'B/b') {
    return "B/B or B/b allows normal black pigment. No dilution to brown.";
  } else {
    return "b/b causes dilution of black pigment to brown/liver.";
  }
}

function getDilutionDescription(genotype: string): string {
  if (genotype === 'D/D' || genotype === 'D/d') {
    return "D/D or D/d allows full expression of color. No dilution effect.";
  } else {
    return "d/d causes dilution of black to blue/gray and red to cream.";
  }
}

function getAgoutiDescription(genotype: string): string {
  if (genotype === 'a/a') {
    return "a/a produces a solid color without banding on individual hairs.";
  } else if (genotype.includes('w')) {
    return "Contains the 'ay' allele which can produce sable/fawn patterns.";
  } else {
    return "Various agouti patterns that determine distribution of black and red pigment.";
  }
}

export default MultiTraitMatrix;
