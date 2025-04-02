import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Heart, 
  Baby, 
  Check, 
  AlertTriangle,
  Milestone
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { HeatCycle, BreedingRecord, PregnancyRecord, ReproductiveMilestone } from '@/types/reproductive';

interface ReproductiveTimelineProps {
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
}

interface TimelineEvent {
  id: string;
  type: 'heat' | 'breeding' | 'pregnancy' | 'whelping' | 'milestone';
  title: string;
  date: Date;
  description?: string;
  status?: string;
  icon: React.ReactNode;
  color: string;
}

const ReproductiveTimeline: React.FC<ReproductiveTimelineProps> = ({
  heatCycles,
  breedingRecords,
  pregnancyRecords,
  milestones
}) => {
  // Combine all events into a single timeline
  const allEvents: TimelineEvent[] = [
    ...heatCycles.map(cycle => ({
      id: cycle.id,
      type: 'heat' as const,
      title: 'Heat Cycle',
      date: new Date(cycle.start_date),
      description: cycle.end_date 
        ? `Duration: ${cycle.cycle_length || 'Unknown'} days` 
        : 'Ongoing heat cycle',
      status: cycle.end_date ? 'complete' : 'ongoing',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-red-500'
    })),
    
    ...breedingRecords.map(record => ({
      id: record.id,
      type: 'breeding' as const,
      title: 'Breeding',
      date: new Date(record.tie_date),
      description: `Sire: ${record.sire?.name || 'Unknown'} - ${record.breeding_method || 'Natural breeding'}`,
      status: record.is_successful === true 
        ? 'successful' 
        : record.is_successful === false 
          ? 'unsuccessful' 
          : 'pending',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-pink-500'
    })),
    
    ...pregnancyRecords.map(record => ({
      id: record.id,
      type: 'pregnancy' as const,
      title: 'Pregnancy Confirmed',
      date: new Date(record.confirmation_date || Date.now()),
      description: record.estimated_whelp_date 
        ? `Due date: ${format(new Date(record.estimated_whelp_date), 'MMM d, yyyy')}` 
        : 'Due date unknown',
      icon: <Baby className="h-5 w-5" />,
      color: 'bg-blue-500'
    })),
    
    ...pregnancyRecords
      .filter(record => record.actual_whelp_date)
      .map(record => ({
        id: `whelp-${record.id}`,
        type: 'whelping' as const,
        title: 'Whelping',
        date: new Date(record.actual_whelp_date!),
        description: `${record.puppies_born || 0} puppies born, ${record.puppies_alive || 0} survived`,
        status: record.outcome,
        icon: <Baby className="h-5 w-5" />,
        color: 'bg-purple-500'
      })),
      
    ...milestones.map(milestone => ({
      id: milestone.id,
      type: 'milestone' as const,
      title: milestone.milestone_type,
      date: new Date(milestone.milestone_date),
      description: milestone.notes || undefined,
      icon: <Milestone className="h-5 w-5" />,
      color: 'bg-amber-500'
    }))
  ];
  
  // Sort all events by date (most recent first)
  const sortedEvents = allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reproductive Timeline</CardTitle>
        <CardDescription>
          Complete history of reproductive events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
            <ul className="space-y-6">
              {sortedEvents.map(event => (
                <li key={`${event.id}-${event.type}`} className="relative pl-10">
                  <div className={`absolute left-0 top-1 rounded-full h-8 w-8 flex items-center justify-center ${event.color} text-white`}>
                    {event.icon}
                  </div>
                  <div className="bg-card rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <time className="text-sm text-muted-foreground">
                          {format(event.date, 'MMM d, yyyy')}
                        </time>
                      </div>
                      {event.status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.status === 'successful' || event.status === 'complete'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'unsuccessful'
                              ? 'bg-red-100 text-red-800'
                              : event.status === 'ongoing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Reproductive Events</h3>
            <p className="text-muted-foreground mt-2">
              There are no reproductive events recorded yet. Start by recording a heat cycle.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReproductiveTimeline;
