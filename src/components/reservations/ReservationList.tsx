
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Reservation } from '@/types/reservation';
import * as reservationService from '@/services/reservationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CreditCard, FileEdit, Eye, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Link } from 'react-router-dom';

interface ReservationListProps {
  onViewReservation?: (id: string) => void;
  onCreateReservation?: () => void;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  onViewReservation,
  onCreateReservation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    data: reservations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationService.getReservations
  });

  const filteredReservations = reservations?.filter(reservation => {
    const matchesSearch = 
      searchTerm === '' ||
      reservation.puppy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'Approved':
        return <Badge variant="secondary">Approved</Badge>;
      case 'Deposit Paid':
        return <Badge variant="default">Deposit Paid</Badge>;
      case 'Contract Signed':
        return <Badge variant="default">Contract Signed</Badge>;
      case 'Ready for Pickup':
        return <Badge variant="default">Ready for Pickup</Badge>;
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleViewReservation = (id: string) => {
    if (onViewReservation) {
      onViewReservation(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Reservations</CardTitle>
            <CardDescription>
              Manage puppy reservations and deposits
            </CardDescription>
          </div>
          <Button onClick={onCreateReservation}>
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Input
            placeholder="Search by puppy or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:max-w-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Deposit Paid">Deposit Paid</SelectItem>
              <SelectItem value="Contract Signed">Contract Signed</SelectItem>
              <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading reservations</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : filteredReservations && filteredReservations.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Puppy</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      {reservation.puppy?.name || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      {reservation.customer 
                        ? `${reservation.customer.first_name} ${reservation.customer.last_name}`
                        : 'Not assigned'
                      }
                    </TableCell>
                    <TableCell>
                      {formatDate(reservation.reservation_date)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(reservation.status)}
                    </TableCell>
                    <TableCell>
                      {reservation.deposit_paid ? (
                        <>
                          <span className="text-green-600">Paid</span>
                          {reservation.deposit_date && (
                            <span className="text-xs block text-muted-foreground">
                              {formatDate(reservation.deposit_date)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-amber-600">Not paid</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewReservation(reservation.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewReservation(reservation.id)}
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewReservation(reservation.id)}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reservations found</p>
            {onCreateReservation && (
              <Button variant="outline" onClick={onCreateReservation} className="mt-2">
                Create a Reservation
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
