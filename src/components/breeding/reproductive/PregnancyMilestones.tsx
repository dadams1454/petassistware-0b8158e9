
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Check, Calendar, Edit, BarChart } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { useDogStatus } from '@/components/dogs/hooks/useDogStatus';
import { SectionHeader } from '@/components/ui/standardized';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface PregnancyMilestonesProps {
  dog: any;
}

const PregnancyMilestones: React.FC<PregnancyMilestonesProps> = ({ dog }) => {
  const [updatePregnancyDialog, setUpdatePregnancyDialog] = useState(false);
  
  const { 
    isPregnant, 
    tieDate,
    estimatedDueDate,
    gestationProgressDays
  } = useDogStatus(dog);
  
  const today = new Date();
  
  // If not pregnant, show instructions to set pregnancy status
  if (!isPregnant) {
    return (
      <div className="space-y-6">
        <SectionHeader 
          title="Pregnancy Milestones" 
          description="Track important milestones during pregnancy"
        />
        
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Not Currently Pregnant</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              This dog is not marked as pregnant. Update pregnancy status to track milestones and important events.
            </p>
            <Button onClick={() => setUpdatePregnancyDialog(true)}>
              Mark as Pregnant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Calculate milestone dates based on breeding date
  const getMilestoneDates = () => {
    if (!tieDate) return {};
    
    const breedingDate = new Date(tieDate);
    return {
      fertilization: addDays(breedingDate, 5),
      implantation: addDays(breedingDate, 21),
      earlyUltrasound: addDays(breedingDate, 28),
      fetusFormation: addDays(breedingDate, 35),
      skeletalDevelopment: addDays(breedingDate, 45),
      xrayCountPuppies: addDays(breedingDate, 55),
      preparationWeek: estimatedDueDate ? addDays(estimatedDueDate, -7) : null,
      dueDate: estimatedDueDate
    };
  };
  
  const milestoneDates = getMilestoneDates();
  
  // Get milestone stages for visualization
  const getMilestoneStages = () => {
    if (!tieDate || !estimatedDueDate) return [];
    
    const breedingDate = new Date(tieDate);
    
    return [
      { 
        name: 'Early Pregnancy', 
        start: breedingDate, 
        end: addDays(breedingDate, 21),
        description: 'Fertilization and early development'
      },
      { 
        name: 'Middle Pregnancy', 
        start: addDays(breedingDate, 22), 
        end: addDays(breedingDate, 42),
        description: 'Embryo implantation and growth'
      },
      { 
        name: 'Late Pregnancy', 
        start: addDays(breedingDate, 43), 
        end: addDays(breedingDate, 58),
        description: 'Significant fetal development'
      },
      { 
        name: 'Pre-Whelping', 
        start: addDays(breedingDate, 59), 
        end: estimatedDueDate,
        description: 'Final preparations for whelping'
      }
    ];
  };
  
  const pregnancyStages = getMilestoneStages();
  
  // Determine current pregnancy stage
  const getCurrentStage = () => {
    if (!pregnancyStages.length || !gestationProgressDays) return null;
    
    for (const stage of pregnancyStages) {
      if (today >= stage.start && today <= stage.end) {
        return stage;
      }
    }
    return null;
  };
  
  const currentStage = getCurrentStage();
  
  // Update pregnancy status
  const handleUpdatePregnancy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const breedingDate = formData.get('breeding_date') as string;
      
      const { error } = await supabase
        .from('dogs')
        .update({ 
          is_pregnant: true,
          tie_date: breedingDate
        })
        .eq('id', dog.id);
        
      if (error) throw error;
      
      setUpdatePregnancyDialog(false);
      // You'd typically refresh the dog data here
    } catch (error) {
      console.error('Error updating pregnancy status:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Pregnancy Milestones" 
        description="Track important events during pregnancy"
        action={{
          label: "Update Pregnancy",
          onClick: () => setUpdatePregnancyDialog(true),
          icon: <Edit className="h-4 w-4 mr-2" />
        }}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Pregnancy Progress</CardTitle>
              <CardDescription>
                {tieDate ? `Bred on ${format(new Date(tieDate), 'MMM d, yyyy')}` : 'Breeding date not recorded'}
              </CardDescription>
            </div>
            <div className="px-3 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 rounded-full text-sm font-medium">
              {gestationProgressDays ? `Day ${gestationProgressDays} of 63` : 'Pregnancy confirmed'}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {gestationProgressDays && (
            <div className="space-y-1 mb-6">
              <div className="flex justify-between text-sm">
                <span>Day 1</span>
                <span>Day 63</span>
              </div>
              <Progress value={(gestationProgressDays / 63) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Breeding</span>
                <span>Due Date</span>
              </div>
            </div>
          )}
          
          {currentStage && (
            <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div>
                  <Heart className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium">Current Stage: {currentStage.name}</h3>
                  <p className="text-sm mt-1">{currentStage.description}</p>
                  
                  {currentStage.name === 'Late Pregnancy' && (
                    <div className="mt-2 text-sm bg-pink-100 p-2 rounded">
                      <span className="font-medium">Recommendation:</span> Schedule X-ray for puppy count around day 55.
                    </div>
                  )}
                  
                  {currentStage.name === 'Pre-Whelping' && (
                    <div className="mt-2 text-sm bg-pink-100 p-2 rounded">
                      <span className="font-medium">Recommendation:</span> Prepare whelping box and supplies, monitor temperature.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <h3 className="font-medium mb-4">Key Pregnancy Milestones</h3>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
            <ul className="space-y-4 relative z-10">
              {Object.entries(milestoneDates).map(([key, date], index) => {
                if (!date) return null;
                
                const isPast = differenceInDays(today, date) > 0;
                const isToday = differenceInDays(today, date) === 0;
                const daysUntil = differenceInDays(date, today);
                
                return (
                  <li key={key} className="ml-10 relative">
                    <div 
                      className={`absolute -left-10 top-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        isPast ? 'bg-green-100 border-green-300' : 
                        isToday ? 'bg-amber-100 border-amber-300' : 
                        'bg-gray-100 border-gray-300'
                      } border-2`}
                    >
                      {isPast ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Calendar className={`h-4 w-4 ${isToday ? 'text-amber-600' : 'text-gray-600'}`} />
                      )}
                    </div>
                    
                    <div className={`rounded-lg border p-3 ${isToday ? 'bg-amber-50 border-amber-200' : 'bg-card'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{formatMilestoneName(key)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(date, 'MMM d, yyyy')} {getMilestoneDay(key, gestationProgressDays)}
                          </p>
                        </div>
                        {!isPast && !isToday && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-2">
                        {getMilestoneDescription(key)}
                      </p>
                      
                      {key === 'earlyUltrasound' && !isPast && (
                        <Button variant="outline" size="sm" className="mt-2 w-full">
                          <Calendar className="h-3 w-3 mr-2" />
                          Schedule Ultrasound
                        </Button>
                      )}
                      
                      {key === 'xrayCountPuppies' && !isPast && (
                        <Button variant="outline" size="sm" className="mt-2 w-full">
                          <Calendar className="h-3 w-3 mr-2" />
                          Schedule X-ray
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Nutritional Requirements
          </CardTitle>
          <CardDescription>
            Dietary recommendations based on pregnancy stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gestationProgressDays && gestationProgressDays < 21 && (
              <RecommendationItem 
                title="Early Pregnancy (Days 1-21)"
                subtitle="Current Stage"
                recommendations={[
                  "Maintain regular adult diet",
                  "Ensure access to fresh water at all times",
                  "Continue normal exercise routine"
                ]}
                isActive={true}
              />
            )}
            
            {gestationProgressDays && gestationProgressDays >= 21 && gestationProgressDays < 42 && (
              <RecommendationItem 
                title="Mid Pregnancy (Days 22-42)"
                subtitle="Current Stage"
                recommendations={[
                  "Begin gradual transition to higher quality food",
                  "Increase food by 10% from regular amount",
                  "Moderate exercise, avoiding strenuous activity"
                ]}
                isActive={true}
              />
            )}
            
            {gestationProgressDays && gestationProgressDays >= 42 && (
              <RecommendationItem 
                title="Late Pregnancy (Days 43-63)"
                subtitle="Current Stage"
                recommendations={[
                  "Switch completely to high-quality puppy food",
                  "Feed smaller meals more frequently (3-4 times daily)",
                  "Increase calories by 30-50% of normal maintenance",
                  "Gentle exercise only, no strenuous activity"
                ]}
                isActive={true}
              />
            )}
            
            {(!gestationProgressDays || gestationProgressDays < 21) && (
              <RecommendationItem 
                title="Mid Pregnancy (Days 22-42)"
                recommendations={[
                  "Begin gradual transition to higher quality food",
                  "Increase food by 10% from regular amount",
                  "Moderate exercise, avoiding strenuous activity"
                ]}
              />
            )}
            
            {(!gestationProgressDays || gestationProgressDays < 42) && (
              <RecommendationItem 
                title="Late Pregnancy (Days 43-63)"
                recommendations={[
                  "Switch completely to high-quality puppy food",
                  "Feed smaller meals more frequently (3-4 times daily)",
                  "Increase calories by 30-50% of normal maintenance",
                  "Gentle exercise only, no strenuous activity"
                ]}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Update Pregnancy Dialog */}
      <Dialog open={updatePregnancyDialog} onOpenChange={setUpdatePregnancyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isPregnant ? 'Update Pregnancy Info' : 'Mark as Pregnant'}</DialogTitle>
            <DialogDescription>
              {isPregnant 
                ? 'Update breeding date and pregnancy status' 
                : 'Record breeding date to start tracking pregnancy milestones'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdatePregnancy} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="breeding_date" className="text-sm font-medium">
                Breeding Date <span className="text-destructive">*</span>
              </label>
              <input
                id="breeding_date"
                name="breeding_date"
                type="date"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={tieDate ? format(new Date(tieDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
              />
              <p className="text-xs text-muted-foreground">
                The date of successful breeding or artificial insemination.
              </p>
            </div>
            
            {isPregnant && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Pregnancy Status
                </label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="is_pregnant" 
                    name="is_pregnant"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked 
                  />
                  <label htmlFor="is_pregnant" className="text-sm">
                    Still pregnant
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Uncheck if pregnancy was unsuccessful or completed.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setUpdatePregnancyDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper components
const RecommendationItem: React.FC<{
  title: string;
  subtitle?: string;
  recommendations: string[];
  isActive?: boolean;
}> = ({ title, subtitle, recommendations, isActive }) => (
  <div className={`rounded-lg border p-4 ${isActive ? 'bg-blue-50 border-blue-200' : ''}`}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-medium">{title}</h3>
      {subtitle && (
        <span className={`text-xs px-2 py-1 rounded-full ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {subtitle}
        </span>
      )}
    </div>
    <ul className="space-y-1">
      {recommendations.map((rec, index) => (
        <li key={index} className="text-sm flex items-start gap-2">
          <Check className={`h-4 w-4 mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
          {rec}
        </li>
      ))}
    </ul>
  </div>
);

// Helper functions
const formatMilestoneName = (key: string): string => {
  switch (key) {
    case 'fertilization':
      return 'Fertilization Complete';
    case 'implantation':
      return 'Embryo Implantation';
    case 'earlyUltrasound':
      return 'Early Ultrasound';
    case 'fetusFormation':
      return 'Fetus Formation';
    case 'skeletalDevelopment':
      return 'Skeletal Development';
    case 'xrayCountPuppies':
      return 'X-ray for Puppy Count';
    case 'preparationWeek':
      return 'Whelping Preparation';
    case 'dueDate':
      return 'Expected Whelping Date';
    default:
      return key;
  }
};

const getMilestoneDay = (key: string, gestationProgressDays: number | null): string => {
  if (!gestationProgressDays) return '';
  
  switch (key) {
    case 'fertilization':
      return '(Day 5)';
    case 'implantation':
      return '(Day 21)';
    case 'earlyUltrasound':
      return '(Day 28-30)';
    case 'fetusFormation':
      return '(Day 35)';
    case 'skeletalDevelopment':
      return '(Day 45)';
    case 'xrayCountPuppies':
      return '(Day 55)';
    case 'preparationWeek':
      return '(Day 56)';
    case 'dueDate':
      return '(Day 63)';
    default:
      return '';
  }
};

const getMilestoneDescription = (key: string): string => {
  switch (key) {
    case 'fertilization':
      return 'Fertilized eggs have moved to the uterus. No visible signs yet.';
    case 'implantation':
      return 'Embryos implant in the uterine wall. First stage of pregnancy.';
    case 'earlyUltrasound':
      return 'First ultrasound to confirm pregnancy and estimate litter size.';
    case 'fetusFormation':
      return 'Fetuses begin to form, with developing organ systems.';
    case 'skeletalDevelopment':
      return 'Skeletal development visible. Begin increasing nutrition.';
    case 'xrayCountPuppies':
      return 'X-ray can confirm puppy count as skeletons are now visible.';
    case 'preparationWeek':
      return 'Prepare whelping box and supplies. Monitor temperature drops.';
    case 'dueDate':
      return 'Expected whelping date. Monitor closely for labor signs.';
    default:
      return '';
  }
};

export default PregnancyMilestones;
