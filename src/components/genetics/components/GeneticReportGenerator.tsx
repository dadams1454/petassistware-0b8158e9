
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Download, Printer, Mail, FileDown } from 'lucide-react';
import { GeneticReportGeneratorProps } from '@/types/genetics';
import { useToast } from '@/hooks/use-toast';
import { formatConditionName, getHealthSummaryData } from '../utils/healthUtils';

export const GeneticReportGenerator: React.FC<GeneticReportGeneratorProps> = ({
  dogId,
  dogName = 'This dog',
  dogGenetics
}) => {
  const { toast } = useToast();
  const [includeSections, setIncludeSections] = useState({
    healthSummary: true,
    detailedHealthTests: true,
    colorGenetics: true,
    coi: true,
    breedingRecommendations: false
  });
  const [reportType, setReportType] = useState<'detailed' | 'summary' | 'certificate'>('detailed');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Toggle a section
  const toggleSection = (section: keyof typeof includeSections) => {
    setIncludeSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Generate PDF report
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `A ${reportType} report for ${dogName} has been generated.`
      });
      setIsGenerating(false);
    }, 1500);
  };
  
  // Send report by email
  const sendReportByEmail = () => {
    toast({
      title: "Email Sent",
      description: `A ${reportType} report for ${dogName} has been sent by email.`
    });
  };
  
  // Export data in CSV format
  const exportCSV = () => {
    if (!dogGenetics) {
      toast({
        title: "Export Failed",
        description: "No genetic data available to export.",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    let csvContent = "Test Type,Date,Result,Lab\n";
    
    dogGenetics.testResults.forEach(test => {
      csvContent += `"${test.testType}","${test.testDate}","${test.result}","${test.labName}"\n`;
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dogName.replace(/\s+/g, '_')}_genetic_tests.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Export Complete",
      description: "Genetic test data has been exported to CSV format."
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <FileText className="h-5 w-5 mr-2" /> Genetic Report Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Report Type</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={reportType === 'detailed' ? 'default' : 'outline'}
                  className="w-full h-10 p-0"
                  onClick={() => setReportType('detailed')}
                >
                  Detailed
                </Button>
                <Button
                  variant={reportType === 'summary' ? 'default' : 'outline'}
                  className="w-full h-10 p-0"
                  onClick={() => setReportType('summary')}
                >
                  Summary
                </Button>
                <Button
                  variant={reportType === 'certificate' ? 'default' : 'outline'}
                  className="w-full h-10 p-0"
                  onClick={() => setReportType('certificate')}
                >
                  Certificate
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Include Sections</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="healthSummary" 
                    checked={includeSections.healthSummary}
                    onCheckedChange={() => toggleSection('healthSummary')}
                  />
                  <Label htmlFor="healthSummary">Health Summary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="detailedHealthTests" 
                    checked={includeSections.detailedHealthTests}
                    onCheckedChange={() => toggleSection('detailedHealthTests')}
                  />
                  <Label htmlFor="detailedHealthTests">Detailed Health Tests</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="colorGenetics" 
                    checked={includeSections.colorGenetics}
                    onCheckedChange={() => toggleSection('colorGenetics')}
                  />
                  <Label htmlFor="colorGenetics">Color Genetics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="coi" 
                    checked={includeSections.coi}
                    onCheckedChange={() => toggleSection('coi')}
                  />
                  <Label htmlFor="coi">COI Analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="breedingRecommendations" 
                    checked={includeSections.breedingRecommendations}
                    onCheckedChange={() => toggleSection('breedingRecommendations')}
                  />
                  <Label htmlFor="breedingRecommendations">Breeding Recommendations</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={generateReport}
                disabled={isGenerating}
              >
                {isGenerating 
                  ? <><span className="animate-spin mr-2">⟳</span> Generating Report...</>
                  : <><Download className="h-4 w-4 mr-2" /> Generate PDF Report</>
                }
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={sendReportByEmail}>
                  <Mail className="h-4 w-4 mr-2" /> Email
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Print
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={exportCSV}>
                <FileDown className="h-4 w-4 mr-2" /> Export as CSV
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">Report Preview</h3>
            
            {!dogGenetics ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>No genetic data available for preview</p>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="text-center border-b pb-2">
                  <h2 className="font-bold">{reportType === 'certificate' ? 'Genetic Health Certificate' : 'Genetic Report'}</h2>
                  <p>{dogName}</p>
                </div>
                
                {includeSections.healthSummary && (
                  <div>
                    <h3 className="font-medium">Health Summary</h3>
                    {(() => {
                      const summary = getHealthSummaryData(dogGenetics.healthMarkers);
                      
                      if (!summary.hasTests) {
                        return <p className="text-muted-foreground">No health test data available</p>;
                      }
                      
                      return (
                        <div className="space-y-1">
                          {summary.affected.length > 0 && (
                            <p>
                              <span className="font-semibold text-red-600">Affected by:</span>{' '}
                              {summary.affected.join(', ')}
                            </p>
                          )}
                          {summary.carriers.length > 0 && (
                            <p>
                              <span className="font-semibold text-yellow-600">Carrier for:</span>{' '}
                              {summary.carriers.join(', ')}
                            </p>
                          )}
                          {summary.clear.length > 0 && (
                            <p>
                              <span className="font-semibold text-green-600">Clear for:</span>{' '}
                              {summary.clear.join(', ')}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {includeSections.detailedHealthTests && dogGenetics.testResults.length > 0 && (
                  <div>
                    <h3 className="font-medium">Detailed Test Results</h3>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1">Test</th>
                          <th className="text-left py-1">Result</th>
                          <th className="text-left py-1">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dogGenetics.testResults.filter(t => t.testType !== 'Color Panel').map((test, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-1">{formatConditionName(test.testType)}</td>
                            <td className="py-1">{test.result}</td>
                            <td className="py-1">{new Date(test.testDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {includeSections.colorGenetics && (
                  <div>
                    <h3 className="font-medium">Color Genetics</h3>
                    <div className="grid grid-cols-2 gap-x-4 text-xs">
                      <div className="flex justify-between">
                        <span>Base Color (E Locus):</span>
                        <span className="font-medium">{dogGenetics.baseColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Brown (B Locus):</span>
                        <span className="font-medium">{dogGenetics.brownDilution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dilution (D Locus):</span>
                        <span className="font-medium">{dogGenetics.dilution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Agouti (A Locus):</span>
                        <span className="font-medium">{dogGenetics.agouti}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Additional sections would be rendered here based on includeSections state */}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneticReportGenerator;
