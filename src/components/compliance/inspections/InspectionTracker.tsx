
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import InspectionDialog from '@/components/compliance/dialogs/InspectionDialog';
import InspectionCard from './InspectionCard';
import { useInspections } from '@/hooks/compliance/useInspections';
import { formatDate } from '../utils/dateUtils';

const InspectionTracker: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    inspections, 
    isLoading, 
    selectedInspection,
    setSelectedInspection,
    saveInspection 
  } = useInspections();
  
  const handleAddInspection = () => {
    setSelectedInspection(null);
    setIsDialogOpen(true);
  };

  const handleEditInspection = (inspection: typeof inspections[0]) => {
    setSelectedInspection(inspection);
    setIsDialogOpen(true);
  };

  const handleSaveInspection = async (inspectionData: any) => {
    const success = await saveInspection(inspectionData);
    if (success) {
      setIsDialogOpen(false);
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

export default InspectionTracker;
