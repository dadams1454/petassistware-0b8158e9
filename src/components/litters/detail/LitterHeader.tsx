
import React from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface LitterHeaderProps {
  litter: {
    id: string;
    litter_name: string | null;
    birth_date: string;
    expected_go_home_date: string | null;
    puppy_count: number | null;
    male_count: number | null;
    female_count: number | null;
    sire_id: string | null;
    dam_id: string | null;
  };
  sire?: {
    name: string;
  } | null;
  dam?: {
    name: string;
  } | null;
  onEditClick?: () => void;
}

const LitterHeader: React.FC<LitterHeaderProps> = ({ litter, sire, dam, onEditClick }) => {
  // Fetch waitlist count for this litter
  const { data: waitlistCount } = useQuery({
    queryKey: ['waitlist-count', litter.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('litter_id', litter.id);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const litterAge = () => {
    const birthDate = new Date(litter.birth_date);
    const today = new Date();
    
    // Calculate difference in weeks
    const diffInTime = today.getTime() - birthDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    const weeks = Math.floor(diffInDays / 7);
    const days = diffInDays % 7;
    
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}, ${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {litter.litter_name || "Unnamed Litter"}
            </h1>
            <div className="text-muted-foreground mt-1">
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                <span>Birth Date: {format(new Date(litter.birth_date), 'MMMM d, yyyy')}</span>
                <span>Age: {litterAge()}</span>
                {litter.expected_go_home_date && (
                  <span>Go Home Date: {format(new Date(litter.expected_go_home_date), 'MMMM d, yyyy')}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {litter.puppy_count || 0} Puppies
              </Badge>
              {litter.male_count !== null && (
                <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 text-sm px-3 py-1">
                  {litter.male_count} Males
                </Badge>
              )}
              {litter.female_count !== null && (
                <Badge variant="outline" className="bg-pink-50 text-pink-800 hover:bg-pink-100 border-pink-200 text-sm px-3 py-1">
                  {litter.female_count} Females
                </Badge>
              )}
              {waitlistCount !== undefined && waitlistCount > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 text-sm px-3 py-1">
                  {waitlistCount} on Waitlist
                </Badge>
              )}
            </div>
            
            {onEditClick && (
              <Button variant="outline" size="sm" onClick={onEditClick}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <span className="text-muted-foreground">Sire:</span>{' '}
            <span className="font-medium">{sire?.name || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Dam:</span>{' '}
            <span className="font-medium">{dam?.name || 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterHeader;
