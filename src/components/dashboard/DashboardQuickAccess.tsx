import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Grid, LayoutDashboard, Dog as DogIcon, ClipboardCheck, Calendar, UserPlus, Utensils, PawPrint } from 'lucide-react';

interface QuickAccessItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const quickAccessItems = [
  {
    title: "Add New Dog",
    icon: <DogIcon className="h-5 w-5" />,
    path: "/dogs/add"
  },
  {
    title: "Daily Care",
    icon: <ClipboardCheck className="h-5 w-5" />,
    path: "/daily-care"
  },
  {
    title: "Dog Let Out",
    icon: <PawPrint className="h-5 w-5" />,
    path: "/daily-care?category=dogletout"
  },
  {
    title: "Record Feeding",
    icon: <Utensils className="h-5 w-5" />,
    path: "/daily-care?category=feeding"
  },
  {
    title: "Schedule",
    icon: <Calendar className="h-5 w-5" />,
    path: "/calendar"
  },
  {
    title: "Add Customer",
    icon: <UserPlus className="h-5 w-5" />,
    path: "/customers/add"
  }
];

export function DashboardQuickAccess() {
  return (
    <Card>
      <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
        {quickAccessItems.map((item) => (
          <Link key={item.title} to={item.path} className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-secondary">
            <div className="mb-2">{item.icon}</div>
            <div className="text-sm font-medium text-center">{item.title}</div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
