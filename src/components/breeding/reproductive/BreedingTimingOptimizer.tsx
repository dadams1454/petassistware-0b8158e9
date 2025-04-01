
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, AlertCircle, Check } from 'lucide-react';

interface BreedingTimingOptimizerProps {
  dog: any;
  heatCycle: any;
}

const BreedingTimingOptimizer: React.FC<BreedingTimingOptimizerProps> = ({ dog, heatCycle }) => {
  const isReadyForBreeding = heatCycle.isInHeat && heatCycle.fertileDays?.start;
  const isPreHeat = heatCycle.isPreHeat;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Breeding Timing Optimizer</CardTitle>
          <CardDescription>
            Recommendations for optimal breeding times based on cycle analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isReadyForBreeding ? (
            <>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-300">Ready for Breeding</h3>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      This female is currently in her fertile window. Consider breeding now for the highest chance of success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <AdviceCard 
                  title="Optimal Timing"
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  description="Schedule breeding every 24-48 hours during the fertile window"
                />
                <AdviceCard 
                  title="Signs to Watch"
                  icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                  description="Standing heat, softening of the vulva, straw-colored discharge"
                />
              </div>
            </>
          ) : isPreHeat ? (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">Heat Approaching</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      This female is approaching her heat cycle. Begin preparations and monitoring for signs of proestrus.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <AdviceCard 
                  title="Preparation"
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  description="Contact stud owner, prepare testing and documentation"
                />
                <AdviceCard 
                  title="Early Signs"
                  icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                  description="Watch for swelling, blood-tinged discharge, and behavior changes"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">Not Currently in Breeding Window</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                This female is not currently in heat. Use this time for health testing, nutritional preparation, and exercise to ensure optimal breeding condition.
              </p>
            </div>
          )}
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Breeding Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-4">
              <RecommendationItem 
                title="Pre-Breeding Health Check"
                description="Schedule a vet visit 2-4 weeks before expected heat"
                status={isPreHeat ? "recommended" : "optional"}
              />
              <RecommendationItem 
                title="Progesterone Testing"
                description="Begin testing when vulvar swelling and discharge appear"
                status={heatCycle.isInHeat ? "urgent" : "upcoming"}
              />
              <RecommendationItem 
                title="Brucellosis Testing"
                description="Required for both dam and sire before breeding"
                status="required"
              />
              <RecommendationItem 
                title="Post-Breeding Checkup"
                description="3-4 weeks after breeding for pregnancy confirmation"
                status={dog.breeding_status === "bred" ? "upcoming" : "future"}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

interface AdviceCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ title, icon, description }) => (
  <div className="bg-card rounded-lg border p-4">
    <div className="flex items-start">
      <div className="mr-3">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </div>
);

interface RecommendationItemProps {
  title: string;
  description: string;
  status: "required" | "recommended" | "optional" | "urgent" | "upcoming" | "future";
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ title, description, status }) => {
  const statusClasses = {
    required: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    recommended: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    optional: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    upcoming: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    future: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    </div>
  );
};

export default BreedingTimingOptimizer;
