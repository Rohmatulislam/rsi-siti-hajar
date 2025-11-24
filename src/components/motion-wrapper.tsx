'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
}

export function MotionDiv({ children, className, initial, animate, transition }: MotionDivProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// Variants for animations
export const MotionSection = ({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) => {
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

export const MotionCard = ({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) => {
  return (
    <MotionDiv
      className={className}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};