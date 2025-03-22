
import { useEffect, useState, useRef } from 'react';

/**
 * Hook to add staggered animation to elements
 * @param selector CSS selector for elements to animate
 * @param delay Base delay between animations in ms
 */
export const useStaggeredAnimation = (selector: string, delay: number = 50) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).classList.add('appear');
      }, index * delay);
    });
    
    return () => {
      elements.forEach(el => {
        (el as HTMLElement).classList.remove('appear');
      });
    };
  }, [selector, delay]);
};

/**
 * Hook to detect when an element enters the viewport
 */
export const useInView = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  
  return isInView;
};

/**
 * Creates animation properties for a staggered entry
 */
export const getStaggeredAnimationProps = (index: number, baseDelay: number = 0.05) => {
  return {
    className: "stagger-item",
    style: {
      transitionDelay: `${index * baseDelay}s`
    }
  };
};

/**
 * Smoothly interpolates between values
 * Useful for number transitions
 */
export const useSmoothTransition = (value: number, duration: number = 500) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  
  useEffect(() => {
    if (value === previousValue.current) return;
    
    let startTime: number;
    const startValue = previousValue.current;
    const changeInValue = value - startValue;
    
    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      setDisplayValue(startValue + changeInValue * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        previousValue.current = value;
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value, duration]);
  
  return displayValue;
};

// Easing function
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};
