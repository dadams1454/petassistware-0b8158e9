import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck, BadgeCheck, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { customSupabase, LicenseRow } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { EmptyState } from '@/components/ui/standardized';
import LicenseDialog from './dialogs/LicenseDialog';
import { useAuth } from '@/hooks/useAuth';

const LicenseManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseRow | null>(null);

  useEffect(() => {
    if (user) {
      fetchLicenses();
    }
  }, [user]);

  const fetchLicenses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await customSupabase
        .from<LicenseRow>('licenses')
        .select('*')
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      setLicenses(data || []);
    } catch (error: any) {
      console.error('Error fetching licenses:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load licenses',
        variant: 'destructive',
      });
      // Set an empty array instead of error data
      setLicenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLicense = () => {
    setSelectedLicense(null);
    setIsDialogOpen(true);
  };

  const handleEditLicense = (license: LicenseRow) => {
    setSelectedLicense(license);
    setIsDialogOpen(true);
  };

  const handleSaveLicense = async (licenseData: any) => {
    try {
      const userId = user?.id;
      if (!userId) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to save license data.',
          variant: 'destructive',
        });
        return;
      }

      if (selectedLicense) {
        // Update existing license
        const { error } = await customSupabase
          .from<LicenseRow>('licenses')
          .update({
            ...licenseData,
            breeder_id: userId
          })
          .eq('id', selectedLicense.id);

        if (error) throw error;
        
        toast({
          title: 'License Updated',
          description: 'The license has been successfully updated.',
        });
      } else {
        // Insert new license
        const { error } = await customSupabase
          .from<LicenseRow>('licenses')
          .insert({
            ...licenseData,
            breeder_id: userId
          });

        if (error) throw error;
        
        toast({
          title: 'License Added',
          description: 'The new license has been successfully added.',
        });
      }
      
      setIsDialogOpen(false);
      fetchLicenses();
    } catch (error: any) {
      console.error('Error saving license:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save license',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Determine license status based on expiry date
  const getLicenseStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (expiry < today) {
      return 'expired';
    } else if (daysUntilExpiry <= 30) {
      return 'expiring';
    } else {
      return 'active';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">License Management</h2>
        <Button onClick={handleAddLicense} className="gap-2">
          <Plus className="h-4 w-4" />
          Add License
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : licenses.length === 0 ? (
        <EmptyState
          title="No Licenses"
          description="You haven't added any licenses yet."
          action={{
            label: "Add License",
            onClick: handleAddLicense
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {licenses.map(license => (
            <LicenseCard 
              key={license.id}
              license={license}
              status={getLicenseStatus(license.expiry_date || '')}
              formatDate={formatDate}
              onEdit={() => handleEditLicense(license)}
            />
          ))}
        </div>
      )}

      <LicenseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveLicense}
        license={selectedLicense}
      />
    </div>
  );
};

interface LicenseCardProps {
  license: LicenseRow;
  status: 'active' | 'expiring' | 'expired';
  formatDate: (date: string) => string;
  onEdit: () => void;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ 
  license, 
  status, 
  formatDate,
  onEdit
}) => {
  const statusIcons = {
    active: <BadgeCheck className="h-5 w-5 text-green-500" />,
    expiring: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    expired: <X className="h-5 w-5 text-red-500" />
  };
  
  const statusText = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired"
  };
  
  const statusClasses = {
    active: "bg-green-50 text-green-700 border-green-200",
    expiring: "bg-amber-50 text-amber-700 border-amber-200",
    expired: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <Card className={`border-l-4 ${statusClasses[status]}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <FileCheck className="mr-2 h-5 w-5" />
          {license.license_type}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm font-medium">
          {statusIcons[status]}
          <span>{statusText[status]}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">License #</span>
            <span className="text-sm font-medium">{license.license_number || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Issued</span>
            <span className="text-sm font-medium">{license.issued_date ? formatDate(license.issued_date) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expiry Date</span>
            <span className="text-sm font-medium">{license.expiry_date ? formatDate(license.expiry_date) : 'N/A'}</span>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>View & Edit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseManagement;
