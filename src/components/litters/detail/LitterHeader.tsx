
import React from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LitterHeaderProps {
  litter: Litter;
  onEditClick: () => void;
}

const LitterHeader: React.FC<LitterHeaderProps> = ({ litter, onEditClick }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={() => navigate('/litters')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-3xl font-bold flex-1">
        Litter: {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
      </h1>
      <Button 
        variant="outline"
        onClick={onEditClick}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Edit Litter
      </Button>
    </div>
  );
};

export default LitterHeader;
