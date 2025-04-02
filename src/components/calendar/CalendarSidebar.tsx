
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CalendarSidebar: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p className="text-muted-foreground">No upcoming events</p>
          </div>
          <Button size="sm" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p className="text-muted-foreground">Filter options will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSidebar;
