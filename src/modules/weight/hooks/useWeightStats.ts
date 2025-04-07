
/**
 * Hook for calculating weight statistics and trends
 */
import { useMemo } from 'react';
import { WeightRecord, GrowthStats } from '../types';
import { WeightUnit } from '@/types/weight-units';
import { 
  convertWeight, 
  calculatePercentChange, 
  getAppropriateWeightUnit 
} from '@/utils/weightConversion';

/**
 * Calculate growth statistics from weight records
 * 
 * @param weightRecords The array of weight records
 * @param preferredUnit The preferred weight unit for display
 * @returns Growth statistics
 */
export const useWeightStats = (
  weightRecords: WeightRecord[] = [],
  preferredUnit?: WeightUnit
): GrowthStats | null => {
  return useMemo(() => {
    if (!weightRecords || weightRecords.length === 0) {
      return null;
    }

    // Sort records by date (most recent first)
    const sortedRecords = [...weightRecords].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Get latest and previous records
    const latestRecord = sortedRecords[0];
    const previousRecord = sortedRecords.length > 1 ? sortedRecords[1] : null;
    
    // Calculate percentage change
    const percentChange = previousRecord 
      ? calculatePercentChange(
          convertWeight(previousRecord.weight, previousRecord.weight_unit, latestRecord.weight_unit),
          latestRecord.weight
        )
      : 0;
    
    // Get the appropriate display unit if not specified
    const displayUnit = preferredUnit || getAppropriateWeightUnit(latestRecord.weight, latestRecord.weight_unit);
    
    // Calculate growth rate over the past week (if enough data points)
    let averageGrowthRate = 0;
    let totalGrowth = 0;
    let lastWeekGrowth = 0;
    
    if (sortedRecords.length > 1) {
      // Calculate total growth
      const oldestRecord = sortedRecords[sortedRecords.length - 1];
      const oldestWeight = convertWeight(
        oldestRecord.weight,
        oldestRecord.weight_unit,
        displayUnit
      );
      
      const latestWeight = convertWeight(
        latestRecord.weight,
        latestRecord.weight_unit,
        displayUnit
      );
      
      totalGrowth = calculatePercentChange(oldestWeight, latestWeight);
      
      // Calculate days between first and last record
      const daysDiff = (
        new Date(latestRecord.date).getTime() - 
        new Date(oldestRecord.date).getTime()
      ) / (1000 * 60 * 60 * 24);
      
      // Calculate average daily growth rate
      averageGrowthRate = daysDiff > 0 ? totalGrowth / daysDiff : 0;
      
      // Calculate growth over the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weekRecords = sortedRecords.filter(
        record => new Date(record.date) >= oneWeekAgo
      );
      
      if (weekRecords.length > 1) {
        const oldestWeekRecord = weekRecords[weekRecords.length - 1];
        const oldestWeekWeight = convertWeight(
          oldestWeekRecord.weight,
          oldestWeekRecord.weight_unit,
          displayUnit
        );
        
        lastWeekGrowth = calculatePercentChange(oldestWeekWeight, latestWeight);
      }
    }
    
    // Create result object
    return {
      percentChange,
      averageGrowthRate,
      totalGrowth,
      lastWeekGrowth,
      growthRate: averageGrowthRate,
      currentWeight: {
        value: convertWeight(latestRecord.weight, latestRecord.weight_unit, displayUnit),
        unit: displayUnit,
        date: latestRecord.date
      }
    };
  }, [weightRecords, preferredUnit]);
};
