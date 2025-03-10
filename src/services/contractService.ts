
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
    birth_date: string | null;
    microchip_number: string | null;
    photo_url: string | null;
    gender: string | null;
    color: string | null;
  } | null;
};

export type ContractInsert = Omit<Tables<'contracts'>, 'id' | 'created_at'>;

export const createContract = async (contract: Partial<ContractInsert>) => {
  // Add the breeder_id if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    contract.breeder_id = user.id;
  }
  
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
      customer:customers(id, first_name, last_name, email, phone),
      puppy:puppies(id, name, birth_date, microchip_number, photo_url, gender, color)
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
      puppy:puppies(id, name, birth_date, microchip_number, photo_url, gender, color)
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

export const markContractSigned = async (id: string) => {
  return updateContract(id, { signed: true });
};
