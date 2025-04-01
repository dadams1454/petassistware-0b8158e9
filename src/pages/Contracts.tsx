
import React, { useState } from 'react';
import ContractsList from '@/components/contracts/ContractsList';
import { SectionHeader } from '@/components/ui/standardized';
import { Plus } from 'lucide-react';
import ContractDialog from '@/components/contracts/ContractDialog';
import PageContainer from '@/components/common/PageContainer';

const Contracts = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  return (
    <PageContainer>
      <div className="container max-w-7xl mx-auto py-6 space-y-6">
        <SectionHeader
          title="Contract Management"
          description="Create and manage contracts for puppy sales and more"
          action={{
            label: "Create Contract",
            onClick: () => setIsCreateDialogOpen(true),
            icon: <Plus className="h-4 w-4 mr-2" />,
          }}
        />
        
        <ContractsList />
        
        <ContractDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </PageContainer>
  );
};

export default Contracts;
