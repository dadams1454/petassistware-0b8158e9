
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Contract = Tables<'contracts'>;
export type ContractInsert = Tables<'contracts'>;

export const createContract = async (contract: Omit<ContractInsert, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('contracts')
    .insert(contract)
    .select()
    .single();

  if (error) {
    console.error('Error creating contract:', error);
    throw error;
  }

  return data;
};

export const getContractsByPuppyId = async (puppyId: string) => {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(*)
    `)
    .eq('puppy_id', puppyId);

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }

  return data;
};

export const getContractById = async (id: string) => {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(*),
      puppy:puppies(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contract:', error);
    throw error;
  }

  return data;
};
