
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocializationCategory } from '../types';
import { DatePicker } from '@/components/ui/date-picker';

// Predefined categories
const SOCIALIZATION_CATEGORIES = [
  { id: 'people', name: 'People', value: 'people', label: 'People', examples: ['Strangers', 'Children', 'Men with beards'] },
  { id: 'animals', name: 'Animals', value: 'animals', label: 'Animals', examples: ['Other dogs', 'Cats', 'Livestock'] },
  { id: 'environments', name: 'Environments', value: 'environments', label: 'Environments', examples: ['Car rides', 'Parks', 'City streets'] },
  { id: 'sounds', name: 'Sounds', value: 'sounds', label: 'Sounds', examples: ['Thunderstorms', 'Fireworks', 'Vacuum cleaners'] },
  { id: 'handling', name: 'Handling', value: 'handling', label: 'Handling', examples: ['Nail trimming', 'Ear cleaning', 'Grooming'] },
  { id: 'objects', name: 'Objects', value: 'objects', label: 'Objects', examples: ['Umbrellas', 'Bicycles', 'Skateboards'] },
  { id: 'surfaces', name: 'Surfaces', value: 'surfaces', label: 'Surfaces', examples: ['Grass', 'Tile', 'Metal grates'] }
];

// Predefined reactions
const REACTIONS = [
  { id: 'positive', name: 'Positive', value: 'positive', label: 'Positive', color: 'green' },
  { id: 'neutral', name: 'Neutral', value: 'neutral', label: 'Neutral', color: 'blue' },
  { id: 'fearful', name: 'Fearful', value: 'fearful', label: 'Fearful', color: 'yellow' },
  { id: 'negative', name: 'Negative', value: 'negative', label: 'Negative', color: 'red' }
];

interface SocializationFormProps {
  onSubmit: (data: { 
    category: SocializationCategory; 
    experience: string; 
    experience_date: string; 
    reaction?: string; 
    notes?: string; 
  }) => Promise<void>;
  isSubmitting: boolean;
}

const SocializationForm: React.FC<SocializationFormProps> = ({ onSubmit, isSubmitting }) => {
  const [category, setCategory] = useState<SocializationCategory | null>(null);
  const [experience, setExperience] = useState('');
  const [experienceDate, setExperienceDate] = useState<Date | undefined>(new Date());
  const [reaction, setReaction] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !experience || !experienceDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit({
        category: category,
        experience: experience,
        experience_date: experienceDate.toISOString().split('T')[0],
        reaction: reaction || undefined,
        notes: notes || undefined
      });
      
      // Reset form
      setCategory(null);
      setExperience('');
      setExperienceDate(new Date());
      setReaction('');
      setNotes('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Selection */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={category?.id || ''} 
          onValueChange={(value) => {
            const selectedCategory = SOCIALIZATION_CATEGORIES.find(cat => cat.id === value);
            if (selectedCategory) {
              setCategory({
                id: selectedCategory.id,
                name: selectedCategory.name
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {SOCIALIZATION_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Examples for selected category */}
        {category && (
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              Examples: {SOCIALIZATION_CATEGORIES.find(cat => cat.id === category.id)?.examples.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Experience Description */}
      <div>
        <Label htmlFor="experience">Experience *</Label>
        <Input 
          id="experience" 
          value={experience} 
          onChange={(e) => setExperience(e.target.value)} 
          placeholder="What did the puppy experience?"
          required
        />
      </div>

      {/* Date of Experience */}
      <div>
        <Label htmlFor="date">Date *</Label>
        <DatePicker 
          date={experienceDate} 
          onSelect={setExperienceDate} 
          className="w-full"
        />
      </div>

      {/* Reaction */}
      <div>
        <Label htmlFor="reaction">Puppy's Reaction</Label>
        <Select 
          value={reaction} 
          onValueChange={setReaction}
        >
          <SelectTrigger>
            <SelectValue placeholder="How did the puppy react?" />
          </SelectTrigger>
          <SelectContent>
            {REACTIONS.map((react) => (
              <SelectItem key={react.id} value={react.value}>
                {react.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Additional observations..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button 
          type="submit" 
          disabled={isSubmitting || !category || !experience || !experienceDate}
        >
          {isSubmitting ? 'Saving...' : 'Save Experience'}
        </Button>
      </div>
    </form>
  );
};

export default SocializationForm;
