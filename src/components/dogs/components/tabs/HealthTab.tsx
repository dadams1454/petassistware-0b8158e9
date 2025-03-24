
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import HealthRecordDialog from '../profile/records/HealthRecordDialog';
import { HealthRecord } from '@/types/dog';

interface HealthTabProps {
  dogId: string;
}

const HealthTab: React.FC<HealthTabProps> = ({ dogId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  
  const { 
    healthRecords, 
    isLoading, 
    refetch,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
  } = useHealthRecords(dogId);
  
  const handleAddRecord = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };
  
  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleSaveRecord = async () => {
    setDialogOpen(false);
    await refetch();
  };
  
  // Helper function to filter records by type
  const getRecordsByType = (type: HealthRecord['record_type']) => {
    return healthRecords?.filter(record => record.record_type === type) || [];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-muted">
        <AlertDescription>
          Track health records, vaccinations, and medical history.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Health Records</h2>
        <Button onClick={handleAddRecord}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      <Tabs defaultValue="all-records">
        <TabsList>
          <TabsTrigger value="all-records">All Records</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-records" className="pt-4">
          {healthRecords && healthRecords.length > 0 ? (
            <div className="space-y-4">
              {healthRecords.map(record => (
                <Card 
                  key={record.id} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleEditRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {record.record_type}
                        </p>
                        {record.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {record.description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No health records found</p>
                <Button variant="outline" className="mt-2" onClick={handleAddRecord}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Health Record
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vaccinations" className="pt-4">
          {getRecordsByType('vaccination').length > 0 ? (
            <div className="space-y-4">
              {getRecordsByType('vaccination').map(record => (
                <Card 
                  key={record.id} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleEditRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        {record.next_due_date && (
                          <p className="text-sm text-amber-600 mt-1">
                            Next due: {new Date(record.next_due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No vaccination records found</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={handleAddRecord}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Vaccination
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="examinations" className="pt-4">
          {getRecordsByType('examination').length > 0 ? (
            <div className="space-y-4">
              {getRecordsByType('examination').map(record => (
                <Card 
                  key={record.id} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleEditRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Performed by: {record.performed_by}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No examination records found</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={handleAddRecord}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Examination
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="medications" className="pt-4">
          {getRecordsByType('medication').length > 0 ? (
            <div className="space-y-4">
              {getRecordsByType('medication').map(record => (
                <Card 
                  key={record.id} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleEditRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        {record.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {record.description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No medication records found</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={handleAddRecord}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <HealthRecordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dogId={dogId}
        record={selectedRecord}
        onSave={handleSaveRecord}
      />
    </div>
  );
};

export default HealthTab;
