
import React from 'react';
import {
  LayoutGrid,
  Sofa,
  CookingPot, // Replace Kitchen with CookingPot
  Bed,
  Bath,
  Flower,
  Car,
  Ship,
  Home, // Replace House with Home
  Sprout, // Replace GardenHose with Sprout
  Tv,
  Table2,
  Dog,
  Baby,
  BookOpen,
  Computer,
  WashingMachine,
  Wrench, // Replace Tool with Wrench
  Warehouse,
  LampDesk,
  ChefHat,
  BookmarkCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Map of available icons
const icons: Record<string, React.ElementType> = {
  'layout-grid': LayoutGrid,
  'sofa': Sofa,
  'kitchen': CookingPot,
  'bed': Bed,
  'bath': Bath,
  'flower': Flower,
  'car': Car,
  'ship': Ship,
  'house': Home,
  'garden': Sprout,
  'tv': Tv, 
  'table': Table2,
  'dog': Dog,
  'baby': Baby,
  'book': BookOpen,
  'computer': Computer,
  'laundry': WashingMachine,
  'tool': Wrench,
  'storage': Warehouse,
  'lamp': LampDesk,
  'chef': ChefHat,
  'task': BookmarkCheck
};

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  color?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ 
  name = 'layout-grid', 
  color, 
  size = 24,
  className,
  ...props 
}) => {
  const IconComponent = icons[name] || LayoutGrid;
  
  return (
    <IconComponent 
      size={size} 
      color={color}
      className={cn(className)}
      {...props}
    />
  );
};

export default Icon;
