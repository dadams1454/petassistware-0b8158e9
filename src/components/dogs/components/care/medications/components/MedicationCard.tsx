
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, Clock, AlertTriangle, Settings, Calendar, Plus } from 'lucide-react';
import { MedicationInfo, DogCareStatus, DogInfoProps, LastMedicationInfoProps } from '../types/medicationTypes';
import { getMedicationStatus, getStatusLabel } from '@/utils/medicationUtils';
import MedicationStatus from './MedicationStatus';

interface MedicationCardProps {
  dogInfo: {
    dogId: string;
    dogName: string;
    dogPhoto: string;
    breed: string;
  };
  preventativeMeds: MedicationInfo[];
  otherMeds: MedicationInfo[];
  onSuccess?: () => void;
}

// Components for rendering parts of the medication card
const DogInfo: React.FC<DogInfoProps> = ({ dogId, dogName, dogPhoto, breed }) => (
  <div className="flex items-center space-x-3">
    <div className="h-10 w-10 rounded-full overflow-hidden">
      {dogPhoto ? (
        <img src={dogPhoto} alt={dogName} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {dogName.substring(0, 1)}
        </div>
      )}
    </div>
    <div>
      <h3 className="font-medium text-base">{dogName}</h3>
      <p className="text-sm text-muted-foreground">{breed}</p>
    </div>
  </div>
);

const LastMedicationInfo: React.FC<LastMedicationInfoProps> = ({ dogId, name, lastAdministered, frequency }) => {
  const formattedDate = lastAdministered ? format(parseISO(lastAdministered), 'MMM d, yyyy') : 'Never';
  return (
    <div className="text-sm">
      <p>Last administered: {formattedDate}</p>
      <p>Frequency: {frequency}</p>
    </div>
  );
};

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  dogInfo, 
  preventativeMeds,
  otherMeds,
  onSuccess 
}) => {
  const [activeSection, setActiveSection] = React.useState<'preventative' | 'other'>('preventative');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [selectedMedication, setSelectedMedication] = React.useState<MedicationInfo | null>(null);

  const handleAdminister = (medicationId: string) => {
    // Handle administering medication
    console.log(`Administer medication ${medicationId}`);
  };
  
  const handleEditMedication = (medication: MedicationInfo) => {
    setSelectedMedication(medication);
    setShowAddForm(true);
  };
  
  const handleAddMedication = () => {
    setSelectedMedication(null);
    setShowAddForm(true);
  };
  
  const handleFormClose = () => {
    setShowAddForm(false);
    setSelectedMedication(null);
  };
  
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setSelectedMedication(null);
    if (onSuccess) onSuccess();
  };

  const renderMedicationList = (medications: MedicationInfo[], title: string, type: 'preventative' | 'other') => {
    if (medications.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No {title.toLowerCase()} medications</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleAddMedication}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Medication
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMedication}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {medications.map(med => (
            <div key={med.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{med.name}</h4>
                <MedicationStatus status={med.status} nextDue={med.nextDue} />
              </div>
              
              <LastMedicationInfo 
                dogId={dogInfo.dogId}
                name={med.name}
                lastAdministered={med.lastAdministered}
                frequency={med.frequency}
              />
              
              <div className="mt-2 flex space-x-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAdminister(med.id)}
                >
                  Administer
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEditMedication(med)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <DogInfo {...dogInfo} />
      
      <div className="border-t pt-4">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeSection === 'preventative' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveSection('preventative')}
          >
            Preventative ({preventativeMeds.length})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeSection === 'other' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveSection('other')}
          >
            Other Medications ({otherMeds.length})
          </button>
        </div>
        
        <div className="pt-4">
          {activeSection === 'preventative' && renderMedicationList(preventativeMeds, 'Preventative Medications', 'preventative')}
          {activeSection === 'other' && renderMedicationList(otherMeds, 'Other Medications', 'other')}
        </div>
      </div>
      
      {/* The actual MedicationForm would be rendered here when showAddForm is true */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {selectedMedication ? 'Edit Medication' : 'Add Medication'}
            </h2>
            <p className="mb-4">Medication form would go here</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleFormClose}>Cancel</Button>
              <Button onClick={handleFormSuccess}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationCard;
