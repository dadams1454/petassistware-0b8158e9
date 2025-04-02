import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SocializationCategory, SocializationReaction } from '@/types/puppyTracking';
import { SOCIALIZATION_CATEGORIES, SOCIALIZATION_REACTIONS } from '@/data/socializationCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocializationFormProps {
  puppyId: string;
  onSubmit: (data: {
    category: string;
    experience: string;
    date: string;
    reaction?: string;
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const SocializationForm: React.FC<SocializationFormProps> = ({
  puppyId,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        category: selectedCategory || '',
        experience: data.experience,
        date: data.date,
        reaction: selectedReaction || '',
        notes: data.notes
      });
      reset();
      setSelectedCategory(null);
      setSelectedReaction(null);
    } catch (error) {
      console.error("Error submitting socialization record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      {/* Category field */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SOCIALIZATION_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`p-2 border rounded text-center transition-colors ${
                selectedCategory === category.id ? 
                `bg-${category.color}-100 border-${category.color}-500 text-${category.color}-700` : 
                'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Experience field */}
      <div>
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          type="text"
          placeholder="Describe the experience"
          {...register("experience", { required: true })}
        />
      </div>
      
      {/* Date field */}
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register("date", { required: true })}
        />
      </div>
      
      {/* Reaction field */}
      <div>
        <label className="block text-sm font-medium mb-2">Reaction</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {SOCIALIZATION_REACTIONS.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              className={`p-2 border rounded text-center transition-colors ${
                selectedReaction === reaction.id ? 
                `bg-${reaction.color}-100 border-${reaction.color}-500 text-${reaction.color}-700` : 
                'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedReaction(reaction.id)}
            >
              {reaction.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Notes field */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          type="text"
          placeholder="Any notes about this experience"
          {...register("notes")}
        />
      </div>
      
      {/* Submit/Cancel buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Experience"}
        </Button>
      </div>
    </form>
  );
};

export default SocializationForm;
