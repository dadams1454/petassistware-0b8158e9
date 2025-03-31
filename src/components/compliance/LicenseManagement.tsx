
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck, BadgeCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LicenseManagement: React.FC = () => {
  const { toast } = useToast();
  
  const handleAddLicense = () => {
    toast({
      title: "Coming Soon",
      description: "License management will be implemented in a future update."
    });
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LicenseCard 
          title="AKC Breeder of Merit" 
          status="active" 
          number="BM-12345"
          expiryDate="2024-12-31"
        />
        <LicenseCard 
          title="State Breeding License" 
          status="expiring" 
          number="SBL-987654"
          expiryDate="2023-08-15"
        />
        <LicenseCard 
          title="County Business Permit" 
          status="expired" 
          number="CBP-45678"
          expiryDate="2023-03-01"
        />
      </div>
    </div>
  );
};

interface LicenseCardProps {
  title: string;
  status: 'active' | 'expiring' | 'expired';
  number: string;
  expiryDate: string;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ title, status, number, expiryDate }) => {
  const statusIcons = {
    active: <BadgeCheck className="h-5 w-5 text-green-500" />,
    expiring: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    expired: <AlertTriangle className="h-5 w-5 text-red-500" />
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className={`border-l-4 ${statusClasses[status]}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <FileCheck className="mr-2 h-5 w-5" />
          {title}
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
            <span className="text-sm font-medium">{number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expiry Date</span>
            <span className="text-sm font-medium">{formatDate(expiryDate)}</span>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseManagement;
