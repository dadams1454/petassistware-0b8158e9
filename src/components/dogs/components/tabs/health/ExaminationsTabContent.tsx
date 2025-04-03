
import React from 'react';
import { EmptyState, LoadingState } from '@/components/ui/standardized';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecordTypeEnum } from '@/types/health';

const ExaminationsTabContent: React.FC = () => {
  const { 
    healthRecords, 
    isLoading, 
    getRecordsByType, 
    handleAddRecord,
    handleEditRecord 
  } = useHealthTabContext();
  
  const examinations = getRecordsByType(HealthRecordTypeEnum.EXAMINATION);
  
  if (isLoading) {
    return <LoadingState message="Loading examination records..." />;
  }
  
  if (examinations.length === 0) {
    return (
      <EmptyState
        title="No examination records"
        description="Add your first examination record to keep track of your dog's health checks."
        action={{
          label: "Add Examination",
          onClick: () => handleAddRecord(HealthRecordTypeEnum.EXAMINATION)
        }}
      />
    );
  }
  
  // Sort examinations by date (newest first)
  const sortedExaminations = [...examinations].sort(
    (a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => handleAddRecord(HealthRecordTypeEnum.EXAMINATION)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Examination
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {sortedExaminations.map(exam => (
          <Card key={exam.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleEditRecord(exam.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{exam.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(exam.visit_date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {exam.description || 'No details provided'}
                </p>
                {exam.performed_by && (
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Performed by:</span> {exam.performed_by}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExaminationsTabContent;
