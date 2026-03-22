import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5";
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover",
    secondary: "bg-transparent border border-border-default text-text-primary hover:bg-bg-secondary",
    ghost: "bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-sm",
    md: "px-5 py-2.5 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};
