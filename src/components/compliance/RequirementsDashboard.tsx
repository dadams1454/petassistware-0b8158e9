
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDashed, CheckCircle2, AlertTriangle, Info, FileCheck2, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const RequirementsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5" />
            Compliance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <ComplianceStatusCard 
              title="License Status"
              icon={<FileCheck2 className="h-8 w-8 text-green-500" />}
              status="Good Standing"
              details="All licenses are current and valid"
              color="green"
            />
            
            <ComplianceStatusCard 
              title="Upcoming Requirements"
              icon={<AlertTriangle className="h-8 w-8 text-amber-500" />}
              status="Action Needed"
              details="2 items require your attention"
              color="amber"
            />
            
            <ComplianceStatusCard 
              title="Overall Compliance"
              icon={<CircleDashed className="h-8 w-8 text-blue-500" />}
              status="90% Complete"
              details="10 of 11 requirements met"
              color="blue"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <RequirementItem 
                title="State License Renewal"
                dueDate="2023-08-15"
                status="due-soon"
                description="Annual state breeding license expires in 15 days"
              />
              <RequirementItem 
                title="AKC Inspection"
                dueDate="2023-09-22"
                status="pending"
                description="Scheduled AKC inspection for facility verification"
              />
              <RequirementItem 
                title="Health Department Follow-up"
                dueDate="2023-07-05"
                status="overdue"
                description="Required facility improvements documentation"
              />
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ComplianceCategory 
                name="Licensing"
                percentage={100}
                items="3/3 Complete"
              />
              <ComplianceCategory 
                name="Facility Standards"
                percentage={75}
                items="3/4 Complete"
              />
              <ComplianceCategory 
                name="Record Keeping"
                percentage={100}
                items="2/2 Complete"
              />
              <ComplianceCategory 
                name="Health & Safety"
                percentage={50}
                items="1/2 Complete"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ComplianceStatusCardProps {
  title: string;
  icon: React.ReactNode;
  status: string;
  details: string;
  color: 'green' | 'amber' | 'blue' | 'red';
}

const ComplianceStatusCard: React.FC<ComplianceStatusCardProps> = ({ 
  title, 
  icon, 
  status, 
  details,
  color
}) => {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
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

interface RequirementItemProps {
  title: string;
  dueDate: string;
  status: 'completed' | 'overdue' | 'due-soon' | 'pending';
  description: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({
  title,
  dueDate,
  status,
  description
}) => {
  const statusIcons = {
    completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    overdue: <AlertTriangle className="h-5 w-5 text-red-500" />,
    'due-soon': <AlertTriangle className="h-5 w-5 text-amber-500" />,
    pending: <Info className="h-5 w-5 text-blue-500" />
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5">
        {statusIcons[status]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{title}</h4>
          <span className="text-sm text-muted-foreground">{formatDate(dueDate)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </li>
  );
};

interface ComplianceCategoryProps {
  name: string;
  percentage: number;
  items: string;
}

const ComplianceCategory: React.FC<ComplianceCategoryProps> = ({
  name,
  percentage,
  items
}) => {
  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-green-500";
    if (percent >= 75) return "bg-blue-500";
    if (percent >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{name}</h4>
        <span className="text-sm text-muted-foreground">{items}</span>
      </div>
      <Progress value={percentage} className={`h-2 ${getProgressColor(percentage)}`} />
    </div>
  );
};

export default RequirementsDashboard;
