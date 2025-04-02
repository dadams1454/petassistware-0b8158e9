import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SOCIALIZATION_REACTIONS } from '@/data/socializationCategories';
import { getReactionObject } from '@/utils/socializationHelpers';
import { SocializationCategory, SocializationReaction } from '@/types/puppyTracking';

const FormSchema = z.object({
  category: z.string({
    required_error: "Please select a category.",
  }),
  experience: z.string({
    required_error: "Please enter the experience details.",
  }).min(3, {
    message: "Experience must be at least 3 characters.",
  }),
  experience_date: z.string({
    required_error: "Please select a date.",
  }),
  reaction: z.string().optional(),
  notes: z.string().optional(),
});

interface SocializationExperienceFormProps {
  onSubmit: (values: z.infer<typeof FormSchema>) => Promise<void>;
  onCancel: () => void;
  puppyId: string;
}

const SocializationExperienceForm: React.FC<SocializationExperienceFormProps> = ({ 
  onSubmit, 
  onCancel,
  puppyId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      experience: "",
      experience_date: new Date().toISOString().split('T')[0],
      reaction: "",
      notes: ""
    },
  });
  
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = form;
  
  const submitHandler = async (values: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Category
        </label>
        <div className="mt-2">
          <select
            id="category"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            {...register("category")}
          >
            <option value="">Select a category</option>
            {/* Map through categories here */}
          </select>
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label
          htmlFor="experience"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Experience
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="experience"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("experience")}
          />
          {errors.experience && (
            <p className="mt-2 text-sm text-red-600">{errors.experience.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label
          htmlFor="experience_date"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Date
        </label>
        <div className="mt-2">
          <input
            type="date"
            id="experience_date"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("experience_date")}
          />
          {errors.experience_date && (
            <p className="mt-2 text-sm text-red-600">{errors.experience_date.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label
          htmlFor="reaction"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Reaction
        </label>
        <div className="mt-2">
          <select
            id="reaction"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            {...register("reaction")}
          >
            <option value="">Select a reaction</option>
            {SOCIALIZATION_REACTIONS.map((reaction) => (
              <option key={reaction.id} value={reaction.id}>
                {reaction.name}
              </option>
            ))}
          </select>
          {errors.reaction && (
            <p className="mt-2 text-sm text-red-600">{errors.reaction.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Notes
        </label>
        <div className="mt-2">
          <textarea
            id="notes"
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default SocializationExperienceForm;
