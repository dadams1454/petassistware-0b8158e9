
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DogProfile } from '../../types/dog';

interface DogHealthTabProps {
  dog: DogProfile;
  dogId: string;
}

const DogHealthTab: React.FC<DogHealthTabProps> = ({ dog, dogId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField 
              label="Last Vaccination" 
              value={formatDate(dog.last_vaccination_date)} 
            />
            <InfoField 
              label="Vaccination Type" 
              value={dog.vaccination_type || 'Not recorded'} 
            />
            <InfoField 
              label="Weight" 
              value={dog.weight ? `${dog.weight} ${dog.weight_unit || 'lbs'}` : 'Not recorded'} 
            />
            <InfoField 
              label="Special Handling" 
              value={dog.requires_special_handling ? 'Yes' : 'No'} 
            />
          </div>
          
          {dog.vaccination_notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">Vaccination Notes:</h3>
              <p className="text-muted-foreground text-sm">{dog.vaccination_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Placeholder for health records - would be implemented with a proper health records component */}
      <Card>
        <CardHeader>
          <CardTitle>Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Health records will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-muted-foreground text-sm">{label}:</span> 
    <span className="ml-1">{value}</span>
  </div>
);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Not recorded';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch (e) {
    return 'Invalid date';
  }
};

export default DogHealthTab;
