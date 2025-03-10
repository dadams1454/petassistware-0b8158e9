
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { getContractsByPuppyId, Contract } from '@/services/contractService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

interface ContractsListProps {
  puppyId: string;
}

const ContractsList: React.FC<ContractsListProps> = ({ puppyId }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user || !puppyId) return;
      
      setLoading(true);
      try {
        const data = await getContractsByPuppyId(puppyId);
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [puppyId, user]);

  if (loading) {
    return <div className="py-4 text-center text-muted-foreground">Loading contracts...</div>;
  }

  if (contracts.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">No contracts found for this puppy.</div>;
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <Card key={contract.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{getContractTypeLabel(contract.contract_type)}</CardTitle>
              </div>
              <SignedStatus signed={contract.signed} />
            </div>
            <CardDescription>{format(new Date(contract.contract_date), 'MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="text-sm">
                  {contract.customer ? 
                    `${contract.customer.first_name} ${contract.customer.last_name}` : 
                    'No customer assigned'}
                </p>
              </div>
              {contract.price && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-sm font-medium">${contract.price.toFixed(2)}</p>
                </div>
              )}
              {contract.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm">{contract.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const SignedStatus: React.FC<{ signed?: boolean | null }> = ({ signed }) => {
  if (signed) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Signed
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
      <XCircle className="h-3 w-3 mr-1" />
      Unsigned
    </Badge>
  );
};

function getContractTypeLabel(type: string | null): string {
  if (!type) return 'Contract';
  
  const typeMap: Record<string, string> = {
    'purchase': 'Purchase Agreement',
    'health_guarantee': 'Health Guarantee',
    'spay_neuter': 'Spay/Neuter Agreement',
    'co_ownership': 'Co-Ownership Agreement',
    'breeding_rights': 'Breeding Rights Agreement',
    'deposit': 'Deposit Agreement',
    'other': 'Other Contract'
  };
  
  return typeMap[type] || 'Contract';
}

export default ContractsList;
