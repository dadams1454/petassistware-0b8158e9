
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContractsByPuppyId } from '@/services/contractService';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  if (!contracts?.length) {
    return (
      <div className="text-center p-6 border border-dashed rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">No contracts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contracts?.map((contract) => (
        <Card key={contract.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {contract.contract_type || 'Sale'} Contract
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
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant={contract.signed ? "success" : "default"}
                className="mb-2"
              >
                {contract.signed ? (
                  <><Check className="w-3 h-3 mr-1" /> Signed</>
                ) : (
                  <><X className="w-3 h-3 mr-1" /> Unsigned</>
                )}
              </Badge>
              <Link to={`/contracts/${contract.id}`}>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  View Contract
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContractsList;
