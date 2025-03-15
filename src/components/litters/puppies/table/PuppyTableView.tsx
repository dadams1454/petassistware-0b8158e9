
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Puppy } from '../types';
import PuppyPhoto from '../common/PuppyPhoto';
import PuppyBasicInfo from '../common/PuppyBasicInfo';
import PuppyDetailsInfo from '../common/PuppyDetailsInfo';
import PuppyWeightInfo from '../common/PuppyWeightInfo';
import PuppyIdentification from '../common/PuppyIdentification';
import PuppyStatusBadge from '../PuppyStatusBadge';
import PuppyActions from '../PuppyActions';

interface PuppyTableViewProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const PuppyTableView: React.FC<PuppyTableViewProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Photo</TableHead>
          <TableHead>ID/Name</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Weights</TableHead>
          <TableHead>Identification</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {puppies.map((puppy) => (
          <TableRow key={puppy.id}>
            {/* Photo */}
            <TableCell>
              <PuppyPhoto 
                photoUrl={puppy.photo_url} 
                name={puppy.name}
              />
            </TableCell>
            
            {/* ID/Name */}
            <TableCell>
              <PuppyBasicInfo
                name={puppy.name}
                id={puppy.id}
                birthDate={puppy.birth_date}
                salePrice={puppy.sale_price}
              />
            </TableCell>
            
            {/* Details */}
            <TableCell>
              <PuppyDetailsInfo
                gender={puppy.gender}
                color={puppy.color}
                salePrice={null} // We show sale price under the name in table view
              />
            </TableCell>
            
            {/* Weights */}
            <TableCell>
              <PuppyWeightInfo
                birthWeight={puppy.birth_weight?.toString() || null}
                currentWeight={puppy.current_weight?.toString() || null}
                displayUnit="both" // Show both units in the table view
              />
            </TableCell>
            
            {/* Identification */}
            <TableCell>
              <PuppyIdentification microchipNumber={puppy.microchip_number} />
            </TableCell>
            
            {/* Status */}
            <TableCell>
              <PuppyStatusBadge status={puppy.status} />
            </TableCell>
            
            {/* Actions */}
            <TableCell className="text-right">
              <PuppyActions 
                puppy={puppy} 
                onEdit={onEditPuppy} 
                onDelete={onDeletePuppy} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PuppyTableView;
