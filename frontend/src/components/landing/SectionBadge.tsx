import React from 'react';

interface SectionBadgeProps {
  label: string;
  className?: string;
}

export const SectionBadge = ({ label, className = '' }: SectionBadgeProps) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-purple-300/60 dark:to-[#DBB7F2]/40" />
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-600/80 dark:text-[#DBB7F2]/80 px-5 py-2 rounded-full border border-purple-200 dark:border-[#DBB7F2]/15 bg-purple-50 dark:bg-[#DBB7F2]/[0.04]">
        {label}
      </span>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-purple-300/60 dark:to-[#DBB7F2]/40" />
    </div>
  );
};
