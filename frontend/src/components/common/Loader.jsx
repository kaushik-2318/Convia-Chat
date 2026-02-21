import { cn } from '@/lib/utils';
import React from 'react';

export default function Loader({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-[5px]',
  };

  return (
    <div className={cn('absolute flex h-screen w-screen items-center justify-center', className)}>
      <div
        className={cn('border-border border-t-indigo animate-spin rounded-full', sizeClasses[size])}
      />
    </div>
  );
}
