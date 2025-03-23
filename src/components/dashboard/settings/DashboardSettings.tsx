
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, LayoutGrid, Save, RotateCcw } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
}

export interface DashboardSettingsProps {
  onClose: () => void;
}

const availableWidgets: WidgetConfig[] = [
  { 
    id: 'stats', 
    name: 'Statistics Cards', 
    description: 'Shows key numbers like dog count, litters, etc.',
    defaultEnabled: true 
  },
  { 
    id: 'events', 
    name: 'Upcoming Events', 
    description: 'Displays calendar events and appointments',
    defaultEnabled: true 
  },
  { 
    id: 'activities', 
    name: 'Recent Activities', 
    description: 'Shows recent actions taken in the system',
    defaultEnabled: true 
  },
  { 
    id: 'analytics', 
    name: 'Breeding Analytics', 
    description: 'Charts and graphs showing breeding statistics',
    defaultEnabled: true 
  },
  { 
    id: 'dailycare', 
    name: 'Daily Care Summary', 
    description: 'Overview of daily care tasks and statuses',
    defaultEnabled: true 
  },
  { 
    id: 'quickactions', 
    name: 'Quick Action Buttons', 
    description: 'Buttons for common tasks',
    defaultEnabled: true 
  }
];

const defaultViewOptions = [
  { id: 'overview', name: 'Overview' },
  { id: 'dailycare', name: 'Daily Care' },
  { id: 'analytics', name: 'Analytics' }
];

const themeOptions = [
  { id: 'default', name: 'Default' },
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'dark', name: 'Dark' }
];

const DashboardSettings = ({ onClose }: DashboardSettingsProps) => {
  const { preferences, resetAllPreferences } = useUserPreferences();
  
  // Get dashboard preferences or set defaults
  const [dashboardPrefs, setDashboardPrefs] = React.useState<{
    visibleWidgets: string[];
    defaultView: string;
    theme: string;
    compactMode: boolean;
  }>({
    visibleWidgets: preferences.dashboardWidgets || availableWidgets.filter(w => w.defaultEnabled).map(w => w.id),
    defaultView: preferences.dashboardDefaultView || 'overview',
    theme: preferences.dashboardTheme || 'default',
    compactMode: preferences.dashboardCompact || false
  });

  const handleWidgetToggle = (widgetId: string, checked: boolean) => {
    setDashboardPrefs(prev => {
      if (checked) {
        return {
          ...prev,
          visibleWidgets: [...prev.visibleWidgets, widgetId]
        };
      } else {
        return {
          ...prev,
          visibleWidgets: prev.visibleWidgets.filter(id => id !== widgetId)
        };
      }
    });
  };

  const handleSaveSettings = () => {
    // This would save to UserPreferencesContext
    // Not implementing this fully since we don't want to modify the context
    console.log('Saving dashboard preferences:', dashboardPrefs);
    onClose();
  };

  const handleResetToDefaults = () => {
    setDashboardPrefs({
      visibleWidgets: availableWidgets.filter(w => w.defaultEnabled).map(w => w.id),
      defaultView: 'overview',
      theme: 'default',
      compactMode: false
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-primary" />
          Dashboard Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Visible Widgets Section */}
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              Visible Widgets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableWidgets.map(widget => (
                <div key={widget.id} className="flex items-start space-x-2 bg-muted/30 p-3 rounded-md">
                  <Checkbox 
                    id={`widget-${widget.id}`}
                    checked={dashboardPrefs.visibleWidgets.includes(widget.id)}
                    onCheckedChange={(checked) => 
                      handleWidgetToggle(widget.id, checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <Label 
                      htmlFor={`widget-${widget.id}`} 
                      className="font-medium"
                    >
                      {widget.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* General Settings Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="default-view" className="font-medium">Default View</Label>
              <Select
                value={dashboardPrefs.defaultView}
                onValueChange={(value) => 
                  setDashboardPrefs({...dashboardPrefs, defaultView: value})
                }
              >
                <SelectTrigger id="default-view">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  {defaultViewOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose which tab to show when you first open the dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme" className="font-medium">Dashboard Theme</Label>
              <Select
                value={dashboardPrefs.theme}
                onValueChange={(value) => 
                  setDashboardPrefs({...dashboardPrefs, theme: value})
                }
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose a visual style for your dashboard
              </p>
            </div>
          </div>
          
          {/* Display Options */}
          <div className="pt-2 border-t">
            <div className="flex items-start space-x-2 mb-6">
              <Checkbox 
                id="compact-mode"
                checked={dashboardPrefs.compactMode}
                onCheckedChange={(checked) => 
                  setDashboardPrefs({...dashboardPrefs, compactMode: checked as boolean})
                }
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor="compact-mode" 
                  className="font-medium"
                >
                  Compact Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Use a more compact layout to fit more content on screen
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleResetToDefaults}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveSettings}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSettings;
