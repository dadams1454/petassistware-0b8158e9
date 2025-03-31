
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardCheck, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InspectionTracker: React.FC = () => {
  const { toast } = useToast();
  
  const handleAddInspection = () => {
    toast({
      title: "Coming Soon",
      description: "Inspection tracking will be implemented in a future update."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inspection Tracker</h2>
        <Button onClick={handleAddInspection} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Inspection
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InspectionCard 
          title="Annual AKC Inspection" 
          status="passed"
          inspector="John Smith"
          date="2023-11-15"
          nextDate="2024-11-15"
        />
        <InspectionCard 
          title="State Health Department" 
          status="scheduled"
          inspector="Pending"
          date="2023-08-30"
          nextDate="2024-08-30"
        />
        <InspectionCard 
          title="County Animal Control" 
          status="failed"
          inspector="Maria Johnson"
          date="2023-05-12"
          nextDate="2023-06-20"
          followUp="Required facility upgrades by June 20"
        />
      </div>
    </div>
  );
};

interface InspectionCardProps {
  title: string;
  status: 'passed' | 'failed' | 'scheduled';
  inspector: string;
  date: string;
  nextDate: string;
  followUp?: string;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ 
  title, 
  status, 
  inspector, 
  date, 
  nextDate,
  followUp
}) => {
  const statusIcons = {
    passed: <CheckCircle className="h-5 w-5 text-green-500" />,
    failed: <XCircle className="h-5 w-5 text-red-500" />,
    scheduled: <Calendar className="h-5 w-5 text-blue-500" />
  };
  
  const statusText = {
    passed: "Passed",
    failed: "Failed",
    scheduled: "Scheduled"
  };
  
  const statusClasses = {
    passed: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200"
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className={`border-l-4 ${statusClasses[status]}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm font-medium">
          {statusIcons[status]}
          <span>{statusText[status]}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Inspector</span>
            <span className="text-sm font-medium">{inspector}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Next Inspection</span>
            <span className="text-sm font-medium">{formatDate(nextDate)}</span>
          </div>
          
          {followUp && (
            <div className="mt-2 pt-2 border-t flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-amber-700">{followUp}</span>
            </div>
          )}
          
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionTracker;
