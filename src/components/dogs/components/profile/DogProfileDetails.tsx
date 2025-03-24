
import React from 'react';
import { format } from 'date-fns';
import { DogProfile } from '@/types/dog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DogProfileDetailsProps {
  dog: DogProfile;
}

const DogProfileDetails: React.FC<DogProfileDetailsProps> = ({ dog }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Details about {dog.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">General</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Name:</dt>
                  <dd>{dog.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Breed:</dt>
                  <dd>{dog.breed}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Color:</dt>
                  <dd>{dog.color}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Gender:</dt>
                  <dd>{dog.gender}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Birthdate:</dt>
                  <dd>{dog.birthdate ? format(new Date(dog.birthdate), 'MMM d, yyyy') : 'Unknown'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Weight:</dt>
                  <dd>{dog.weight} {dog.weight_unit}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Status:</dt>
                  <dd className="capitalize">{dog.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Pedigree:</dt>
                  <dd>{dog.pedigree ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">Identification</h3>
              <dl className="space-y-2">
                {dog.registration_number && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Registration Number:</dt>
                    <dd>{dog.registration_number}</dd>
                  </div>
                )}
                {dog.registration_organization && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Registration Organization:</dt>
                    <dd>{dog.registration_organization}</dd>
                  </div>
                )}
                {dog.microchip_number && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Microchip Number:</dt>
                    <dd>{dog.microchip_number}</dd>
                  </div>
                )}
                {dog.microchip_location && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Microchip Location:</dt>
                    <dd>{dog.microchip_location}</dd>
                  </div>
                )}
                {dog.created_at && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Added on:</dt>
                    <dd>{format(new Date(dog.created_at), 'MMM d, yyyy')}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {dog.gender === 'female' && (
            <>
              <Separator className="my-4" />
              <h3 className="font-medium text-muted-foreground mb-2">Breeding Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Is Pregnant:</dt>
                    <dd>{dog.is_pregnant ? 'Yes' : 'No'}</dd>
                  </div>
                  {dog.last_heat_date && (
                    <div className="flex justify-between">
                      <dt className="font-medium">Last Heat Date:</dt>
                      <dd>{format(new Date(dog.last_heat_date), 'MMM d, yyyy')}</dd>
                    </div>
                  )}
                  {dog.tie_date && (
                    <div className="flex justify-between">
                      <dt className="font-medium">Tie Date:</dt>
                      <dd>{format(new Date(dog.tie_date), 'MMM d, yyyy')}</dd>
                    </div>
                  )}
                  {dog.litter_number !== undefined && dog.litter_number > 0 && (
                    <div className="flex justify-between">
                      <dt className="font-medium">Litter Number:</dt>
                      <dd>{dog.litter_number}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </>
          )}
          
          {dog.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Notes</h3>
                <p className="whitespace-pre-line">{dog.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Care Information</CardTitle>
          <CardDescription>Special care requirements for {dog.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Special Handling Required:</dt>
                <dd>{dog.requires_special_handling ? 'Yes' : 'No'}</dd>
              </div>
              {dog.potty_alert_threshold && (
                <div className="flex justify-between">
                  <dt className="font-medium">Potty Alert Threshold:</dt>
                  <dd>{dog.potty_alert_threshold} minutes</dd>
                </div>
              )}
              {dog.max_time_between_breaks && (
                <div className="flex justify-between">
                  <dt className="font-medium">Max Time Between Breaks:</dt>
                  <dd>{dog.max_time_between_breaks} minutes</dd>
                </div>
              )}
            </dl>
            
            <dl className="space-y-2">
              {dog.last_vaccination_date && (
                <div className="flex justify-between">
                  <dt className="font-medium">Last Vaccination:</dt>
                  <dd>{format(new Date(dog.last_vaccination_date), 'MMM d, yyyy')}</dd>
                </div>
              )}
              {dog.vaccination_type && (
                <div className="flex justify-between">
                  <dt className="font-medium">Vaccination Type:</dt>
                  <dd>{dog.vaccination_type}</dd>
                </div>
              )}
              {dog.vaccination_notes && (
                <div className="flex justify-between">
                  <dt className="font-medium">Vaccination Notes:</dt>
                  <dd>{dog.vaccination_notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DogProfileDetails;
