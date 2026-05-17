import React from 'react';
import { Volume2 } from 'lucide-react';

export interface TemplateCardProps {
  name: string;
  tag: string;
  tagType: 'outbound' | 'inbound' | 'trigger';
  description: string;
  avatarUrl?: string;
  avatarColor?: string;
}

export const TemplateCard = ({
  name,
  tag,
  tagType,
  description,
  avatarUrl,
  avatarColor = 'bg-blue-500',
}: TemplateCardProps) => {
  return (
    <div className="bg-[#15121D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-full group hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-5">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${avatarColor}`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold">{name.charAt(0)}</span>
          )}
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-white">{name}</h3>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300`}>
            {tag}
          </span>
        </div>
        <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold transition-colors border border-white/5">
        Create
      </button>
    </div>
  );
};
