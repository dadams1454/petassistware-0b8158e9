
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, File, Calendar, UtensilsCrossed } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import BlurBackground from '@/components/ui/blur-background';
import { useToast } from '@/components/ui/use-toast';

interface QuickActionsProps {
  onCareLogClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onCareLogClick }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Quick action handlers
  const handleNewLitter = () => {
    navigate('/litters?action=add');
    toast({
      title: "New Litter",
      description: "Redirecting to create a new litter...",
    });
  };

  const handleAddDog = () => {
    navigate('/dogs?action=add');
    toast({
      title: "Add Dog",
      description: "Redirecting to add a new dog...",
    });
  };

  const handleCreateContract = () => {
    navigate('/documents?action=create-contract');
    toast({
      title: "Create Contract",
      description: "Redirecting to contract creation...",
    });
  };

  const handleCreateEvent = () => {
    navigate('/calendar?action=create');
    toast({
      title: "Create Event",
      description: "Redirecting to create a new event...",
    });
  };

  return (
    <BlurBackground
      className="p-4 sm:p-6 rounded-xl mb-8 overflow-hidden relative"
      intensity="md"
      opacity="light"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-[-1]" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Frequently used features for your daily operations
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <CustomButton 
            variant="primary" 
            size="sm" 
            icon={<PlusCircle size={16} />}
            onClick={handleNewLitter}
          >
            New Litter
          </CustomButton>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<PlusCircle size={16} />}
            onClick={handleAddDog}
          >
            Add Dog
          </CustomButton>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<UtensilsCrossed size={16} />}
            onClick={onCareLogClick}
          >
            Log Daily Care
          </CustomButton>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<File size={16} />}
            onClick={handleCreateContract}
          >
            Create Contract
          </CustomButton>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<Calendar size={16} />}
            onClick={handleCreateEvent}
          >
            Add Event
          </CustomButton>
        </div>
      </div>
    </BlurBackground>
  );
};

export default QuickActions;
