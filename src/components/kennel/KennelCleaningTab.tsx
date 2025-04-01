
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Broom } from 'lucide-react';
import { KennelCleaning, KennelUnit } from '@/types/kennel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KennelCleaningForm from './forms/KennelCleaningForm';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/standardized';
import { format, parseISO } from 'date-fns';

interface KennelCleaningTabProps {
  cleaningRecords: KennelCleaning[];
  kennelUnits: KennelUnit[];
  loading: boolean;
  addCleaningRecord: (cleaning: Omit<KennelCleaning, 'id' | 'created_at'>) => Promise<KennelCleaning>;
}

const KennelCleaningTab: React.FC<KennelCleaningTabProps> = ({ 
  cleaningRecords, 
  kennelUnits,
  loading,
  addCleaningRecord
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCleaningRecord = async (data: Omit<KennelCleaning, 'id' | 'created_at'>) => {
    await addCleaningRecord(data);
    setIsAddDialogOpen(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cleaning Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cleaning Records</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={kennelUnits.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Cleaning Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cleaning Record</DialogTitle>
            </DialogHeader>
            <KennelCleaningForm 
              onSubmit={handleAddCleaningRecord} 
              kennelUnits={kennelUnits}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {cleaningRecords.length === 0 ? (
          <EmptyState 
            title="No Cleaning Records" 
            description="Add cleaning records to track kennel sanitation."
            icon={<Broom className="h-12 w-12 text-muted-foreground" />}
            action={
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                disabled={kennelUnits.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Cleaning Record
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Kennel Unit</TableHead>
                  <TableHead>Cleaning Type</TableHead>
                  <TableHead>Cleaned By</TableHead>
                  <TableHead>Products Used</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cleaningRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(parseISO(record.cleaning_date), 'MMM d, yyyy h:mm a')}</TableCell>
                    <TableCell className="font-medium">{record.kennel_unit?.name || '-'}</TableCell>
                    <TableCell>
                      {record.cleaning_type.charAt(0).toUpperCase() + record.cleaning_type.slice(1)}
                    </TableCell>
                    <TableCell>{record.cleaned_by}</TableCell>
                    <TableCell>
                      {record.products_used && record.products_used.length > 0 
                        ? record.products_used.join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell>{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KennelCleaningTab;
