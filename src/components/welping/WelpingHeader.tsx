
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Litter } from '@/components/litters/puppies/types';

interface WelpingHeaderProps {
  litter: Litter;
  litterId: string;
}

const WelpingHeader: React.FC<WelpingHeaderProps> = ({ litter, litterId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate(`/litters/${litterId}`)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Dog className="h-7 w-7 text-pink-500" />
          Welping Session
        </h1>
        <p className="text-muted-foreground">
          Record puppies for {litter?.dam?.name || 'Unknown Dam'} × {litter?.sire?.name || 'Unknown Sire'}
        </p>
      </div>
    </div>
  );
};

export default WelpingHeader;
