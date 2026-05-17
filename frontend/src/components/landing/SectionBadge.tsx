import React from 'react';

interface SectionBadgeProps {
  label: string;
  className?: string;
}

export const SectionBadge = ({ label, className = '' }: SectionBadgeProps) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#DBB7F2]/40" />
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#DBB7F2]/80 px-5 py-2 rounded-full border border-[#DBB7F2]/15 bg-[#DBB7F2]/[0.04]">
        {label}
      </span>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#DBB7F2]/40" />
    </div>
  );
};
