
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Contract } from '@/services/contractService';

interface ContractsListProps {
  puppyId?: string;
}

const ContractsList: React.FC<ContractsListProps> = ({ puppyId }) => {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts', puppyId],
    queryFn: async () => {
      let query = supabase
        .from('contracts')
        .select(`
          *,
          customer:customers(id, first_name, last_name, email, phone),
          puppy:puppies(id, name, birth_date, microchip_number, photo_url, gender, color)
        `);
      
      if (puppyId) {
        query = query.eq('puppy_id', puppyId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Contract[];
    }
  });

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        </div>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-dashed rounded-lg border-slate-200 dark:border-slate-700">
        <FileText className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600 mb-2" />
        <h3 className="text-lg font-medium">No contracts yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create your first contract by clicking the "Create Contract" button.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <Card key={contract.id} className="overflow-hidden">
          <CardHeader className="pb-4 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {contract.contract_type === 'sale' ? 'Sale Contract' : 
                 contract.contract_type === 'reservation' ? 'Reservation Agreement' :
                 contract.contract_type === 'health_guarantee' ? 'Health Guarantee' :
                 contract.contract_type === 'co_ownership' ? 'Co-Ownership Agreement' :
                 'Contract'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Created on {format(new Date(contract.contract_date), 'MMM d, yyyy')}
              </p>
            </div>
            <Badge variant={contract.signed ? "success" : "outline"}>
              {contract.signed ? "Signed" : "Unsigned"}
            </Badge>
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Customer</h4>
                {contract.customer ? (
                  <p className="text-sm">
                    {contract.customer.first_name} {contract.customer.last_name}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No customer assigned</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Puppy</h4>
                {contract.puppy ? (
                  <p className="text-sm">
                    {contract.puppy.name || 'Unnamed puppy'} 
                    {contract.puppy.gender ? ` (${contract.puppy.gender})` : ''}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No puppy assigned</p>
                )}
              </div>
              
              {contract.price && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Price</h4>
                  <p className="text-sm">${contract.price}</p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-slate-50 dark:bg-slate-900 pt-4 pb-4 flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-xs">
              <Eye className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ContractsList;
