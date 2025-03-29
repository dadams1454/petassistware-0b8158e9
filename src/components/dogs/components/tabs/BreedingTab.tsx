
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DogProfile, DogGender } from '@/types/dog';
import { Edit, Calendar, Calculator } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';

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
    
    // Calculate breeding-related dates
    const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
    const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
    
    // Calculate projected dates
    const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
    const dueDate = tieDate ? addDays(tieDate, 63) : null; // 63 days gestation

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
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Projected Next Heat</div>
                  <div className="font-medium">
                    {nextHeatDate ? format(nextHeatDate, 'PPP') : 'Unknown'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Breeding Date</div>
                  <div className="font-medium">
                    {tieDate ? format(tieDate, 'PPP') : 'Not recorded'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Due Date</div>
                  <div className="font-medium">
                    {dueDate ? format(dueDate, 'PPP') : 'Unknown'}
                  </div>
                </div>
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
                    {dog.is_pregnant ? (
                      <span className="text-amber-600 font-semibold">Pregnant</span>
                    ) : (
                      <span>Not Pregnant</span>
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
              </div>
            </CardContent>
          </Card>
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
