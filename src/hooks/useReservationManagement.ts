
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Reservation, ReservationStatus, ReservationStatusHistory, Deposit, PaymentMethod } from '@/types/reservation';
import { useToast } from '@/hooks/use-toast';

interface CreateDepositData {
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  notes?: string;
}

interface UpdateStatusData {
  status: ReservationStatus;
  notes?: string;
}

export const useReservationManagement = (reservationId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Fetch reservation details
  const { 
    data: reservation,
    isLoading: isReservationLoading,
    isError: isReservationError,
    refetch: refetchReservation
  } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          customer:customers(*),
          puppy:puppies(*)
        `)
        .eq('id', reservationId)
        .single();
      
      if (error) throw error;
      return data as Reservation;
    }
  });

  // Fetch deposit history
  const { 
    data: deposits,
    isLoading: isDepositsLoading,
    isError: isDepositsError,
    refetch: refetchDeposits
  } = useQuery({
    queryKey: ['deposits', reservationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('reservation_id', reservationId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data as Deposit[];
    }
  });

  // Fetch status history
  const { 
    data: statusHistory,
    isLoading: isStatusHistoryLoading,
    isError: isStatusHistoryError,
    refetch: refetchStatusHistory
  } = useQuery({
    queryKey: ['statusHistory', reservationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservation_status_history')
        .select('*')
        .eq('reservation_id', reservationId)
        .order('changed_at', { ascending: false });
      
      if (error) throw error;
      return data as ReservationStatusHistory[];
    }
  });

  // Create deposit mutation
  const depositMutation = useMutation({
    mutationFn: async (depositData: CreateDepositData) => {
      if (!reservation) throw new Error('Reservation not found');
      
      // Create deposit record
      const { data: deposit, error: depositError } = await supabase
        .from('deposits')
        .insert({
          reservation_id: reservationId,
          customer_id: reservation.customer_id,
          puppy_id: reservation.puppy_id,
          amount: depositData.amount,
          payment_date: depositData.payment_date,
          payment_method: depositData.payment_method,
          payment_status: 'completed',
          notes: depositData.notes,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (depositError) throw depositError;
      
      // If this is the first deposit, update the reservation
      if (!reservation.deposit_paid) {
        const { error: updateError } = await supabase
          .from('reservations')
          .update({
            deposit_paid: true,
            deposit_amount: depositData.amount,
            deposit_date: depositData.payment_date,
            status: 'Deposit Paid',
            status_updated_at: new Date().toISOString()
          })
          .eq('id', reservationId);
        
        if (updateError) throw updateError;
        
        // Add status history record
        await supabase
          .from('reservation_status_history')
          .insert({
            reservation_id: reservationId,
            previous_status: reservation.status,
            new_status: 'Deposit Paid',
            changed_at: new Date().toISOString(),
            notes: 'Deposit recorded: ' + depositData.amount
          });
      }
      
      return deposit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['deposits', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['statusHistory', reservationId] });
      
      toast({
        title: 'Deposit Recorded',
        description: 'Deposit has been successfully recorded'
      });
      
      setIsDepositDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error Recording Deposit',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: async (statusData: UpdateStatusData) => {
      if (!reservation) throw new Error('Reservation not found');
      
      // Update reservation status
      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          status: statusData.status,
          status_updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);
      
      if (updateError) throw updateError;
      
      // Add status history record
      const { data: statusRecord, error: historyError } = await supabase
        .from('reservation_status_history')
        .insert({
          reservation_id: reservationId,
          previous_status: reservation.status,
          new_status: statusData.status,
          changed_at: new Date().toISOString(),
          notes: statusData.notes
        })
        .select()
        .single();
      
      if (historyError) throw historyError;
      
      return statusRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['statusHistory', reservationId] });
      
      toast({
        title: 'Status Updated',
        description: 'Reservation status has been successfully updated'
      });
      
      setIsStatusDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error Updating Status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Create a deposit
  const createDeposit = async (data: CreateDepositData) => {
    await depositMutation.mutateAsync(data);
  };

  // Update reservation status
  const updateStatus = async (data: UpdateStatusData) => {
    await statusMutation.mutateAsync(data);
  };

  // Handle opening deposit dialog
  const handleOpenDepositDialog = () => {
    setIsDepositDialogOpen(true);
  };

  // Handle opening status dialog
  const handleOpenStatusDialog = () => {
    setIsStatusDialogOpen(true);
  };

  // Refresh all data
  const handleRefreshAll = () => {
    refetchReservation();
    refetchDeposits();
    refetchStatusHistory();
  };

  return {
    reservation,
    deposits,
    statusHistory,
    isReservationLoading,
    isDepositsLoading,
    isStatusHistoryLoading,
    isReservationError,
    isDepositsError,
    isStatusHistoryError,
    createDeposit,
    updateStatus,
    isCreatingDeposit: depositMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
    isDepositDialogOpen,
    setIsDepositDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    handleOpenDepositDialog,
    handleOpenStatusDialog,
    handleRefreshAll
  };
};
