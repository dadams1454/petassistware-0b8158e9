
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, File, Pill, Stethoscope, Syringe, Scissors } from 'lucide-react';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';

interface HealthDetailViewProps {
  record: HealthRecord;
  onBack: () => void;
  onEdit: (record: HealthRecord) => void;
}

const HealthDetailView: React.FC<HealthDetailViewProps> = ({
  record,
  onBack,
  onEdit
}) => {
  // Select icon based on record type
  const getRecordIcon = () => {
    switch (record.record_type) {
      case HealthRecordTypeEnum.Vaccination:
        return <Syringe className="h-5 w-5" />;
      case HealthRecordTypeEnum.Examination:
        return <Stethoscope className="h-5 w-5" />;
      case HealthRecordTypeEnum.Medication:
        return <Pill className="h-5 w-5" />;
      case HealthRecordTypeEnum.Surgery:
        return <Scissors className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };
  
  // Format date for display
  const formatDateString = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        
        <Button size="sm" onClick={() => onEdit(record)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Record
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                {getRecordIcon()}
              </div>
              <CardTitle className="text-xl">{record.title}</CardTitle>
            </div>
            <Badge variant="outline" className="ml-2">
              {record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p>{formatDateString(record.date)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Performed By</h3>
              <p>{record.performed_by || 'Not specified'}</p>
            </div>
            
            {record.next_due_date && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Next Due Date</h3>
                <p>{formatDateString(record.next_due_date)}</p>
              </div>
            )}
          </div>
          
          {/* Record type specific details */}
          {record.record_type === HealthRecordTypeEnum.Medication && (
            <div className="border p-4 rounded-md space-y-4 mt-4">
              <h3 className="font-medium">Medication Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.medication_name && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Medication</h4>
                    <p>{record.medication_name}</p>
                  </div>
                )}
                
                {(record.dosage || record.dosage_unit) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Dosage</h4>
                    <p>{record.dosage} {record.dosage_unit}</p>
                  </div>
                )}
                
                {record.frequency && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Frequency</h4>
                    <p>{record.frequency}</p>
                  </div>
                )}
                
                {(record.duration || record.duration_unit) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                    <p>{record.duration} {record.duration_unit}</p>
                  </div>
                )}
                
                {record.start_date && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                    <p>{formatDateString(record.start_date)}</p>
                  </div>
                )}
                
                {record.end_date && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                    <p>{formatDateString(record.end_date)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {record.record_type === HealthRecordTypeEnum.Vaccination && (
            <div className="border p-4 rounded-md space-y-4 mt-4">
              <h3 className="font-medium">Vaccination Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.vaccine_name && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Vaccine</h4>
                    <p>{record.vaccine_name}</p>
                  </div>
                )}
                
                {record.manufacturer && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Manufacturer</h4>
                    <p>{record.manufacturer}</p>
                  </div>
                )}
                
                {record.lot_number && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Lot Number</h4>
                    <p>{record.lot_number}</p>
                  </div>
                )}
                
                {record.administration_route && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Administration Route</h4>
                    <p>{record.administration_route}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {record.record_type === HealthRecordTypeEnum.Examination && (
            <div className="border p-4 rounded-md space-y-4 mt-4">
              <h3 className="font-medium">Examination Details</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {record.examination_type && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Examination Type</h4>
                    <p>{record.examination_type}</p>
                  </div>
                )}
                
                {record.findings && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Findings</h4>
                    <p className="whitespace-pre-line">{record.findings}</p>
                  </div>
                )}
                
                {record.recommendations && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Recommendations</h4>
                    <p className="whitespace-pre-line">{record.recommendations}</p>
                  </div>
                )}
                
                {record.follow_up_date && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Follow-up Date</h4>
                    <p>{formatDateString(record.follow_up_date)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {record.record_type === HealthRecordTypeEnum.Surgery && (
            <div className="border p-4 rounded-md space-y-4 mt-4">
              <h3 className="font-medium">Surgery Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.procedure_name && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Procedure</h4>
                    <p>{record.procedure_name}</p>
                  </div>
                )}
                
                {record.surgeon && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Surgeon</h4>
                    <p>{record.surgeon}</p>
                  </div>
                )}
                
                {record.anesthesia_used && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Anesthesia</h4>
                    <p>{record.anesthesia_used}</p>
                  </div>
                )}
                
                {record.recovery_notes && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Recovery Notes</h4>
                    <p className="whitespace-pre-line">{record.recovery_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {record.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="whitespace-pre-line mt-1">{record.description}</p>
            </div>
          )}
          
          {record.document_url && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Attached Document</h3>
              <a 
                href={record.document_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center mt-1"
              >
                <File className="h-4 w-4 mr-1" />
                View Document
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDetailView;
