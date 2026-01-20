import React from 'react';

export default function PageHeading({ children, className = '', ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-4xl font-bold text-center text-text dark:text-text-dark ${className}`} {...props}>
      {children}
    </div>
  );
}
