import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog } from '@/types/dog';

interface WhelpingPreparationProps {
  dog: Dog;
}

const WhelpingPreparation: React.FC<WhelpingPreparationProps> = ({ dog }) => {
  if (!dog.is_pregnant) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Whelping Preparation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Whelping preparation details for {dog.name}.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Estimated Due Date</h3>
            <p>{dog.tie_date ? 'Calculating...' : 'Not available'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Whelping Supplies</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Whelping box</li>
              <li>Clean towels and bedding</li>
              <li>Heat lamp or heating pad</li>
              <li>Digital thermometer</li>
              <li>Surgical gloves</li>
              <li>Scissors (for cutting umbilical cords)</li>
              <li>Dental floss (for tying umbilical cords)</li>
              <li>Iodine solution</li>
              <li>Scale for weighing puppies</li>
              <li>Notebook for record keeping</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Signs of Labor</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Drop in body temperature (below 99°F)</li>
              <li>Restlessness and nesting behavior</li>
              <li>Loss of appetite</li>
              <li>Panting and shivering</li>
              <li>Clear vaginal discharge</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Emergency Contacts</h3>
            <p className="text-sm">Make sure to have your veterinarian's emergency number readily available.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhelpingPreparation;
