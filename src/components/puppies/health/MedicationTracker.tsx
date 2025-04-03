
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Pill, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  Calculator, 
  Check, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Medication {
  id: string;
  puppy_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route: string;
  notes?: string;
  created_at: string;
  last_administered?: string;
  is_active: boolean;
}

interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

interface MedicationTrackerProps {
  puppyId: string;
  puppyWeight?: number;
  puppyWeightUnit?: string;
}

const ADMINISTRATION_ROUTES = [
  { value: 'oral', label: 'Oral' },
  { value: 'injection', label: 'Injection' },
  { value: 'topical', label: 'Topical' },
  { value: 'eye_drops', label: 'Eye Drops' },
  { value: 'ear_drops', label: 'Ear Drops' },
];

const FREQUENCIES = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'three_times_daily', label: 'Three Times Daily' },
  { value: 'four_times_daily', label: 'Four Times Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as_needed', label: 'As Needed' },
];

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ 
  puppyId,
  puppyWeight,
  puppyWeightUnit = 'lb'
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [administrationHistory, setAdministrationHistory] = useState<Record<string, MedicationAdministration[]>>({});
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAdministerDialog, setShowAdministerDialog] = useState(false);
  const [showDosageCalculator, setShowDosageCalculator] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    dosage_unit: 'mg',
    frequency: 'daily',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: '',
    administration_route: 'oral',
    notes: '',
  });
  const [administerFormData, setAdministerFormData] = useState({
    administered_by: '',
    administered_at: new Date().toISOString(),
    notes: '',
  });
  const [calculatorData, setCalculatorData] = useState({
    weight: puppyWeight?.toString() || '',
    weightUnit: puppyWeightUnit,
    mgPerKg: '',
    mgPerLb: '',
    concentration: '',
    concentrationUnit: 'mg/ml',
  });
  const [calculatedDosage, setCalculatedDosage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (puppyId) {
      fetchMedications();
    }
  }, [puppyId]);

  React.useEffect(() => {
    if (puppyWeight) {
      setCalculatorData(prev => ({
        ...prev,
        weight: puppyWeight.toString(),
        weightUnit: puppyWeightUnit
      }));
    }
  }, [puppyWeight, puppyWeightUnit]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('puppy_medications')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const meds = data || [];
      setMedications(meds);
      
      // Fetch administration history for each medication
      for (const med of meds) {
        await fetchAdministrationHistory(med.id);
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdministrationHistory = async (medicationId: string) => {
    try {
      const { data, error } = await supabase
        .from('puppy_medication_administrations')
        .select('*')
        .eq('medication_id', medicationId)
        .order('administered_at', { ascending: false });

      if (error) throw error;

      setAdministrationHistory(prev => ({
        ...prev,
        [medicationId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching administration history:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdministerInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAdministerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculatorInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({ ...prev, [name]: value }));
    setCalculatedDosage(null); // Reset calculation when inputs change
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDosage = () => {
    const { weight, weightUnit, mgPerKg, mgPerLb, concentration, concentrationUnit } = calculatorData;
    
    // Validate inputs
    if (!weight || parseFloat(weight) <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid weight',
        variant: 'destructive',
      });
      return;
    }
    
    if ((!mgPerKg || parseFloat(mgPerKg) <= 0) && (!mgPerLb || parseFloat(mgPerLb) <= 0)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid dosage in mg/kg or mg/lb',
        variant: 'destructive',
      });
      return;
    }
    
    if (!concentration || parseFloat(concentration) <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid concentration',
        variant: 'destructive',
      });
      return;
    }
    
    const weightValue = parseFloat(weight);
    const concentrationValue = parseFloat(concentration);
    
    // Calculate total mg needed
    let totalMg = 0;
    if (mgPerKg && parseFloat(mgPerKg) > 0) {
      // Convert weight to kg if needed
      const weightInKg = weightUnit === 'kg' ? weightValue : weightValue * 0.453592;
      totalMg = weightInKg * parseFloat(mgPerKg);
    } else if (mgPerLb && parseFloat(mgPerLb) > 0) {
      // Convert weight to lb if needed
      const weightInLb = weightUnit === 'lb' ? weightValue : weightValue * 2.20462;
      totalMg = weightInLb * parseFloat(mgPerLb);
    }
    
    // Calculate volume based on concentration
    let volumeToAdminister = 0;
    if (concentrationUnit === 'mg/ml') {
      volumeToAdminister = totalMg / concentrationValue;
    } else if (concentrationUnit === 'mg/tablet') {
      volumeToAdminister = totalMg / concentrationValue;
    }
    
    // Format result based on concentration unit
    let result = '';
    if (concentrationUnit === 'mg/ml') {
      result = `${volumeToAdminister.toFixed(2)} mL`;
    } else if (concentrationUnit === 'mg/tablet') {
      result = `${volumeToAdminister.toFixed(2)} tablets`;
    }
    
    setCalculatedDosage(result);
    
    // Update dosage in form
    setFormData(prev => ({
      ...prev,
      dosage: totalMg.toFixed(2),
      dosage_unit: 'mg'
    }));
  };

  const handleSubmitMedication = async () => {
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('puppy_medications')
        .insert([
          {
            puppy_id: puppyId,
            medication_name: formData.medication_name,
            dosage: parseFloat(formData.dosage),
            dosage_unit: formData.dosage_unit,
            frequency: formData.frequency,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            administration_route: formData.administration_route,
            notes: formData.notes,
            is_active: true,
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Medication added successfully',
      });
      
      setShowAddDialog(false);
      resetFormData();
      fetchMedications();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to add medication',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdministerMedication = async () => {
    if (!selectedMedication) return;
    
    setSubmitting(true);
    
    try {
      // Add administration record
      const { data, error } = await supabase
        .from('puppy_medication_administrations')
        .insert([
          {
            medication_id: selectedMedication.id,
            administered_at: administerFormData.administered_at,
            administered_by: administerFormData.administered_by,
            notes: administerFormData.notes,
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Update last_administered date on the medication
      await supabase
        .from('puppy_medications')
        .update({
          last_administered: administerFormData.administered_at,
        })
        .eq('id', selectedMedication.id);
      
      toast({
        title: 'Success',
        description: 'Medication administration recorded',
      });
      
      setShowAdministerDialog(false);
      resetAdministerFormData();
      fetchMedications();
      fetchAdministrationHistory(selectedMedication.id);
    } catch (error) {
      console.error('Error recording medication administration:', error);
      toast({
        title: 'Error',
        description: 'Failed to record administration',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMedicationStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('puppy_medications')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Medication ${currentStatus ? 'discontinued' : 'reactivated'}`,
      });
      
      fetchMedications();
    } catch (error) {
      console.error('Error toggling medication status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update medication status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication? This will also delete all administration records.')) {
      return;
    }
    
    try {
      // First delete all administration records
      await supabase
        .from('puppy_medication_administrations')
        .delete()
        .eq('medication_id', id);
      
      // Then delete the medication
      const { error } = await supabase
        .from('puppy_medications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Medication deleted successfully',
      });
      
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete medication',
        variant: 'destructive',
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      medication_name: '',
      dosage: '',
      dosage_unit: 'mg',
      frequency: 'daily',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: '',
      administration_route: 'oral',
      notes: '',
    });
    setCalculatedDosage(null);
  };

  const resetAdministerFormData = () => {
    setAdministerFormData({
      administered_by: '',
      administered_at: new Date().toISOString(),
      notes: '',
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Medication Tracker</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowDosageCalculator(true);
                resetFormData();
              }}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Dosage Calculator
            </Button>
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : medications.length > 0 ? (
            <div className="space-y-6">
              {/* Active Medications */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Active Medications</h3>
                {medications.filter(med => med.is_active).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No active medications</p>
                ) : (
                  medications
                    .filter(med => med.is_active)
                    .map(med => (
                      <div key={med.id} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <Pill className="h-5 w-5 mr-2 text-blue-500" />
                              <h4 className="font-medium">{med.medication_name}</h4>
                            </div>
                            <div className="ml-7 space-y-1 mt-1">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Dosage:</span> {med.dosage} {med.dosage_unit}
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Route:</span> {
                                  ADMINISTRATION_ROUTES.find(r => r.value === med.administration_route)?.label || 
                                  med.administration_route
                                }
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Frequency:</span> {
                                  FREQUENCIES.find(f => f.value === med.frequency)?.label || 
                                  med.frequency
                                }
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Started:</span> {
                                  new Date(med.start_date).toLocaleDateString()
                                }
                                {med.end_date && ` (until ${new Date(med.end_date).toLocaleDateString()})`}
                              </p>
                              {med.last_administered && (
                                <p className="text-sm text-green-600">
                                  Last given: {new Date(med.last_administered).toLocaleString()}
                                </p>
                              )}
                              {med.notes && (
                                <p className="text-sm mt-2 italic">{med.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button 
                              size="sm" 
                              className="h-8"
                              onClick={() => {
                                setSelectedMedication(med);
                                setShowAdministerDialog(true);
                                resetAdministerFormData();
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Administer
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8"
                                    onClick={() => handleToggleMedicationStatus(med.id, med.is_active)}
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Discontinue medication</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => handleDeleteMedication(med.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete medication</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        {/* Administration History */}
                        {administrationHistory[med.id] && administrationHistory[med.id].length > 0 && (
                          <div className="mt-4 pt-3 border-t">
                            <h5 className="text-sm font-medium mb-2">Administration History</h5>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {administrationHistory[med.id].slice(0, 5).map(admin => (
                                <div key={admin.id} className="text-xs p-2 bg-muted rounded flex justify-between">
                                  <div>
                                    <span className="font-medium">{new Date(admin.administered_at).toLocaleString()}</span>
                                    <span className="ml-2 text-muted-foreground">by {admin.administered_by}</span>
                                  </div>
                                  {admin.notes && (
                                    <span className="text-muted-foreground">{admin.notes}</span>
                                  )}
                                </div>
                              ))}
                              {administrationHistory[med.id].length > 5 && (
                                <p className="text-xs text-center text-muted-foreground">
                                  + {administrationHistory[med.id].length - 5} more entries
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
              
              {/* Inactive Medications */}
              {medications.some(med => !med.is_active) && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground">Inactive Medications</h3>
                  <div className="space-y-2">
                    {medications
                      .filter(med => !med.is_active)
                      .map(med => (
                        <div key={med.id} className="border rounded p-3 bg-muted/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Pill className="h-4 w-4 mr-2 text-muted-foreground" />
                                <h4 className="font-medium text-sm text-muted-foreground">{med.medication_name}</h4>
                              </div>
                              <p className="text-xs text-muted-foreground ml-6 mt-1">
                                {med.dosage} {med.dosage_unit}, {
                                  FREQUENCIES.find(f => f.value === med.frequency)?.label || 
                                  med.frequency
                                }
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleToggleMedicationStatus(med.id, med.is_active)}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteMedication(med.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Pill className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No medications found</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Medication
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Medication Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="medication_name">Medication Name</Label>
              <Input 
                id="medication_name"
                name="medication_name"
                value={formData.medication_name}
                onChange={handleInputChange}
                placeholder="Enter medication name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <div className="flex">
                  <Input 
                    id="dosage"
                    name="dosage"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    required
                    className="rounded-r-none"
                  />
                  <Select
                    name="dosage_unit"
                    value={formData.dosage_unit}
                    onValueChange={(value) => handleSelectChange('dosage_unit', value)}
                  >
                    <SelectTrigger className="w-24 rounded-l-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="ml">mL</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="tablet">tablet</SelectItem>
                      <SelectItem value="capsule">capsule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  name="frequency"
                  value={formData.frequency}
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="administration_route">Administration Route</Label>
              <Select
                name="administration_route"
                value={formData.administration_route}
                onValueChange={(value) => handleSelectChange('administration_route', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMINISTRATION_ROUTES.map((route) => (
                    <SelectItem key={route.value} value={route.value}>
                      {route.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <div className="flex">
                  <Calendar className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                  <Input 
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <div className="flex">
                  <Calendar className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                  <Input 
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional information"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmitMedication}
              disabled={submitting || !formData.medication_name || !formData.dosage}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Administer Medication Dialog */}
      <Dialog open={showAdministerDialog} onOpenChange={setShowAdministerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Administer Medication: {selectedMedication?.medication_name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Dosage:</span> {selectedMedication?.dosage} {selectedMedication?.dosage_unit}
              </p>
              <p className="text-sm">
                <span className="font-medium">Route:</span> {
                  ADMINISTRATION_ROUTES.find(r => r.value === selectedMedication?.administration_route)?.label || 
                  selectedMedication?.administration_route
                }
              </p>
              <p className="text-sm">
                <span className="font-medium">Frequency:</span> {
                  FREQUENCIES.find(f => f.value === selectedMedication?.frequency)?.label || 
                  selectedMedication?.frequency
                }
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="administered_by">Administered By</Label>
              <Input 
                id="administered_by"
                name="administered_by"
                value={administerFormData.administered_by}
                onChange={handleAdministerInputChange}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="administered_at">Date & Time</Label>
              <div className="flex">
                <Clock className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                <Input 
                  id="administered_at"
                  name="administered_at"
                  type="datetime-local"
                  value={new Date(administerFormData.administered_at).toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setAdministerFormData(prev => ({
                      ...prev,
                      administered_at: new Date(e.target.value).toISOString()
                    }));
                  }}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="admin_notes">Notes (Optional)</Label>
              <Textarea 
                id="admin_notes"
                name="notes"
                value={administerFormData.notes}
                onChange={handleAdministerInputChange}
                placeholder="Enter any observations or additional information"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAdministerDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAdministerMedication}
              disabled={submitting || !administerFormData.administered_by}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Recording...
                </>
              ) : (
                <>Record Administration</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dosage Calculator Dialog */}
      <Dialog open={showDosageCalculator} onOpenChange={setShowDosageCalculator}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Medication Dosage Calculator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Puppy Weight</Label>
                <div className="flex">
                  <Input 
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={calculatorData.weight}
                    onChange={handleCalculatorInputChange}
                    placeholder="Weight"
                    required
                    className="rounded-r-none"
                  />
                  <Select
                    name="weightUnit"
                    value={calculatorData.weightUnit}
                    onValueChange={(value) => {
                      setCalculatorData(prev => ({
                        ...prev,
                        weightUnit: value
                      }));
                      setCalculatedDosage(null);
                    }}
                  >
                    <SelectTrigger className="w-16 rounded-l-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lb">lb</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="mgPerKg">Dosage (mg/kg)</Label>
                <Input 
                  id="mgPerKg"
                  name="mgPerKg"
                  type="number"
                  step="0.01"
                  min="0"
                  value={calculatorData.mgPerKg}
                  onChange={handleCalculatorInputChange}
                  placeholder="mg per kg"
                />
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">OR</div>
            
            <div className="grid gap-2">
              <Label htmlFor="mgPerLb">Dosage (mg/lb)</Label>
              <Input 
                id="mgPerLb"
                name="mgPerLb"
                type="number"
                step="0.01"
                min="0"
                value={calculatorData.mgPerLb}
                onChange={handleCalculatorInputChange}
                placeholder="mg per lb"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="concentration">Concentration</Label>
                <Input 
                  id="concentration"
                  name="concentration"
                  type="number"
                  step="0.01"
                  min="0"
                  value={calculatorData.concentration}
                  onChange={handleCalculatorInputChange}
                  placeholder="Strength"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="concentrationUnit">Unit</Label>
                <Select
                  name="concentrationUnit"
                  value={calculatorData.concentrationUnit}
                  onValueChange={(value) => {
                    setCalculatorData(prev => ({
                      ...prev,
                      concentrationUnit: value
                    }));
                    setCalculatedDosage(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/ml">mg/mL (liquid)</SelectItem>
                    <SelectItem value="mg/tablet">mg/tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={calculateDosage}
              disabled={!calculatorData.weight || 
                ((!calculatorData.mgPerKg || calculatorData.mgPerKg === '0') && 
                (!calculatorData.mgPerLb || calculatorData.mgPerLb === '0')) || 
                !calculatorData.concentration}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Dosage
            </Button>
            
            {calculatedDosage && (
              <div className="bg-muted p-4 rounded-md text-center">
                <Label className="text-sm">Required Dosage</Label>
                <p className="text-lg font-bold">{calculatedDosage}</p>
                {formData.dosage && (
                  <p className="text-xs mt-2 text-muted-foreground">
                    Total: {formData.dosage} mg
                  </p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setShowDosageCalculator(false);
                    setShowAddDialog(true);
                  }}
                >
                  Use This Dosage
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDosageCalculator(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicationTracker;
