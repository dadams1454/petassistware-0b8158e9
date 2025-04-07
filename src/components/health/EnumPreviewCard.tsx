
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HealthRecordType, 
  AppetiteLevel,
  EnergyLevel,
  StoolConsistency 
} from '@/types/health-enums';

const EnumPreviewCard: React.FC = () => {
  // Helper function to convert enum to array
  const enumToArray = (enumObj: any) => {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ 
        key, 
        value: enumObj[key] 
      }));
  };

  // Get values from each enum
  const healthRecordTypes = enumToArray(HealthRecordType);
  const appetiteLevels = enumToArray(AppetiteLevel);
  const energyLevels = enumToArray(EnergyLevel);
  const stoolConsistencies = enumToArray(StoolConsistency);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Enums Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Health Record Types</h3>
            <div className="flex flex-wrap gap-2">
              {healthRecordTypes.map(({ key, value }) => (
                <Badge key={key} variant="outline" className="bg-blue-50">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Appetite Levels</h3>
            <div className="flex flex-wrap gap-2">
              {appetiteLevels.map(({ key, value }) => (
                <Badge key={key} variant="outline" className="bg-green-50">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Energy Levels</h3>
            <div className="flex flex-wrap gap-2">
              {energyLevels.map(({ key, value }) => (
                <Badge key={key} variant="outline" className="bg-yellow-50">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Stool Consistency</h3>
            <div className="flex flex-wrap gap-2">
              {stoolConsistencies.map(({ key, value }) => (
                <Badge key={key} variant="outline" className="bg-amber-50">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnumPreviewCard;
