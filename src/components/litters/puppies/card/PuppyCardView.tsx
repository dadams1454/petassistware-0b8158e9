
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Info, Weight, Scan, Medal } from 'lucide-react';
import PuppyPhoto from '../common/PuppyPhoto';
import PuppyBasicInfo from '../common/PuppyBasicInfo';
import PuppyDetailsInfo from '../common/PuppyDetailsInfo';
import PuppyWeightInfo from '../common/PuppyWeightInfo';
import PuppyStatusBadge from '../PuppyStatusBadge';
import PuppyActions from '../PuppyActions';
import { Puppy } from '../types';

interface PuppyCardViewProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const PuppyCardView: React.FC<PuppyCardViewProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {puppies.map((puppy) => (
        <Card key={puppy.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center border-b p-4 bg-muted/30">
            {/* Photo */}
            <div className="mr-3">
              <PuppyPhoto 
                photoUrl={puppy.photo_url} 
                name={puppy.name}
                size="lg"
              />
            </div>
            
            {/* Name and Status */}
            <div className="flex-1">
              <PuppyBasicInfo
                name={puppy.name}
                id={puppy.id}
                birthDate={puppy.birth_date}
              />
            </div>
            
            <PuppyStatusBadge status={puppy.status} />
          </div>
          
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Details */}
              <div className="bg-muted/20 rounded-md p-3">
                <div className="flex items-center gap-1 text-sm font-medium mb-2 text-primary">
                  <Info className="h-4 w-4" />
                  <span>Details</span>
                </div>
                <PuppyDetailsInfo
                  gender={puppy.gender}
                  color={puppy.color}
                  salePrice={puppy.sale_price}
                />
              </div>
              
              {/* Weights */}
              <div className="bg-muted/20 rounded-md p-3">
                <div className="flex items-center gap-1 text-sm font-medium mb-2 text-primary">
                  <Weight className="h-4 w-4" />
                  <span>Weights</span>
                </div>
                <PuppyWeightInfo
                  birthWeight={puppy.birth_weight}
                  currentWeight={puppy.current_weight}
                />
              </div>
            </div>
            
            {/* Identification */}
            {puppy.microchip_number && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-1 text-sm font-medium mb-1">
                  <Scan className="h-4 w-4" />
                  <span>Microchip</span>
                </div>
                <div className="text-sm font-mono bg-muted/20 p-2 rounded-sm overflow-x-auto">
                  {puppy.microchip_number}
                </div>
              </div>
            )}
            
            {/* Special Badge for Available Puppies */}
            {puppy.status === 'Available' && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <Medal className="h-4 w-4" />
                  <span>Ready for a new home</span>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end p-4 pt-0 border-t mt-3">
            <PuppyActions 
              puppy={puppy} 
              onEdit={onEditPuppy} 
              onDelete={onDeletePuppy} 
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PuppyCardView;
