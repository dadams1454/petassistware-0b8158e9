
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LitterSelectorProps {
  litters: any[];
  selectedLitterId: string | null;
  setSelectedLitterId: (id: string) => void;
  isLoadingLitters: boolean;
}

const LitterSelector: React.FC<LitterSelectorProps> = ({ 
  litters,
  selectedLitterId,
  setSelectedLitterId,
  isLoadingLitters
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Select Litter:</label>
      <Select
        value={selectedLitterId || ''}
        onValueChange={(value) => setSelectedLitterId(value)}
        disabled={isLoadingLitters || (litters && litters.length === 0)}
      >
        <SelectTrigger className="w-full md:w-[350px]">
          <SelectValue placeholder="Select a litter to view analytics" />
        </SelectTrigger>
        <SelectContent>
          {isLoadingLitters ? (
            <SelectItem value="loading" disabled>Loading litters...</SelectItem>
          ) : litters && litters.length > 0 ? (
            litters.map(litter => (
              <SelectItem key={litter.id} value={litter.id}>
                {litter.litter_name || `${litter.dam?.name || 'Unknown'} × ${litter.sire?.name || 'Unknown'}`}
                {' '}
                ({litter.puppies?.length || 0} puppies)
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No litters available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LitterSelector;
