
import React from 'react';
import { Customer } from '../../types/customer';

interface CustomerDetailsProps {
  customer: Customer;
  puppy: any | null;
  litter: any | null;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ 
  customer, 
  puppy, 
  litter 
}) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <h3 className="font-semibold mb-2">Contact Information</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground mr-2">Email:</span>
            {customer.email || 'N/A'}
          </p>
          <p>
            <span className="text-muted-foreground mr-2">Phone:</span>
            {customer.phone || 'N/A'}
          </p>
          <p>
            <span className="text-muted-foreground mr-2">Address:</span>
            {customer.address || 'N/A'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Customer Details</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground mr-2">Type:</span>
            {customer.metadata?.customer_type === 'returning' ? 'Returning Customer' : 'New Customer'}
          </p>
          <p>
            <span className="text-muted-foreground mr-2">Customer Since:</span>
            {customer.metadata?.customer_since || 'N/A'}
          </p>
          <p>
            <span className="text-muted-foreground mr-2">Waitlist Type:</span>
            {customer.metadata?.waitlist_type === 'open' ? 'Open Waitlist (Any Future Litter)' : 'Specific Litter'}
          </p>
        </div>
      </div>

      {litter && <LitterDetails litter={litter} />}
      {puppy && <PuppyDetails puppy={puppy} />}

      {customer.notes && (
        <div>
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
        </div>
      )}
    </div>
  );
};

const LitterDetails: React.FC<{ litter: any }> = ({ litter }) => (
  <div>
    <h3 className="font-semibold mb-2">Interested Litter</h3>
    <div className="space-y-1 text-sm">
      <p>
        <span className="text-muted-foreground mr-2">Litter Name:</span>
        {litter.litter_name || 'Unnamed Litter'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Dam:</span>
        {litter.dam?.name || 'N/A'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Sire:</span>
        {litter.sire?.name || 'N/A'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Birth Date:</span>
        {litter.birth_date ? new Date(litter.birth_date).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  </div>
);

const PuppyDetails: React.FC<{ puppy: any }> = ({ puppy }) => (
  <div>
    <h3 className="font-semibold mb-2">Interested Puppy</h3>
    <div className="space-y-1 text-sm">
      <p>
        <span className="text-muted-foreground mr-2">Puppy Name:</span>
        {puppy.name || 'Unnamed'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Litter:</span>
        {(puppy.litters as any)?.litter_name || 'N/A'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Color:</span>
        {puppy.color || 'N/A'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Gender:</span>
        {puppy.gender || 'N/A'}
      </p>
      <p>
        <span className="text-muted-foreground mr-2">Status:</span>
        {puppy.status || 'N/A'}
      </p>
    </div>
  </div>
);

export default CustomerDetails;
