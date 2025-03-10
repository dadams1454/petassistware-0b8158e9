
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LitterTimelineProps {
  litterId: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  type: 'birth' | 'exam' | 'vaccination' | 'milestone' | 'other';
  description?: string;
}

const LitterTimeline: React.FC<LitterTimelineProps> = ({ litterId }) => {
  const { data: timelineEvents, isLoading } = useQuery({
    queryKey: ['litter-timeline', litterId],
    queryFn: async () => {
      // This is a placeholder for the actual timeline fetch
      // In a future implementation, this would fetch real timeline events
      
      // For now, just get litter info to create a birth event
      const { data, error } = await supabase
        .from('litters')
        .select('litter_name, birth_date')
        .eq('id', litterId)
        .single();
      
      if (error) throw error;
      
      // Create a mock timeline with just the birth event
      const events: TimelineEvent[] = [];
      
      if (data) {
        events.push({
          id: 'birth-event',
          title: `${data.litter_name || 'Litter'} Born`,
          date: data.birth_date,
          type: 'birth',
          description: `Litter born on ${new Date(data.birth_date).toLocaleDateString()}`
        });
      }
      
      return events;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Litter Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading timeline...</div>
        ) : timelineEvents && timelineEvents.length > 0 ? (
          <div className="space-y-6">
            {timelineEvents.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary w-3 h-3"></div>
                  <div className="bg-border w-0.5 h-full"></div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  {event.description && <p className="text-sm">{event.description}</p>}
                </div>
              </div>
            ))}
            <div className="text-center text-muted-foreground mt-4">
              Timeline feature is under development. More events will be added soon.
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No timeline events yet. The timeline feature is coming soon.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LitterTimeline;
