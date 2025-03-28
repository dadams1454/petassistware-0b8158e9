
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, FileText, RefreshCw } from 'lucide-react';

interface ReportsTabProps {
  onRefresh: () => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ onRefresh }) => {
  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Reports</h2>
        <Button onClick={onRefresh} variant="outline" className="shrink-0">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <BarChart className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Dog Health Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="h-60 flex items-center justify-center bg-muted/20 rounded-md">
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Health summary visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <FileText className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Care Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="h-60 flex items-center justify-center bg-muted/20 rounded-md">
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Care activities report coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl truncate">Export Reports</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="space-x-2">
              <FileText className="h-4 w-4" />
              <span>Dog Health Report</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <FileText className="h-4 w-4" />
              <span>Vaccination Schedule</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <FileText className="h-4 w-4" />
              <span>Daily Care Summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
