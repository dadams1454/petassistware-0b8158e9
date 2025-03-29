
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DogGenotype } from '@/types/genetics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TraitProbabilityChartProps {
  sireGenotype: DogGenotype;
  damGenotype: DogGenotype;
  traitType: 'color' | 'coat' | 'size' | 'all';
  title?: string;
}

interface ColorProbability {
  name: string;
  probability: number;
  color: string;
}

export const TraitProbabilityChart: React.FC<TraitProbabilityChartProps> = ({
  sireGenotype,
  damGenotype,
  traitType,
  title = 'Offspring Color Probability'
}) => {
  const colorData = calculateColorProbabilities(sireGenotype, damGenotype);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colorData}
                dataKey="probability"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, probability }) => `${name}: ${probability}%`}
              >
                {colorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Probability']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {colorData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 mr-2 rounded-sm" 
                  style={{ backgroundColor: item.color }} 
                />
                <span>{item.name} ({item.probability}%)</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold mb-2">Genotype Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Sire:</span> {sireGenotype.baseColor}, {sireGenotype.brownDilution}, {sireGenotype.dilution}</p>
            </div>
            <div>
              <p><span className="font-semibold">Dam:</span> {damGenotype.baseColor}, {damGenotype.brownDilution}, {damGenotype.dilution}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate color inheritance
function calculateColorProbabilities(
  sireGenotype: DogGenotype, 
  damGenotype: DogGenotype
): ColorProbability[] {
  // Parse genotypes
  const sireBase = sireGenotype.baseColor.split('/');
  const damBase = damGenotype.baseColor.split('/');
  
  const sireBrown = sireGenotype.brownDilution.split('/');
  const damBrown = damGenotype.brownDilution.split('/');
  
  const sireDilution = sireGenotype.dilution.split('/');
  const damDilution = damGenotype.dilution.split('/');
  
  // Calculate possible combinations using Punnett square principles
  const colorOutcomes: Record<string, number> = {};
  
  // Calculate for each possible allele combination
  for (const sireAllele1 of sireBase) {
    for (const damAllele1 of damBase) {
      for (const sireAllele2 of sireBrown) {
        for (const damAllele2 of damBrown) {
          for (const sireAllele3 of sireDilution) {
            for (const damAllele3 of damDilution) {
              // Generate genotype for this combination
              const baseGenotype = sortAlleles(sireAllele1 + damAllele1);
              const brownGenotype = sortAlleles(sireAllele2 + damAllele2);
              const dilutionGenotype = sortAlleles(sireAllele3 + damAllele3);
              
              // Determine the phenotype (actual color)
              const phenotype = determinePhenotype(
                baseGenotype, 
                brownGenotype, 
                dilutionGenotype
              );
              
              // Increment count for this phenotype
              colorOutcomes[phenotype] = (colorOutcomes[phenotype] || 0) + 1;
            }
          }
        }
      }
    }
  }
  
  // Calculate total outcomes
  const totalOutcomes = Object.values(colorOutcomes).reduce((a, b) => a + b, 0);
  
  // Convert to percentages and format for chart
  return Object.entries(colorOutcomes).map(([name, count]) => ({
    name,
    probability: Math.round((count / totalOutcomes) * 100),
    color: getColorCode(name)
  }));
}

// Helper function to sort alleles (dominant first)
function sortAlleles(genotype: string): string {
  if (genotype.length !== 2) return genotype;
  
  const alleles = genotype.split('');
  
  // Sort so capital (dominant) letters come first
  alleles.sort((a, b) => {
    if (a === a.toUpperCase() && b !== b.toUpperCase()) return -1;
    if (a !== a.toUpperCase() && b === b.toUpperCase()) return 1;
    return a.localeCompare(b);
  });
  
  return alleles.join('');
}

// Determine phenotype based on genotype
function determinePhenotype(
  baseGenotype: string,
  brownGenotype: string,
  dilutionGenotype: string
): string {
  // E is dominant (black-based), e is recessive (red-based)
  const isBlackBased = baseGenotype.includes('E');
  
  // B is dominant (no brown), b is recessive (brown)
  const hasBrownDilution = brownGenotype === 'bb';
  
  // D is dominant (no dilution), d is recessive (dilute)
  const hasDilution = dilutionGenotype === 'dd';
  
  // Determine base color
  if (!isBlackBased) {
    // Red-based colors
    if (hasDilution) {
      return 'Cream';
    }
    return 'Red';
  } else {
    // Black-based colors
    if (hasBrownDilution) {
      // Brown variants
      if (hasDilution) {
        return 'Light Brown';
      }
      return 'Brown';
    } else {
      // Black variants
      if (hasDilution) {
        return 'Grey';
      }
      return 'Black';
    }
  }
}

// Get color code for chart visualization
function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#212529',
    'Grey': '#adb5bd',
    'Brown': '#795548',
    'Light Brown': '#a98274',
    'Red': '#fd7e14',
    'Cream': '#f8deb5'
  };
  
  return colorMap[colorName] || '#212529';
}

export default TraitProbabilityChart;
