
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { renderGenderIcon } from '../litters/puppies/utils/puppyUtils';

interface CustomerWaitlistStatusProps {
  customerId: string;
}

interface WaitlistEntry {
  id: string;
  litter_id: string;
  status: 'pending' | 'contacted' | 'approved' | 'declined';
  requested_at: string;
  preferences: {
    gender_preference?: 'Male' | 'Female' | null;
    color_preference?: string | null;
  };
  position: number | null;
  litters: {
    litter_name: string | null;
    birth_date: string;
  };
}

const CustomerWaitlistStatus: React.FC<CustomerWaitlistStatusProps> = ({ customerId }) => {
  const { data: waitlistEntries, isLoading } = useQuery({
    queryKey: ['customer-waitlist', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*, litters(litter_name, birth_date)')
        .eq('customer_id', customerId)
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as WaitlistEntry[];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Contacted</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Approved</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!waitlistEntries || waitlistEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Not currently on any waitlists</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {waitlistEntries.map((entry) => (
            <div key={entry.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {entry.litters.litter_name || 'Unnamed Litter'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Litter born: {format(new Date(entry.litters.birth_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(entry.status)}
                  {entry.position && (
                    <span className="text-sm text-muted-foreground mt-1">
                      Position #{entry.position}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 text-sm">
                <p>Requested on {format(new Date(entry.requested_at), 'MMM d, yyyy')}</p>
                {(entry.preferences?.gender_preference || entry.preferences?.color_preference) && (
                  <div className="mt-1">
                    <p className="font-medium">Preferences:</p>
                    <div className="flex gap-3 mt-1">
                      {entry.preferences?.gender_preference && (
                        <div className="flex items-center">
                          {renderGenderIcon(entry.preferences.gender_preference)}
                          {entry.preferences.gender_preference}
                        </div>
                      )}
                      {entry.preferences?.color_preference && (
                        <div>Color: {entry.preferences.color_preference}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerWaitlistStatus;
