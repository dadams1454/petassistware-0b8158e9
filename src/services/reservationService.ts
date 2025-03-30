
import { supabase } from '@/integrations/supabase/client';
import { Reservation, ReservationStatus, ReservationStatusHistory, Deposit } from '@/types/reservation';
import { useToast } from '@/hooks/use-toast';
import { auditLogger } from '@/utils/auditLogger';

// Get all reservations
export const getReservations = async (): Promise<Reservation[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      puppy:puppy_id(id, name, gender, color, litter_id, photo_url, status),
      customer:customer_id(id, first_name, last_name, email, phone)
    `)
    .order('reservation_date', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }

  return data as unknown as Reservation[];
};

// Get a specific reservation by ID
export const getReservationById = async (id: string): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      puppy:puppy_id(id, name, gender, color, litter_id, photo_url, status),
      customer:customer_id(id, first_name, last_name, email, phone)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching reservation:', error);
    throw error;
  }

  return data as unknown as Reservation;
};

// Create a new reservation
export const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservation)
    .select()
    .single();

  if (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }

  await auditLogger.logBusinessEvent(
    'CREATE',
    'reservations',
    data.id,
    `New reservation created for puppy ${reservation.puppy_id}`
  );

  return data as Reservation;
};

// Update an existing reservation
export const updateReservation = async (id: string, updates: Partial<Reservation>): Promise<Reservation> => {
  // Get the current reservation to compare for status changes
  const currentReservation = await getReservationById(id);
  const statusChanged = updates.status && updates.status !== currentReservation.status;

  // Perform the update
  const { data, error } = await supabase
    .from('reservations')
    .update({
      ...updates,
      status_updated_at: statusChanged ? new Date().toISOString() : currentReservation.status_updated_at
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }

  // Log the status change if status was updated
  if (statusChanged && updates.status) {
    await logStatusChange(
      id,
      currentReservation.status,
      updates.status,
      updates.notes
    );
  }

  await auditLogger.logBusinessEvent(
    'UPDATE',
    'reservations',
    id,
    `Reservation updated: ${JSON.stringify(updates)}`
  );

  return data as Reservation;
};

// Delete a reservation
export const deleteReservation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }

  await auditLogger.logBusinessEvent(
    'DELETE',
    'reservations',
    id,
    'Reservation deleted'
  );
};

// Log a reservation status change
export const logStatusChange = async (
  reservationId: string,
  previousStatus: ReservationStatus,
  newStatus: ReservationStatus,
  notes?: string
): Promise<void> => {
  const { error } = await supabase
    .from('reservation_status_history')
    .insert({
      reservation_id: reservationId,
      previous_status: previousStatus,
      new_status: newStatus,
      notes: notes
    });

  if (error) {
    console.error('Error logging status change:', error);
    throw error;
  }
};

// Get status history for a reservation
export const getStatusHistory = async (reservationId: string): Promise<ReservationStatusHistory[]> => {
  const { data, error } = await supabase
    .from('reservation_status_history')
    .select('*')
    .eq('reservation_id', reservationId)
    .order('changed_at', { ascending: false });

  if (error) {
    console.error('Error fetching status history:', error);
    throw error;
  }

  return data as ReservationStatusHistory[];
};

// Create a new deposit
export const createDeposit = async (deposit: Omit<Deposit, 'id' | 'created_at'>): Promise<Deposit> => {
  const { data, error } = await supabase
    .from('deposits')
    .insert(deposit)
    .select()
    .single();

  if (error) {
    console.error('Error creating deposit:', error);
    throw error;
  }

  // If deposit was successful, update the reservation status
  if (deposit.payment_status === 'completed') {
    try {
      await updateReservation(deposit.reservation_id, {
        deposit_paid: true,
        deposit_date: deposit.payment_date,
        status: 'Deposit Paid'
      });
    } catch (updateError) {
      console.error('Error updating reservation after deposit:', updateError);
      // Continue even if the update fails, since the deposit was recorded
    }
  }

  await auditLogger.logBusinessEvent(
    'CREATE',
    'deposits',
    data.id,
    `Deposit of ${deposit.amount} recorded for reservation ${deposit.reservation_id}`
  );

  return data as Deposit;
};

// Get all deposits for a reservation
export const getDepositsByReservation = async (reservationId: string): Promise<Deposit[]> => {
  const { data, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('reservation_id', reservationId)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching deposits:', error);
    throw error;
  }

  return data as Deposit[];
};

// Update a deposit
export const updateDeposit = async (id: string, updates: Partial<Deposit>): Promise<Deposit> => {
  const { data, error } = await supabase
    .from('deposits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating deposit:', error);
    throw error;
  }

  // If deposit status was updated to completed, update the reservation
  if (updates.payment_status === 'completed') {
    try {
      const deposit = data as Deposit;
      await updateReservation(deposit.reservation_id, {
        deposit_paid: true,
        deposit_date: deposit.payment_date,
        status: 'Deposit Paid'
      });
    } catch (updateError) {
      console.error('Error updating reservation after deposit update:', updateError);
      // Continue even if the update fails
    }
  }

  await auditLogger.logBusinessEvent(
    'UPDATE',
    'deposits',
    id,
    `Deposit updated: ${JSON.stringify(updates)}`
  );

  return data as Deposit;
};
