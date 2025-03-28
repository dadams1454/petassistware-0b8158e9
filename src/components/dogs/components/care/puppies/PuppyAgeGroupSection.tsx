
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InfoIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import PuppyCard from './PuppyCard';

interface PuppyAgeGroupSectionProps {
  ageGroup: PuppyAgeGroupData;
  puppies: PuppyWithAge[];
  onRefresh: () => void;
}

const PuppyAgeGroupSection: React.FC<PuppyAgeGroupSectionProps> = ({
  ageGroup,
  puppies,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Age Group Info */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>{ageGroup.label}</span>
              <Badge variant="outline" className="ml-2">
                {ageGroup.daysRange.min}-{ageGroup.daysRange.max ?? '∞'} days
              </Badge>
            </CardTitle>
            <CardDescription>{ageGroup.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium flex items-center mb-2">
                <InfoIcon className="h-4 w-4 mr-1.5 text-blue-500" />
                Expected Milestones
              </h4>
              <ul className="text-sm space-y-1.5 ml-6 list-disc text-muted-foreground">
                {ageGroup.milestones.map((milestone, idx) => (
                  <li key={idx}>{milestone}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                Critical Care Tasks
              </h4>
              <ul className="text-sm space-y-1.5 ml-6 list-disc text-muted-foreground">
                {ageGroup.criticalTasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column: Puppies */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>Puppies in this Stage</span>
              <Badge variant="secondary" className="ml-2">
                {puppies.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              {puppies.length === 0 
                ? "No puppies currently in this developmental stage" 
                : "Puppies requiring monitoring and care at this stage"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {puppies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No puppies in this age group right now.</p>
              </div>
            ) : (
              <Tabs defaultValue="cards">
                <TabsList className="mb-4">
                  <TabsTrigger value="cards">Cards View</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cards" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {puppies.map(puppy => (
                      <PuppyCard 
                        key={puppy.id} 
                        puppy={puppy} 
                        onRefresh={onRefresh}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="checklist" className="mt-0">
                  <PuppyAgeChecklist 
                    puppies={puppies}
                    ageGroup={ageGroup}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Placeholder for PuppyAgeChecklist - We'll implement this fully in the next phase
const PuppyAgeChecklist: React.FC<{
  puppies: PuppyWithAge[];
  ageGroup: PuppyAgeGroupData;
}> = ({ puppies, ageGroup }) => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-center py-4">
        Detailed puppy checklist tracking will be implemented in the next phase.
      </p>
    </div>
  );
};

export default PuppyAgeGroupSection;
