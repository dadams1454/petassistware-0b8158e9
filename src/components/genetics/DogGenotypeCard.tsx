
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogGenotype, CompactGenotypeViewProps, HealthMarkersPanelProps } from '@/types/genetics';
import { getHealthSummaryData, formatConditionName } from './utils/healthUtils';
import { Dna, FileBadge, ExternalLink } from 'lucide-react';
import { useDogGenetics } from '@/hooks/useDogGenetics';

interface DogGenotypeCardProps {
  dogId: string;
  showHealthTests?: boolean;
  showColorTraits?: boolean;
}

export const DogGenotypeCard: React.FC<DogGenotypeCardProps> = ({
  dogId,
  showHealthTests = true,
  showColorTraits = true
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { geneticData, loading, error } = useDogGenetics(dogId);
  
  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Dna className="h-5 w-5 mr-2" /> Genetic Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <CompactGenotypeView 
              dogData={geneticData} 
              showColorTraits={showColorTraits} 
              showHealthTests={showHealthTests} 
            />
            
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/genetics/detail/${dogId}`)}
              >
                Full Genetic Profile <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <HealthMarkersPanel dogData={geneticData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({ 
  dogData, 
  showColorTraits = true,
  showHealthTests = true
}) => {
  if (!dogData) {
    return <div className="text-sm text-muted-foreground">No genetic data available</div>;
  }
  
  const healthSummary = getHealthSummaryData(dogData.healthMarkers);
  
  return (
    <div className="space-y-4">
      {showColorTraits && (
        <div>
          <h4 className="text-sm font-medium mb-2">Coat Color Genotype</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md bg-muted p-2 flex justify-between">
              <span className="text-muted-foreground">Base Color:</span>
              <span className="font-medium">{dogData.baseColor}</span>
            </div>
            <div className="rounded-md bg-muted p-2 flex justify-between">
              <span className="text-muted-foreground">Brown:</span>
              <span className="font-medium">{dogData.brownDilution}</span>
            </div>
            <div className="rounded-md bg-muted p-2 flex justify-between">
              <span className="text-muted-foreground">Dilution:</span>
              <span className="font-medium">{dogData.dilution}</span>
            </div>
            <div className="rounded-md bg-muted p-2 flex justify-between">
              <span className="text-muted-foreground">Agouti:</span>
              <span className="font-medium">{dogData.agouti}</span>
            </div>
          </div>
        </div>
      )}
      
      {showHealthTests && healthSummary.hasTests && (
        <div>
          <h4 className="text-sm font-medium mb-2">Health Tests</h4>
          
          {healthSummary.affected.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="health-marker-icon health-marker-affected"></span>
                <span className="text-xs font-semibold">Affected by:</span>
              </div>
              <ul className="pl-5 text-sm list-disc">
                {healthSummary.affected.map((condition, i) => (
                  <li key={i} className="text-xs">{condition}</li>
                ))}
              </ul>
            </div>
          )}
          
          {healthSummary.carriers.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="health-marker-icon health-marker-carrier"></span>
                <span className="text-xs font-semibold">Carrier for:</span>
              </div>
              <ul className="pl-5 text-sm list-disc">
                {healthSummary.carriers.map((condition, i) => (
                  <li key={i} className="text-xs">{condition}</li>
                ))}
              </ul>
            </div>
          )}
          
          {healthSummary.clear.length > 0 && (
            <div>
              <div className="flex items-center mb-1">
                <span className="health-marker-icon health-marker-clear"></span>
                <span className="text-xs font-semibold">Clear for:</span>
              </div>
              <ul className="pl-5 text-sm list-disc">
                {healthSummary.clear.map((condition, i) => (
                  <li key={i} className="text-xs">{condition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {showHealthTests && !healthSummary.hasTests && (
        <div className="text-sm text-muted-foreground">
          No health test data available
        </div>
      )}
    </div>
  );
};

const HealthMarkersPanel: React.FC<HealthMarkersPanelProps> = ({ dogData }) => {
  if (!dogData || Object.keys(dogData.healthMarkers).length === 0) {
    return (
      <div className="text-center p-4">
        <FileBadge className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No health markers found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {Object.entries(dogData.healthMarkers).map(([condition, marker]) => (
        <div 
          key={condition} 
          className="border p-3 rounded-md bg-background flex flex-col"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">
              {formatConditionName(condition)}
            </span>
            <div className="flex items-center">
              <span className={`health-marker-icon health-marker-${marker.status}`}></span>
              <span 
                className={`text-xs font-medium ml-1 ${
                  marker.status === 'clear' ? 'text-green-600' :
                  marker.status === 'carrier' ? 'text-yellow-600' : 
                  marker.status === 'affected' ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {marker.status}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Genotype: {marker.genotype}</span>
            {marker.testDate && <span>Tested: {new Date(marker.testDate).toLocaleDateString()}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DogGenotypeCard;
