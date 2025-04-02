
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Dog, Clipboard, Calendar, 
  MessageSquare, FileText, DollarSign, Building2,
  ShieldCheck, Heart, Baby, FileSpreadsheet, Settings,
  PawPrint, AreaChart
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-60 bg-black text-white border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <div className="bg-blue-600 p-2 rounded-md mr-2">
          <PawPrint className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold">PAW</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase mb-4 font-medium">Main</p>
          <nav className="space-y-2">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink to="/profile" icon={<Users size={18} />} label="Profile" />
            <SidebarLink to="/dogs" icon={<Dog size={18} />} label="Dogs" />
            <SidebarLink to="/reproduction" icon={<Heart size={18} />} label="Reproduction" />
            <SidebarLink to="/reservations" icon={<Calendar size={18} />} label="Reservations" />
            <SidebarLink to="/customers" icon={<Users size={18} />} label="Customers" />
          </nav>
        </div>
        
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase mb-4 font-medium">Operations</p>
          <nav className="space-y-2">
            <SidebarLink to="/calendar" icon={<Calendar size={18} />} label="Calendar" />
            <SidebarLink to="/communications" icon={<MessageSquare size={18} />} label="Communications" />
            <SidebarLink to="/contracts" icon={<FileText size={18} />} label="Contracts" />
            <SidebarLink to="/finances" icon={<DollarSign size={18} />} label="Finances" />
            <SidebarLink to="/facility" icon={<Building2 size={18} />} label="Facility" />
            <SidebarLink to="/compliance" icon={<ShieldCheck size={18} />} label="Compliance" />
          </nav>
        </div>
        
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase mb-4 font-medium">Administration</p>
          <nav className="space-y-2">
            <SidebarLink to="/users" icon={<Users size={18} />} label="Users" />
            <SidebarLink to="/audit-logs" icon={<FileSpreadsheet size={18} />} label="Audit Logs" />
            <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <span className="text-sm font-medium">Bear Paw Newfoundlands</span>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? 'bg-blue-900/30 text-blue-400' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`
      }
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default Sidebar;
