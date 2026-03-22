import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-normal text-text-secondary ml-1">
          {label}
        </label>
      )}
      <input
        className={`h-[44px] border border-border-default rounded-md px-3 text-base focus:outline-none focus:border-brand transition-colors duration-200 bg-white ${error ? 'border-error' : ''} ${className}`}
        style={{ fontSize: '16px' }}
        {...props}
      />
      {error && (
        <span className="text-xs text-error/80 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};
