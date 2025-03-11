
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Syringe, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDogVaccinations } from '../hooks/useDogVaccinations';
import VaccinationForm from './VaccinationForm';
import { Vaccination } from '../types/vaccination';

interface VaccinationsTabProps {
  dogId: string;
}

const VaccinationsTab: React.FC<VaccinationsTabProps> = ({ dogId }) => {
  const {
    vaccinations,
    isLoading,
    isAddingVaccination,
    setIsAddingVaccination,
    addVaccination,
    deleteVaccination,
    isAdding,
    isDeleting,
  } = useDogVaccinations(dogId);
  
  const [vaccinationToDelete, setVaccinationToDelete] = useState<string | null>(null);

  const handleAddVaccination = (data: Vaccination) => {
    addVaccination(data);
  };

  const handleDeleteConfirm = () => {
    if (vaccinationToDelete) {
      deleteVaccination(vaccinationToDelete);
      setVaccinationToDelete(null);
    }
  };

  const getVaccinationTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'rabies': 'Rabies',
      'distemper': 'Distemper',
      'parvovirus': 'Parvovirus',
      'adenovirus': 'Adenovirus',
      'leptospirosis': 'Leptospirosis',
      'bordetella': 'Bordetella',
      'lyme': 'Lyme Disease',
      'combo': 'Combo (DHPP)'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vaccination Records</h3>
        
        {!isAddingVaccination && (
          <Button 
            onClick={() => setIsAddingVaccination(true)}
            size="sm"
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Vaccination
          </Button>
        )}
      </div>
      
      <Separator className="my-4" />
      
      {isAddingVaccination && (
        <VaccinationForm
          dogId={dogId}
          onSubmit={handleAddVaccination}
          onCancel={() => setIsAddingVaccination(false)}
          isSubmitting={isAdding}
        />
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : vaccinations && vaccinations.length > 0 ? (
        <div className="space-y-4">
          {vaccinations.map((vaccination) => (
            <div 
              key={vaccination.id}
              className="p-4 border rounded-md bg-card hover:bg-muted/10 transition-colors"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Syringe className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">{getVaccinationTypeLabel(vaccination.vaccination_type)}</span>
                </div>
                
                <Badge variant="outline">
                  {format(new Date(vaccination.vaccination_date), 'MMM d, yyyy')}
                </Badge>
              </div>
              
              {vaccination.notes && (
                <div className="mt-2 text-sm text-muted-foreground pl-6">
                  {vaccination.notes}
                </div>
              )}
              
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => setVaccinationToDelete(vaccination.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No vaccination records found. Click "Add Vaccination" to create one.
        </div>
      )}
      
      <AlertDialog open={!!vaccinationToDelete} onOpenChange={(open) => !open && setVaccinationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vaccination Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vaccination record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VaccinationsTab;
