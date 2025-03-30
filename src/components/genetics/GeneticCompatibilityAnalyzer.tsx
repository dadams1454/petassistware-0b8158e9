
import React, { useEffect, useState } from 'react';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { HealthWarningCard } from './HealthWarningCard';
import { HealthWarning } from '@/types/genetics';

// TypeScript interfaces
interface GeneticCompatibilityProps {
  sireId: string;
  damId: string;
  showProbabilities?: boolean;
  showHealthWarnings?: boolean;
}

interface CompatibilityAnalysis {
  coi: number;
  healthWarnings: HealthWarning[];
  compatibleTests: string[];
  incompatibleTests: string[];
}

export const GeneticCompatibilityAnalyzer: React.FC<GeneticCompatibilityProps> = ({
  sireId,
  damId,
  showProbabilities = true,
  showHealthWarnings = true
}) => {
  const { geneticData: sireGenetics, loading: sireLoading } = useDogGenetics(sireId);
  const { geneticData: damGenetics, loading: damLoading } = useDogGenetics(damId);
  const [analysis, setAnalysis] = useState<CompatibilityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Reset loading state when dog IDs change
    setIsLoading(true);
    
    // Only proceed when both dogs' genetic data is loaded
    if (!sireLoading && !damLoading && sireGenetics && damGenetics) {
      // Perform compatibility analysis
      const compatibilityAnalysis = analyzeGeneticCompatibility(sireGenetics, damGenetics);
      setAnalysis(compatibilityAnalysis);
      setIsLoading(false);
    }
  }, [sireId, damId, sireGenetics, damGenetics, sireLoading, damLoading]);
  
  // Helper function to analyze genetic compatibility
  function analyzeGeneticCompatibility(sireGenetics: any, damGenetics: any): CompatibilityAnalysis {
    // Start with empty results
    const healthWarnings: HealthWarning[] = [];
    const compatibleTests: string[] = [];
    const incompatibleTests: string[] = [];
    
    // Calculate coefficient of inbreeding (COI)
    // This would typically come from a more complex pedigree analysis
    // For now, we'll use a placeholder value
    const coi = calculateCOI(sireGenetics, damGenetics);
    
    // Check for health condition carrier status
    for (const [condition, sireMarker] of Object.entries(sireGenetics.healthMarkers)) {
      // Type assertion to access status property
      const sireStatus = (sireMarker as any).status;
      
      // Check if both dogs have data for this condition
      if (damGenetics.healthMarkers[condition]) {
        const damMarker = damGenetics.healthMarkers[condition];
        const damStatus = (damMarker as any).status;
        
        // Add to compatible tests list if both are clear
        if (sireStatus === 'clear' && damStatus === 'clear') {
          compatibleTests.push(condition);
        }
        
        // Check for carrier × carrier scenarios
        if (sireStatus === 'carrier' && damStatus === 'carrier') {
          healthWarnings.push({
            condition,
            riskLevel: 'critical',
            description: `Both parents are carriers for ${condition}`,
            affectedPercentage: 25
          });
          incompatibleTests.push(condition);
        }
        
        // Check for affected × carrier scenarios
        if ((sireStatus === 'affected' && damStatus === 'carrier') ||
            (sireStatus === 'carrier' && damStatus === 'affected')) {
          healthWarnings.push({
            condition,
            riskLevel: 'high',
            description: `One parent is affected and one is a carrier for ${condition}`,
            affectedPercentage: 50
          });
          incompatibleTests.push(condition);
        }
        
        // Check for affected × affected scenarios
        if (sireStatus === 'affected' && damStatus === 'affected') {
          healthWarnings.push({
            condition,
            riskLevel: 'critical',
            description: `Both parents are affected with ${condition}`,
            affectedPercentage: 100
          });
          incompatibleTests.push(condition);
        }
      }
    }
    
    // Check COI level for warnings
    if (coi > 12.5) {
      healthWarnings.push({
        condition: 'High Inbreeding',
        riskLevel: 'high',
        description: `COI of ${coi.toFixed(1)}% exceeds recommended maximum (12.5%)`
      });
    } else if (coi > 6.25) {
      healthWarnings.push({
        condition: 'Moderate Inbreeding',
        riskLevel: 'medium',
        description: `COI of ${coi.toFixed(1)}% is above ideal level (6.25%)`
      });
    }
    
    return {
      coi,
      healthWarnings,
      compatibleTests,
      incompatibleTests
    };
  }
  
  // Helper function to calculate COI
  // In a real implementation, this would analyze the full pedigree
  function calculateCOI(sireGenetics: any, damGenetics: any): number {
    // Placeholder for actual COI calculation
    // This would normally involve tracking common ancestors
    return 4.2; // Example value
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2.5"></div>
      </div>
    );
  }
  
  // Render analysis results
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">Genetic Compatibility Analysis</h3>
      </div>
      
      {/* COI Section */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-md font-semibold mb-2">Coefficient of Inbreeding (COI)</h4>
        
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full ${getCoiColorClass(analysis?.coi || 0)}`}
            style={{ width: `${Math.min(100, ((analysis?.coi || 0) * 8))}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
            {analysis?.coi.toFixed(1)}%
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {getCoiDescription(analysis?.coi || 0)}
        </div>
      </div>
      
      {/* Health Warnings Section */}
      {showHealthWarnings && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-md font-semibold mb-2">Health Considerations</h4>
          
          {analysis?.healthWarnings && analysis.healthWarnings.length > 0 ? (
            <div className="space-y-2">
              {analysis.healthWarnings.map((warning, index) => (
                <HealthWarningCard key={index} warning={warning} />
              ))}
            </div>
          ) : (
            <div className="p-3 bg-green-50 text-green-800 rounded-md">
              No genetic health concerns detected between these dogs.
            </div>
          )}
        </div>
      )}
      
      {/* Compatible Tests Section */}
      <div className="p-4">
        <h4 className="text-md font-semibold mb-2">Compatible Genetic Tests</h4>
        
        {analysis?.compatibleTests && analysis.compatibleTests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {analysis.compatibleTests.map((test, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                {formatConditionName(test)}: Clear
              </span>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600 italic">
            No shared clear genetic tests found.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get COI color class based on value
function getCoiColorClass(coi: number): string {
  if (coi < 3.125) return 'bg-green-500';
  if (coi < 6.25) return 'bg-green-400';
  if (coi < 12.5) return 'bg-yellow-400';
  return 'bg-red-500';
}

// Helper function to get COI description
function getCoiDescription(coi: number): string {
  if (coi < 3.125) {
    return 'Excellent - Very low inbreeding coefficient';
  } else if (coi < 6.25) {
    return 'Good - Acceptable inbreeding coefficient';
  } else if (coi < 12.5) {
    return 'Caution - Moderate inbreeding coefficient';
  } else {
    return 'Warning - High inbreeding coefficient';
  }
}

// Helper function to format condition names
function formatConditionName(condition: string): string {
  // Convert common abbreviations
  const abbreviations: Record<string, string> = {
    'DM': 'Degenerative Myelopathy',
    'DCM': 'Dilated Cardiomyopathy',
    'vWD': 'von Willebrand Disease',
    'PRA': 'Progressive Retinal Atrophy'
  };
  
  if (abbreviations[condition]) {
    return abbreviations[condition];
  }
  
  // Otherwise capitalize each word
  return condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default GeneticCompatibilityAnalyzer;
