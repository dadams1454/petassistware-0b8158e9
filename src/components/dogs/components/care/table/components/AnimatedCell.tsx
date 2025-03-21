
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCellProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

const AnimatedCell: React.FC<AnimatedCellProps> = ({ 
  children, 
  isActive,
  className
}) => {
  return (
    <motion.div
      className={cn("w-full h-full", className)}
      initial={false}
      animate={{
        backgroundColor: isActive 
          ? 'rgba(34, 197, 94, 0.2)' 
          : 'rgba(255, 255, 255, 0)',
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCell;
