
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Baby, ChevronLeft, Dog, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/common/BackButton';
import { Litter } from '@/types/litter';

interface WelpingPageHeaderProps {
  litter: Litter;
  litterId: string;
}

const WelpingPageHeader: React.FC<WelpingPageHeaderProps> = ({
  litter,
  litterId
}) => {
  const navigate = useNavigate();
  
  const getLitterDisplayName = () => {
    if (litter.litter_name) return litter.litter_name;
    return litter.dam?.name ? `${litter.dam.name}'s Litter` : 'Unnamed Litter';
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex items-center">
        <BackButton fallbackPath="/welping-dashboard" className="mr-4" />
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold flex items-center">
              <Baby className="h-6 w-6 mr-2 text-pink-500" />
              {getLitterDisplayName()}
            </h1>
            <Badge className="ml-2 bg-pink-100 text-pink-800 border-pink-300">
              Welping
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 mt-1 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {litter.birth_date 
                ? format(new Date(litter.birth_date), 'MMMM d, yyyy')
                : 'Birth date not set'}
            </span>
            
            {litter.dam && (
              <span className="flex items-center gap-1">
                <Dog className="h-4 w-4" />
                Dam: {litter.dam.name}
              </span>
            )}
            
            <Badge variant="outline">
              {litter.puppies?.length || 0} Puppies
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/litters/${litterId}`)}
        >
          View Litter Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dogs/${litter.dam_id}/reproductive`)}
          disabled={!litter.dam_id}
        >
          Dam's Profile
        </Button>
      </div>
    </div>
  );
};

export default WelpingPageHeader;
