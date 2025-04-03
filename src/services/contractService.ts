
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
  puppy?: {
    id: string;
    name: string | null;
    color: string | null;
    birth_date: string | null;
    microchip_number: string | null;
  } | null;
};

export type ContractInsert = Omit<Tables<'contracts'>, 'id' | 'created_at'>;

export interface ContractFilters {
  puppyId?: string;
  customerId?: string;
  status?: string;
  contractType?: string;
}

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

export const getContracts = async (filters: ContractFilters = {}) => {
  let query = supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(id, first_name, last_name, email, phone),
      puppy:puppies(id, name, color, birth_date, microchip_number)
    `)
    .order('created_at', { ascending: false });

  if (filters.puppyId) {
    query = query.eq('puppy_id', filters.puppyId);
  }

  if (filters.customerId) {
    query = query.eq('customer_id', filters.customerId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.contractType) {
    query = query.eq('contract_type', filters.contractType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }

  return data as Contract[];
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

export const updateContract = async (id: string, updates: Partial<Tables<'contracts'>>) => {
  const { data, error } = await supabase
    .from('contracts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contract:', error);
    throw error;
  }

  return data;
};

export const deleteContract = async (id: string) => {
  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contract:', error);
    throw error;
  }
};
