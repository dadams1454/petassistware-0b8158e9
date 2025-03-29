
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, Edit, PawPrint, Dog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Litter } from '@/types/litter';
import { Dog as DogType } from '@/types/dog';

interface LitterHeaderProps {
  litter: Litter;
  sire?: DogType | null;
  dam?: DogType | null;
  onEditClick: () => void;
}

const LitterHeader: React.FC<LitterHeaderProps> = ({ 
  litter, 
  sire, 
  dam, 
  onEditClick 
}) => {
  const navigate = useNavigate();
  const birthDate = litter.birth_date ? new Date(litter.birth_date) : null;
  
  const handleWelpingClick = () => {
    navigate(`/welping/${litter.id}`);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {litter.litter_name || "Unnamed Litter"}
              </h2>
              <Badge variant="outline" className="ml-2">
                {litter.status || 'active'}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {birthDate ? format(birthDate, 'MMMM d, yyyy') : 'Birth date not set'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Dam:</span> {dam?.name || 'Unknown'}
              </div>
              <span>•</span>
              <div>
                <span className="font-medium">Sire:</span> {sire?.name || 'Unknown'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleWelpingClick}
            >
              <Dog className="h-4 w-4" />
              Welping Session
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={onEditClick}
            >
              <Edit className="h-4 w-4" />
              Edit Litter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterHeader;
