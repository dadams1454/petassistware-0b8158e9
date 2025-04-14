
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { Dog, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface DogLetOutTabProps {
  onRefresh?: () => void;
  dogStatuses?: DogCareStatus[];
}

interface DogBreakStatus {
  dogId: string;
  dogName: string;
  lastBreakTime: string | null;
  needsBreak: boolean;
}

const DogLetOutTab: React.FC<DogLetOutTabProps> = ({ 
  onRefresh,
  dogStatuses = []
}) => {
  const navigate = useNavigate();
  const [breakStatuses, setBreakStatuses] = useState<DogBreakStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPottyBreaks = async () => {
      setIsLoading(true);
      try {
        // Get all active dogs if dogStatuses is empty
        let dogsToCheck = dogStatuses;
        if (dogsToCheck.length === 0) {
          const { data } = await supabase
            .from('dogs')
            .select('id, name')
            .eq('status', 'active');
          
          if (data) {
            dogsToCheck = data.map(dog => ({
              dog_id: dog.id,
              dog_name: dog.name,
              flags: [],
              created_at: '',
              updated_at: ''
            }));
          }
        }

        // For each dog, get their last potty break
        const statuses = await Promise.all(
          dogsToCheck.map(async (dog) => {
            const { data: pottyData } = await supabase
              .from('daily_care_logs')
              .select('timestamp')
              .eq('dog_id', dog.dog_id)
              .eq('category', 'pottybreaks')
              .order('timestamp', { ascending: false })
              .limit(1);

            const lastBreakTime = pottyData && pottyData.length > 0 
              ? pottyData[0].timestamp 
              : null;
            
            // Determine if dog needs a break (no break in 6+ hours)
            const needsBreak = !lastBreakTime || 
              (new Date().getTime() - new Date(lastBreakTime).getTime() > 6 * 60 * 60 * 1000);
            
            return {
              dogId: dog.dog_id,
              dogName: dog.dog_name,
              lastBreakTime,
              needsBreak
            };
          })
        );

        setBreakStatuses(statuses);
      } catch (error) {
        console.error('Error fetching potty break data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPottyBreaks();
  }, [dogStatuses]);

  // Count dogs that need breaks
  const dogsNeedingBreaks = breakStatuses.filter(status => status.needsBreak).length;
  
  // Get time since text with formatting
  const getTimeSinceText = (lastBreakTime: string | null) => {
    if (!lastBreakTime) return 'No record';
    
    try {
      return formatDistanceToNow(new Date(lastBreakTime), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Dog className="h-6 w-6 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Dog Let Out Tracking</h3>
        
        {isLoading ? (
          <p className="text-muted-foreground">Loading dog break status...</p>
        ) : (
          <>
            <div className="w-full max-w-md space-y-3 my-4">
              {breakStatuses.slice(0, 3).map(status => (
                <div 
                  key={status.dogId}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    status.needsBreak ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{status.dogName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {status.needsBreak && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />}
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span className={status.needsBreak ? 'text-amber-700' : 'text-gray-600'}>
                      {getTimeSinceText(status.lastBreakTime)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {dogsNeedingBreaks > 0 && (
              <div className="text-amber-600 font-medium mb-4">
                {dogsNeedingBreaks} dog{dogsNeedingBreaks !== 1 ? 's' : ''} need{dogsNeedingBreaks === 1 ? 's' : ''} to be let out
              </div>
            )}
          </>
        )}
        
        <Button onClick={() => navigate("/facility")} className="mt-2">
          Go to Dog Let Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default DogLetOutTab;
