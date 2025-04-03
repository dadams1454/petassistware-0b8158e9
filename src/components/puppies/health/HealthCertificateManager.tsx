
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileUp, FilePlus, FileText, Trash2, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface HealthCertificate {
  id: string;
  puppy_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

interface HealthCertificateManagerProps {
  puppyId: string;
}

const HealthCertificateManager: React.FC<HealthCertificateManagerProps> = ({ puppyId }) => {
  const [certificates, setCertificates] = React.useState<HealthCertificate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    certificate_type: '',
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    expiry_date: '',
    issuer: '',
    notes: '',
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchCertificates();
  }, [puppyId]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('puppy_health_certificates')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching health certificates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load health certificates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let fileUrl = null;
      
      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${puppyId}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('health_certificates')
          .upload(fileName, selectedFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('health_certificates')
          .getPublicUrl(fileName);
        
        fileUrl = publicUrlData.publicUrl;
      }
      
      // Save certificate information
      const { data, error } = await supabase
        .from('puppy_health_certificates')
        .insert([
          {
            puppy_id: puppyId,
            certificate_type: formData.certificate_type,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date || null,
            issuer: formData.issuer,
            file_url: fileUrl,
            notes: formData.notes,
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Reset form
      setFormData({
        certificate_type: '',
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        expiry_date: '',
        issuer: '',
        notes: '',
      });
      setSelectedFile(null);
      setOpenDialog(false);
      
      // Refresh certificates list
      fetchCertificates();
      
      toast({
        title: 'Success',
        description: 'Health certificate added successfully',
      });
    } catch (error) {
      console.error('Error adding health certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to save health certificate',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteCertificate = async (id: string, fileUrl?: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      // Delete from database
      const { error } = await supabase
        .from('puppy_health_certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Delete file if it exists
      if (fileUrl) {
        const filePath = fileUrl.split('/').slice(-2).join('/');
        await supabase.storage
          .from('health_certificates')
          .remove([filePath]);
      }
      
      // Refresh list
      fetchCertificates();
      
      toast({
        title: 'Success',
        description: 'Health certificate deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting health certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete health certificate',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Health Certificates</CardTitle>
        <Button onClick={() => setOpenDialog(true)} size="sm">
          <FilePlus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id} className="border rounded p-4">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{cert.certificate_type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Issued by {cert.issuer} on {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                      {cert.expiry_date && (
                        <p className="text-sm">
                          <span className={`${
                            new Date(cert.expiry_date) < new Date() 
                              ? 'text-red-500' 
                              : 'text-orange-500'
                          }`}>
                            {new Date(cert.expiry_date) < new Date() 
                              ? 'Expired' 
                              : 'Expires'}: {new Date(cert.expiry_date).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                      {cert.notes && (
                        <p className="text-sm mt-1">{cert.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    {cert.file_url && (
                      <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                        <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteCertificate(cert.id, cert.file_url)}
                      className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No health certificates found</p>
            <Button variant="outline" className="mt-4" onClick={() => setOpenDialog(true)}>
              <FilePlus className="h-4 w-4 mr-2" />
              Add Your First Certificate
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Health Certificate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="certificate_type">Certificate Type</Label>
                <Input 
                  id="certificate_type"
                  name="certificate_type"
                  required
                  placeholder="e.g., Health Certificate, Vaccination Record"
                  value={formData.certificate_type}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="issuer">Issuer</Label>
                <Input 
                  id="issuer"
                  name="issuer"
                  required
                  placeholder="Veterinarian or organization name"
                  value={formData.issuer}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <div className="flex">
                    <Calendar className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                    <Input 
                      id="issue_date"
                      name="issue_date"
                      type="date"
                      required
                      value={formData.issue_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiry_date">Expiry Date (optional)</Label>
                  <div className="flex">
                    <Calendar className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                    <Input 
                      id="expiry_date"
                      name="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="file">Upload Document (optional)</Label>
                <div className="flex items-center">
                  <Input 
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setSelectedFile(null)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  placeholder="Additional information about this certificate"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4 mr-2" />
                    Save Certificate
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default HealthCertificateManager;
