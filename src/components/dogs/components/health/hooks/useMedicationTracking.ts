
import { useState, useMemo } from 'react';
import { Medication } from '@/types/health';
import { Toast } from '@/components/ui/toast';

export const useMedicationTracking = (
  medications: Medication[],
  filter?: string,
  onAdminister?: (medicationId: string, data: any) => void,
  toast?: any
) => {
  const [expandedMedications, setExpandedMedications] = useState<Record<string, boolean>>({});

  // Apply filter if provided
  const filteredMedications = useMemo(() => {
    if (!filter) return medications;
    return medications.filter(med => 
      med.medication_name.toLowerCase().includes(filter.toLowerCase()) ||
      (med.dosage_unit && med.dosage_unit.toLowerCase().includes(filter.toLowerCase())) ||
      (med.administration_route && med.administration_route.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [medications, filter]);

  // Split medications into active and inactive
  const activeMedications = useMemo(() => 
    filteredMedications.filter(med => med.is_active !== false),
    [filteredMedications]
  );
  
  const inactiveMedications = useMemo(() => 
    filteredMedications.filter(med => med.is_active === false),
    [filteredMedications]
  );

  const toggleExpand = (id: string) => {
    setExpandedMedications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAdminister = (medicationId: string) => {
    if (onAdminister) {
      onAdminister(medicationId, {
        administered_at: new Date().toISOString(),
        notes: ''
      });
      
      if (toast) {
        toast({
          title: 'Medication administered',
          description: 'The medication administration has been recorded.',
        });
      }
    }
  };

  return {
    filteredMedications,
    activeMedications,
    inactiveMedications,
    expandedMedications,
    toggleExpand,
    handleAdminister
  };
};
