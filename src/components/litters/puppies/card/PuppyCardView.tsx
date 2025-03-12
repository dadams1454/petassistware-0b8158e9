
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Weight, Scan } from 'lucide-react';
import PuppyPhoto from '../common/PuppyPhoto';
import PuppyBasicInfo from '../common/PuppyBasicInfo';
import PuppyDetailsInfo from '../common/PuppyDetailsInfo';
import PuppyWeightInfo from '../common/PuppyWeightInfo';
import PuppyStatusBadge from '../PuppyStatusBadge';
import PuppyActions from '../PuppyActions';

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
    <>
      {puppies.map((puppy) => (
        <Card key={puppy.id} className="overflow-hidden">
          <div className="flex items-center border-b p-4">
            {/* Photo */}
            <div className="mr-3">
              <PuppyPhoto 
                photoUrl={puppy.photo_url} 
                name={puppy.name}
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
            <div className="grid grid-cols-2 gap-4">
              {/* Details */}
              <div>
                <div className="flex items-center gap-1 text-sm font-medium mb-1">
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
              <div>
                <div className="flex items-center gap-1 text-sm font-medium mb-1">
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
                <div className="text-sm font-mono">{puppy.microchip_number}</div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end mt-3 pt-3 border-t">
              <PuppyActions 
                puppy={puppy} 
                onEdit={onEditPuppy} 
                onDelete={onDeletePuppy} 
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PuppyCardView;
