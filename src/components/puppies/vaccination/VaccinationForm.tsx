import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';

interface VaccinationFormProps {
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({ onSubmit, onCancel, initialData, isSubmitting }) => {
  const [vaccineName, setVaccineName] = useState<string>(initialData?.vaccine_name || '');
  const [manufacturer, setManufacturer] = useState<string>(initialData?.manufacturer || '');
  const [lotNumber, setLotNumber] = useState<string>(initialData?.lot_number || '');
  const [dueDate, setDueDate] = useState<Date | null>(initialData?.next_due_date ? new Date(initialData.next_due_date) : null);
  const [administered, setAdministered] = useState<boolean>(initialData?.administered || false);
  const [administeredDate, setAdministeredDate] = useState<Date | null>(initialData?.administered_date ? new Date(initialData.administered_date) : null);

  useEffect(() => {
    if (initialData) {
      setVaccineName(initialData.vaccine_name || '');
      setManufacturer(initialData.manufacturer || '');
      setLotNumber(initialData.lot_number || '');
      setDueDate(initialData.next_due_date ? new Date(initialData.next_due_date) : null);
      setAdministered(initialData.administered || false);
      setAdministeredDate(initialData.administered_date ? new Date(initialData.administered_date) : null);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      vaccine_name: vaccineName,
      manufacturer: manufacturer,
      lot_number: lotNumber,
      next_due_date: dueDate ? dueDate.toISOString() : null,
      administered: administered,
      administered_date: administeredDate ? administeredDate.toISOString() : null,
    };

    const success = await onSubmit(data);
    if (success) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vaccineName">Vaccine Name</Label>
          <Input
            type="text"
            id="vaccineName"
            value={vaccineName}
            onChange={(e) => setVaccineName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            type="text"
            id="manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lotNumber">Lot Number</Label>
          <Input
            type="text"
            id="lotNumber"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <DatePicker date={dueDate} onSelect={setDueDate} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="administered"
          checked={administered}
          onCheckedChange={setAdministered}
        />
        <Label htmlFor="administered">Administered</Label>
      </div>

      {administered && (
        <div>
          <Label htmlFor="administeredDate">Administered Date</Label>
          <DatePicker date={administeredDate} onSelect={setAdministeredDate} />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default VaccinationForm;
