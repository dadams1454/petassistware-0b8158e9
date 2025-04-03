
import React from 'react';
import { EmptyState, LoadingState } from '@/components/ui/standardized';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecordTypeEnum } from '@/types/health';

const VaccinationsTabContent: React.FC = () => {
  const { 
    isLoading, 
    getRecordsByType, 
    handleAddRecord,
    handleEditRecord 
  } = useHealthTabContext();
  
  const vaccinations = getRecordsByType(HealthRecordTypeEnum.VACCINATION);
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination records..." />;
  }
  
  if (vaccinations.length === 0) {
    return (
      <EmptyState
        title="No vaccination records"
        description="Add your first vaccination record to keep track of your dog's vaccinations."
        action={{
          label: "Add Vaccination",
          onClick: () => handleAddRecord(HealthRecordTypeEnum.VACCINATION)
        }}
      />
    );
  }
  
  // Sort vaccinations by date (newest first)
  const sortedVaccinations = [...vaccinations].sort(
    (a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => handleAddRecord(HealthRecordTypeEnum.VACCINATION)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vaccination
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {sortedVaccinations.map(vax => (
          <Card key={vax.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleEditRecord(vax.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{vax.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(vax.visit_date), 'MMM d, yyyy')}
                  </span>
                </div>
                {vax.next_due_date && (
                  <p className="text-sm text-muted-foreground">
                    Next due: {format(new Date(vax.next_due_date), 'MMM d, yyyy')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {vax.description || 'No details provided'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VaccinationsTabContent;
