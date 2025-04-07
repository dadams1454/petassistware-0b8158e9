
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dog } from '@/types/dog';

interface WhelpingPreparationProps {
  dog: Dog;
  breedingData?: {
    isPregnant?: boolean;
    confirmationDate?: string;
    tieDate?: string;
    estimatedDueDate?: string;
    daysUntilDue?: number;
    gestationDays?: number;
  };
}

const WhelpingPreparation: React.FC<WhelpingPreparationProps> = ({ dog, breedingData }) => {
  // Only show if the dog is pregnant
  const isPregnant = dog.is_pregnant || breedingData?.isPregnant;
  
  if (!isPregnant) {
    return null;
  }

  const tieDate = dog.tie_date || breedingData?.tieDate;
  const estimatedDueDate = breedingData?.estimatedDueDate || 
    (tieDate ? format(new Date(new Date(tieDate).getTime() + (63 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd') : null);
    
  const today = new Date();
  const daysUntilDue = estimatedDueDate ? 
    differenceInDays(new Date(estimatedDueDate), today) : breedingData?.daysUntilDue || null;
  
  const gestationDays = tieDate ? 
    differenceInDays(today, new Date(tieDate)) : breedingData?.gestationDays || null;
  
  const gestationProgress = gestationDays !== null ? Math.min(Math.round((gestationDays / 63) * 100), 100) : 0;
  
  // Determine urgency based on days until due
  let urgencyColor = 'bg-blue-500';
  let urgencyText = 'Preparing';
  
  if (daysUntilDue !== null) {
    if (daysUntilDue <= 0) {
      urgencyColor = 'bg-red-500';
      urgencyText = 'Due Now!';
    } else if (daysUntilDue <= 7) {
      urgencyColor = 'bg-amber-500';
      urgencyText = 'Upcoming';
    } else if (daysUntilDue <= 14) {
      urgencyColor = 'bg-green-500';
      urgencyText = 'Preparing';
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Whelping Preparation
          <Badge className={`ml-2 ${urgencyColor}`}>{urgencyText}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Whelping preparation details for {dog.name}.
        </p>
        
        <div className="space-y-4">
          {daysUntilDue !== null && daysUntilDue <= 7 && (
            <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-md border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Whelping approaching!</p>
                <p className="text-sm text-amber-700">
                  Estimated {daysUntilDue <= 0 ? 'due now' : `in ${daysUntilDue} days`}. 
                  Ensure your whelping area is prepared.
                </p>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-medium">Gestation Progress</h3>
            <div className="mt-2 space-y-2">
              <Progress value={gestationProgress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Day {gestationDays || '0'}</span>
                <span>63 days</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium">Estimated Due Date</h3>
            <p className="text-sm mt-1">
              {estimatedDueDate ? format(new Date(estimatedDueDate), 'MMMM d, yyyy') : 'Not available'}
              {daysUntilDue !== null && daysUntilDue > 0 && ` (in ${daysUntilDue} days)`}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Whelping Supplies Checklist</h3>
            <ul className="list-none pl-0 mt-2 space-y-1 text-sm">
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Whelping box
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Clean towels and bedding
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Heat lamp or heating pad
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Digital thermometer
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Surgical gloves
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Scissors (for umbilical cords)
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Dental floss (for tying cords)
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Iodine solution
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-4 w-4 text-green-500 mr-2" /> Scale for weighing puppies
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Signs of Labor</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
              <li>Drop in body temperature (below 99°F)</li>
              <li>Restlessness and nesting behavior</li>
              <li>Loss of appetite</li>
              <li>Panting and shivering</li>
              <li>Clear vaginal discharge</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Emergency Contacts</h3>
            <p className="text-sm mt-1">Make sure to have your veterinarian's emergency number readily available.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhelpingPreparation;
