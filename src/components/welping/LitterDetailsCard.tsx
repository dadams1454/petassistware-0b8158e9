
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Litter } from '@/types/litter';

interface LitterDetailsCardProps {
  litter: Litter;
}

const LitterDetailsCard: React.FC<LitterDetailsCardProps> = ({ litter }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Litter Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Parents</h3>
            <div className="flex justify-between">
              <span className="text-sm">Dam:</span>
              <span className="text-sm font-medium">{litter?.dam?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sire:</span>
              <span className="text-sm font-medium">{litter?.sire?.name || 'Unknown'}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Litter Details</h3>
            {litter?.litter_name && (
              <div className="flex justify-between">
                <span className="text-sm">Name:</span>
                <span className="text-sm font-medium">{litter.litter_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm">Birth Date:</span>
              <span className="text-sm font-medium">{litter ? format(new Date(litter.birth_date), 'MMM d, yyyy') : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Puppies Recorded:</span>
              <Badge variant="outline" className="text-xs">
                {litter?.puppies?.length || 0} {(litter?.puppies?.length || 0) === 1 ? 'puppy' : 'puppies'}
              </Badge>
            </div>
            {litter?.akc_registration_number && (
              <div className="flex justify-between">
                <span className="text-sm">AKC Registration:</span>
                <span className="text-sm font-medium">{litter.akc_registration_number}</span>
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate(`/litters/${litter.id}`)}
            >
              View Full Litter Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterDetailsCard;
