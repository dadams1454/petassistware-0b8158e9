
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Syringe, 
  Stethoscope, 
  Pill, 
  Weight, 
  LineChart, 
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthProvider, useHealth } from '@/contexts/HealthProvider';
import { SectionHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import HealthRecordCard from './HealthRecordCard';
import MedicationCard from './MedicationCard';
import { Card, CardContent } from '@/components/ui/card';

interface UnifiedHealthDashboardProps {
  dogId: string;
  dogName: string;
}

// Inner component that uses context
const HealthDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const {
    healthRecords,
    isLoadingHealthRecords,
    medications,
    isLoadingMedications,
    weightRecords,
    isLoadingWeightRecords,
    healthIndicators,
    isLoadingHealthIndicators,
    // Actions
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addMedication,
    updateMedication,
    deleteMedication,
    addWeightRecord,
    deleteWeightRecord
  } = useHealth();

  const isLoading = 
    isLoadingHealthRecords || 
    isLoadingMedications || 
    isLoadingWeightRecords || 
    isLoadingHealthIndicators;

  if (isLoading) {
    return <LoadingState message="Loading health data..." />;
  }

  // Filter health records by type
  const vaccinationRecords = healthRecords
    .filter(record => record.record_type === 'VACCINATION')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const examinationRecords = healthRecords
    .filter(record => record.record_type === 'EXAMINATION')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Sort medications by status (active first)
  const sortedMedications = [...medications]
    .sort((a, b) => {
      // Active medications first
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      // Then sort by start date (newest first)
      return new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime();
    });
    
  // Sort weight records by date (newest first)
  const sortedWeightRecords = [...weightRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  // Get latest health indicators
  const latestHealthIndicators = [...healthIndicators]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const abnormalHealthIndicators = healthIndicators
    .filter(indicator => indicator.abnormal)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Health Management"
        description="Comprehensive view of all health data, medications, and indicators"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-2">
            <Syringe className="h-4 w-4" />
            <span>Vaccinations</span>
          </TabsTrigger>
          <TabsTrigger value="examinations" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span>Examinations</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="weight" className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            <span>Weight</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Recent Vaccinations</h3>
                {vaccinationRecords.length > 0 ? (
                  <div className="space-y-4">
                    {vaccinationRecords.slice(0, 3).map(record => (
                      <HealthRecordCard 
                        key={record.id} 
                        record={record} 
                        onEdit={(record) => console.log('Edit vaccination', record)}
                        onDelete={(id) => console.log('Delete vaccination', id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No vaccination records</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Active Medications</h3>
                {sortedMedications.filter(med => med.status === 'active').length > 0 ? (
                  <div className="space-y-4">
                    {sortedMedications
                      .filter(med => med.status === 'active')
                      .slice(0, 3)
                      .map(medication => (
                        <MedicationCard 
                          key={medication.id} 
                          medication={medication} 
                          onEdit={(med) => console.log('Edit medication', med)}
                          onDelete={(id) => console.log('Delete medication', id)}
                          onLogAdministration={(id) => console.log('Log administration', id)}
                        />
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-muted-foreground">No active medications</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Health Indicators</h3>
                {latestHealthIndicators.length > 0 ? (
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-muted-foreground border-b">
                          <th className="text-left font-medium pb-2">Date</th>
                          <th className="text-left font-medium pb-2">Appetite</th>
                          <th className="text-left font-medium pb-2">Energy</th>
                          <th className="text-left font-medium pb-2">Stool</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestHealthIndicators.map(indicator => (
                          <tr key={indicator.id} className={`border-b ${indicator.abnormal ? 'text-amber-600' : ''}`}>
                            <td className="py-2 text-sm">
                              {new Date(indicator.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 text-sm capitalize">{indicator.appetite}</td>
                            <td className="py-2 text-sm capitalize">{indicator.energy}</td>
                            <td className="py-2 text-sm capitalize">{indicator.stool_consistency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No health indicators</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Recent Examinations</h3>
                {examinationRecords.length > 0 ? (
                  <div className="space-y-4">
                    {examinationRecords.slice(0, 3).map(record => (
                      <HealthRecordCard 
                        key={record.id} 
                        record={record} 
                        onEdit={(record) => console.log('Edit examination', record)}
                        onDelete={(id) => console.log('Delete examination', id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No examination records</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Weight History</h3>
                {sortedWeightRecords.length > 0 ? (
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-muted-foreground border-b">
                          <th className="text-left font-medium pb-2">Date</th>
                          <th className="text-left font-medium pb-2">Weight</th>
                          <th className="text-left font-medium pb-2">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedWeightRecords.slice(0, 5).map(record => (
                          <tr key={record.id} className="border-b">
                            <td className="py-2 text-sm">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 text-sm">
                              {record.weight} {record.weight_unit}
                            </td>
                            <td className="py-2 text-sm">
                              {record.percent_change !== undefined ? (
                                <span className={record.percent_change > 0 ? 'text-green-600' : record.percent_change < 0 ? 'text-red-600' : ''}>
                                  {record.percent_change > 0 ? '+' : ''}{record.percent_change.toFixed(1)}%
                                </span>
                              ) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No weight records</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="vaccinations" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Vaccination Records</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vaccination
            </Button>
          </div>
          
          {vaccinationRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaccinationRecords.map(record => (
                <HealthRecordCard 
                  key={record.id} 
                  record={record} 
                  onView={(record) => console.log('View vaccination', record)}
                  onEdit={(record) => console.log('Edit vaccination', record)}
                  onDelete={(id) => deleteHealthRecord(id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No vaccination records found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="examinations" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Examination Records</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Examination
            </Button>
          </div>
          
          {examinationRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examinationRecords.map(record => (
                <HealthRecordCard 
                  key={record.id} 
                  record={record} 
                  onView={(record) => console.log('View examination', record)}
                  onEdit={(record) => console.log('Edit examination', record)}
                  onDelete={(id) => deleteHealthRecord(id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No examination records found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="medications" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Medications</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </div>
          
          {sortedMedications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedMedications.map(medication => (
                <MedicationCard 
                  key={medication.id} 
                  medication={medication} 
                  onView={(med) => console.log('View medication', med)}
                  onEdit={(med) => console.log('Edit medication', med)}
                  onDelete={(id) => deleteMedication(id)}
                  onLogAdministration={(id) => console.log('Log administration', id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No medications found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="weight" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Weight Records</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Weight
            </Button>
          </div>
          
          {sortedWeightRecords.length > 0 ? (
            <div>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Weight</th>
                      <th className="text-left p-3 font-medium">Change</th>
                      <th className="text-left p-3 font-medium">Notes</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWeightRecords.map(record => (
                      <tr key={record.id} className="border-t">
                        <td className="p-3">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {record.weight} {record.weight_unit}
                        </td>
                        <td className="p-3">
                          {record.percent_change !== undefined ? (
                            <span className={record.percent_change > 0 ? 'text-green-600' : record.percent_change < 0 ? 'text-red-600' : ''}>
                              {record.percent_change > 0 ? '+' : ''}{record.percent_change.toFixed(1)}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-3">{record.notes || '-'}</td>
                        <td className="p-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteWeightRecord(record.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No weight records found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Wrapper component that provides the context
const UnifiedHealthDashboard: React.FC<UnifiedHealthDashboardProps> = ({ dogId, dogName }) => {
  return (
    <HealthProvider dogId={dogId}>
      <HealthDashboardContent />
    </HealthProvider>
  );
};

export default UnifiedHealthDashboard;
