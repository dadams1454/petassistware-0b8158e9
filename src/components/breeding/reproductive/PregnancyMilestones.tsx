
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Baby, Calendar, Check } from 'lucide-react';
import { Dog } from '@/types/litter';
import { ReproductiveStatus } from '@/types/reproductive';
import { differenceInDays, formatDistance, addDays } from 'date-fns';

interface PregnancyMilestonesProps {
  dog: Dog;
}

const PregnancyMilestones: React.FC<PregnancyMilestonesProps> = ({ dog }) => {
  // Type-safe check for pregnancy status
  const isPregnant = dog.is_pregnant === true || 
                    (dog.reproductive_status === ReproductiveStatus.Pregnant);

  if (!isPregnant) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Not Currently Pregnant</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Pregnancy tracking features will be available when this dog's status is updated to pregnant.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate milestones based on tie date or estimated due date
  let dueDate: Date | null = null;
  let tieDate: Date | null = null;
  
  if (dog.tie_date) {
    tieDate = new Date(dog.tie_date);
    // Pregnancy lasts about 63 days for dogs
    dueDate = addDays(tieDate, 63);
  }

  const milestones = [
    { day: 1, title: "Fertilization", description: "Eggs are fertilized after mating", completed: true },
    { day: 21, title: "Ultrasound Possible", description: "First confirmation of pregnancy possible", completed: false },
    { day: 28, title: "Embryos Developing", description: "Fetuses becoming visible on ultrasound", completed: false },
    { day: 35, title: "X-Ray Possible", description: "Skeletons becoming visible to count puppies", completed: false },
    { day: 45, title: "Begin Nesting Box Prep", description: "Time to prepare for whelping", completed: false },
    { day: 55, title: "Temperature Monitoring", description: "Begin checking temperature twice daily", completed: false },
    { day: 63, title: "Expected Whelping", description: "Puppies should arrive around this time", completed: false },
  ];

  // Mark milestones as completed based on current day of pregnancy
  if (tieDate) {
    const currentDay = differenceInDays(new Date(), tieDate);
    milestones.forEach(milestone => {
      milestone.completed = currentDay >= milestone.day;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pregnancy Milestone Tracker</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        {!tieDate ? (
          <div className="text-center text-muted-foreground">
            <p>No breeding date recorded. Add a breeding date to track pregnancy milestones.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Breeding Date</p>
                <p className="font-medium">{tieDate.toLocaleDateString()}</p>
              </div>
              {dueDate && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Estimated Due Date</p>
                  <p className="font-medium">{dueDate.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistance(dueDate, new Date(), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {milestone.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{milestone.day}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.completed ? 'text-green-600' : ''}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Day {milestone.day}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PregnancyMilestones;
