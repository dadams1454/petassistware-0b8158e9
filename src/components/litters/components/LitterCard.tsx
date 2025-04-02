
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Calendar } from 'lucide-react';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';

interface LitterCardProps {
  id: string;
  name: string;
  breed: string;
  birthDate?: string | null;
  puppiesCount: number;
}

const LitterCard: React.FC<LitterCardProps> = ({
  id,
  name,
  breed,
  birthDate,
  puppiesCount,
}) => {
  const navigate = useNavigate();

  const handleViewLitter = () => {
    navigate(`/litters/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm"><span className="font-semibold">Breed:</span> {breed}</p>
          {birthDate && (
            <p className="text-sm">
              <span className="font-semibold">Birth Date:</span> {formatDateForDisplay(birthDate)}
            </p>
          )}
          <p className="text-sm"><span className="font-semibold">Puppies:</span> {puppiesCount}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-between items-center">
        <Badge variant="secondary">
          <Calendar className="h-4 w-4 mr-2" />
          {breed}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleViewLitter}>
          View Litter
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LitterCard;
