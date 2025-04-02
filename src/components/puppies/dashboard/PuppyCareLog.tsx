
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, PlusCircle, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';

interface PuppyCareLogProps {
  puppyId: string;
  puppyName: string;
  puppyGender: string;
  puppyColor: string;
  puppyAge: number;
  onSuccess?: () => void;
  onRefresh?: () => void;
}

const PuppyCareLog: React.FC<PuppyCareLogProps> = ({
  puppyId,
  puppyName,
  puppyGender,
  puppyColor,
  puppyAge,
  onSuccess,
  onRefresh
}) => {
  const { toast } = useToast();
  const [careLogs, setCareLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCare, setIsAddingCare] = useState(false);
  const [careType, setCareType] = useState('feeding');
  const [careDate, setCareDate] = useState<Date>(new Date());
  const [careNotes, setCareNotes] = useState('');
  const [details, setDetails] = useState<Record<string, any>>({});

  // Fetch care logs for the puppy
  const fetchCareLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('puppy_care_logs')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('timestamp', { ascending: false });
      
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

  useEffect(() => {
    if (puppyId) {
      fetchCareLogs();
    }
  }, [puppyId]);

  const handleAddCare = async () => {
    try {
      let careDetails = { ...details };
      
      // Format details based on care type
      if (careType === 'feeding') {
        careDetails = {
          ...careDetails,
          amount: careDetails.amount || '15',
          unit: careDetails.unit || 'ml',
          type: careDetails.type || 'formula',
        };
      } else if (careType === 'potty') {
        careDetails = {
          ...careDetails,
          successful: careDetails.successful !== undefined ? careDetails.successful : true,
          type: careDetails.type || 'both',
        };
      } else if (careType === 'medication') {
        careDetails = {
          ...careDetails,
          medication: careDetails.medication || '',
          dosage: careDetails.dosage || '',
          unit: careDetails.unit || 'ml',
        };
      }
      
      const { error } = await supabase
        .from('puppy_care_logs')
        .insert([
          {
            puppy_id: puppyId,
            care_type: careType,
            timestamp: careDate.toISOString(),
            details: careDetails,
            notes: careNotes || null,
          },
        ]);
      
      if (error) throw error;
      
      toast({
        title: 'Care log added',
        description: `${careType} log for ${puppyName} has been recorded`,
      });
      
      // Reset form
      setIsAddingCare(false);
      setCareType('feeding');
      setCareDate(new Date());
      setCareNotes('');
      setDetails({});
      
      // Refresh data
      fetchCareLogs();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding care log:', error);
      toast({
        title: 'Error',
        description: 'Failed to add care log',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    fetchCareLogs();
    if (onRefresh) {
      onRefresh();
    }
  };

  const renderCareTypeFields = () => {
    switch (careType) {
      case 'feeding':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select 
                value={details.type || 'formula'} 
                onValueChange={(value) => setDetails({ ...details, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formula">Formula</SelectItem>
                  <SelectItem value="bottle">Bottle</SelectItem>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="solid">Solid Food</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={details.amount || ''}
                  onChange={(e) => setDetails({ ...details, amount: e.target.value })}
                  placeholder="15"
                />
                <Select 
                  value={details.unit || 'ml'} 
                  onValueChange={(value) => setDetails({ ...details, unit: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 'potty':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select 
                value={details.type || 'both'} 
                onValueChange={(value) => setDetails({ ...details, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urine">Urine</SelectItem>
                  <SelectItem value="stool">Stool</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Successful</label>
              <Select 
                value={details.successful !== undefined ? details.successful.toString() : 'true'} 
                onValueChange={(value) => setDetails({ ...details, successful: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'medication':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Medication</label>
              <input 
                type="text" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={details.medication || ''}
                onChange={(e) => setDetails({ ...details, medication: e.target.value })}
                placeholder="Medication name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={details.dosage || ''}
                  onChange={(e) => setDetails({ ...details, dosage: e.target.value })}
                  placeholder="Dosage"
                />
                <Select 
                  value={details.unit || 'ml'} 
                  onValueChange={(value) => setDetails({ ...details, unit: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="tablet">tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCareLogItem = (log: any) => {
    const timestamp = new Date(log.timestamp);
    const formattedDate = format(timestamp, 'MMM dd, yyyy');
    const formattedTime = format(timestamp, 'h:mm a');
    
    let detailsText = '';
    if (log.care_type === 'feeding') {
      const { type, amount, unit } = log.details || {};
      detailsText = type && amount ? `${type}, ${amount} ${unit || 'ml'}` : '';
    } else if (log.care_type === 'potty') {
      const { type, successful } = log.details || {};
      detailsText = type ? `${type}, ${successful ? 'successful' : 'unsuccessful'}` : '';
    } else if (log.care_type === 'medication') {
      const { medication, dosage, unit } = log.details || {};
      detailsText = medication ? `${medication}, ${dosage || ''} ${unit || ''}` : '';
    }
    
    return (
      <div key={log.id} className="border-b py-3 last:border-b-0">
        <div className="flex justify-between">
          <div className="font-semibold capitalize">{log.care_type}</div>
          <div className="text-sm text-muted-foreground">{formattedTime}</div>
        </div>
        <div className="text-sm text-muted-foreground mb-1">{formattedDate}</div>
        {detailsText && <div className="text-sm">{detailsText}</div>}
        {log.notes && <div className="text-sm mt-1 italic">{log.notes}</div>}
      </div>
    );
  };

  if (isAddingCare) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add Care Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Care Type</label>
              <Select value={careType} onValueChange={setCareType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeding">Feeding</SelectItem>
                  <SelectItem value="potty">Potty</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="health">Health Check</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <div className="flex items-center gap-2">
                <DatePicker
                  date={careDate}
                  onSelect={(date) => setCareDate(date)}
                />
              </div>
            </div>
          </div>
          
          {renderCareTypeFields()}
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={careNotes}
              onChange={(e) => setCareNotes(e.target.value)}
              placeholder="Additional notes..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingCare(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCare}>
              Add Care Log
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Care Logs</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RotateCcw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddingCare(true)}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Care
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">Loading care logs...</div>
        ) : careLogs.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No care logs found for this puppy
          </div>
        ) : (
          <div className="divide-y">
            {careLogs.map(renderCareLogItem)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuppyCareLog;
