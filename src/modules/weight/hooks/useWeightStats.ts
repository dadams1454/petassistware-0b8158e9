
/**
 * Hook for calculating weight statistics
 */
import { useMemo } from 'react';
import { WeightRecord, GrowthStats } from '../types';
import { WeightUnit } from '@/types/weight-units';
import { convertWeight, calculatePercentChange } from '@/utils/weightConversion';

/**
 * Hook to calculate weight statistics based on weight records
 * 
 * @param weightRecords Array of weight records
 * @param preferredUnit Preferred unit for weight display
 * @returns Growth statistics
 */
export const useWeightStats = (
  weightRecords: WeightRecord[],
  preferredUnit?: WeightUnit
): GrowthStats => {
  return useMemo(() => {
    if (!weightRecords || weightRecords.length === 0) {
      return {
        percentChange: 0,
      };
    }
    
    // Sort records by date (oldest to newest for calculations)
    const sortedRecords = [...weightRecords].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstRecord = sortedRecords[0];
    const latestRecord = sortedRecords[sortedRecords.length - 1];
    
    // Get unit to use (either preferred unit or unit from latest record)
    const unit = preferredUnit || latestRecord.weight_unit;
    
    // Convert weights to the same unit for comparison
    const firstWeight = convertWeight(
      firstRecord.weight, 
      firstRecord.weight_unit, 
      unit
    );
    
    const latestWeight = convertWeight(
      latestRecord.weight, 
      latestRecord.weight_unit, 
      unit
    );
    
    // Calculate overall percent change
    const percentChange = calculatePercentChange(firstWeight, latestWeight);
    
    // Calculate growth rate (gain per day)
    let growthRate = 0;
    let averageGrowthRate = 0;
    
    if (sortedRecords.length > 1) {
      const firstDate = new Date(firstRecord.date);
      const latestDate = new Date(latestRecord.date);
      const daysDiff = (latestDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 0) {
        growthRate = (latestWeight - firstWeight) / daysDiff;
        
        // Calculate average daily growth rate
        let totalDailyGrowth = 0;
        let totalDays = 0;
        
        for (let i = 1; i < sortedRecords.length; i++) {
          const prevRecord = sortedRecords[i - 1];
          const currRecord = sortedRecords[i];
          
          const prevWeight = convertWeight(
            prevRecord.weight, 
            prevRecord.weight_unit, 
            unit
          );
          
          const currWeight = convertWeight(
            currRecord.weight, 
            currRecord.weight_unit, 
            unit
          );
          
          const prevDate = new Date(prevRecord.date);
          const currDate = new Date(currRecord.date);
          const days = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (days > 0) {
            totalDailyGrowth += (currWeight - prevWeight) / days;
            totalDays++;
          }
        }
        
        if (totalDays > 0) {
          averageGrowthRate = totalDailyGrowth / totalDays;
        }
      }
    }
    
    // Calculate recent growth (last week)
    let lastWeekGrowth = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentRecords = sortedRecords.filter(
      record => new Date(record.date) >= oneWeekAgo
    );
    
    if (recentRecords.length > 1) {
      const firstRecentRecord = recentRecords[0];
      const latestRecentRecord = recentRecords[recentRecords.length - 1];
      
      const firstRecentWeight = convertWeight(
        firstRecentRecord.weight, 
        firstRecentRecord.weight_unit, 
        unit
      );
      
      const latestRecentWeight = convertWeight(
        latestRecentRecord.weight, 
        latestRecentRecord.weight_unit, 
        unit
      );
      
      lastWeekGrowth = latestRecentWeight - firstRecentWeight;
    }
    
    // Simple projection (if growth continues at the same rate)
    const projectedWeight = growthRate > 0 ? 
      latestWeight + (growthRate * 30) : // Project 30 days
      undefined;
    
    return {
      percentChange,
      averageGrowthRate,
      projectedWeight,
      growthRate,
      lastWeekGrowth,
      totalGrowth: latestWeight - firstWeight,
      currentWeight: {
        value: latestWeight,
        unit,
        date: latestRecord.date
      }
    };
  }, [weightRecords, preferredUnit]);
};
