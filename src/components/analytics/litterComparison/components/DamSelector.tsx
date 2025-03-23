
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Dam {
  id: string;
  name: string;
  litters?: any[];
}

interface DamSelectorProps {
  dams: Dam[] | undefined;
  selectedDamId: string | null;
  setSelectedDamId: (id: string) => void;
  isLoading: boolean;
}

const DamSelector: React.FC<DamSelectorProps> = ({
  dams = [],
  selectedDamId,
  setSelectedDamId,
  isLoading
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Select Dam:</label>
      <Select
        value={selectedDamId || ''}
        onValueChange={(value) => setSelectedDamId(value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full md:w-[350px]">
          <SelectValue placeholder="Select a dam to view breeding history" />
        </SelectTrigger>
        <SelectContent>
          {dams?.map(dam => (
            <SelectItem key={dam.id} value={dam.id}>
              {dam.name} ({dam.litters?.length || 0} litters)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DamSelector;
