
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HealthTabHeaderProps {
  onAdd: () => void;
}

const HealthTabHeader: React.FC<HealthTabHeaderProps> = ({ onAdd }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Health Records</h2>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Health Record
      </Button>
    </div>
  );
};

export default HealthTabHeader;
