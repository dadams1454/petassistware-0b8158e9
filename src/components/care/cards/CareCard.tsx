
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { useCareCategories } from '@/contexts/CareCategories/CareCategoriesContext';
import { CareCategory } from '@/types/careCategories';
import { format, formatDistanceToNow } from 'date-fns';

interface CareCardProps {
  categoryId: CareCategory;
  dogId: string;
  dogName: string;
  lastActivity?: {
    timestamp: string;
    title: string;
    description?: string;
  };
  onLogCare: () => void;
}

const CareCard: React.FC<CareCardProps> = ({
  categoryId,
  dogId,
  dogName,
  lastActivity,
  onLogCare
}) => {
  const { getCategoryById } = useCareCategories();
  const category = getCategoryById(categoryId);

  if (!category) return null;

  const getTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <Card className={`border-l-4 ${category.color} h-full`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {category.icon}
            {category.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onLogCare} className="h-8 px-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {lastActivity ? (
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(lastActivity.timestamp)}</span>
            </div>
            <p className="font-medium text-sm">{lastActivity.title}</p>
            {lastActivity.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {lastActivity.description}
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No {category.name.toLowerCase()} recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareCard;
