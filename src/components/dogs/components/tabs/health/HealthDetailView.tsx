import React from 'react';
import {
  ArrowLeft,
  Pill,
  Syringe,
  Stethoscope,
  Scissors,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthRecord, HealthRecordType } from '@/types/health';
import { formatDate, formatDateWithTime } from '@/lib/formatDate';
import { Separator } from '@/components/ui/separator';

interface HealthDetailViewProps {
  record: HealthRecord;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HealthDetailView: React.FC<HealthDetailViewProps> = ({ record, onBack, onEdit, onDelete }) => {
  const recordTypeIcon = () => {
    switch (record.record_type) {
      case HealthRecordType.VACCINATION:
        return <Syringe className="h-5 w-5 mr-2" />;
      case HealthRecordType.EXAMINATION:
        return <Stethoscope className="h-5 w-5 mr-2" />;
      case HealthRecordType.MEDICATION:
        return <Pill className="h-5 w-5 mr-2" />;
      case HealthRecordType.SURGERY:
        return <Scissors className="h-5 w-5 mr-2" />;
      default:
        return <Stethoscope className="h-5 w-5 mr-2" />;
    }
  };

  const renderDetailItem = (label: string, value: string | number | undefined) => (
    <div className="grid grid-cols-3 gap-4 py-2">
      <div className="text-right font-semibold">{label}:</div>
      <div className="col-span-2">{value || 'N/A'}</div>
    </div>
  );

  const renderDateDetail = (label: string, date: string | undefined) => (
    <div className="grid grid-cols-3 gap-4 py-2">
      <div className="text-right font-semibold">{label}:</div>
      <div className="col-span-2">
        {date ? formatDate(date) : 'N/A'}
      </div>
    </div>
  );

  const renderDateTimeDetail = (label: string, date: string | undefined) => (
    <div className="grid grid-cols-3 gap-4 py-2">
      <div className="text-right font-semibold">{label}:</div>
      <div className="col-span-2">
        {date ? formatDateWithTime(date) : 'N/A'}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="py-4">
      <div className="font-semibold">Notes:</div>
      <div className="whitespace-pre-line">{record.record_notes || 'No notes provided.'}</div>
    </div>
  );
  
  const renderMedicationDetails = () => {
    if (record.record_type !== HealthRecordType.MEDICATION) return null;
    
    return (
      <>
        <Separator className="my-4" />
        <CardTitle className="text-lg">Medication Details</CardTitle>
        {renderDetailItem('Medication Name', record.medication_name)}
        {renderDetailItem('Dosage', record.dosage)}
        {renderDetailItem('Dosage Unit', record.dosage_unit)}
        {renderDetailItem('Frequency', record.frequency)}
        {renderDetailItem('Administration Route', record.administration_route)}
        {renderDateDetail('Start Date', record.start_date)}
        {renderDateDetail('End Date', record.end_date)}
        {renderDetailItem('Duration', record.duration)}
        {renderDetailItem('Duration Unit', record.duration_unit)}
      </>
    );
  };
  
  const renderVaccinationDetails = () => {
    if (record.record_type !== HealthRecordType.VACCINATION) return null;
    
    return (
      <>
        <Separator className="my-4" />
        <CardTitle className="text-lg">Vaccination Details</CardTitle>
        {renderDetailItem('Vaccine Name', record.vaccine_name)}
        {renderDetailItem('Manufacturer', record.manufacturer)}
        {renderDetailItem('Lot Number', record.lot_number)}
        {renderDateDetail('Expiration Date', record.expiration_date)}
      </>
    );
  };
  
  const renderExaminationDetails = () => {
    if (record.record_type !== HealthRecordType.EXAMINATION) return null;
    
    return (
      <>
        <Separator className="my-4" />
        <CardTitle className="text-lg">Examination Details</CardTitle>
        {renderDetailItem('Examination Type', record.examination_type)}
        {renderDetailItem('Findings', record.findings)}
        {renderDetailItem('Recommendations', record.recommendations)}
        {renderDateDetail('Follow-up Date', record.follow_up_date)}
      </>
    );
  };
  
  const renderSurgeryDetails = () => {
    if (record.record_type !== HealthRecordType.SURGERY) return null;
    
    return (
      <>
        <Separator className="my-4" />
        <CardTitle className="text-lg">Surgery Details</CardTitle>
        {renderDetailItem('Procedure Name', record.procedure_name)}
        {renderDetailItem('Surgeon', record.surgeon)}
        {renderDetailItem('Anesthesia Used', record.anesthesia_used)}
        {renderDetailItem('Recovery Notes', record.recovery_notes)}
      </>
    );
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {recordTypeIcon()}
          {record.title}
        </CardTitle>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        {renderDetailItem('Record Type', record.record_type)}
        {renderDateTimeDetail('Visit Date', record.visit_date)}
        {renderDetailItem('Veterinarian', record.vet_name)}
        {renderDetailItem('Performed By', record.performed_by)}
        {renderDetailItem('Description', record.description)}
        {renderDetailItem('Document URL', record.document_url)}
        {renderDateDetail('Next Due Date', record.next_due_date)}
        {renderNotes()}
        {renderMedicationDetails()}
        {renderVaccinationDetails()}
        {renderExaminationDetails()}
        {renderSurgeryDetails()}
      </CardContent>
    </Card>
  );
};

export default HealthDetailView;
