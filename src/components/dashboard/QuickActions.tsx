
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, File } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import BlurBackground from '@/components/ui/blur-background';

const QuickActions: React.FC = () => {
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
          >
            New Litter
          </CustomButton>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<PlusCircle size={16} />}
            asChild
          >
            <Link to="/dogs/new">Add Dog</Link>
          </CustomButton>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<File size={16} />}
          >
            Create Contract
          </CustomButton>
        </div>
      </div>
    </BlurBackground>
  );
};

export default QuickActions;
