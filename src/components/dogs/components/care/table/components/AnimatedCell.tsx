
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCellProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

const AnimatedCell: React.FC<AnimatedCellProps> = memo(({ 
  children, 
  isActive,
  className
}) => {
  // Pre-compute class names to avoid recalculations during render
  const baseClasses = "w-full h-full transition-all duration-300";
  const stateClasses = isActive 
    ? "bg-green-100/80 dark:bg-green-950/20 scale-[1.02]" 
    : "bg-transparent scale-100";
    
  return (
    <motion.div
      className={cn(baseClasses, stateClasses, className)}
      initial={false}
      animate={{
        backgroundColor: isActive 
          ? 'rgba(34, 197, 94, 0.2)' 
          : 'rgba(255, 255, 255, 0)',
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ 
        duration: 0.3, 
        type: "tween", 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
});

AnimatedCell.displayName = 'AnimatedCell';

export default AnimatedCell;
