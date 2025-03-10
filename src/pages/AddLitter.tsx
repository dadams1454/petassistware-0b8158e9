
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import LitterForm from '@/components/litters/LitterForm';
import { toast } from '@/components/ui/use-toast';
import DashboardCard from '@/components/dashboard/DashboardCard';

const AddLitter = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Litter created successfully.",
    });
    navigate('/litters');
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/litters')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Add New Litter</h1>
        </div>

        <DashboardCard>
          <div className="p-6">
            <LitterForm onSuccess={handleSuccess} onCancel={() => navigate('/litters')} />
          </div>
        </DashboardCard>
      </div>
    </MainLayout>
  );
};

export default AddLitter;
