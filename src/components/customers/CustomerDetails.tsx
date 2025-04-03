
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

const CustomerDetails: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading customer details..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Error Loading Customer" 
        message="Could not load the customer details." 
      />
    );
  }

  // Create display name from first and last name
  const customerName = customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer';
  
  // Parse metadata for additional fields
  const metadata = customer?.metadata || {};
  const { 
    preferred_contact_method, 
    interested_in, 
    city, 
    state, 
    zip 
  } = typeof metadata === 'object' ? metadata : {};

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center" 
        onClick={() => navigate('/customers')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Customers
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{customerName}</h1>
          <p className="text-muted-foreground">{customer?.email}</p>
        </div>
        <Button onClick={() => navigate(`/customers/${customerId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Customer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd>{customer?.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Phone</dt>
                <dd>{customer?.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Address</dt>
                <dd>
                  {customer?.address ? (
                    <div>
                      <p>{customer.address}</p>
                      {city && state && (
                        <p>{city}, {state} {zip}</p>
                      )}
                    </div>
                  ) : (
                    'Not provided'
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Preferred Contact Method</dt>
                <dd>{preferred_contact_method || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Interested In</dt>
                <dd>{interested_in || 'Not specified'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {customer?.notes || 'No notes have been added for this customer.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetails;
