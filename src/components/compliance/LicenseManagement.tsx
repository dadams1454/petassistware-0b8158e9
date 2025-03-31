import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CircleDashed, CheckCircle2, AlertTriangle, FileText, BadgeCheck, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customSupabase, LicenseRow } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import LicenseDialog from './dialogs/LicenseDialog';
import { useAuth } from '@/contexts/AuthProvider';

interface License extends LicenseRow {}

const LicenseManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

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
        .select('*');
      
      if (error) throw error;
      
      // Process the data to determine status based on expiry date
      const processedData = (data || []).map((license: any) => {
        const expiryDate = new Date(license.expiry_date);
        const today = new Date();
        let status = license.status;
        
        if (!status || status === 'active') {
          if (isBefore(expiryDate, today)) {
            status = 'expired';
          } else if (isBefore(expiryDate, addDays(today, 90))) {
            status = 'expiring-soon';
          } else {
            status = 'active';
          }
        }
        
        return {
          ...license,
          status
        };
      });
      
      setLicenses(processedData);
    } catch (error) {
      setLicenses([]);  // Set to empty array of the correct type instead of error
      console.error("Error fetching licenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLicense = () => {
    setSelectedLicense(null);
    setIsDialogOpen(true);
  };

  const handleEditLicense = (license: License) => {
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

      // Determine the correct status based on expiry date
      const expiryDate = new Date(licenseData.expiry_date);
      const today = new Date();
      let status;
      
      if (isBefore(expiryDate, today)) {
        status = 'expired';
      } else if (isBefore(expiryDate, addDays(today, 90))) {
        status = 'expiring-soon';
      } else {
        status = 'active';
      }
      
      const updatedData = {
        ...licenseData,
        status,
        breeder_id: userId
      };
      
      if (selectedLicense) {
        // Update existing license
        const { error } = await customSupabase
          .from<LicenseRow>('licenses')
          .update(updatedData)
          .eq('id', selectedLicense.id);

        if (error) throw error;
        
        toast({
          title: 'License Updated',
          description: 'The license has been updated successfully.',
        });
      } else {
        // Insert new license
        const { error } = await customSupabase
          .from<LicenseRow>('licenses')
          .insert(updatedData);

        if (error) throw error;
        
        toast({
          title: 'License Added',
          description: 'The new license has been added successfully.',
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

  // Calculate license metrics
  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const expiringSoonLicenses = licenses.filter(l => l.status === 'expiring-soon').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired').length;
  
  const activePercentage = totalLicenses > 0 
    ? Math.round((activeLicenses / totalLicenses) * 100) 
    : 0;

  // Filter licenses based on active tab
  const filteredLicenses = licenses.filter(license => {
    if (activeTab === 'active') {
      return license.status === 'active' || license.status === 'expiring-soon';
    } else if (activeTab === 'expired') {
      return license.status === 'expired';
    }
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              License Management
            </CardTitle>
            <Button onClick={handleAddLicense} className="gap-2">
              <Calendar className="h-4 w-4" />
              Add License
            </Button>
          </div>
          <CardDescription>Manage your kennel licenses and compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <LicenseStatusCard 
              title="Active Licenses"
              icon={<BadgeCheck className="h-8 w-8 text-green-500" />}
              status={`${activePercentage}% Active`}
              details={`${activeLicenses} of ${totalLicenses} licenses active`}
              color="green"
            />
            
            <LicenseStatusCard 
              title="Expiring Soon"
              icon={<AlertTriangle className="h-8 w-8 text-amber-500" />}
              status={`${expiringSoonLicenses} Expiring Soon`}
              details={expiringSoonLicenses > 0 ? "Renew licenses to maintain compliance" : "No licenses expiring soon"}
              color="amber"
            />
            
            <LicenseStatusCard 
              title="Expired Licenses"
              icon={expiredLicenses > 0 ? 
                <AlertTriangle className="h-8 w-8 text-red-500" /> : 
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              }
              status={expiredLicenses > 0 ? 
                `${expiredLicenses} Expired` : 
                `No Expired Licenses`
              }
              details={expiredLicenses > 0 ? 
                "Renew expired licenses immediately" : 
                "All licenses are up to date"
              }
              color={expiredLicenses > 0 ? "red" : "green"}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">License Details</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active & Expiring</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : filteredLicenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No {activeTab} licenses</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredLicenses.map(license => (
                <LicenseItem 
                  key={license.id}
                  license={license}
                  formatDate={formatDate}
                  onEdit={() => handleEditLicense(license)}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <LicenseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveLicense}
        license={selectedLicense}
      />
    </div>
  );
};

interface LicenseStatusCardProps {
  title: string;
  icon: React.ReactNode;
  status: string;
  details: string;
  color: 'green' | 'amber' | 'red';
}

const LicenseStatusCard: React.FC<LicenseStatusCardProps> = ({ 
  title, 
  icon, 
  status, 
  details,
  color
}) => {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    red: "bg-red-50 border-red-200",
  };
  
  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-lg font-semibold">{status}</p>
          <p className="text-sm text-muted-foreground mt-1">{details}</p>
        </div>
      </div>
    </div>
  );
};

interface LicenseItemProps {
  license: License;
  formatDate: (date: string) => string;
  onEdit: () => void;
}

const LicenseItem: React.FC<LicenseItemProps> = ({
  license,
  formatDate,
  onEdit
}) => {
  const statusIcons = {
    active: <BadgeCheck className="h-5 w-5 text-green-500" />,
    'expiring-soon': <AlertTriangle className="h-5 w-5 text-amber-500" />,
    expired: <AlertTriangle className="h-5 w-5 text-red-500" />
  };
  
  return (
    <li className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
      <div className="mt-0.5">
        {statusIcons[license.status]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{license.license_name}</h4>
          <span className="text-sm text-muted-foreground">
            Expires: {formatDate(license.expiry_date)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{license.description}</p>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">License Number: {license.license_number}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onEdit}>
            View & Edit
          </Button>
        </div>
      </div>
    </li>
  );
};

export default LicenseManagement;
