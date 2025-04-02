
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  HealthRecordTypeEnum, 
  AppetiteLevelEnum, 
  EnergyLevelEnum, 
  StoolConsistencyEnum,
  WeightUnit
} from '@/types/health';

/**
 * A card component that shows all the enum values from health.ts
 * Used for testing and confirming that enums are properly exported 
 */
const EnumPreviewCard: React.FC = () => {
  // Helper function to convert enum to displayable array
  const enumToArray = (enumObject: any) => {
    if (Array.isArray(enumObject)) {
      return enumObject;
    }
    return Object.values(enumObject);
  };

  // Create arrays of enum values
  const healthRecordTypes = enumToArray(HealthRecordTypeEnum);
  const appetiteLevels = enumToArray(AppetiteLevelEnum);
  const energyLevels = enumToArray(EnergyLevelEnum);
  const stoolConsistencies = enumToArray(StoolConsistencyEnum);
  
  // Weight units is a union type, not an enum
  const weightUnits: WeightUnit[] = ['oz', 'g', 'lbs', 'kg', 'lb'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Enums Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Health Record Types</h3>
          <div className="flex flex-wrap gap-2">
            {healthRecordTypes.map((type) => (
              <span key={type} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Appetite Levels</h3>
          <div className="flex flex-wrap gap-2">
            {appetiteLevels.map((level) => (
              <span key={level} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {level}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Energy Levels</h3>
          <div className="flex flex-wrap gap-2">
            {energyLevels.map((level) => (
              <span key={level} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                {level}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Stool Consistencies</h3>
          <div className="flex flex-wrap gap-2">
            {stoolConsistencies.map((consistency) => (
              <span key={consistency} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                {consistency}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Weight Units</h3>
          <div className="flex flex-wrap gap-2">
            {weightUnits.map((unit) => (
              <span key={unit} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                {unit}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnumPreviewCard;
