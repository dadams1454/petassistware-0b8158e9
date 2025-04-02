
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { SocializationCategory, SocializationProgress } from '@/types/puppyTracking';

interface SocializationCategoryListProps {
  categories: SocializationCategory[];
  progress: SocializationProgress[];
  onAddExperience: () => void;
}

const SocializationCategoryList: React.FC<SocializationCategoryListProps> = ({
  categories,
  progress,
  onAddExperience
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map(category => {
        const categoryProgress = progress.find(p => p.categoryId === category.id);
        const completionPercentage = categoryProgress?.completion_percentage || 0;
        const count = categoryProgress?.count || 0;
        const target = categoryProgress?.target || 0;
        
        // Get color for progress bar
        const getProgressColor = (percentage: number) => {
          if (percentage >= 100) return 'bg-green-500';
          if (percentage >= 75) return 'bg-blue-500';
          if (percentage >= 50) return 'bg-amber-500';
          if (percentage >= 25) return 'bg-orange-500';
          return 'bg-red-500';
        };
        
        return (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant="outline" className={completionPercentage >= 100 ? 'bg-green-100 text-green-800' : ''}>
                  {count}/{target}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {category.description || `Experiences related to ${category.name.toLowerCase()}`}
                </p>
                
                <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressColor(completionPercentage)}`} 
                    style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completionPercentage}% complete</span>
                  <span>{count} experiences</span>
                </div>
              </div>
              
              {category.examples && (
                <div className="mt-3 text-sm">
                  <p className="font-medium mb-1">Examples:</p>
                  <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                    {category.examples.slice(0, 3).map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3" 
                onClick={onAddExperience}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Experience
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SocializationCategoryList;
