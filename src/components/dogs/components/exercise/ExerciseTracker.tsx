import React, { useState } from 'react';
import { useExerciseTracking } from '@/hooks/useExerciseTracking';
import { getExerciseRecommendations } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Plus, Activity, AlertTriangle, ArrowUpRight, Info } from 'lucide-react';
import ExerciseForm from './ExerciseForm';
import ExerciseHistory from './ExerciseHistory';
import { differenceInYears } from 'date-fns';

interface ExerciseTrackerProps {
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogBirthdate?: Date;
  dogWeight?: number;
  healthConditions?: string[];
}

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  dogId,
  dogName,
  dogBreed,
  dogBirthdate,
  dogWeight = 0,
  healthConditions = []
}) => {
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const {
    exerciseHistory,
    summary,
    isLoading,
    isSubmitting,
    loadExerciseHistory,
    addExercise
  } = useExerciseTracking(dogId);
  
  // Calculate dog's age in years
  const dogAge = dogBirthdate ? differenceInYears(new Date(), new Date(dogBirthdate)) : 3;
  
  // Get exercise recommendations
  const recommendations = getExerciseRecommendations(
    dogBreed,
    dogAge,
    dogWeight,
    healthConditions
  );
  
  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    const success = await addExercise(data);
    if (success) {
      setIsAddingExercise(false);
      return true;
    }
    return false;
  };
  
  // Handle filter change
  const handleFilterChange = (days: number) => {
    loadExerciseHistory(days);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Exercise Tracker
          </h2>
          <p className="text-muted-foreground">
            Track and monitor {dogName}'s exercise activities
          </p>
        </div>
        
        <Button onClick={() => setIsAddingExercise(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Log Exercise
        </Button>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Exercise History</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Exercise</CardTitle>
                <CardDescription>
                  {dogName}'s latest activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : exerciseHistory.length > 0 ? (
                  <div className="space-y-4">
                    {exerciseHistory.slice(0, 3).map((exercise) => (
                      <div key={exercise.id} className="flex justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{exercise.exercise_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exercise.timestamp).toLocaleDateString()} - {exercise.duration} min
                          </p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {exercise.intensity}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {exerciseHistory.length > 3 && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => setActiveTab('history')}
                      >
                        View all activities
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No exercise records yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setIsAddingExercise(true)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add First Exercise
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Exercise Recommendations</CardTitle>
                <CardDescription>
                  Based on {dogName}'s breed, age, and health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recommended Daily Exercise</p>
                    <p className="text-2xl font-bold">{recommendations.dailyMinutes} minutes</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Suggested Activities</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {recommendations.recommendedTypes.map((type) => (
                        <span 
                          key={type}
                          className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {recommendations.warnings.length > 0 && (
                    <Alert variant="warning">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Exercise Cautions</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-4 space-y-1 mt-2">
                          {recommendations.warnings.map((warning, index) => (
                            <li key={index} className="text-sm">{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setActiveTab('recommendations')}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    View Full Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {summary && summary.totalDuration > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exercise Summary</CardTitle>
                <CardDescription>
                  Activity overview for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                    <p className="text-2xl font-bold">{summary.totalDuration} minutes</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Exercise Sessions</p>
                    <p className="text-2xl font-bold">{summary.exerciseCount}</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Average Session</p>
                    <p className="text-2xl font-bold">{Math.round(summary.averageDuration)} minutes</p>
                  </div>
                </div>
                
                <Button 
                  variant="link" 
                  className="mt-4 p-0 h-auto" 
                  onClick={() => setActiveTab('history')}
                >
                  View detailed analytics
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <ExerciseHistory 
            exercises={exerciseHistory}
            summary={summary}
            isLoading={isLoading}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Recommendations for {dogName}</CardTitle>
              <CardDescription>
                Personalized exercise plan based on breed, age, and health
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Daily Exercise Goals</h3>
                <p className="text-muted-foreground">
                  {dogName} should get around <strong>{recommendations.dailyMinutes} minutes</strong> of exercise daily, 
                  with a maximum intensity level of <strong>{recommendations.maxIntensity}</strong>.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Recommended Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {recommendations.recommendedTypes.map((type) => (
                    <div key={type} className="border rounded-lg p-4">
                      <h4 className="font-medium">{type}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getActivityDescription(type, dogBreed)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {recommendations.warnings.length > 0 && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                      Important Health Considerations
                    </h3>
                    <ul className="space-y-2 mt-2">
                      {recommendations.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Breed-Specific Notes</h3>
                <p className="text-muted-foreground mt-2">
                  {getBreedNotes(dogBreed)}
                </p>
              </div>
              
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Exercise Safety</AlertTitle>
                <AlertDescription>
                  Always monitor your dog during exercise for signs of fatigue or distress. 
                  Adjust intensity and duration based on their response and the weather conditions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddingExercise} onOpenChange={setIsAddingExercise}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log Exercise for {dogName}</DialogTitle>
          </DialogHeader>
          <ExerciseForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsAddingExercise(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get activity descriptions
function getActivityDescription(activity: string, breed: string): string {
  const descriptions: Record<string, string> = {
    "Walk": "Regular leashed walks provide mental stimulation and moderate physical exercise.",
    "Run": "Running provides high-intensity exercise, great for high-energy dogs.",
    "Play Fetch": "Great for mental stimulation and physical exercise without requiring too much space.",
    "Swimming": "Low-impact exercise that's excellent for joint health and full-body conditioning.",
    "Agility Training": "Combines mental and physical exercise while building confidence and coordination.",
    "Treadmill": "Controlled exercise environment, especially useful during extreme weather.",
    "Frisbee": "High-energy activity that develops coordination and provides intense exercise.",
    "Hiking": "Combines exercise with new scents and environments for mental stimulation.",
    "Play with Other Dogs": "Social interaction combined with natural play-based exercise.",
    "Training Session": "Mental stimulation that can include physical components.",
    "Tug of War": "Builds strength and provides an outlet for natural instincts.",
    "Backyard Play": "Free play in a controlled environment, can be adjusted to energy levels.",
    "Short Walk": "Brief, gentle walks appropriate for puppies or senior dogs.",
    "Gentle Play": "Low-intensity play appropriate for puppies or dogs with health restrictions.",
    "Mental Stimulation": "Puzzle toys and training that provide mental exercise with minimal physical exertion.",
    "Other": "Custom exercise activities tailored to your dog's specific needs."
  };
  
  return descriptions[activity] || "Custom exercise activity.";
}

// Helper function to get breed-specific notes
function getBreedNotes(breed: string): string {
  const breedNotes: Record<string, string> = {
    "Newfoundland": "Newfoundlands have a natural affinity for water and swimming is an excellent exercise for them. They're prone to joint issues, so moderate exercise that doesn't put too much strain on their joints is ideal. Despite their size, they don't require extensive exercise and are relatively low-energy indoors.",
    "Labrador Retriever": "Labs are high-energy dogs that thrive with plenty of exercise. They excel at fetch, swimming, and running. Without adequate exercise, they may develop destructive behaviors.",
    "Border Collie": "Extremely high energy and intelligence require both physical and mental stimulation. They excel at agility, frisbee, and complex training exercises.",
    "Bulldog": "Prone to overheating and respiratory issues. Short, low-intensity walks and play sessions are best, especially in cool weather.",
    "Greyhound": "Despite their racing background, greyhounds are often \"couch potatoes\" who enjoy short bursts of high-intensity exercise followed by long rest periods.",
    "German Shepherd": "Intelligent, active dogs that benefit from structured exercise with mental components. They excel at training exercises and jobs.",
    "Chihuahua": "Small but energetic, they get sufficient exercise from indoor play and short walks. Care should be taken in extreme temperatures.",
    "Great Dane": "Despite their size, they typically have moderate energy levels. Gentle exercise is important during growth phases to protect developing joints.",
    "Poodle": "Intelligent and athletic, they enjoy varied exercises including swimming, fetch, and training activities.",
    "Beagle": "Scent hounds with high energy that benefit from regular opportunities to explore and follow scents in secure areas.",
    "Golden Retriever": "Athletic and enthusiastic exercise partners who especially enjoy water activities and retrieving games.",
    "Saint Bernard": "Giant breeds with moderate energy that benefit from regular short walks and play sessions. Avoid strenuous exercise in hot weather.",
    "Dachshund": "Small but spirited dogs that need regular exercise, but care should be taken to protect their backs by avoiding jumping and stairs."
  };
  
  return breedNotes[breed] || 
    `${breed}s, like all dogs, benefit from regular exercise adjusted to their age, size, and health conditions. Monitor their response to different activities and adjust accordingly.`;
}

export default ExerciseTracker;
