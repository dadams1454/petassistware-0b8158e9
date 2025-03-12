
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Contract = Tables<'contracts'> & {
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
  } | null;
  puppy?: Tables<'puppies'> | null;
  breeder_signature?: string | null;
  customer_signature?: string | null;
};

export type ContractInsert = Omit<Tables<'contracts'>, 'id' | 'created_at'> & {
  breeder_signature?: string | null;
  customer_signature?: string | null;
};

export type ContractUpdate = Partial<Tables<'contracts'>> & { 
  id: string;
  breeder_signature?: string | null;
  customer_signature?: string | null;
};

export const createContract = async (contract: ContractInsert) => {
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

export const updateContract = async (contract: ContractUpdate) => {
  const { data, error } = await supabase
    .from('contracts')
    .update(contract)
    .eq('id', contract.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contract:', error);
    throw error;
  }

  return data;
};

export const getContractsByPuppyId = async (puppyId: string) => {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(id, first_name, last_name, email, phone)
    `)
    .eq('puppy_id', puppyId);

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }

  return data as Contract[];
};

export const getContractById = async (id: string) => {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(id, first_name, last_name, email, phone),
      puppy:puppies(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contract:', error);
    throw error;
  }

  return data as Contract;
};
