
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, PlusCircle, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, isAfter, isBefore } from 'date-fns';
import { usePuppyHealthCertificates } from '@/hooks/usePuppyHealthCertificates';
import HealthCertificateForm from './HealthCertificateForm';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HealthCertificateManagerProps {
  puppyId: string;
}

const HealthCertificateManager: React.FC<HealthCertificateManagerProps> = ({ puppyId }) => {
  const { 
    certificates, 
    isLoading, 
    certificateTypes,
    addCertificate,
    deleteCertificate
  } = usePuppyHealthCertificates(puppyId);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddCertificate = async (formData: any) => {
    try {
      await addCertificate({
        puppy_id: puppyId,
        certificate_type: formData.certificateType,
        issue_date: formData.issueDate,
        expiry_date: formData.expiryDate,
        issuer: formData.issuer,
        notes: formData.notes,
        file: formData.file
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to add certificate',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCertificate = async () => {
    if (!deleteId) return;
    
    try {
      await deleteCertificate(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete certificate',
        variant: 'destructive'
      });
    }
  };

  const getCertificateStatus = (certificate: any) => {
    const now = new Date();
    const expiry = certificate.expiry_date ? new Date(certificate.expiry_date) : null;
    
    if (!expiry) {
      return { label: 'No Expiry', color: 'bg-gray-100 text-gray-800' };
    }
    
    if (isBefore(expiry, now)) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    
    // Soon to expire (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    if (isBefore(expiry, thirtyDaysFromNow)) {
      return { label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { label: 'Valid', color: 'bg-green-100 text-green-800' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Health Certificates</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Health Certificate</DialogTitle>
            </DialogHeader>
            <HealthCertificateForm 
              onSubmit={handleAddCertificate}
              certificateTypes={certificateTypes}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FileIcon className="mx-auto h-10 w-10 opacity-20" />
            <p className="mt-2">No health certificates added yet.</p>
            <p className="text-sm">Add certificates to keep track of important health documents.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((certificate) => {
              const status = getCertificateStatus(certificate);
              
              return (
                <div 
                  key={certificate.id} 
                  className="p-3 border rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium">{certificate.certificate_type}</span>
                      <Badge className={`${status.color} self-start sm:self-auto`}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Issued: {format(new Date(certificate.issue_date), 'MMM d, yyyy')}
                      </span>
                      {certificate.expiry_date && (
                        <span>
                          Expires: {format(new Date(certificate.expiry_date), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span>Issuer: {certificate.issuer}</span>
                    </div>
                    {certificate.notes && (
                      <p className="text-sm mt-1 line-clamp-1">{certificate.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {certificate.file_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        onClick={() => window.open(certificate.file_url, '_blank')}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(certificate.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certificate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCertificate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default HealthCertificateManager;
