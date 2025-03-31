
import React from 'react';
import { useDogStatus } from '../../hooks/useDogStatus';
import { Check, AlertTriangle, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreedingRecommendationsProps {
  dog: any;
}

export const BreedingRecommendations: React.FC<BreedingRecommendationsProps> = ({ dog }) => {
  const { 
    isPregnant, 
    heatCycle, 
    tieDate,
    hasVaccinationHeatConflict,
    gestationProgressDays
  } = useDogStatus(dog);
  
  const { 
    isInHeat, 
    isPreHeat, 
    currentStage,
    lastHeatDate,
    nextHeatDate,
    daysUntilNextHeat
  } = heatCycle;

  // Determine recommendations based on breeding status
  const getRecommendations = () => {
    if (isPregnant) {
      return getPregnancyRecommendations(gestationProgressDays);
    }
    
    if (isInHeat) {
      return getHeatCycleRecommendations(currentStage);
    }
    
    if (isPreHeat) {
      return getPreHeatRecommendations();
    }
    
    return getGeneralRecommendations(nextHeatDate, daysUntilNextHeat);
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Breeding Recommendations</h3>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <RecommendationItem key={index} recommendation={rec} />
        ))}
      </div>
      
      {hasVaccinationHeatConflict && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 text-sm mt-4">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Vaccination Conflict Warning</p>
              <p className="text-sm">
                Upcoming vaccinations conflict with projected heat cycle. Consider rescheduling 
                vaccinations to at least 30 days before or after heat.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Recommendation {
  title: string;
  description: string;
  status: 'recommended' | 'not-recommended' | 'warning' | 'info';
}

// Recommendation display component
const RecommendationItem = ({ recommendation }: { recommendation: Recommendation }) => {
  const { title, description, status } = recommendation;
  
  let icon;
  let colorClasses;
  
  switch (status) {
    case 'recommended':
      icon = <Check className="h-5 w-5 text-green-500" />;
      colorClasses = "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300";
      break;
    case 'not-recommended':
      icon = <X className="h-5 w-5 text-red-500" />;
      colorClasses = "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300";
      break;
    case 'warning':
      icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
      colorClasses = "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300";
      break;
    case 'info':
    default:
      icon = <Info className="h-5 w-5 text-blue-500" />;
      colorClasses = "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300";
  }
  
  return (
    <div className={cn("p-3 border rounded-md text-sm flex gap-2", colorClasses)}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

// Helper functions to get recommendations for different statuses
function getPregnancyRecommendations(gestationProgressDays: number | null): Recommendation[] {
  if (gestationProgressDays === null) {
    return [
      {
        title: "Confirm Pregnancy",
        description: "Schedule a veterinary appointment to confirm pregnancy with an ultrasound.",
        status: "recommended"
      },
      {
        title: "Nutrition",
        description: "Gradually increase caloric intake by 10% in the first month, and up to 50% by the end of pregnancy.",
        status: "recommended"
      }
    ];
  }
  
  if (gestationProgressDays < 30) {
    return [
      {
        title: "Gentle Exercise",
        description: "Maintain light, regular exercise but avoid strenuous activity.",
        status: "recommended"
      },
      {
        title: "Pregnancy Confirmation",
        description: "Schedule ultrasound between days 25-35 to confirm pregnancy and estimate litter size.",
        status: "recommended"
      },
      {
        title: "Diet Adjustment",
        description: "Begin transitioning to a higher quality, puppy-formulated food with increased protein and calories.",
        status: "recommended"
      },
      {
        title: "Medications",
        description: "Avoid all medications not approved by your veterinarian during pregnancy.",
        status: "not-recommended"
      }
    ];
  }
  
  if (gestationProgressDays < 45) {
    return [
      {
        title: "Veterinary Check-up",
        description: "Schedule a mid-pregnancy check-up to monitor health and development.",
        status: "recommended"
      },
      {
        title: "Nutrition",
        description: "Increase food intake by 30-40% with multiple small meals per day.",
        status: "recommended"
      },
      {
        title: "Whelping Preparation",
        description: "Begin preparing whelping area and gathering necessary supplies.",
        status: "info"
      },
      {
        title: "Exercise Limitation",
        description: "Reduce exercise to short, gentle walks as the pregnancy progresses.",
        status: "warning"
      }
    ];
  }
  
  // Late pregnancy (45+ days)
  return [
    {
      title: "Whelping Box Setup",
      description: "Complete whelping box setup with appropriate bedding and heating.",
      status: "recommended"
    },
    {
      title: "X-ray",
      description: "Consider X-ray around day 55 to confirm puppy count and positions.",
      status: "recommended"
    },
    {
      title: "Temperature Monitoring",
      description: "Begin monitoring rectal temperature twice daily; a drop below 99°F may indicate labor within 24 hours.",
      status: "recommended"
    },
    {
      title: "Strenuous Activity",
      description: "Avoid all strenuous activity and minimize stress.",
      status: "not-recommended"
    },
    {
      title: "Veterinary Contact",
      description: "Have emergency veterinary contact information readily available.",
      status: "info"
    }
  ];
}

function getHeatCycleRecommendations(currentStage: any): Recommendation[] {
  if (!currentStage) {
    return [
      {
        title: "Monitor Closely",
        description: "Keep track of physical and behavioral changes to determine the exact stage of heat.",
        status: "recommended"
      }
    ];
  }
  
  if (currentStage.name === 'Proestrus') {
    return [
      {
        title: "Maintain Separation",
        description: "Keep away from intact males even though she's not receptive yet.",
        status: "recommended"
      },
      {
        title: "Monitor Discharge",
        description: "Track bloody discharge which typically lasts 7-10 days during this phase.",
        status: "info"
      },
      {
        title: "Prepare for Fertile Phase",
        description: "The fertile phase (Estrus) will follow, prepare breeding plans if applicable.",
        status: "info"
      },
      {
        title: "Breeding",
        description: "Breeding during this phase is not recommended as the female is not yet fertile or receptive.",
        status: "not-recommended"
      }
    ];
  }
  
  if (currentStage.name === 'Estrus') {
    return [
      {
        title: "Breeding Window",
        description: "This is the fertile period when breeding should occur if desired.",
        status: "info"
      },
      {
        title: "Progesterone Testing",
        description: "Consider progesterone testing to pinpoint optimal breeding days.",
        status: "recommended"
      },
      {
        title: "Multiple Breeding Sessions",
        description: "If breeding, consider multiple sessions 24-48 hours apart for best results.",
        status: "recommended"
      },
      {
        title: "Careful Monitoring",
        description: "Watch for standing heat behaviors that indicate receptivity.",
        status: "info"
      }
    ];
  }
  
  if (currentStage.name === 'Diestrus') {
    return [
      {
        title: "Pregnancy Watch",
        description: "Monitor for signs of pregnancy if breeding occurred.",
        status: "recommended"
      },
      {
        title: "False Pregnancy",
        description: "Be aware of false pregnancy symptoms which can occur even in unbred females.",
        status: "info"
      },
      {
        title: "Breeding",
        description: "Breeding during diestrus is not recommended as female is no longer fertile.",
        status: "not-recommended"
      },
      {
        title: "Return to Normal",
        description: "Gradually return to normal exercise and activity routines.",
        status: "recommended"
      }
    ];
  }
  
  return [
    {
      title: "Normal Activities",
      description: "Maintain regular activities as the heat cycle subsides.",
      status: "recommended"
    },
    {
      title: "Record Keeping",
      description: "Document the full length of this heat cycle for future reference.",
      status: "recommended"
    }
  ];
}

function getPreHeatRecommendations(): Recommendation[] {
  return [
    {
      title: "Prepare Supplies",
      description: "Gather supplies for managing the upcoming heat (dog diapers, cleaning supplies, etc).",
      status: "recommended"
    },
    {
      title: "Exercise Schedule",
      description: "Maintain exercise now before potential restrictions during heat.",
      status: "recommended"
    },
    {
      title: "Breeding Plans",
      description: "If planning to breed, contact stud owner and arrange progesterone testing schedule.",
      status: "info"
    },
    {
      title: "Vaccination/Surgery",
      description: "Avoid scheduling any vaccinations or surgeries that would fall during the heat period.",
      status: "warning"
    }
  ];
}

function getGeneralRecommendations(nextHeatDate: Date | null, daysUntilNextHeat: number | null): Recommendation[] {
  if (!nextHeatDate || !daysUntilNextHeat) {
    return [
      {
        title: "Establish Heat Pattern",
        description: "Record the first day of discharge when next heat begins to establish cycle patterns.",
        status: "recommended"
      },
      {
        title: "Regular Health Check",
        description: "Maintain regular veterinary check-ups to monitor reproductive health.",
        status: "recommended"
      }
    ];
  }
  
  if (daysUntilNextHeat <= 60) {
    return [
      {
        title: "Upcoming Heat Preparation",
        description: "Begin preparing for the upcoming heat cycle in approximately 2 months.",
        status: "info"
      },
      {
        title: "Breeding Decision",
        description: "Decide whether breeding is planned for the next cycle and prepare accordingly.",
        status: "info"
      },
      {
        title: "Health Assessment",
        description: "Consider a pre-breeding health assessment if planning to breed next cycle.",
        status: "recommended"
      }
    ];
  }
  
  return [
    {
      title: "Regular Monitoring",
      description: "Continue regular monitoring for any changes in behavior or physical condition.",
      status: "recommended"
    },
    {
      title: "Health Maintenance",
      description: "Maintain optimal nutrition and exercise for reproductive health.",
      status: "recommended"
    },
    {
      title: "Record Keeping",
      description: "Keep detailed records of past cycles to help predict future patterns.",
      status: "info"
    }
  ];
}
