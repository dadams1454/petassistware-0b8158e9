
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowUpDown, Grid, List } from 'lucide-react';
import { SectionHeader } from '@/components/ui/standardized';
import CategorySelector from '@/components/care/categories/CategorySelector';
import { useCareCategories } from '@/contexts/CareCategories/CareCategoriesContext';
import { CareCategory } from '@/types/careCategories';

interface DailyCareLayoutProps {
  title: string;
  description?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  activeCategory: CareCategory;
  onCategoryChange: (category: CareCategory) => void;
  includePuppy?: boolean;
  headerActions?: React.ReactNode;
  tabs?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }[];
}

const DailyCareLayout: React.FC<DailyCareLayoutProps> = ({
  title,
  description,
  onRefresh,
  isLoading = false,
  children,
  activeCategory,
  onCategoryChange,
  includePuppy = true,
  headerActions,
  tabs = []
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'main');
  const { getCategoryById } = useCareCategories();
  
  const category = getCategoryById(activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader 
          title={title}
          description={description}
        >
          {headerActions}
        </SectionHeader>
        
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>
      
      <CategorySelector 
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        includePuppy={includePuppy}
      />
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {category?.icon}
          {category?.name || 'Care Category'}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {tabs.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card className="p-4">
          {children}
        </Card>
      )}
    </div>
  );
};

export default DailyCareLayout;
