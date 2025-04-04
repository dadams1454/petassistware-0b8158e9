import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { 
  MedicationInfo,
  MedicationCardProps
} from '../types/medicationTypes';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import MedicationStatus from './MedicationStatus';
import MedicationForm from '../MedicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  dogId, 
  preventativeMeds = [], 
  otherMeds = [],
  onSuccess
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdministrationDialogOpen, setIsAdministrationDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [viewType, setViewType] = useState<'add' | 'administer' | 'view'>('add');
  
  const handleAddMedication = () => {
    setSelectedMedication(null);
    setViewType('add');
    setIsAddDialogOpen(true);
  };
  
  const handleAdministerMedication = (medication: MedicationInfo) => {
    setSelectedMedication(medication);
    setViewType('administer');
    setIsAdministrationDialogOpen(true);
  };
  
  const handleViewMedication = (medication: MedicationInfo) => {
    setSelectedMedication(medication);
    setViewType('view');
    setIsAddDialogOpen(true);
  };
  
  const renderMedicationItem = (medication: MedicationInfo) => (
    <div key={medication.id} className="py-2 border-b last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{medication.name}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAdministerMedication(medication)}>
                  Administer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewMedication(medication)}>
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {medication.dosage && (
            <div className="text-xs text-muted-foreground">
              {medication.dosage} - {medication.frequency}
            </div>
          )}
          
          <div className="flex flex-col space-y-1 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Last administered:</span>
              <span className="text-xs font-medium">
                {format(parseISO(medication.lastAdministered), 'MMM d, yyyy')}
              </span>
            </div>
            
            <MedicationStatus 
              status={medication.status}
              nextDue={medication.nextDue}
              showIcon={false}
              showLabel={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Medications</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddMedication}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" /> 
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {preventativeMeds.length === 0 && otherMeds.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No medications recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {preventativeMeds.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Preventative
                </h3>
                {preventativeMeds.map(renderMedicationItem)}
              </div>
            )}
            
            {otherMeds.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Treatment
                </h3>
                {otherMeds.map(renderMedicationItem)}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Add/Edit Medication Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {viewType === 'add' ? 'Add New Medication' : 'Medication Details'}
            </DialogTitle>
          </DialogHeader>
          <MedicationForm 
            dogId={dogId}
            medication={selectedMedication}
            isViewMode={viewType === 'view'}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              onSuccess();
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Administer Medication Dialog */}
      <Dialog open={isAdministrationDialogOpen} onOpenChange={setIsAdministrationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Administer Medication
            </DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold">{selectedMedication.name}</h3>
                {selectedMedication.dosage && (
                  <p className="text-sm text-muted-foreground">
                    {selectedMedication.dosage} - {selectedMedication.frequency}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAdministrationDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Medication administration logic would go here
                    setIsAdministrationDialogOpen(false);
                    onSuccess();
                  }}
                >
                  Record Administration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MedicationCard;
