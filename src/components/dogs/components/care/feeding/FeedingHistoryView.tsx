
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, Coffee, RefreshCw } from 'lucide-react';
import { FeedingRecord } from '@/types/feedingSchedule';
import { getLatestFeedings } from '@/services/dailyCare/feedingService';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { LoadingState } from '@/components/ui/standardized';

interface FeedingHistoryViewProps {
  dogId: string;
  limit?: number;
}

const FeedingHistoryView: React.FC<FeedingHistoryViewProps> = ({ dogId, limit = 10 }) => {
  const { toast } = useToast();
  const [feedings, setFeedings] = useState<FeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchFeedings = async () => {
    try {
      setLoading(true);
      const data = await getLatestFeedings(dogId, limit);
      setFeedings(data);
    } catch (error) {
      console.error('Error fetching feeding history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feeding history.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (dogId) {
      fetchFeedings();
    }
  }, [dogId]);
  
  const handleRefresh = () => {
    fetchFeedings();
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return timestamp;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Feeding History</CardTitle>
          <CardDescription>Recent feeding records for this dog</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState message="Loading feeding history..." />
        ) : feedings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Coffee className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No feeding records found</h3>
            <p className="text-muted-foreground mt-1">
              No feeding records have been recorded for this dog yet.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {feedings.map((feeding, index) => (
                <div key={feeding.id} className="relative">
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-0.5 bg-primary/10 text-primary">
                      <Coffee className="h-4 w-4" />
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <h4 className="font-medium">{feeding.food_type}</h4>
                          <Badge variant="outline" className="ml-2">
                            {feeding.amount_offered} {feeding.food_type.toLowerCase().includes('water') ? 'ml' : 'cups'}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatTimestamp(feeding.timestamp)}
                        </div>
                      </div>
                      {feeding.amount_consumed && (
                        <p className="text-sm">
                          <span className="font-medium">Consumed:</span> {feeding.amount_consumed} {feeding.food_type.toLowerCase().includes('water') ? 'ml' : 'cups'}
                        </p>
                      )}
                      {feeding.notes && (
                        <p className="text-sm text-muted-foreground">{feeding.notes}</p>
                      )}
                    </div>
                  </div>
                  {index < feedings.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedingHistoryView;
