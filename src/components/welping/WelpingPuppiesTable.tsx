
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PuppyStatusBadge from '@/components/litters/puppies/PuppyStatusBadge';
import PuppyActions from '@/components/litters/puppies/PuppyActions';
import { renderGenderIcon } from '@/components/litters/puppies/utils/puppyUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCheck, Award, Fingerprint } from 'lucide-react';
import { Puppy } from '@/components/litters/puppies/types';

interface WelpingPuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const WelpingPuppiesTable: React.FC<WelpingPuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  // Sort puppies by birth time (or created_at)
  const sortedPuppies = [...puppies].sort((a, b) => {
    return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
  });

  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="w-[100px]">Time</TableHead>
          <TableHead>ID/Color</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>AKC/Microchip</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPuppies.map((puppy, index) => (
          <TableRow key={puppy.id} className="border-b border-slate-100 hover:bg-slate-50/50">
            {/* Birth Time */}
            <TableCell className="font-medium whitespace-nowrap">
              {puppy.birth_time 
                ? puppy.birth_time 
                : puppy.created_at 
                  ? format(new Date(puppy.created_at), 'h:mm a') 
                  : 'Unknown'}
            </TableCell>
            
            {/* ID/Color */}
            <TableCell>
              <div className="font-medium">
                {/* Display name if exists, otherwise use sequential number by birth order */}
                {puppy.name || `Puppy ${index + 1}`}
              </div>
              {puppy.color && (
                <div className="text-sm text-muted-foreground">{puppy.color}</div>
              )}
            </TableCell>
            
            {/* Gender */}
            <TableCell>
              <div className="flex items-center gap-1.5">
                {renderGenderIcon(puppy.gender)}
                <span>{puppy.gender || 'Unknown'}</span>
              </div>
            </TableCell>
            
            {/* Weight */}
            <TableCell>
              {puppy.birth_weight 
                ? `${puppy.birth_weight} oz` 
                : 'Not recorded'}
            </TableCell>
            
            {/* AKC/Microchip Info */}
            <TableCell>
              <TooltipProvider>
                <div className="flex items-center space-x-2">
                  {puppy.akc_litter_number && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Award className="h-4 w-4 text-purple-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AKC Litter #: {puppy.akc_litter_number}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  {puppy.akc_registration_number && (
                    <Tooltip>
                      <TooltipTrigger>
                        <FileCheck className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AKC Reg #: {puppy.akc_registration_number}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  {puppy.microchip_number && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Fingerprint className="h-4 w-4 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Microchip #: {puppy.microchip_number}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  {!puppy.akc_litter_number && !puppy.akc_registration_number && !puppy.microchip_number && (
                    <span className="text-sm text-muted-foreground">None recorded</span>
                  )}
                </div>
              </TooltipProvider>
            </TableCell>
            
            {/* Notes */}
            <TableCell className="max-w-[200px] truncate">
              {puppy.notes || '-'}
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

export default WelpingPuppiesTable;
