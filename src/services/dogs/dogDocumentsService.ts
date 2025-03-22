
import { supabase } from '@/integrations/supabase/client';
import { DogDocument } from '@/components/dogs/types/document';

export const addDogDocument = async (
  documentData: Omit<DogDocument, 'id' | 'created_at' | 'file_name'> & { notes?: string },
  userId: string
): Promise<DogDocument> => {
  const { data, error } = await supabase
    .from('dog_documents')
    .insert({
      ...documentData,
      created_by: userId,
      file_name: documentData.file_url.split('/').pop() || 'document'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error adding document:', error);
    throw new Error(error.message);
  }

  return data as DogDocument;
};

export const updateDogDocument = async (
  id: string,
  documentData: Partial<DogDocument>
): Promise<DogDocument> => {
  const { data, error } = await supabase
    .from('dog_documents')
    .update(documentData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating document:', error);
    throw new Error(error.message);
  }

  return data as DogDocument;
};

export const deleteDogDocument = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('dog_documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting document:', error);
    throw new Error(error.message);
  }
};

export const getDogDocuments = async (dogId: string): Promise<DogDocument[]> => {
  const { data, error } = await supabase
    .from('dog_documents')
    .select('*')
    .eq('dog_id', dogId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw new Error(error.message);
  }

  return data as DogDocument[];
};
