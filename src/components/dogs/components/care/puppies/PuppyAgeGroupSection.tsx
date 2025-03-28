
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PuppyAgeGroupData, PuppyWithAge } from '@/types/puppyTracking';
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{ageGroup.label} Development Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {ageGroup.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Milestones */}
            <div>
              <h4 className="font-medium mb-2">Key Milestones</h4>
              <ul className="list-disc pl-5 space-y-1">
                {ageGroup.milestones.map((milestone, index) => (
                  <li key={index} className="text-sm">{milestone}</li>
                ))}
              </ul>
            </div>
            
            {/* Critical Tasks */}
            <div>
              <h4 className="font-medium mb-2">Critical Tasks</h4>
              <ul className="list-disc pl-5 space-y-1">
                {ageGroup.criticalTasks.map((task, index) => (
                  <li key={index} className="text-sm">{task}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Puppies in this age group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {puppies.map(puppy => (
          <PuppyCard 
            key={puppy.id} 
            puppy={puppy}
            ageGroup={ageGroup}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
};

export default PuppyAgeGroupSection;
