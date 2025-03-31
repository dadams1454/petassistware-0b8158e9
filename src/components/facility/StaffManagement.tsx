
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Plus,
  Search,
  MoreVertical,
  PenLine,
  Trash2,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  hourlyRate?: number;
  startDate: string;
}

// Mock data
const mockStaffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Caretaker',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'active',
    hourlyRate: 15,
    startDate: '2022-01-15'
  },
  {
    id: '2',
    name: 'Emma Johnson',
    role: 'Veterinarian',
    email: 'emma.johnson@example.com',
    phone: '(555) 234-5678',
    status: 'active',
    hourlyRate: 35,
    startDate: '2021-06-10'
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Trainer',
    email: 'michael.brown@example.com',
    phone: '(555) 345-6789',
    status: 'active',
    hourlyRate: 20,
    startDate: '2022-03-22'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    role: 'Groomer',
    email: 'sarah.davis@example.com',
    phone: '(555) 456-7890',
    status: 'inactive',
    hourlyRate: 18,
    startDate: '2021-11-05'
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'Assistant',
    email: 'david.wilson@example.com',
    phone: '(555) 567-8901',
    status: 'active',
    hourlyRate: 14,
    startDate: '2022-09-30'
  }
];

const StaffManagement: React.FC = () => {
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsAddStaffDialogOpen(true);
  };
  
  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsAddStaffDialogOpen(true);
  };
  
  const handleDeleteStaff = (staffId: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== staffId));
    toast({
      title: "Staff member removed",
      description: "The staff member has been removed from the system."
    });
  };
  
  const handleSaveStaff = () => {
    // In a real app, you would save to your database here
    toast({
      title: editingStaff ? "Staff updated" : "Staff added",
      description: `${editingStaff ? "Changes to staff member have" : "New staff member has"} been saved.`
    });
    setIsAddStaffDialogOpen(false);
  };
  
  const handleViewHours = (staffId: string) => {
    // In a real app, you would navigate to the hours page or show a dialog
    toast({
      title: "View Hours",
      description: "This would show the staff member's hours in a real application."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Staff Members
          </CardTitle>
          <Button onClick={handleAddStaff} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search staff..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      {staff.name}
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{staff.email}</div>
                        <div className="text-muted-foreground">{staff.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {staff.hourlyRate ? `$${staff.hourlyRate}/hr` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={staff.status === 'active' ? 'default' : 'secondary'}
                        className={
                          staff.status === 'active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                        }
                      >
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditStaff(staff)}>
                            <PenLine className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewHours(staff.id)}>
                            <Clock className="mr-2 h-4 w-4" />
                            <span>View Hours</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No staff members found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Staff Dialog */}
      <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name"
                  placeholder="Full name"
                  defaultValue={editingStaff?.name || ''}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <Input 
                  id="role"
                  placeholder="Job role"
                  defaultValue={editingStaff?.role || ''}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Email address"
                  defaultValue={editingStaff?.email || ''}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone"
                  placeholder="Phone number"
                  defaultValue={editingStaff?.phone || ''}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="hourlyRate" className="text-sm font-medium">Hourly Rate ($)</label>
                <Input 
                  id="hourlyRate"
                  type="number"
                  placeholder="0.00"
                  defaultValue={editingStaff?.hourlyRate?.toString() || ''}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                <Input 
                  id="startDate"
                  type="date"
                  defaultValue={editingStaff?.startDate || ''}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStaff}>
              {editingStaff ? 'Update Staff' : 'Add Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
