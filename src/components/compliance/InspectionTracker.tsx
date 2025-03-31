
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardCheck, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase, customSupabase, InspectionRow } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { EmptyState } from '@/components/ui/standardized';
import InspectionDialog from './dialogs/InspectionDialog';
import { useAuth } from '@/hooks/useAuth';

const InspectionTracker: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [inspections, setInspections] = useState<InspectionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRow | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchInspections();
    }
  }, [user]);

  const fetchInspections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await customSupabase
        .from<InspectionRow>('inspections')
        .select('*')
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error: any) {
      console.error('Error fetching inspections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inspections data. Please try again later.',
        variant: 'destructive',
      });
      // Set an empty array instead of the error
      setInspections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInspection = () => {
    setSelectedInspection(null);
    setIsDialogOpen(true);
  };

  const handleEditInspection = (inspection: InspectionRow) => {
    setSelectedInspection(inspection);
    setIsDialogOpen(true);
  };

  const handleSaveInspection = async (inspectionData: any) => {
    try {
      const userId = user?.id;
      if (!userId) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to save inspection data.',
          variant: 'destructive',
        });
        return;
      }

      if (selectedInspection) {
        // Update existing inspection
        const { error } = await customSupabase
          .from<InspectionRow>('inspections')
          .update({
            ...inspectionData,
            breeder_id: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedInspection.id);

        if (error) throw error;
        
        toast({
          title: 'Inspection Updated',
          description: 'The inspection has been successfully updated.',
        });
      } else {
        // Create new inspection
        const { error } = await customSupabase
          .from<InspectionRow>('inspections')
          .insert({
            ...inspectionData,
            breeder_id: userId
          });

        if (error) throw error;
        
        toast({
          title: 'Inspection Added',
          description: 'The new inspection has been successfully added.',
        });
      }
      
      setIsDialogOpen(false);
      fetchInspections();
    } catch (error: any) {
      console.error('Error saving inspection:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save inspection',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : inspections.length === 0 ? (
        <EmptyState
          title="No Inspections"
          description="You haven't added any inspections yet."
          action={{
            label: "Add Inspection",
            onClick: handleAddInspection
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inspections.map((inspection) => (
            <InspectionCard 
              key={inspection.id}
              inspection={inspection}
              formatDate={formatDate}
              onEdit={() => handleEditInspection(inspection)}
            />
          ))}
        </div>
      )}

      <InspectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveInspection}
        inspection={selectedInspection}
      />
    </div>
  );
};

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

export default InspectionTracker;
