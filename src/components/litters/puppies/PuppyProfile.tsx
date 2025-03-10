import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PuppyStatusBadge from './PuppyStatusBadge';
import { Calendar, Weight, Dog, MessageSquare } from 'lucide-react';

interface PuppyProfileProps {
  puppy: Puppy;
}

const PuppyProfile: React.FC<PuppyProfileProps> = ({ puppy }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderDetailItem = (icon: React.ReactNode, label: string, value: string | React.ReactNode) => (
    <div className="flex items-start space-x-2 mb-3">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </CardHeader>
          <CardContent>
            {renderDetailItem(
              <Calendar className="h-4 w-4" />,
              "Created",
              formatDate(puppy.created_at)
            )}
            
            {renderDetailItem(
              <Dog className="h-4 w-4" />,
              "Gender",
              <div className="flex items-center">
                <span className="mr-2">{puppy.gender}</span>
                {puppy.collar_color && (
                  <Badge 
                    style={{ backgroundColor: puppy.collar_color }}
                    className="text-white"
                  >
                    {puppy.collar_color}
                  </Badge>
                )}
              </div>
            )}
            
            {renderDetailItem(
              <Weight className="h-4 w-4" />,
              "Birth Weight",
              puppy.birth_weight ? `${puppy.birth_weight} g` : 'Not recorded'
            )}
            
            {renderDetailItem(
              <Weight className="h-4 w-4" />,
              "Current Weight",
              puppy.current_weight ? `${puppy.current_weight} g` : 'Not recorded'
            )}
            
            {renderDetailItem(
              <MessageSquare className="h-4 w-4" />,
              "Notes",
              puppy.notes ? (
                <div className="prose prose-sm max-w-none">
                  <p>{puppy.notes}</p>
                </div>
              ) : 'No notes'
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Status & Registration</h3>
          </CardHeader>
          <CardContent>
            {renderDetailItem(
              <Dog className="h-4 w-4" />,
              "Status",
              <PuppyStatusBadge status={puppy.status} />
            )}
            
            {renderDetailItem(
              <Dog className="h-4 w-4" />,
              "Microchip",
              puppy.microchip_number || 'Not microchipped'
            )}
            
            {renderDetailItem(
              <Dog className="h-4 w-4" />,
              "AKC #",
              puppy.akc_number || 'Not registered'
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Appearance</h3>
          </CardHeader>
          <CardContent>
            {renderDetailItem(
              <Dog className="h-4 w-4" />,
              "Color",
              puppy.color || 'Not specified'
            )}
            
            {renderDetailItem(
              <Dog className="h-4 w-4" />,
              "Markings",
              puppy.markings || 'Not specified'
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PuppyProfile;
