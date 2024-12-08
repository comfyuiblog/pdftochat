import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'px-4 py-2 rounded-lg border border-gray-300',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}