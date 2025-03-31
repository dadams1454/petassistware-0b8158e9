
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays, AlertTriangle, CheckCircle, FileCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const ComplianceCalendar: React.FC = () => {
  const { toast } = useToast();
  
  const handleAddEvent = () => {
    toast({
      title: "Coming Soon",
      description: "Compliance calendar event creation will be implemented in a future update."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Compliance Calendar</h2>
        <Button onClick={handleAddEvent} className="gap-2">
          <Calendar className="h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarDays className="mr-2 h-5 w-5" />
            Compliance Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <MonthSection month="July 2023" events={[
              { 
                date: "July 5, 2023", 
                title: "Health Department Follow-up", 
                type: "inspection",
                status: "overdue"
              },
              { 
                date: "July 15, 2023", 
                title: "AKC Quarterly Report Submission", 
                type: "report",
                status: "completed"
              },
              { 
                date: "July 28, 2023", 
                title: "Staff Training - Regulatory Updates", 
                type: "training",
                status: "upcoming"
              }
            ]} />
            
            <MonthSection month="August 2023" events={[
              { 
                date: "August 15, 2023", 
                title: "State License Renewal", 
                type: "license",
                status: "upcoming"
              },
              { 
                date: "August 22, 2023", 
                title: "County Health & Safety Inspection", 
                type: "inspection",
                status: "upcoming"
              }
            ]} />
            
            <MonthSection month="September 2023" events={[
              { 
                date: "September 10, 2023", 
                title: "Annual Insurance Review", 
                type: "review",
                status: "upcoming"
              },
              { 
                date: "September 22, 2023", 
                title: "AKC Inspection", 
                type: "inspection",
                status: "upcoming"
              },
              { 
                date: "September 30, 2023", 
                title: "Q3 Compliance Self-Assessment", 
                type: "assessment",
                status: "upcoming"
              }
            ]} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MonthSectionProps {
  month: string;
  events: {
    date: string;
    title: string;
    type: "inspection" | "license" | "report" | "training" | "review" | "assessment";
    status: "upcoming" | "completed" | "overdue";
  }[];
}

const MonthSection: React.FC<MonthSectionProps> = ({ month, events }) => {
  return (
    <div>
      <h3 className="font-semibold text-base mb-3">{month}</h3>
      <div className="space-y-3">
        {events.map((event, index) => (
          <EventItem key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

interface EventItemProps {
  event: {
    date: string;
    title: string;
    type: "inspection" | "license" | "report" | "training" | "review" | "assessment";
    status: "upcoming" | "completed" | "overdue";
  };
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const typeIcons = {
    inspection: <AlertTriangle className="h-4 w-4" />,
    license: <FileCheck className="h-4 w-4" />,
    report: <CalendarDays className="h-4 w-4" />,
    training: <Calendar className="h-4 w-4" />,
    review: <CalendarDays className="h-4 w-4" />,
    assessment: <CheckCircle className="h-4 w-4" />
  };
  
  const statusClasses = {
    upcoming: "bg-blue-50 border-blue-200 text-blue-700",
    completed: "bg-green-50 border-green-200 text-green-700",
    overdue: "bg-red-50 border-red-200 text-red-700"
  };

  return (
    <div className={`rounded-md p-3 border ${statusClasses[event.status]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {typeIcons[event.type]}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-medium">{event.title}</h4>
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs capitalize">{event.type}</span>
            <span className="text-xs capitalize">{event.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendar;
