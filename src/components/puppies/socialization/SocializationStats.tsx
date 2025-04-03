
import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SocializationExperience } from '@/types/puppyTracking';
import SocializationProgressTracker from './SocializationProgressTracker';

interface SocializationStatsProps {
  experiences: SocializationExperience[];
}

const SocializationStats: React.FC<SocializationStatsProps> = ({ experiences }) => {
  const stats = useMemo(() => {
    // Define the target categories and counts
    const targets = [
      { category: 'people', categoryName: 'People', target: 10 },
      { category: 'animals', categoryName: 'Animals', target: 5 },
      { category: 'environments', categoryName: 'Environments', target: 8 },
      { category: 'sounds', categoryName: 'Sounds', target: 6 },
      { category: 'handling', categoryName: 'Handling', target: 7 },
      { category: 'surfaces', categoryName: 'Surfaces', target: 5 },
      { category: 'objects', categoryName: 'Objects', target: 8 },
    ];

    // Count experiences by category
    const categoryCounts: Record<string, number> = {};
    const reactionCounts: Record<string, number> = {};
    const dateMap: Record<string, number> = {};

    experiences.forEach(exp => {
      // Track category counts
      const category = exp.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      
      // Track reaction counts
      const reaction = exp.reaction || 'neutral';
      reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
      
      // Track experience dates for timeline
      if (typeof exp.experience_date === 'string') {
        const date = exp.experience_date.split('T')[0];
        dateMap[date] = (dateMap[date] || 0) + 1;
      }
    });

    // Calculate progress for each category
    const progressData = targets.map(target => {
      const count = categoryCounts[target.category] || 0;
      const completion_percentage = Math.min(Math.round((count / target.target) * 100), 100);
      return {
        category: target.category,
        categoryName: target.categoryName,
        count,
        target: target.target,
        completion_percentage
      };
    });

    // Calculate overall progress
    const totalExperiences = experiences.length;
    const totalTargets = targets.reduce((sum, t) => sum + t.target, 0);
    const overallProgress = Math.min(Math.round((totalExperiences / totalTargets) * 100), 100);

    // Get reaction distribution
    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
    const reactionDistribution = Object.entries(reactionCounts).map(([type, count]) => ({
      type,
      count,
      percentage: totalReactions > 0 ? Math.round((count / totalReactions) * 100) : 0
    }));

    return {
      totalExperiences,
      progressData,
      overallProgress,
      reactionDistribution,
      dateMap
    };
  }, [experiences]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SocializationProgressTracker 
        progressData={stats.progressData} 
        overallProgress={stats.overallProgress} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Reaction Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.reactionDistribution.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No reaction data available yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.reactionDistribution.map(({ type, count, percentage }) => {
                const reactionInfo = {
                  'very_positive': { name: 'Very Positive', emoji: '😄', color: 'bg-green-600' },
                  'positive': { name: 'Positive', emoji: '🙂', color: 'bg-green-500' },
                  'neutral': { name: 'Neutral', emoji: '😐', color: 'bg-gray-500' },
                  'cautious': { name: 'Cautious', emoji: '😟', color: 'bg-yellow-500' },
                  'fearful': { name: 'Fearful', emoji: '😨', color: 'bg-orange-500' },
                  'very_fearful': { name: 'Very Fearful', emoji: '😱', color: 'bg-red-500' }
                }[type] || { name: type, emoji: '❓', color: 'bg-blue-500' };
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{reactionInfo.emoji}</span>
                        <span>{reactionInfo.name}</span>
                      </div>
                      <span className="font-medium">{count} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className={`h-1.5 ${reactionInfo.color}`} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Total Socialization Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <span className="text-3xl font-bold">{stats.totalExperiences}</span>
            <span className="text-muted-foreground ml-2">experiences recorded</span>
          </div>
          
          <Progress 
            value={stats.overallProgress} 
            className="h-2 mb-2" 
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0%</span>
            <span>{stats.overallProgress}% Complete</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocializationStats;
