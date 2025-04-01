
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dna, AlertTriangle, Check, X, ChevronRight, Star } from 'lucide-react';
import { getBreedingCompatibility, getSuggestedBreedingPartners } from '@/services/breedingRecommendationService';
import { HealthWarningCard } from './HealthWarningCard';
import { PairingAnalysis } from '@/types/genetics';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import { useToast } from '@/hooks/use-toast';

interface BreedingRecommendationsProps {
  dogId: string;
  selectedPartnerId?: string;
}

export const BreedingRecommendations: React.FC<BreedingRecommendationsProps> = ({ 
  dogId, 
  selectedPartnerId 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { dog, isLoading: dogLoading } = useDogDetail(dogId);
  const [loading, setLoading] = useState(true);
  const [compatibility, setCompatibility] = useState<PairingAnalysis | null>(null);
  const [suggestedPartners, setSuggestedPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(!selectedPartnerId);
  
  // Fetch partner details if provided
  const { dog: partnerDog, isLoading: partnerLoading } = useDogDetail(selectedPartnerId || '');
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!dog?.gender) return;
      
      setLoading(true);
      
      try {
        // Load suggested partners if no specific partner is selected
        if (!selectedPartnerId) {
          const partners = await getSuggestedBreedingPartners(dogId, dog.gender, 5);
          setSuggestedPartners(partners);
        } 
        // Load compatibility analysis for selected partner
        else if (selectedPartnerId && dog) {
          const sireId = dog.gender?.toLowerCase() === 'male' ? dogId : selectedPartnerId;
          const damId = dog.gender?.toLowerCase() === 'male' ? selectedPartnerId : dogId;
          
          const analysis = await getBreedingCompatibility(sireId, damId);
          setCompatibility(analysis);
          setSelectedPartner(partnerDog);
        }
      } catch (error) {
        console.error('Error loading breeding recommendations:', error);
        toast({
          title: 'Failed to load breeding data',
          description: 'There was an error loading the breeding recommendations.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (!dogLoading && dog) {
      loadData();
    }
  }, [dogId, selectedPartnerId, dog, dogLoading, partnerDog]);
  
  // Handle partner selection
  const handleSelectPartner = async (partnerId: string) => {
    if (!dog?.gender) return;
    
    setLoading(true);
    try {
      const sireId = dog.gender?.toLowerCase() === 'male' ? dogId : partnerId;
      const damId = dog.gender?.toLowerCase() === 'male' ? partnerId : dogId;
      
      const analysis = await getBreedingCompatibility(sireId, damId);
      setCompatibility(analysis);
      setSelectedPartner(suggestedPartners.find(p => p.dogId === partnerId));
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error loading compatibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze compatibility',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate a compatibility score (0-100)
  const getCompatibilityScore = (analysis: PairingAnalysis): number => {
    if (!analysis) return 0;
    
    // Start with perfect score
    let score = 100;
    
    // Deduct for health warnings
    analysis.healthWarnings.forEach(warning => {
      switch (warning.riskLevel) {
        case 'critical': score -= 30; break;
        case 'high': score -= 20; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });
    
    // Deduct for high COI
    if (analysis.coi > 12.5) score -= 20;
    else if (analysis.coi > 6.25) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };
  
  // Get color class based on score
  const getScoreColorClass = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Get badge for score
  const getScoreBadge = (score: number) => {
    let variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' = 'outline';
    let label = 'Unknown';
    
    if (score >= 90) {
      variant = 'success';
      label = 'Excellent';
    } else if (score >= 70) {
      variant = 'secondary';
      label = 'Good';
    } else if (score >= 50) {
      variant = 'outline';
      label = 'Fair';
    } else if (score >= 30) {
      variant = 'outline';
      label = 'Poor';
    } else {
      variant = 'destructive';
      label = 'Not Recommended';
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  // View full pairing analysis
  const viewFullPairingAnalysis = () => {
    if (!selectedPartner?.dogId) return;
    
    navigate(`/genetics/pairing?sireId=${dog?.gender?.toLowerCase() === 'male' ? dogId : selectedPartner.dogId}&damId=${dog?.gender?.toLowerCase() === 'male' ? selectedPartner.dogId : dogId}`);
  };
  
  if (dogLoading || (selectedPartnerId && partnerLoading)) {
    return <BreedingRecommendationsLoading />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-lg font-bold">Breeding Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            {dog?.name}'s genetic compatibility analysis for breeding
          </p>
        </div>
        
        {!showSuggestions && selectedPartner && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSuggestions(true)}
          >
            View Other Suggestions
          </Button>
        )}
      </div>
      
      {loading ? (
        <BreedingRecommendationsLoading />
      ) : showSuggestions ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Suggested Breeding Partners</CardTitle>
            <CardDescription>
              Based on genetic compatibility and health screening
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {suggestedPartners.length > 0 ? (
              <div className="space-y-3">
                {suggestedPartners.map((partner) => (
                  <div 
                    key={partner.dogId}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectPartner(partner.dogId)}
                  >
                    <div className="flex items-center gap-3">
                      {partner.photoUrl ? (
                        <img 
                          src={partner.photoUrl} 
                          alt={partner.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Dna className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-muted-foreground">
                          COI: {partner.coi.toFixed(1)}% • {partner.majorHealthIssues === 0 ? 
                            'No major health issues' : 
                            `${partner.majorHealthIssues} health ${partner.majorHealthIssues === 1 ? 'issue' : 'issues'}`
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-lg font-bold ${getScoreColorClass(partner.compatibility)}`}>
                        {partner.compatibility}%
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertTitle>No recommended partners found</AlertTitle>
                <AlertDescription>
                  No suitable breeding partners with genetic data were found. Add more dogs to your database or update their genetic profiles.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : compatibility && selectedPartner ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Breeding Compatibility Analysis</CardTitle>
                  <CardDescription>
                    {dog?.name} × {selectedPartner.name || 'Selected Partner'}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold">
                    <span className={getScoreColorClass(getCompatibilityScore(compatibility))}>
                      {getCompatibilityScore(compatibility)}%
                    </span>
                  </div>
                  <div>
                    {getScoreBadge(getCompatibilityScore(compatibility))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 space-y-4">
              {/* COI Section */}
              <div>
                <h4 className="text-sm font-medium mb-2">Coefficient of Inbreeding (COI)</h4>
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${compatibility.coi < 6.25 ? 'bg-green-500' : compatibility.coi < 12.5 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (compatibility.coi * 4))}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {compatibility.coi.toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {compatibility.coi < 6.25 
                    ? 'Healthy level of genetic diversity' 
                    : compatibility.coi < 12.5 
                      ? 'Moderate inbreeding - some caution advised' 
                      : 'High inbreeding - not recommended'}
                </p>
              </div>
              
              {/* Health Warning Summary */}
              <div>
                <h4 className="text-sm font-medium mb-2">Health Compatibility</h4>
                
                {compatibility.healthWarnings.length > 0 ? (
                  <div className="space-y-2">
                    {compatibility.healthWarnings
                      .sort((a, b) => {
                        const levels = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
                        return levels[b.riskLevel] - levels[a.riskLevel];
                      })
                      .slice(0, 3) // Show only top 3 risks
                      .map((warning, index) => (
                        <HealthWarningCard key={index} warning={warning} />
                      ))}
                    
                    {compatibility.healthWarnings.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{compatibility.healthWarnings.length - 3} more health considerations
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    No genetic health concerns detected
                  </div>
                )}
              </div>
              
              {/* Trait Summary */}
              <div>
                <h4 className="text-sm font-medium mb-2">Offspring Trait Predictions</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted rounded-md">
                    <span className="block text-xs text-muted-foreground mb-1">Coat Color</span>
                    {Object.entries(compatibility.traitPredictions.color)
                      .map(([color, percentage]) => (
                        <div key={color} className="flex justify-between">
                          <span>{color}</span>
                          <span>{percentage}%</span>
                        </div>
                      ))}
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="block text-xs text-muted-foreground mb-1">Size Range</span>
                    <div>Males: {compatibility.traitPredictions.size.males}</div>
                    <div>Females: {compatibility.traitPredictions.size.females}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full" 
                onClick={viewFullPairingAnalysis}
              >
                View Full Genetic Analysis
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recommendation Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Breeding Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getCompatibilityScore(compatibility) >= 70 ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <p className="font-medium">Recommended Pairing</p>
                    <p className="text-sm">This breeding pair has good genetic compatibility with minimal health concerns.</p>
                  </AlertDescription>
                </Alert>
              ) : getCompatibilityScore(compatibility) >= 50 ? (
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    <p className="font-medium">Proceed with Caution</p>
                    <p className="text-sm">This breeding pair has moderate compatibility. Review health concerns before proceeding.</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <X className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">Not Recommended</p>
                    <p className="text-sm">This breeding pair has significant genetic health risks. Consider alternative pairings.</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

// Loading state component
const BreedingRecommendationsLoading: React.FC = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-8 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default BreedingRecommendations;
