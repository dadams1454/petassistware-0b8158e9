
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReproductiveStatus } from '@/types/reproductive';
import { CalendarDays, Heart, Baby, Stethoscope, Scissors } from 'lucide-react';

interface ReproductiveStatusCardProps {
  status: ReproductiveStatus;
  daysInStatus?: number;
  nextMilestone?: {
    type: string;
    days: number;
    label: string;
  };
}

const ReproductiveStatusCard: React.FC<ReproductiveStatusCardProps> = ({
  status,
  daysInStatus = 0,
  nextMilestone
}) => {
  // Function to get the appropriate icon and color based on status
  const getStatusInfo = () => {
    switch (status) {
      case ReproductiveStatus.InHeat:
        return {
          icon: <Heart className="h-6 w-6 text-red-500" />,
          color: 'bg-red-100 border-red-300',
          label: 'In Heat',
          description: `Day ${daysInStatus} of heat cycle`
        };
      case ReproductiveStatus.PreHeat:
        return {
          icon: <Heart className="h-6 w-6 text-orange-500" />,
          color: 'bg-orange-100 border-orange-300',
          label: 'Pre-Heat',
          description: 'Approaching heat cycle'
        };
      case ReproductiveStatus.Pregnant:
        return {
          icon: <Baby className="h-6 w-6 text-green-500" />,
          color: 'bg-green-100 border-green-300',
          label: 'Pregnant',
          description: `Day ${daysInStatus} of pregnancy`
        };
      case ReproductiveStatus.Whelping:
        return {
          icon: <Baby className="h-6 w-6 text-amber-500" />,
          color: 'bg-amber-100 border-amber-300',
          label: 'Whelping',
          description: 'Active whelping'
        };
      case ReproductiveStatus.Nursing:
        return {
          icon: <Baby className="h-6 w-6 text-blue-500" />,
          color: 'bg-blue-100 border-blue-300',
          label: 'Nursing',
          description: `${daysInStatus} days postpartum`
        };
      case ReproductiveStatus.Recovery:
        return {
          icon: <Stethoscope className="h-6 w-6 text-purple-500" />,
          color: 'bg-purple-100 border-purple-300',
          label: 'Recovery',
          description: `${daysInStatus} days in recovery`
        };
      case ReproductiveStatus.Intact:
      case ReproductiveStatus.NotInHeat:
        return {
          icon: <CalendarDays className="h-6 w-6 text-gray-500" />,
          color: 'bg-gray-100 border-gray-300',
          label: 'Not in Heat',
          description: 'Intact, not in heat'
        };
      case ReproductiveStatus.Altered:
      case ReproductiveStatus.Spayed:
      case ReproductiveStatus.Neutered:
        return {
          icon: <Scissors className="h-6 w-6 text-gray-500" />,
          color: 'bg-gray-100 border-gray-300',
          label: 'Altered',
          description: 'Spayed/Neutered'
        };
      default:
        return {
          icon: <CalendarDays className="h-6 w-6 text-gray-500" />,
          color: 'bg-gray-100 border-gray-300',
          label: 'Unknown',
          description: 'Status not available'
        };
    }
  };

  const { icon, color, label, description } = getStatusInfo();

  return (
    <Card className={`${color} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {icon}
          Reproductive Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-xl font-bold">{label}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
          
          {nextMilestone && (
            <div className="mt-4 text-sm">
              <div className="font-medium">Next Milestone:</div>
              <div className="text-muted-foreground">{nextMilestone.label} in {nextMilestone.days} days</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReproductiveStatusCard;
