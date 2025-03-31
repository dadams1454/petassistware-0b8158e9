
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { inspectionFormSchema, InspectionFormValues } from './inspectionFormSchema';
import { InspectionRow } from '@/integrations/supabase/client';

interface UseInspectionFormProps {
  inspection: InspectionRow | null | undefined;
  onSave: (data: any) => void;
}

export const useInspectionForm = ({ inspection, onSave }: UseInspectionFormProps) => {
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      title: "",
      inspector: "",
      status: "scheduled",
      follow_up: "",
      notes: "",
    }
  });

  useEffect(() => {
    if (inspection) {
      form.reset({
        title: inspection.title,
        inspector: inspection.inspector || "",
        inspection_date: inspection.inspection_date ? new Date(inspection.inspection_date) : undefined,
        next_date: inspection.next_date ? new Date(inspection.next_date) : undefined,
        status: inspection.status || "scheduled",
        follow_up: inspection.follow_up || "",
        notes: inspection.notes || "",
      });
    } else {
      form.reset({
        title: "",
        inspector: "",
        status: "scheduled",
        follow_up: "",
        notes: "",
      });
    }
  }, [inspection, form]);

  const handleSubmit = (values: InspectionFormValues) => {
    onSave({
      ...values,
      inspection_date: values.inspection_date.toISOString().split('T')[0],
      next_date: values.next_date ? values.next_date.toISOString().split('T')[0] : null,
    });
  };

  return {
    form,
    handleSubmit
  };
};
