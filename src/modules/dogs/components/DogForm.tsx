
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DogProfile, DogGender, DogStatus } from '../types/dog';

interface DogFormProps {
  dog?: DogProfile;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DogForm: React.FC<DogFormProps> = ({
  dog,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  // This is a simplified placeholder form
  // In a real implementation, you'd use react-hook-form with zod validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you'd collect form data and validate
    onSubmit({ name: 'Example Dog', breed: 'Example Breed' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Dog Name</Label>
            <Input 
              id="name" 
              defaultValue={dog?.name || ''} 
              placeholder="Enter dog's name" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select defaultValue={dog?.gender || ''}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DogGender.Male}>Male</SelectItem>
                <SelectItem value={DogGender.Female}>Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input 
              id="breed" 
              defaultValue={dog?.breed || ''} 
              placeholder="Enter breed" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input 
              id="color" 
              defaultValue={dog?.color || ''} 
              placeholder="Enter color" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input 
              id="birthdate" 
              type="date" 
              defaultValue={dog?.birthdate ? new Date(dog.birthdate).toISOString().split('T')[0] : ''} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={dog?.status || DogStatus.Active}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DogStatus.Active}>Active</SelectItem>
                <SelectItem value={DogStatus.Inactive}>Inactive</SelectItem>
                <SelectItem value={DogStatus.Sold}>Sold</SelectItem>
                <SelectItem value={DogStatus.Deceased}>Deceased</SelectItem>
                <SelectItem value={DogStatus.Rehomed}>Rehomed</SelectItem>
                <SelectItem value={DogStatus.Guardian}>Guardian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            defaultValue={dog?.notes || ''} 
            placeholder="Enter any additional notes about the dog" 
            rows={4} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="pedigree" 
            defaultChecked={dog?.pedigree || false}
          />
          <Label htmlFor="pedigree">Has Pedigree</Label>
        </div>
        
        {dog?.gender === DogGender.Female && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_pregnant" 
              defaultChecked={dog?.is_pregnant || false}
            />
            <Label htmlFor="is_pregnant">Currently Pregnant</Label>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : dog ? 'Update Dog' : 'Add Dog'}
        </Button>
      </div>
    </form>
  );
};

export default DogForm;
