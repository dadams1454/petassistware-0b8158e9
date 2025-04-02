
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Milk, Droplet, PawPrint, Weight, Stethoscope, Plus } from 'lucide-react';

interface PuppyCareLogProps {
  puppyId: string;
  onCareAdded?: () => void;
}

type CareType = 'feeding' | 'potty' | 'medication' | 'weight' | 'health';

interface CareLog {
  id: string;
  puppy_id: string;
  care_type: CareType;
  timestamp: string;
  notes?: string;
  details?: any;
  created_at: string;
}

const PuppyCareLog: React.FC<PuppyCareLogProps> = ({ puppyId, onCareAdded }) => {
  const [activeTab, setActiveTab] = useState<CareType>('feeding');
  const [isLoading, setIsLoading] = useState(false);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [feedingDetails, setFeedingDetails] = useState({
    amount: '',
    unit: 'ml',
    type: 'formula',
    notes: '',
  });
  
  const [pottyDetails, setPottyDetails] = useState({
    type: 'urine',
    successful: true,
    notes: '',
  });
  
  const [medicationDetails, setMedicationDetails] = useState({
    medication: '',
    dosage: '',
    unit: 'ml',
    method: 'oral',
    notes: '',
  });
  
  const [weightDetails, setWeightDetails] = useState({
    weight: '',
    unit: 'oz',
    notes: '',
  });
  
  const [healthDetails, setHealthDetails] = useState({
    category: 'general',
    notes: '',
  });

  useEffect(() => {
    if (puppyId) {
      fetchCareLogs();
    }
  }, [puppyId]);

  const fetchCareLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('puppy_care_logs')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCareLogs(data || []);
    } catch (error) {
      console.error('Error fetching care logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load care logs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let details;
      switch (activeTab) {
        case 'feeding':
          details = feedingDetails;
          break;
        case 'potty':
          details = pottyDetails;
          break;
        case 'medication':
          details = medicationDetails;
          break;
        case 'weight':
          details = weightDetails;
          break;
        case 'health':
          details = healthDetails;
          break;
      }
      
      const careLog = {
        puppy_id: puppyId,
        care_type: activeTab,
        timestamp: new Date().toISOString(),
        details,
        notes: details.notes || null,
      };
      
      const { data, error } = await supabase
        .from('puppy_care_logs')
        .insert(careLog)
        .select()
        .single();
        
      if (error) throw error;
      
      // If it's a weight entry, also add to weight_records
      if (activeTab === 'weight') {
        const weightRecord = {
          puppy_id: puppyId,
          weight: parseFloat(weightDetails.weight),
          weight_unit: weightDetails.unit,
          date: new Date().toISOString().split('T')[0],
          notes: weightDetails.notes || 'Regular weight check',
        };
        
        const { error: weightError } = await supabase
          .from('weight_records')
          .insert(weightRecord);
          
        if (weightError) throw weightError;
      }
      
      toast({
        title: 'Care log added',
        description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} record saved successfully`,
      });
      
      // Reset form based on type
      switch (activeTab) {
        case 'feeding':
          setFeedingDetails({
            amount: '',
            unit: 'ml',
            type: 'formula',
            notes: '',
          });
          break;
        case 'potty':
          setPottyDetails({
            type: 'urine',
            successful: true,
            notes: '',
          });
          break;
        case 'medication':
          setMedicationDetails({
            medication: '',
            dosage: '',
            unit: 'ml',
            method: 'oral',
            notes: '',
          });
          break;
        case 'weight':
          setWeightDetails({
            weight: '',
            unit: 'oz',
            notes: '',
          });
          break;
        case 'health':
          setHealthDetails({
            category: 'general',
            notes: '',
          });
          break;
      }
      
      // Refresh logs
      fetchCareLogs();
      
      // Call onCareAdded callback if provided
      if (onCareAdded) {
        onCareAdded();
      }
      
    } catch (error: any) {
      console.error('Error adding care log:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add care log',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'feeding':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feeding-amount">Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id="feeding-amount"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Amount"
                    value={feedingDetails.amount}
                    onChange={(e) => setFeedingDetails({ ...feedingDetails, amount: e.target.value })}
                    required
                  />
                  <Select
                    value={feedingDetails.unit}
                    onValueChange={(value) => setFeedingDetails({ ...feedingDetails, unit: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                      <SelectItem value="cc">cc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeding-type">Type</Label>
                <Select
                  value={feedingDetails.type}
                  onValueChange={(value) => setFeedingDetails({ ...feedingDetails, type: value })}
                >
                  <SelectTrigger id="feeding-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formula">Formula</SelectItem>
                    <SelectItem value="mother's milk">Mother's Milk</SelectItem>
                    <SelectItem value="supplement">Supplement</SelectItem>
                    <SelectItem value="solid food">Solid Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeding-notes">Notes</Label>
              <Textarea
                id="feeding-notes"
                placeholder="Add any notes about this feeding"
                value={feedingDetails.notes}
                onChange={(e) => setFeedingDetails({ ...feedingDetails, notes: e.target.value })}
              />
            </div>
          </div>
        );
      case 'potty':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="potty-type">Type</Label>
              <Select
                value={pottyDetails.type}
                onValueChange={(value) => setPottyDetails({ ...pottyDetails, type: value })}
              >
                <SelectTrigger id="potty-type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urine">Urine</SelectItem>
                  <SelectItem value="stool">Stool</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Successful?</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="successful-yes"
                    name="successful"
                    checked={pottyDetails.successful}
                    onChange={() => setPottyDetails({ ...pottyDetails, successful: true })}
                  />
                  <Label htmlFor="successful-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="successful-no"
                    name="successful"
                    checked={!pottyDetails.successful}
                    onChange={() => setPottyDetails({ ...pottyDetails, successful: false })}
                  />
                  <Label htmlFor="successful-no">No</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="potty-notes">Notes</Label>
              <Textarea
                id="potty-notes"
                placeholder="Add any notes about this potty break"
                value={pottyDetails.notes}
                onChange={(e) => setPottyDetails({ ...pottyDetails, notes: e.target.value })}
              />
            </div>
          </div>
        );
      case 'medication':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medication-name">Medication</Label>
              <Input
                id="medication-name"
                placeholder="Medication name"
                value={medicationDetails.medication}
                onChange={(e) => setMedicationDetails({ ...medicationDetails, medication: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication-dosage">Dosage</Label>
                <div className="flex space-x-2">
                  <Input
                    id="medication-dosage"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Dosage"
                    value={medicationDetails.dosage}
                    onChange={(e) => setMedicationDetails({ ...medicationDetails, dosage: e.target.value })}
                    required
                  />
                  <Select
                    value={medicationDetails.unit}
                    onValueChange={(value) => setMedicationDetails({ ...medicationDetails, unit: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="cc">cc</SelectItem>
                      <SelectItem value="drops">drops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medication-method">Method</Label>
                <Select
                  value={medicationDetails.method}
                  onValueChange={(value) => setMedicationDetails({ ...medicationDetails, method: value })}
                >
                  <SelectTrigger id="medication-method">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="injectable">Injectable</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medication-notes">Notes</Label>
              <Textarea
                id="medication-notes"
                placeholder="Add any notes about this medication"
                value={medicationDetails.notes}
                onChange={(e) => setMedicationDetails({ ...medicationDetails, notes: e.target.value })}
              />
            </div>
          </div>
        );
      case 'weight':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="weight-value">Weight</Label>
                <Input
                  id="weight-value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Weight"
                  value={weightDetails.weight}
                  onChange={(e) => setWeightDetails({ ...weightDetails, weight: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight-unit">Unit</Label>
                <Select
                  value={weightDetails.unit}
                  onValueChange={(value) => setWeightDetails({ ...weightDetails, unit: value })}
                >
                  <SelectTrigger id="weight-unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-notes">Notes</Label>
              <Textarea
                id="weight-notes"
                placeholder="Add any notes about this weight check"
                value={weightDetails.notes}
                onChange={(e) => setWeightDetails({ ...weightDetails, notes: e.target.value })}
              />
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="health-category">Category</Label>
              <Select
                value={healthDetails.category}
                onValueChange={(value) => setHealthDetails({ ...healthDetails, category: value })}
              >
                <SelectTrigger id="health-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Observation</SelectItem>
                  <SelectItem value="concern">Health Concern</SelectItem>
                  <SelectItem value="checkup">Routine Checkup</SelectItem>
                  <SelectItem value="developmental">Developmental</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="health-notes">Notes</Label>
              <Textarea
                id="health-notes"
                placeholder="Describe the health observation or issue"
                value={healthDetails.notes}
                onChange={(e) => setHealthDetails({ ...healthDetails, notes: e.target.value })}
                required
                rows={4}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getCareTypeIcon = (type: CareType) => {
    switch (type) {
      case 'feeding':
        return <Milk className="h-5 w-5 text-blue-500" />;
      case 'potty':
        return <Droplet className="h-5 w-5 text-yellow-500" />;
      case 'medication':
        return <Stethoscope className="h-5 w-5 text-purple-500" />;
      case 'weight':
        return <Weight className="h-5 w-5 text-green-500" />;
      case 'health':
        return <PawPrint className="h-5 w-5 text-red-500" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'h:mm a - MMM d, yyyy');
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add Care Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CareType)}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="feeding" className="flex items-center gap-1">
                <Milk className="h-4 w-4" /> Feeding
              </TabsTrigger>
              <TabsTrigger value="potty" className="flex items-center gap-1">
                <Droplet className="h-4 w-4" /> Potty
              </TabsTrigger>
              <TabsTrigger value="medication" className="flex items-center gap-1">
                <Stethoscope className="h-4 w-4" /> Meds
              </TabsTrigger>
              <TabsTrigger value="weight" className="flex items-center gap-1">
                <Weight className="h-4 w-4" /> Weight
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-1">
                <PawPrint className="h-4 w-4" /> Health
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <div className="py-2">
                {renderForm()}
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Care Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading care logs...</div>
          ) : careLogs.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No care logs recorded yet</div>
          ) : (
            <div className="space-y-4">
              {careLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 border rounded-md flex items-start gap-3"
                >
                  <div className="mt-1">{getCareTypeIcon(log.care_type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium capitalize">{log.care_type}</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    {log.details && (
                      <div className="mt-1 text-sm">
                        {Object.entries(log.details)
                          .filter(([key]) => key !== 'notes')
                          .map(([key, value]) => (
                            <span key={key} className="mr-3">
                              <span className="capitalize">{key}:</span>{' '}
                              <span className="font-medium">{value as string}</span>
                            </span>
                          ))}
                      </div>
                    )}
                    {log.notes && (
                      <div className="mt-1 text-sm text-muted-foreground">{log.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyCareLog;
