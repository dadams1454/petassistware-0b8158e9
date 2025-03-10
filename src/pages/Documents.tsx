
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContractsList from '@/components/contracts/ContractsList';
import ContractDialog from '@/components/contracts/ContractDialog';
import { useToast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import { Plus, FileText } from 'lucide-react';

const Documents = () => {
  const { toast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get('action');
  const [open, setOpen] = React.useState(action === 'create-contract');

  React.useEffect(() => {
    if (action === 'create-contract') {
      setOpen(true);
    }
  }, [action]);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Contract created successfully",
      variant: "default",
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Documents</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage your contracts and other documents
          </p>
        </div>
        <ContractDialog 
          trigger={
            <CustomButton variant="primary" icon={<Plus size={16} />}>
              Create Contract
            </CustomButton>
          }
          onSuccess={handleSuccess}
        />
      </div>

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="contracts" className="mt-4">
          <ContractsList />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <div className="p-6 text-center border border-dashed rounded-lg border-slate-200 dark:border-slate-700">
            <FileText className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-2" />
            <h3 className="text-lg font-medium">Contract Templates</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Create reusable contract templates to quickly generate standard agreements for your breeding business.
            </p>
            <CustomButton 
              variant="outline" 
              className="mt-4"
              icon={<Plus size={16} />}
            >
              Create Template
            </CustomButton>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Documents;
