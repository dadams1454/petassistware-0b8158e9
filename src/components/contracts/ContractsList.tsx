
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContractsByPuppyId } from '@/services/contractService';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContractsListProps {
  puppyId?: string;
}

const ContractsList: React.FC<ContractsListProps> = ({ puppyId }) => {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts', puppyId],
    queryFn: () => getContractsByPuppyId(puppyId || ''),
    enabled: !!puppyId
  });

  if (isLoading) {
    return <div>Loading contracts...</div>;
  }

  return (
    <div className="space-y-4">
      {contracts?.map((contract) => (
        <Card key={contract.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {contract.contract_type} Contract
              </h3>
              <p className="text-sm text-gray-600">
                Date: {format(new Date(contract.contract_date), 'MMM d, yyyy')}
              </p>
              {contract.customer && (
                <p className="text-sm text-gray-600">
                  Customer: {contract.customer.first_name} {contract.customer.last_name}
                </p>
              )}
              {contract.price && (
                <p className="text-sm text-gray-600">
                  Price: ${contract.price}
                </p>
              )}
            </div>
            <Badge 
              variant={contract.signed ? "secondary" : "default"}
            >
              {contract.signed ? "Signed" : "Pending"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContractsList;
