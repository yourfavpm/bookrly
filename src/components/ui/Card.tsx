import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  onClick
}) => {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-8",
    lg: "p-10"
  };

  return (
    <div 
      className={`bg-white rounded-shopify shadow-none border border-border-polaris ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
