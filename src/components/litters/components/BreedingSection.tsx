
import React from 'react';
import { SectionHeader } from '@/components/ui/standardized';
import BreedingManagement from './BreedingManagement';

interface BreedingSectionProps {
  onRefresh?: () => void;
}

const BreedingSection: React.FC<BreedingSectionProps> = ({ onRefresh }) => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Breeding Management" 
        description="Monitor heat cycles and breeding activities"
      />
      
      <BreedingManagement onRefresh={onRefresh} />
    </div>
  );
};

export default BreedingSection;
