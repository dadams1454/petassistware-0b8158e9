
import React, { useState } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import CareTracker from '@/components/dogs/components/care/CareTracker';
import { Card, CardContent } from '@/components/ui/card';
import dogCareService from '@/services/dailyCare/dogCareService';
import { DatePicker } from '@/components/ui/date-picker';

const DailyCare: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    setIsDatePickerOpen(false);
  };

  return (
    <PageLayout
      title="Daily Care"
      description="Manage and track daily pet care activities"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Daily Care Tracking</h2>
            <DatePicker
              date={date}
              onSelect={handleDateSelect}
            />
          </div>
          <CareTracker />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default DailyCare;
