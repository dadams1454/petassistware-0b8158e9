
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { InspectionRow } from '@/integrations/supabase/client';

interface InspectionCardProps {
  inspection: InspectionRow;
  formatDate: (date: string) => string;
  onEdit: () => void;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ 
  inspection, 
  formatDate,
  onEdit
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

  return (
    <Card className={`border-l-4 ${statusClasses[inspection.status as keyof typeof statusClasses]}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          {inspection.title}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm font-medium">
          {statusIcons[inspection.status as keyof typeof statusIcons]}
          <span>{statusText[inspection.status as keyof typeof statusText]}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Inspector</span>
            <span className="text-sm font-medium">{inspection.inspector}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm font-medium">{formatDate(inspection.inspection_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Next Inspection</span>
            <span className="text-sm font-medium">{inspection.next_date ? formatDate(inspection.next_date) : 'Not scheduled'}</span>
          </div>
          
          {inspection.follow_up && (
            <div className="mt-2 pt-2 border-t flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-amber-700">{inspection.follow_up}</span>
            </div>
          )}
          
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionCard;
