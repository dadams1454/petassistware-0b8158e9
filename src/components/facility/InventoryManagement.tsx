
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// This would come from your database in a real implementation
const mockInventoryItems = [
  { 
    id: '1', 
    name: 'Dog Food (Adult)', 
    category: 'Food & Nutrition', 
    quantity: 12,
    unit: 'bags',
    minQuantity: 5,
    location: 'Main Storage',
    lastRestocked: '2023-07-15'
  },
  { 
    id: '2', 
    name: 'Puppy Formula', 
    category: 'Food & Nutrition', 
    quantity: 8,
    unit: 'cans',
    minQuantity: 10,
    location: 'Kitchen Cabinet',
    lastRestocked: '2023-07-20'
  },
  { 
    id: '3', 
    name: 'Flea & Tick Medicine', 
    category: 'Medical Supplies', 
    quantity: 15,
    unit: 'doses',
    minQuantity: 5,
    location: 'Medical Cabinet',
    lastRestocked: '2023-06-30'
  },
  { 
    id: '4', 
    name: 'Towels', 
    category: 'Cleaning & Bedding', 
    quantity: 25,
    unit: 'units',
    minQuantity: 10,
    location: 'Cleaning Closet',
    lastRestocked: '2023-07-10'
  },
  { 
    id: '5', 
    name: 'Disinfectant', 
    category: 'Cleaning & Bedding', 
    quantity: 4,
    unit: 'gallons',
    minQuantity: 2,
    location: 'Cleaning Closet',
    lastRestocked: '2023-07-05'
  }
];

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  location: string;
  lastRestocked: string;
}

interface InventoryDialogProps {
  item?: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Omit<InventoryItem, 'id'> & { id?: string }) => void;
}

const InventoryDialog: React.FC<InventoryDialogProps> = ({ 
  item, 
  open, 
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'> & { id?: string }>(
    item || {
      name: '',
      category: 'Food & Nutrition',
      quantity: 0,
      unit: 'units',
      minQuantity: 0,
      location: '',
      lastRestocked: new Date().toISOString().split('T')[0]
    }
  );

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Nutrition">Food & Nutrition</SelectItem>
                  <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                  <SelectItem value="Cleaning & Bedding">Cleaning & Bedding</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', Number(e.target.value))}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleChange('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="cans">Cans</SelectItem>
                    <SelectItem value="pounds">Pounds</SelectItem>
                    <SelectItem value="ounces">Ounces</SelectItem>
                    <SelectItem value="gallons">Gallons</SelectItem>
                    <SelectItem value="doses">Doses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minQuantity">Min Quantity</Label>
                <Input 
                  id="minQuantity"
                  type="number"
                  min="0"
                  value={formData.minQuantity}
                  onChange={(e) => handleChange('minQuantity', Number(e.target.value))}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input 
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lastRestocked">Last Restocked</Label>
              <Input 
                id="lastRestocked"
                type="date"
                value={formData.lastRestocked}
                onChange={(e) => handleChange('lastRestocked', e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InventoryManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesLowStock = !showLowStock || item.quantity <= item.minQuantity;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (itemToDelete) {
      setInventoryItems(prev => prev.filter(item => item.id !== itemToDelete));
      toast({
        title: "Item Deleted",
        description: "The inventory item has been removed.",
      });
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSaveItem = (item: Omit<InventoryItem, 'id'> & { id?: string }) => {
    if (item.id) {
      // Update existing item
      setInventoryItems(prev => 
        prev.map(i => i.id === item.id ? { ...item, id: item.id } as InventoryItem : i)
      );
      toast({
        title: "Item Updated",
        description: "The inventory item has been updated successfully.",
      });
    } else {
      // Add new item
      const newId = (Math.max(...inventoryItems.map(i => Number(i.id))) + 1).toString();
      setInventoryItems(prev => [...prev, { ...item, id: newId } as InventoryItem]);
      toast({
        title: "Item Added",
        description: "The new inventory item has been added successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Food & Nutrition">Food & Nutrition</SelectItem>
              <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
              <SelectItem value="Cleaning & Bedding">Cleaning & Bedding</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Office Supplies">Office Supplies</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="lowStock"
              checked={showLowStock}
              onChange={() => setShowLowStock(!showLowStock)}
              className="rounded border-gray-300"
            />
            <label htmlFor="lowStock" className="text-sm">
              Show Low Stock Only
            </label>
          </div>
        </div>

        <Button onClick={handleAddItem} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.quantity} {item.unit}</span>
                        {item.quantity <= item.minQuantity && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeleteConfirm(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <InventoryDialog
        item={selectedItem}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveItem}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this inventory item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
