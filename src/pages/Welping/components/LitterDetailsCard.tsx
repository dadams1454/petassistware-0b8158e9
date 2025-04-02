
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Dog, Calendar, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Litter } from '../types';

interface LitterDetailsCardProps {
  litter: Litter;
}

const LitterDetailsCard: React.FC<LitterDetailsCardProps> = ({ litter }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Litter Details</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`/welping/${litter.id}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Birth Date</p>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <p>{format(new Date(litter.birth_date), 'MMMM d, yyyy')}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Dam (Mother)</p>
          <div className="flex items-center">
            <Dog className="h-4 w-4 mr-2 text-muted-foreground" />
            <p>{litter.dam?.name || 'Unknown'}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Sire (Father)</p>
          <div className="flex items-center">
            <Dog className="h-4 w-4 mr-2 text-muted-foreground" />
            <p>{litter.sire?.name || 'Unknown'}</p>
          </div>
        </div>
        
        {litter.akc_litter_number && (
          <div>
            <p className="text-sm text-muted-foreground">AKC Litter #</p>
            <p>{litter.akc_litter_number}</p>
          </div>
        )}
        
        {litter.notes && (
          <div>
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="text-sm">{litter.notes}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/welping/${litter.id}/logs`)}
          >
            View Birthing Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterDetailsCard;
