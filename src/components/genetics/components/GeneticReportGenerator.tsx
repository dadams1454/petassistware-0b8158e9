
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Printer, Share2 } from 'lucide-react';
import { DogGenotype } from '@/types/genetics';
import { formatConditionName } from '../utils/healthUtils';

interface GeneticReportGeneratorProps {
  dogId: string;
  dogName?: string;
  dogGenetics?: DogGenotype;
}

export const GeneticReportGenerator: React.FC<GeneticReportGeneratorProps> = ({ 
  dogId, 
  dogName = 'Dog',
  dogGenetics
}) => {
  const { toast } = useToast();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('health_certificate');
  const [includedSections, setIncludedSections] = useState<string[]>([
    'health_tests',
    'color_genetics',
    'coi_analysis'
  ]);
  
  // Handle report generation
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "The genetic report has been generated successfully."
    });
    
    // Close the dialog
    setIsGenerateDialogOpen(false);
    
    // In a real implementation, this would generate a PDF or other report format
    // For now, we'll simulate a download delay
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your report is ready to download.",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => simulateDownload()}
          >
            Download
          </Button>
        ),
      });
    }, 1500);
  };
  
  // Simulate a download
  const simulateDownload = () => {
    // Create a placeholder PDF file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,Genetic Report for ' + dogName);
    element.setAttribute('download', `${dogName.replace(/\s+/g, '_')}_genetic_report.pdf`);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reports & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setIsGenerateDialogOpen(true)}>
                <CardContent className="p-6 flex items-center">
                  <FileText className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Generate Health Certificate</h3>
                    <p className="text-sm text-gray-500">Create official documentation of genetic test results</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => {
                setReportType('breeder_report');
                setIsGenerateDialogOpen(true);
              }}>
                <CardContent className="p-6 flex items-center">
                  <FileText className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Breeder Report</h3>
                    <p className="text-sm text-gray-500">Detailed analysis for breeding decisions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => simulateDownload()}>
                <CardContent className="p-4 flex items-center">
                  <Download className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium text-sm">Export Raw Data</h3>
                    <p className="text-xs text-gray-500">CSV format</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => {
                toast({
                  title: "Print Preview",
                  description: "Print functionality would open here."
                });
              }}>
                <CardContent className="p-4 flex items-center">
                  <Printer className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium text-sm">Print Report</h3>
                    <p className="text-xs text-gray-500">For physical records</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => {
                toast({
                  title: "Share Options",
                  description: "Sharing functionality would open here."
                });
              }}>
                <CardContent className="p-4 flex items-center">
                  <Share2 className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium text-sm">Share Results</h3>
                    <p className="text-xs text-gray-500">Email or link</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-2">Report Preview</h3>
              <div className="border rounded-md p-4 bg-white">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">{reportType === 'health_certificate' ? 'Genetic Health Certificate' : 'Breeder Genetic Report'}</h2>
                  <div className="text-sm text-gray-500">{dogName}</div>
                </div>
                
                {includedSections.includes('health_tests') && dogGenetics && (
                  <div className="mb-4">
                    <h3 className="font-medium border-b pb-1 mb-2">Health Test Results</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-2 px-3">Test</th>
                          <th className="text-left py-2 px-3">Result</th>
                          <th className="text-left py-2 px-3">Genotype</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(dogGenetics.healthMarkers).map(([test, data]) => (
                          <tr key={test} className="border-b">
                            <td className="py-2 px-3">{formatConditionName(test)}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                data.status === 'clear' ? 'bg-green-100 text-green-800' :
                                data.status === 'carrier' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono">{data.genotype}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {includedSections.includes('color_genetics') && dogGenetics && (
                  <div className="mb-4">
                    <h3 className="font-medium border-b pb-1 mb-2">Color Genetics</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">Base Color (E Locus)</div>
                        <div>{dogGenetics.baseColor}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">Brown Dilution (B Locus)</div>
                        <div>{dogGenetics.brownDilution}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">Dilution (D Locus)</div>
                        <div>{dogGenetics.dilution}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {includedSections.includes('coi_analysis') && (
                  <div>
                    <h3 className="font-medium border-b pb-1 mb-2">Coefficient of Inbreeding</h3>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium">10-generation COI:</span> 4.2%
                      </div>
                      <div className="h-4 w-full bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: '4.2%' }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Breed average: 6.5% • Recommended maximum: 12.5%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Genetic Report</DialogTitle>
            <DialogDescription>
              Customize the genetic report for {dogName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-type" className="text-right">Report Type</Label>
              <Select
                defaultValue={reportType}
                onValueChange={setReportType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health_certificate">Health Certificate</SelectItem>
                  <SelectItem value="breeder_report">Breeder Report</SelectItem>
                  <SelectItem value="puppy_buyer">Puppy Buyer Report</SelectItem>
                  <SelectItem value="veterinary">Veterinary Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Include Sections</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="health_tests" 
                    checked={includedSections.includes('health_tests')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIncludedSections([...includedSections, 'health_tests']);
                      } else {
                        setIncludedSections(includedSections.filter(s => s !== 'health_tests'));
                      }
                    }}
                  />
                  <Label htmlFor="health_tests">Health Test Results</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="color_genetics" 
                    checked={includedSections.includes('color_genetics')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIncludedSections([...includedSections, 'color_genetics']);
                      } else {
                        setIncludedSections(includedSections.filter(s => s !== 'color_genetics'));
                      }
                    }}
                  />
                  <Label htmlFor="color_genetics">Color Genetics</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="coi_analysis" 
                    checked={includedSections.includes('coi_analysis')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIncludedSections([...includedSections, 'coi_analysis']);
                      } else {
                        setIncludedSections(includedSections.filter(s => s !== 'coi_analysis'));
                      }
                    }}
                  />
                  <Label htmlFor="coi_analysis">COI Analysis</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pedigree" 
                    checked={includedSections.includes('pedigree')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIncludedSections([...includedSections, 'pedigree']);
                      } else {
                        setIncludedSections(includedSections.filter(s => s !== 'pedigree'));
                      }
                    }}
                  />
                  <Label htmlFor="pedigree">Pedigree Visualization</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breeder-name" className="text-right">Breeder Name</Label>
              <Input
                id="breeder-name"
                placeholder="Your kennel name"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-logo" className="text-right">Logo</Label>
              <Input
                id="report-logo"
                type="file"
                accept="image/*"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneticReportGenerator;
