
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PuppyAgeGroup } from '@/types/careCategories';
import { cn } from '@/lib/utils';

interface PuppyAgeGroupCardProps {
  ageGroup: PuppyAgeGroup;
  puppies?: {
    id: string;
    name: string;
    birthDate: Date;
    litterSize: number;
  }[];
  onLogCare: (puppyId: string) => void;
}

const PuppyAgeGroupCard: React.FC<PuppyAgeGroupCardProps> = ({
  ageGroup,
  puppies = [],
  onLogCare
}) => {
  return (
    <Card className={cn("border-l-4", ageGroup.color.split(' ')[0])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{ageGroup.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{ageGroup.ageRange}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{ageGroup.description}</p>
        
        {puppies.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Puppies in this stage:</h4>
            <ul className="space-y-1">
              {puppies.map(puppy => (
                <li key={puppy.id} className="flex justify-between items-center text-sm">
                  <span>{puppy.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLogCare(puppy.id)}
                    className="h-7 px-2"
                  >
                    Log Care
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No puppies in this stage</p>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Recommended Care:</h4>
          <ul className="text-xs space-y-1">
            {ageGroup.careItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="min-w-[4px] h-4 bg-primary rounded-full block mt-0.5"></span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyAgeGroupCard;
