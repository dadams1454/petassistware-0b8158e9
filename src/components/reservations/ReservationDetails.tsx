import React from 'react';
import { Reservation, ReservationStatusHistory, Deposit } from '@/types/reservation';
import { DepositDialog } from './DepositDialog';
import { StatusUpdateDialog } from './StatusUpdateDialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CreditCard, FileEdit, FileText, Plus, RefreshCcw } from 'lucide-react';
import StatusBadge from '@/components/ui/standardized/StatusBadge';
import { useReservationManagement } from '@/hooks/useReservationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import GenerateContractButton from '@/components/contracts/GenerateContractButton';

interface ReservationDetailsProps {
  reservationId: string;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservationId }) => {
  const {
    reservation,
    deposits,
    statusHistory,
    isReservationLoading,
    isDepositsLoading,
    isStatusHistoryLoading,
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
  } = useReservationManagement(reservationId);

  if (isReservationLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reservation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservation Not Found</CardTitle>
          <CardDescription>Unable to load reservation details</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The reservation you're looking for could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefreshAll} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const getStatusLabel = () => {
    switch (reservation.status) {
      case 'Pending':
        return <StatusBadge status="pending" label="Pending" />;
      case 'Approved':
        return <StatusBadge status="active" label="Approved" />;
      case 'Deposit Paid':
        return <StatusBadge status="active" label="Deposit Paid" />;
      case 'Contract Signed':
        return <StatusBadge status="active" label="Contract Signed" />;
      case 'Ready for Pickup':
        return <StatusBadge status="active" label="Ready for Pickup" />;
      case 'Completed':
        return <StatusBadge status="completed" label="Completed" />;
      case 'Cancelled':
        return <StatusBadge status="inactive" label="Cancelled" />;
      default:
        return <StatusBadge status="pending" label={reservation.status} />;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  // Check if both puppy_id and customer_id are available for contract generation
  const canGenerateContract = reservation.puppy_id && reservation.customer_id;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl">Reservation Details</CardTitle>
            <CardDescription>
              {reservation.puppy?.name 
                ? `For ${reservation.puppy.name} on ${formatDate(reservation.reservation_date)}`
                : `Created on ${formatDate(reservation.reservation_date)}`
              }
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusLabel()}
            <Button variant="outline" size="sm" onClick={handleOpenStatusDialog}>
              <FileEdit className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
              <p className="text-base font-medium">
                {reservation.customer 
                  ? `${reservation.customer.first_name} ${reservation.customer.last_name}`
                  : 'No customer assigned'
                }
              </p>
              {reservation.customer?.email && (
                <p className="text-sm text-muted-foreground">{reservation.customer.email}</p>
              )}
              {reservation.customer?.phone && (
                <p className="text-sm text-muted-foreground">{reservation.customer.phone}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Puppy</h3>
              <p className="text-base font-medium">
                {reservation.puppy 
                  ? `${reservation.puppy.name} (${reservation.puppy.gender})`
                  : 'No puppy assigned'
                }
              </p>
              {reservation.puppy?.color && (
                <p className="text-sm text-muted-foreground">{reservation.puppy.color}</p>
              )}
              {reservation.puppy?.status && (
                <Badge variant="outline" className="mt-1">
                  {reservation.puppy.status}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Deposit</h3>
              <p className="text-base font-medium">
                {reservation.deposit_paid 
                  ? `Paid (${formatCurrency(reservation.deposit_amount)})`
                  : 'Not paid'
                }
              </p>
              {reservation.deposit_date && (
                <p className="text-sm text-muted-foreground">
                  Paid on {formatDate(reservation.deposit_date)}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contract</h3>
              <p className="text-base font-medium">
                {reservation.contract_signed 
                  ? 'Signed'
                  : 'Not signed'
                }
              </p>
              {reservation.contract_date && (
                <p className="text-sm text-muted-foreground">
                  Signed on {formatDate(reservation.contract_date)}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pickup Date</h3>
              <p className="text-base font-medium">
                {reservation.pickup_date 
                  ? formatDate(reservation.pickup_date)
                  : 'Not scheduled'
                }
              </p>
            </div>
          </div>

          {reservation.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="text-base">{reservation.notes}</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="justify-between flex">
          <Button onClick={handleRefreshAll} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex space-x-2">
            <Button onClick={handleOpenDepositDialog}>
              <CreditCard className="h-4 w-4 mr-2" />
              Record Deposit
            </Button>
            
            {canGenerateContract && (
              <GenerateContractButton
                puppyId={reservation.puppy_id!}  
                customerId={reservation.customer_id!}
              />
            )}
          </div>
        </CardFooter>
      </Card>

      <Tabs defaultValue="deposits">
        <TabsList>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="history">Status History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposits" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Deposit History</CardTitle>
                <CardDescription>
                  Record of payments for this reservation
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleOpenDepositDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Deposit
              </Button>
            </CardHeader>
            <CardContent>
              {isDepositsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : deposits && deposits.length > 0 ? (
                <div className="space-y-4">
                  {deposits.map((deposit) => (
                    <div key={deposit.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{formatCurrency(deposit.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(deposit.payment_date)} · {deposit.payment_method}
                        </p>
                        {deposit.notes && (
                          <p className="text-sm mt-1">{deposit.notes}</p>
                        )}
                      </div>
                      <Badge 
                        variant={
                          deposit.payment_status === 'completed' 
                            ? 'default' 
                            : deposit.payment_status === 'pending' 
                            ? 'outline' 
                            : 'destructive'
                        }
                      >
                        {deposit.payment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No deposits recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
              <CardDescription>
                Record of status changes for this reservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isStatusHistoryLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : statusHistory && statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {statusHistory.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-start p-3 bg-muted rounded-md">
                      <div>
                        <div className="flex items-center">
                          <Badge className="mr-2">{entry.new_status}</Badge>
                          {entry.previous_status && (
                            <span className="text-sm text-muted-foreground">
                              from {entry.previous_status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(entry.changed_at)}
                        </p>
                        {entry.notes && (
                          <p className="text-sm mt-1">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No status changes recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deposit Dialog */}
      <DepositDialog
        isOpen={isDepositDialogOpen}
        onOpenChange={setIsDepositDialogOpen}
        onSubmit={createDeposit}
        isSubmitting={isCreatingDeposit}
        defaultAmount={reservation.deposit_amount}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onSubmit={updateStatus}
        isSubmitting={isUpdatingStatus}
        currentStatus={reservation.status}
      />
    </div>
  );
};
