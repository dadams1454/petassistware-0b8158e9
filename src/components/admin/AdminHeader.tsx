
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onViewAuditLogs: () => void;
  onBackToDashboard: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onViewAuditLogs, 
  onBackToDashboard 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your organization, manage users, and set access permissions
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onViewAuditLogs}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View Audit Logs
        </Button>
        <Button 
          variant="outline" 
          onClick={onBackToDashboard}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
