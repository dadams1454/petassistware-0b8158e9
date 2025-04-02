
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VaccinationFormProps {
  puppyId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  puppyId,
  onSubmit,
  onCancel
}) => {
  const [vaccinationType, setVaccinationType] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaccinationType) {
      alert('Please select a vaccination type');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        puppy_id: puppyId,
        vaccination_type: vaccinationType,
        vaccination_date: vaccinationDate,
        notes
      });
    } catch (error) {
      console.error('Error submitting vaccination:', error);
      alert('Failed to save vaccination record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Vaccination</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vaccination-type">Vaccination Type</Label>
            <Select value={vaccinationType} onValueChange={setVaccinationType}>
              <SelectTrigger id="vaccination-type">
                <SelectValue placeholder="Select vaccination type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Distemper">Distemper</SelectItem>
                <SelectItem value="Parvovirus">Parvovirus</SelectItem>
                <SelectItem value="Hepatitis">Hepatitis</SelectItem>
                <SelectItem value="Rabies">Rabies</SelectItem>
                <SelectItem value="Bordetella">Bordetella</SelectItem>
                <SelectItem value="Leptospirosis">Leptospirosis</SelectItem>
                <SelectItem value="Parainfluenza">Parainfluenza</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vaccination-date">Date Administered</Label>
            <Input
              id="vaccination-date"
              type="date"
              value={vaccinationDate}
              onChange={(e) => setVaccinationDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Vaccine lot #, reactions, etc."
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Vaccination'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VaccinationForm;
