
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DogProfile, DogGender } from '@/types/dog';
import { Edit, Calendar, Calculator, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { useDogStatus } from '../../hooks/useDogStatus';
import BreedingCycleCard from '../breeding/BreedingCycleCard';

// Define separate props interfaces for different usage contexts
export interface BreedingTabViewProps {
  dog: DogProfile;
  onEdit?: () => void;
}

export interface BreedingTabFormProps {
  form: UseFormReturn<any>;
  lastHeatDate: Date | null;
  isPregnant: boolean;
  nextHeatDate: Date | null;
  hasSchedulingConflict: boolean;
}

// Union type for props
export type BreedingTabProps = BreedingTabViewProps | BreedingTabFormProps;

// Type guard to determine which props we're using
const isViewProps = (props: BreedingTabProps): props is BreedingTabViewProps => {
  return 'dog' in props;
};

const BreedingTab: React.FC<BreedingTabProps> = (props) => {
  if (isViewProps(props)) {
    // Standalone view mode with a dog object
    const { dog, onEdit } = props;
    
    // Use our enhanced status hook
    const { 
      isPregnant, 
      heatCycle,
      tieDate,
      estimatedDueDate,
      gestationProgressDays,
      hasVaccinationHeatConflict
    } = useDogStatus(dog);
    
    const { 
      lastHeatDate,
      nextHeatDate,
      daysUntilNextHeat,
      daysIntoCurrentHeat,
      isInHeat,
      currentStage
    } = heatCycle;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Breeding Information</h2>
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Breeding Info
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Last Heat</div>
                  <div className="font-medium">
                    {lastHeatDate ? format(lastHeatDate, 'PPP') : 'Not recorded'}
                  </div>
                </div>
                
                {!isPregnant && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Current Status</div>
                    <div className="font-medium">
                      {isInHeat && currentStage ? (
                        <span className="text-red-600">In Heat - {currentStage.name} Stage</span>
                      ) : daysUntilNextHeat && daysUntilNextHeat <= 14 ? (
                        <span className="text-purple-600">Heat Approaching (in {daysUntilNextHeat} days)</span>
                      ) : (
                        <span>Not in Heat</span>
                      )}
                    </div>
                  </div>
                )}
                
                {!isPregnant && nextHeatDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Projected Next Heat</div>
                    <div className="font-medium flex items-center">
                      {format(nextHeatDate, 'PPP')}
                      {hasVaccinationHeatConflict && (
                        <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Vaccination Conflict
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {tieDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Breeding Date</div>
                    <div className="font-medium">
                      {format(new Date(tieDate), 'PPP')}
                    </div>
                  </div>
                )}
                
                {isPregnant && estimatedDueDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Due Date</div>
                    <div className="font-medium text-pink-600">
                      {format(estimatedDueDate, 'PPP')}
                      {gestationProgressDays !== null && (
                        <span className="text-sm ml-2 text-muted-foreground">
                          (Day {gestationProgressDays} of gestation)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Breeding Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Current Status</div>
                  <div className="font-medium">
                    {isPregnant ? (
                      <span className="text-pink-600 font-semibold">Pregnant</span>
                    ) : isInHeat ? (
                      <span className="text-red-600 font-semibold">In Heat</span>
                    ) : (
                      <span>Not Breeding</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Total Litters</div>
                  <div className="font-medium">
                    {dog.litter_number || '0'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Fertility</div>
                  <div className="font-medium">
                    {dog.gender === DogGender.Female ? 'Intact Female' : 'Intact Male'}
                  </div>
                </div>
                
                {dog.gender === DogGender.Female && isPregnant && gestationProgressDays !== null && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Pregnancy Progress</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-pink-600 h-2.5 rounded-full" 
                        style={{ width: `${(gestationProgressDays / 63) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Day {gestationProgressDays}</span>
                      <span>Day 63</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Conditional display of cycle information only for females */}
          {dog.gender === DogGender.Female && !isPregnant && (
            <div className="md:col-span-2">
              <BreedingCycleCard dog={dog} />
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Form mode with form values
    const { form, lastHeatDate, isPregnant, nextHeatDate, hasSchedulingConflict } = props;
    
    // Form-based implementation (we'll just show a placeholder for now)
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Breeding Information Form</h2>
        {/* Form fields would go here */}
        <p className="text-muted-foreground">Form implementation for breeding info</p>
      </div>
    );
  }
};

export default BreedingTab;
