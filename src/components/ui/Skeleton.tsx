import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rect: 'h-full w-full rounded-2xl',
    circle: 'rounded-full'
  };

  return (
    <div className={`animate-pulse bg-bg-canvas/50 ${variantClasses[variant]} ${className}`} />
  );
};
