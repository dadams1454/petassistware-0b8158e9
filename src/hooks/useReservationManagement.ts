
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Reservation, ReservationStatus, Deposit, PaymentMethod } from '@/types/reservation';
import { useToast } from '@/hooks/use-toast';
import * as reservationService from '@/services/reservationService';

export const useReservationManagement = (reservationId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Fetch reservation details if reservationId is provided
  const {
    data: reservation,
    isLoading: isReservationLoading,
    error: reservationError,
    refetch: refetchReservation
  } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => reservationId ? reservationService.getReservationById(reservationId) : null,
    enabled: !!reservationId
  });

  // Fetch deposit history if reservationId is provided
  const {
    data: deposits,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposits
  } = useQuery({
    queryKey: ['deposits', reservationId],
    queryFn: () => reservationId ? reservationService.getDepositsByReservation(reservationId) : [],
    enabled: !!reservationId
  });

  // Fetch status history if reservationId is provided
  const {
    data: statusHistory,
    isLoading: isStatusHistoryLoading,
    error: statusHistoryError,
    refetch: refetchStatusHistory
  } = useQuery({
    queryKey: ['statusHistory', reservationId],
    queryFn: () => reservationId ? reservationService.getStatusHistory(reservationId) : [],
    enabled: !!reservationId
  });

  // Mutation to create a deposit
  const { mutate: createDeposit, isPending: isCreatingDeposit } = useMutation({
    mutationFn: (depositData: {
      amount: number;
      payment_method: PaymentMethod;
      notes?: string;
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    }) => {
      if (!reservationId) throw new Error('Reservation ID is required');
      
      const deposit: Omit<Deposit, 'id' | 'created_at'> = {
        reservation_id: reservationId,
        customer_id: reservation?.customer_id,
        puppy_id: reservation?.puppy_id,
        amount: depositData.amount,
        payment_date: new Date().toISOString(),
        payment_method: depositData.payment_method,
        payment_status: depositData.payment_status,
        notes: depositData.notes,
        created_by: undefined // This will be set by RLS
      };
      
      return reservationService.createDeposit(deposit);
    },
    onSuccess: () => {
      toast({
        title: 'Deposit recorded successfully',
        description: 'The deposit has been added to this reservation',
      });
      queryClient.invalidateQueries({ queryKey: ['deposits', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      setIsDepositDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating deposit:', error);
      toast({
        title: 'Error recording deposit',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });

  // Mutation to update reservation status
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (data: {
      newStatus: ReservationStatus;
      notes?: string;
    }) => {
      if (!reservationId) throw new Error('Reservation ID is required');
      
      return reservationService.updateReservation(reservationId, {
        status: data.newStatus,
        notes: data.notes
      });
    },
    onSuccess: () => {
      toast({
        title: 'Status updated successfully',
        description: 'The reservation status has been updated',
      });
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['statusHistory', reservationId] });
      setIsStatusDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast({
        title: 'Error updating status',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });

  const handleOpenDepositDialog = () => {
    setIsDepositDialogOpen(true);
  };

  const handleOpenStatusDialog = () => {
    setIsStatusDialogOpen(true);
  };

  const handleRefreshAll = async () => {
    if (reservationId) {
      await Promise.all([
        refetchReservation(),
        refetchDeposits(),
        refetchStatusHistory()
      ]);
    }
  };

  return {
    reservation,
    deposits,
    statusHistory,
    isReservationLoading,
    isDepositsLoading,
    isStatusHistoryLoading,
    reservationError,
    depositsError,
    statusHistoryError,
    createDeposit,
    updateStatus,
    isCreatingDeposit,
    isUpdatingStatus,
    isDepositDialogOpen,
    setIsDepositDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    handleOpenDepositDialog,
    handleOpenStatusDialog,
    handleRefreshAll
  };
};
