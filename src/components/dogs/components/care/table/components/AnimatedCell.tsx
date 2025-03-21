
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
      className={cn(
        "w-full h-full transition-all duration-200", 
        isActive ? "bg-green-100/80 dark:bg-green-950/20 scale-[1.02]" : "bg-transparent scale-100",
        className
      )}
      initial={false}
      animate={{
        backgroundColor: isActive 
          ? 'rgba(34, 197, 94, 0.2)' 
          : 'rgba(255, 255, 255, 0)',
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.2, type: "tween" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCell;
