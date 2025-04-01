
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { SocializationExperience } from '@/types/puppyTracking';
import { differenceInDays } from 'date-fns';

interface SocializationStatsProps {
  experiences: SocializationExperience[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#45B39D'];

const CATEGORIES = [
  { id: 'people', name: 'People' },
  { id: 'animals', name: 'Animals' },
  { id: 'environments', name: 'Environments' },
  { id: 'sounds', name: 'Sounds' },
  { id: 'handling', name: 'Handling' },
  { id: 'objects', name: 'Objects' },
  { id: 'travel', name: 'Travel' }
];

const REACTIONS = [
  { value: 'very_positive', label: 'Very Positive' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'cautious', label: 'Cautious' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'very_fearful', label: 'Very Fearful' }
];

const SocializationStats: React.FC<SocializationStatsProps> = ({ experiences }) => {
  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">No data available for statistics.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for category distribution chart
  const categoryCount = CATEGORIES.map(category => {
    const count = experiences.filter(e => e.category_id === category.id).length;
    return {
      name: category.name,
      count
    };
  }).filter(item => item.count > 0);

  // Prepare data for reaction distribution chart
  const reactionData = REACTIONS.map(reaction => {
    const count = experiences.filter(e => e.reaction === reaction.value).length;
    return {
      name: reaction.label,
      value: count
    };
  }).filter(item => item.value > 0);

  // Calculate recent activity - last 30 days
  const today = new Date();
  const recentExperiences = experiences.filter(e => {
    const experienceDate = new Date(e.experience_date);
    return differenceInDays(today, experienceDate) <= 30;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{experiences.length}</div>
            <p className="text-muted-foreground text-sm">
              Total socialization experiences recorded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(experiences.map(e => e.category_id)).size}
            </div>
            <p className="text-muted-foreground text-sm">
              Different socialization categories experienced
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recentExperiences.length}</div>
            <p className="text-muted-foreground text-sm">
              Experiences in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryCount}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {reactionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocializationStats;
