
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CircleDashed, CheckCircle2, AlertTriangle, Info, FileCheck2, ShieldAlert, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customSupabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import RequirementDialog from './dialogs/RequirementDialog';
import { useAuth } from '@/contexts/AuthProvider';

interface Requirement extends ComplianceRequirementRow {}

const RequirementsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  useEffect(() => {
    if (user) {
      fetchRequirements();
    }
  }, [user]);

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await customSupabase
        .from<ComplianceRequirementRow, ComplianceRequirementRow>('compliance_requirements')
        .select('*');
      
      if (error) throw error;
      
      // Process the data to determine status based on due date
      const processedData = (data || []).map((req: any) => {
        const dueDate = new Date(req.due_date);
        const today = new Date();
        let status = req.status;
        
        if (!status || status === 'pending') {
          if (req.completed_at) {
            status = 'completed';
          } else if (isBefore(dueDate, today)) {
            status = 'overdue';
          } else if (isBefore(dueDate, addDays(today, 14))) {
            status = 'due-soon';
          } else {
            status = 'pending';
          }
        }
        
        return {
          ...req,
          status
        };
      });
      
      setRequirements(processedData);
    } catch (error: any) {
      console.error('Error fetching requirements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load compliance requirements. Please try again later.',
        variant: 'destructive',
      });
      setRequirements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequirement = () => {
    setSelectedRequirement(null);
    setIsDialogOpen(true);
  };

  const handleEditRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsDialogOpen(true);
  };

  const handleSaveRequirement = async (requirementData: any) => {
    try {
      const userId = user?.id;
      if (!userId) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to save requirement data.',
          variant: 'destructive',
        });
        return;
      }

      // Determine the correct status based on dates
      const dueDate = new Date(requirementData.due_date);
      const today = new Date();
      let status;
      let completedAt = null;
      
      if (requirementData.completed) {
        status = 'completed';
        completedAt = new Date().toISOString();
      } else if (isBefore(dueDate, today)) {
        status = 'overdue';
      } else if (isBefore(dueDate, addDays(today, 14))) {
        status = 'due-soon';
      } else {
        status = 'pending';
      }
      
      const updatedData = {
        ...requirementData,
        status,
        completed_at: completedAt,
        breeder_id: userId
      };
      
      // Remove 'completed' field as it's not in the database schema
      delete updatedData.completed;
      
      if (selectedRequirement) {
        // Update existing requirement
        const { error } = await customSupabase
          .from<ComplianceRequirementRow, ComplianceRequirementRow>('compliance_requirements')
          .update(updatedData)
          .eq('id', selectedRequirement.id);

        if (error) throw error;
        
        toast({
          title: 'Requirement Updated',
          description: 'The compliance requirement has been updated successfully.',
        });
      } else {
        // Insert new requirement
        const { error } = await customSupabase
          .from<ComplianceRequirementRow, ComplianceRequirementRow>('compliance_requirements')
          .insert(updatedData);

        if (error) throw error;
        
        toast({
          title: 'Requirement Added',
          description: 'The new compliance requirement has been added successfully.',
        });
      }
      
      setIsDialogOpen(false);
      fetchRequirements();
    } catch (error: any) {
      console.error('Error saving requirement:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save requirement',
        variant: 'destructive',
      });
    }
  };

  // Calculate compliance metrics
  const totalRequirements = requirements.length;
  const completedRequirements = requirements.filter(r => r.status === 'completed').length;
  const overdueRequirements = requirements.filter(r => r.status === 'overdue').length;
  const dueSoonRequirements = requirements.filter(r => r.status === 'due-soon').length;
  
  const completionPercentage = totalRequirements > 0 
    ? Math.round((completedRequirements / totalRequirements) * 100) 
    : 0;

  // Group requirements by category
  const categories = [...new Set(requirements.map(r => r.category))];
  const categoryStats = categories.map(category => {
    const categoryReqs = requirements.filter(r => r.category === category);
    const completed = categoryReqs.filter(r => r.status === 'completed').length;
    const total = categoryReqs.length;
    return {
      name: category,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      items: `${completed}/${total} Complete`
    };
  });

  // Filter requirements based on active tab
  const filteredRequirements = requirements.filter(req => {
    if (activeTab === 'upcoming') {
      return req.status === 'pending' || req.status === 'due-soon';
    } else if (activeTab === 'overdue') {
      return req.status === 'overdue';
    } else if (activeTab === 'completed') {
      return req.status === 'completed';
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
              <ShieldAlert className="mr-2 h-5 w-5" />
              Compliance Overview
            </CardTitle>
            <Button onClick={handleAddRequirement} className="gap-2">
              <Calendar className="h-4 w-4" />
              Add Requirement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <ComplianceStatusCard 
              title="Completion Status"
              icon={<CheckCircle2 className="h-8 w-8 text-blue-500" />}
              status={`${completionPercentage}% Complete`}
              details={`${completedRequirements} of ${totalRequirements} requirements met`}
              color="blue"
            />
            
            <ComplianceStatusCard 
              title="Upcoming Requirements"
              icon={<AlertTriangle className="h-8 w-8 text-amber-500" />}
              status={`${dueSoonRequirements} Due Soon`}
              details={dueSoonRequirements > 0 ? "Action needed" : "No upcoming deadlines"}
              color="amber"
            />
            
            <ComplianceStatusCard 
              title="Overdue Items"
              icon={overdueRequirements > 0 ? 
                <AlertTriangle className="h-8 w-8 text-red-500" /> : 
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              }
              status={overdueRequirements > 0 ? 
                `${overdueRequirements} Overdue` : 
                `No Overdue Items`
              }
              details={overdueRequirements > 0 ? 
                "Immediate attention required" : 
                "Everything is up to date"
              }
              color={overdueRequirements > 0 ? "red" : "green"}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Requirements</CardTitle>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : filteredRequirements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {activeTab} requirements</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {filteredRequirements.map(requirement => (
                    <RequirementItem 
                      key={requirement.id}
                      requirement={requirement}
                      formatDate={formatDate}
                      onEdit={() => handleEditRequirement(requirement)}
                    />
                  ))}
                </ul>
              )}
            </CardContent>
          </Tabs>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map(category => (
                <ComplianceCategory 
                  key={category.name}
                  name={category.name}
                  percentage={category.percentage}
                  items={category.items}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <RequirementDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveRequirement}
        requirement={selectedRequirement}
      />
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
  requirement: Requirement;
  formatDate: (date: string) => string;
  onEdit: () => void;
}

const RequirementItem: React.FC<RequirementItemProps> = ({
  requirement,
  formatDate,
  onEdit
}) => {
  const statusIcons = {
    completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    overdue: <AlertTriangle className="h-5 w-5 text-red-500" />,
    'due-soon': <AlertTriangle className="h-5 w-5 text-amber-500" />,
    pending: <Info className="h-5 w-5 text-blue-500" />
  };
  
  const priorityClasses = {
    high: "text-red-600 border-red-200 bg-red-50",
    medium: "text-amber-600 border-amber-200 bg-amber-50",
    low: "text-green-600 border-green-200 bg-green-50"
  };
  
  return (
    <li className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
      <div className="mt-0.5">
        {statusIcons[requirement.status]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{requirement.title}</h4>
          <div className="flex items-center gap-2">
            {requirement.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityClasses[requirement.priority]}`}>
                {requirement.priority}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDate(requirement.due_date)}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{requirement.description}</p>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">{requirement.category}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onEdit}>
            View & Edit
          </Button>
        </div>
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
      <div className="flex items-center gap-2">
        <Progress 
          value={percentage} 
          className={`h-2 flex-grow ${getProgressColor(percentage)}`} 
        />
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    </div>
  );
};

export default RequirementsDashboard;
