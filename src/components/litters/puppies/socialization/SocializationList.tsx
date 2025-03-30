import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocializationRecord, SocializationCategory } from '../types';
import { format } from 'date-fns';

interface SocializationListProps {
  experiences: SocializationRecord[];
}

const SocializationList: React.FC<SocializationListProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Experiences Yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          No socialization experiences have been recorded for this puppy.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {experiences.map((experience) => {
        const category = experience.category;
        const categoryName = typeof category === 'string' ? category : category.name;

        return (
          <Card key={experience.id} className="mb-4">
            <CardHeader>
              <CardTitle>{categoryName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Experience:</p>
              <p>{experience.experience}</p>
              <p className="text-sm text-muted-foreground">
                Date: {format(new Date(experience.experience_date), 'MMMM dd, yyyy')}
              </p>
              {experience.reaction && (
                <>
                  <p className="font-semibold mt-2">Reaction:</p>
                  <p>{experience.reaction}</p>
                </>
              )}
              {experience.notes && (
                <>
                  <p className="font-semibold mt-2">Notes:</p>
                  <p>{experience.notes}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SocializationList;
