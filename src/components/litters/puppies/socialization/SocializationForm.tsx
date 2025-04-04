
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocializationCategory } from '@/types/puppyTracking';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Predefined categories
const SOCIALIZATION_CATEGORIES = [
  { id: 'people', name: 'People', targetCount: 5, description: 'Introducing puppies to different types of people' },
  { id: 'animals', name: 'Animals', targetCount: 5, description: 'Introducing puppies to other animals' },
  { id: 'environments', name: 'Environments', targetCount: 5, description: 'Exposing puppies to different environments' },
  { id: 'sounds', name: 'Sounds', targetCount: 5, description: 'Exposing puppies to various sounds' },
  { id: 'handling', name: 'Handling', targetCount: 5, description: 'Getting puppies used to being handled' },
  { id: 'objects', name: 'Objects', targetCount: 5, description: 'Introducing puppies to different objects' },
  { id: 'surfaces', name: 'Surfaces', targetCount: 5, description: 'Exposing puppies to different surfaces' }
];

// Predefined reactions
const REACTIONS = [
  { id: 'positive', name: 'Positive', value: 'positive', color: 'green' },
  { id: 'neutral', name: 'Neutral', value: 'neutral', color: 'blue' },
  { id: 'fearful', name: 'Fearful', value: 'fearful', color: 'yellow' },
  { id: 'negative', name: 'Negative', value: 'negative', color: 'red' }
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
              setCategory(selectedCategory);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {SOCIALIZATION_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Examples for selected category */}
        {category && (
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              {category.description}
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !experienceDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {experienceDate ? format(experienceDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={experienceDate}
              onSelect={setExperienceDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
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
                {react.name}
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
