
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DogProfile } from '../../types/dog';

interface DogOverviewTabProps {
  dog: DogProfile;
}

const DogOverviewTab: React.FC<DogOverviewTabProps> = ({ dog }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About {dog.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Breed" value={dog.breed || 'Not specified'} />
                <InfoField label="Color" value={dog.color || 'Not specified'} />
                <InfoField label="Gender" value={dog.gender || 'Not specified'} />
                <InfoField label="Status" value={dog.status || 'Active'} />
              </div>
            </div>
            
            {dog.gender === 'Female' && (
              <div>
                <h3 className="font-medium mb-2">Breeding Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Pregnant" value={dog.is_pregnant ? 'Yes' : 'No'} />
                  <InfoField label="Last Heat Date" value={formatDate(dog.last_heat_date)} />
                  <InfoField label="Tie Date" value={formatDate(dog.tie_date)} />
                  <InfoField label="Litter Number" value={dog.litter_number?.toString() || '0'} />
                </div>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Registration Number" value={dog.registration_number || 'Not registered'} />
                <InfoField label="Microchip Number" value={dog.microchip_number || 'Not microchipped'} />
                <InfoField label="Pedigree" value={dog.pedigree ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
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

export default DogOverviewTab;
