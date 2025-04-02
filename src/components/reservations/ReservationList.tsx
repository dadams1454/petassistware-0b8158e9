
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/standardized';

const ReservationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const query = supabase
        .from('reservations')
        .select(`
          *,
          customer:customer_id(name, email),
          litter:litter_id(name, whelp_date)
        `);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
  
  // Filter reservations based on search query and status filter
  const filteredReservations = reservations?.filter((reservation) => {
    // Apply search filter
    const searchMatches = 
      reservation.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.litter?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    
    // Apply status filter
    const statusMatches = statusFilter === 'all' || reservation.status === statusFilter;
    
    return searchMatches && statusMatches;
  });
  
  if (isLoading) {
    return <LoadingState message="Loading reservations..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="Error Loading Reservations" 
        message="Could not load the reservation data." 
      />
    );
  }
  
  if (!reservations || reservations.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reservations</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Reservation
          </Button>
        </div>
        
        <EmptyState
          title="No Reservations Found"
          description="You haven't created any reservations yet."
          action={{
            label: "Add Reservation",
            onClick: () => {}
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Reservations</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Reservation
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reservations..."
            className="pl-8 w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Status:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="placed">Placed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations?.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {reservation.customer?.name || 'Unknown Customer'}
              </CardTitle>
              <Badge className={
                reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                reservation.status === 'placed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }>
                {reservation.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Litter</p>
                  <p>{reservation.litter?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Whelp Date</p>
                  <p>{reservation.litter?.whelp_date 
                    ? new Date(reservation.litter.whelp_date).toLocaleDateString() 
                    : 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deposit</p>
                  <p>{reservation.deposit_amount 
                    ? `$${reservation.deposit_amount.toFixed(2)}` 
                    : 'No deposit'}</p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReservationPage;
