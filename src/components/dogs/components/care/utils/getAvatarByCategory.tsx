
import { ReactNode } from 'react';
import { 
  Coffee, Bath, Utensils, 
  Pill, Dumbbell, Heart, 
  Clipboard, CheckCircle,
  Building2, Baby, StickyNote, 
  Dog
} from 'lucide-react';

/**
 * Returns the appropriate icon component based on the category
 */
export const getAvatarByCategory = (category: string): ReactNode => {
  switch (category) {
    case 'feeding':
      return <Coffee className="h-16 w-16 text-orange-500" />;
    case 'medication':
      return <Pill className="h-16 w-16 text-red-500" />;
    case 'grooming':
      return <Bath className="h-16 w-16 text-purple-500" />;
    case 'exercise':
      return <Dumbbell className="h-16 w-16 text-green-500" />;
    case 'wellness':
      return <Heart className="h-16 w-16 text-pink-500" />;
    case 'training':
      return <CheckCircle className="h-16 w-16 text-indigo-500" />;
    case 'notes':
      return <StickyNote className="h-16 w-16 text-gray-500" />;
    case 'facility':
      return <Building2 className="h-16 w-16 text-blue-500" />;
    case 'puppies':
      return <Baby className="h-16 w-16 text-amber-500" />;
    default:
      return <Dog className="h-16 w-16 text-muted-foreground" />;
  }
};
