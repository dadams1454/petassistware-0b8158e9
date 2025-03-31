
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Upload, File, Search, Filter } from 'lucide-react';
import { SectionHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { expenseCategories } from './constants';
import ReceiptUploadDialog from './ReceiptUploadDialog';

const ReceiptManager = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [receipts, setReceipts] = useState([
    { 
      id: '1', 
      fileName: 'food_receipt.jpg', 
      uploadDate: new Date(), 
      status: 'processed', 
      amount: 120.50,
      category: 'Food',
      vendor: 'PetSmart'
    },
    { 
      id: '2', 
      fileName: 'vet_bill.pdf', 
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      status: 'unprocessed', 
      amount: null,
      category: null,
      vendor: null
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  
  const addReceipt = (newReceipt: any) => {
    setReceipts([...receipts, { 
      id: Date.now().toString(), 
      ...newReceipt,
      status: 'unprocessed',
      uploadDate: new Date(),
      amount: null,
      category: null,
      vendor: null
    }]);
    setIsUploadDialogOpen(false);
  };
  
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (receipt.vendor && receipt.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusFilter || receipt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Receipt Management"
        description="Upload and process receipts for automatic expense tracking"
        action={{
          label: "Upload Receipt",
          onClick: () => setIsUploadDialogOpen(true),
          icon: <Upload size={16} />
        }}
      />
      
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search receipts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All Statuses</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="unprocessed">Unprocessed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.map(receipt => (
              <TableRow key={receipt.id}>
                <TableCell>
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 text-muted-foreground" />
                    {receipt.fileName}
                  </div>
                </TableCell>
                <TableCell>{receipt.uploadDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    receipt.status === 'processed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {receipt.status}
                  </span>
                </TableCell>
                <TableCell>{receipt.amount ? `$${receipt.amount.toFixed(2)}` : '-'}</TableCell>
                <TableCell>{receipt.category || '-'}</TableCell>
                <TableCell>{receipt.vendor || '-'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  {receipt.status === 'unprocessed' && (
                    <Button variant="ghost" size="sm">
                      Process
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <ReceiptUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onUpload={addReceipt}
      />
    </div>
  );
};

export default ReceiptManager;
