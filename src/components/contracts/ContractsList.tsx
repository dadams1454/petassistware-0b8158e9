
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, FileText, Edit, Trash2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getContracts, deleteContract, Contract } from '@/services/contractService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ContractPreviewDialog from './ContractPreviewDialog';
import { downloadContract } from '@/utils/contracts/download';

interface ContractsListProps {
  puppyId?: string;
  customerId?: string;
  showFilters?: boolean;
  limit?: number;
}

const ContractsList: React.FC<ContractsListProps> = ({ 
  puppyId, 
  customerId,
  showFilters = true,
  limit
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [previewContract, setPreviewContract] = useState<Contract | null>(null);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);

  // Query contracts based on filters
  const { data: contracts, isLoading, refetch } = useQuery({
    queryKey: ['contracts', puppyId, customerId, statusFilter, typeFilter],
    queryFn: async () => {
      try {
        return await getContracts({ puppyId, customerId, status: statusFilter !== 'all' ? statusFilter : undefined, contractType: typeFilter !== 'all' ? typeFilter : undefined });
      } catch (error) {
        console.error('Error fetching contracts:', error);
        toast({
          title: 'Error fetching contracts',
          description: 'Unable to load contracts. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  const handleDeleteContract = async () => {
    if (!contractToDelete) return;
    
    try {
      await deleteContract(contractToDelete);
      toast({
        title: 'Contract deleted',
        description: 'The contract has been successfully deleted.',
      });
      refetch();
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contract. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setContractToDelete(null);
    }
  };

  const handleDownloadContract = async (contract: Contract) => {
    try {
      if (contract.pdf_url) {
        window.open(contract.pdf_url, '_blank');
      } else {
        // Generate contract PDF on-the-fly if no PDF exists
        await downloadContract(contract);
        toast({
          title: 'Contract Downloaded',
          description: 'The contract has been downloaded successfully.',
        });
      }
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast({
        title: 'Download Failed',
        description: 'Unable to download the contract. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter contracts based on search term
  const filteredContracts = contracts?.filter(contract => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const customerName = contract.customer ? 
      `${contract.customer.first_name} ${contract.customer.last_name}`.toLowerCase() : '';
    
    return (
      customerName.includes(searchTermLower) ||
      (contract.puppy?.name && contract.puppy.name.toLowerCase().includes(searchTermLower)) ||
      (contract.contract_type && contract.contract_type.toLowerCase().includes(searchTermLower))
    );
  });

  // Limit the number of contracts shown if limit is provided
  const displayedContracts = limit && filteredContracts ? 
    filteredContracts.slice(0, limit) : 
    filteredContracts;

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'signed':
        return "success";
      case 'draft':
        return "secondary";
      case 'sent':
        return "warning";
      case 'completed':
        return "default";
      case 'cancelled':
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:max-w-xs"
          />
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pet">Pet</SelectItem>
                <SelectItem value="breeding">Breeding</SelectItem>
                <SelectItem value="co-ownership">Co-ownership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {displayedContracts?.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No contracts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating a new contract'}
          </p>
          {!puppyId && !customerId && (
            <div className="mt-6">
              <Button 
                onClick={() => navigate('/contracts/new')}
                className="mx-auto"
              >
                <FileText className="mr-2 h-4 w-4" />
                Create New Contract
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedContracts?.map((contract) => (
            <Card key={contract.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">
                      {contract.contract_type ? 
                        contract.contract_type.charAt(0).toUpperCase() + contract.contract_type.slice(1) : 'Unknown'} Contract
                    </h3>
                    <Badge 
                      variant={getStatusBadgeVariant(contract.status) as any}
                      className="ml-2"
                    >
                      {contract.status ? 
                        contract.status.charAt(0).toUpperCase() + contract.status.slice(1) : 'Unknown'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Date: {contract.contract_date ? format(new Date(contract.contract_date), 'MMM d, yyyy') : 'Not specified'}
                  </p>
                  {contract.customer && (
                    <p className="text-sm text-gray-600">
                      Customer: {contract.customer.first_name} {contract.customer.last_name}
                    </p>
                  )}
                  {contract.puppy && (
                    <p className="text-sm text-gray-600">
                      Puppy: {contract.puppy.name || "Unnamed puppy"}
                    </p>
                  )}
                  {contract.price && (
                    <p className="text-sm text-gray-600">
                      Price: ${contract.price}
                    </p>
                  )}
                  {contract.signed && contract.signed_date && (
                    <p className="text-sm text-gray-600">
                      Signed: {format(new Date(contract.signed_date), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
                
                <div className="flex mt-3 md:mt-0 space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setPreviewContract(contract)}
                    title="Preview Contract"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadContract(contract)}
                    title="Download Contract"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                    title="Edit Contract"
                    disabled={contract.signed}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Delete Contract"
                        disabled={contract.signed}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the contract
                          and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setContractToDelete(contract.id);
                            handleDeleteContract();
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {previewContract && (
        <ContractPreviewDialog
          isOpen={!!previewContract}
          onOpenChange={() => setPreviewContract(null)}
          contractId={previewContract.id}
        />
      )}
    </div>
  );
};

export default ContractsList;
