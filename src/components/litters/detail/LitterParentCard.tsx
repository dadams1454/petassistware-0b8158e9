
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dog } from '@/types/litter';
import { Badge } from '@/components/ui/badge';
import { ScanSearch } from 'lucide-react';

interface LitterParentCardProps {
  title: string;
  dog?: Dog | null;
  icon: ReactNode;
}

const LitterParentCard: React.FC<LitterParentCardProps> = ({ 
  title, 
  dog, 
  icon 
}) => {
  if (!dog) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <div className="text-muted-foreground mb-2">
            <ScanSearch className="h-10 w-10" />
          </div>
          <p className="text-center text-muted-foreground">No {title} selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {dog.photo_url ? (
            <div className="w-full sm:w-1/3 h-32 sm:h-full relative bg-muted">
              <img 
                src={dog.photo_url} 
                alt={dog.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full sm:w-1/3 h-32 sm:h-full bg-muted flex items-center justify-center">
              <Dog className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-2">
              {icon}
              <h3 className="font-semibold">{title}</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">{dog.name}</p>
              
              <div className="flex flex-wrap gap-2">
                {dog.breed && (
                  <Badge variant="outline">{dog.breed}</Badge>
                )}
                {dog.color && (
                  <Badge 
                    variant="outline" 
                    className="border-none" 
                    style={{ 
                      backgroundColor: getColorBackground(dog.color),
                      color: getTextColor(dog.color)
                    }}
                  >
                    {dog.color}
                  </Badge>
                )}
                {dog.registration_number && (
                  <Badge variant="secondary">
                    AKC: {dog.registration_number}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions for color styling
function getColorBackground(color: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#333333',
    'Brown': '#8B4513',
    'Gray': '#808080',
    'Grey': '#808080',
    'Landseer': '#F5F5F5',
    'White': '#FFFFFF',
  };
  
  return colorMap[color] || '#F0F0F0';
}

function getTextColor(color: string): string {
  const darkColors = ['Black', 'Brown', 'Gray', 'Grey', 'Blue'];
  return darkColors.includes(color) ? '#FFFFFF' : '#333333';
}

export default LitterParentCard;
