
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  getBreedingRecommendationsForDog,
  getSpecificCompatibility,
  BreedingRecommendation
} from '@/services/breedingRecommendationService';
import { useToast } from '@/components/ui/use-toast';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  Dna, 
  HeartPulse, 
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface BreedingRecommendationsProps {
  dogId: string;
  selectedPartnerId?: string;
}

const BreedingRecommendations: React.FC<BreedingRecommendationsProps> = ({
  dogId,
  selectedPartnerId
}) => {
  const [recommendations, setRecommendations] = useState<BreedingRecommendation[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<BreedingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { dog } = useDogDetail(dogId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        if (selectedPartnerId) {
          // Get specific compatibility if a partner is selected
          const result = await getSpecificCompatibility(dogId, selectedPartnerId);
          if (result) {
            setRecommendations([result]);
            setSelectedMatch(result);
          } else {
            setRecommendations([]);
          }
        } else {
          // Get general recommendations
          const results = await getBreedingRecommendationsForDog(dogId);
          setRecommendations(results);
          if (results.length > 0) {
            setSelectedMatch(results[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching breeding recommendations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load breeding recommendations.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (dogId) {
      fetchRecommendations();
    }
  }, [dogId, selectedPartnerId, toast]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dog) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Could not find dog information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Recommendations Available</AlertTitle>
            <AlertDescription>
              {selectedPartnerId 
                ? 'Unable to generate compatibility analysis for this specific pair.'
                : 'No suitable breeding matches found. Try broadening your criteria.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleSelectMatch = (match: BreedingRecommendation) => {
    setSelectedMatch(match);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-green-600';
    if (score >= 70) return 'bg-amber-600';
    return 'bg-red-600';
  };

  const getRiskVariant = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'outline';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendations.length > 1 && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Potential Matches</CardTitle>
              <CardDescription>
                Genetic compatibility ranked by score
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="px-4 pb-4 space-y-2">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedMatch?.id === rec.id 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleSelectMatch(rec)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={rec.dam.photo_url || undefined} alt={rec.dam.name} />
                          <AvatarFallback className="bg-primary/10">
                            {rec.dam.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{rec.dam.name}</h4>
                            <Badge variant="secondary" className="ml-2 shrink-0">
                              {Math.round(rec.compatibility_score)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {rec.dam.breed} • {rec.dam.color || 'Unknown color'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        <Card className={recommendations.length > 1 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {selectedMatch && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-primary" />
                  Genetic Compatibility Analysis
                </CardTitle>
                <CardDescription>
                  Detailed compatibility assessment between {dog.name} and {selectedMatch.dam.id === dog.id ? selectedMatch.sire.name : selectedMatch.dam.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-4 items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={dog.photo_url || undefined} alt={dog.name} />
                      <AvatarFallback className="bg-primary/10 text-lg">
                        {dog.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{dog.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dog.gender === 'male' ? 'Sire' : 'Dam'} • {dog.breed}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage 
                        src={selectedMatch.dam.id === dog.id 
                          ? selectedMatch.sire.photo_url || undefined 
                          : selectedMatch.dam.photo_url || undefined} 
                        alt={selectedMatch.dam.id === dog.id 
                          ? selectedMatch.sire.name 
                          : selectedMatch.dam.name} 
                      />
                      <AvatarFallback className="bg-primary/10 text-lg">
                        {(selectedMatch.dam.id === dog.id 
                          ? selectedMatch.sire.name 
                          : selectedMatch.dam.name).substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedMatch.dam.id === dog.id 
                          ? selectedMatch.sire.name 
                          : selectedMatch.dam.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedMatch.dam.id === dog.id ? 'Sire' : 'Dam'} • {selectedMatch.dam.id === dog.id 
                          ? selectedMatch.sire.breed 
                          : selectedMatch.dam.breed}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/40 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <Dna className="h-4 w-4 text-primary" />
                        Overall Compatibility
                      </h4>
                      <span className={`text-lg font-bold ${getScoreColor(selectedMatch.compatibility_score)}`}>
                        {Math.round(selectedMatch.compatibility_score)}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedMatch.compatibility_score} 
                      className={`h-2 ${getProgressColor(selectedMatch.compatibility_score)}`} 
                    />
                  </div>

                  <div className="p-4 bg-muted/40 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <HeartPulse className="h-4 w-4 text-primary" />
                        Health Score
                      </h4>
                      <span className={`text-lg font-bold ${getScoreColor(selectedMatch.health_score)}`}>
                        {Math.round(selectedMatch.health_score)}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedMatch.health_score} 
                      className={`h-2 ${getProgressColor(selectedMatch.health_score)}`} 
                    />
                  </div>

                  <div className="p-4 bg-muted/40 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Inbreeding Coefficient
                      </h4>
                      <span className="text-lg font-bold">
                        {selectedMatch.coefficient_of_inbreeding.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedMatch.coefficient_of_inbreeding < 5 ? 'Safe range' : 
                        selectedMatch.coefficient_of_inbreeding < 10 ? 'Moderate concern' : 'High risk'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Trait Predictions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedMatch.trait_predictions.map((trait) => (
                        <div key={trait.trait} className="p-3 bg-muted/30 rounded-md">
                          <h4 className="text-xs font-medium mb-1">{trait.trait}</h4>
                          <p className="text-xs">{trait.description}</p>
                          <div className="mt-1 text-xs flex items-center gap-1">
                            <span className="font-medium">{trait.probability}%</span>
                            <span className="text-muted-foreground">likelihood</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Health Risk Assessment</h3>
                    <div className="space-y-2">
                      {selectedMatch.health_risks.map((risk) => (
                        <div key={risk.risk_type} className="flex items-start gap-2">
                          <Badge variant={getRiskVariant(risk.severity)} className="mt-0.5">
                            {risk.severity}
                          </Badge>
                          <div>
                            <h4 className="text-sm font-medium">{risk.risk_type}</h4>
                            <p className="text-xs text-muted-foreground">{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Alert className="bg-primary/10 border-primary/20">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertTitle>Pairing Recommendation</AlertTitle>
                  <AlertDescription>
                    {selectedMatch.compatibility_score >= 85 
                      ? 'This pairing is highly recommended based on genetic compatibility and health scores.'
                      : selectedMatch.compatibility_score >= 70
                      ? 'This pairing is acceptable but monitor for potential health concerns.'
                      : 'This pairing is not recommended due to genetic compatibility concerns.'}
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/welping/new?dam=${selectedMatch.dam.id}&sire=${selectedMatch.sire.id}`)}
                    className="flex items-center gap-1"
                  >
                    <span>Plan Litter</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BreedingRecommendations;
