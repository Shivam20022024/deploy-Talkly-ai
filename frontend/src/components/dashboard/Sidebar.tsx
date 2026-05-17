'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UsersRound,
  Zap,
  X,
  Activity,
  FileText,
  Target,
  PieChart,
  Workflow,
  Blocks,
  Code2,
  Settings as SettingsIcon
} from 'lucide-react';

const mainNav = [
  { name: 'Dashboard', icon: Zap, href: '/dashboard' },
  { name: 'AI Agents', icon: UsersRound, href: '#' },
  { name: 'Live Monitoring', icon: Activity, href: '#' },
  { name: 'Transcripts & Insights', icon: FileText, href: '#' },
];

const secondaryNav = [
  { name: 'Lead Scoring', icon: Target, href: '#' },
  { name: 'Agent Performance', icon: PieChart, href: '#' },
  { name: 'CRM Workflows', icon: Workflow, href: '#' },
];

const bottomNav = [
  { name: 'Integrations', icon: Blocks, href: '#' },
  { name: 'API Reference', icon: Code2, href: '#' },
  { name: 'Settings', icon: SettingsIcon, href: '#' },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full bg-[#0A0810] border-r border-white/5 flex flex-col flex-shrink-0 text-gray-400 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
      {/* Mobile Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand */}
      <div className="p-4 flex items-center gap-3 mt-1 pr-12 lg:pr-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DBB7F2] to-[#7A668A] flex items-center justify-center flex-shrink-0">
          <span className="text-[#0A0810] font-black text-sm">T</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-base tracking-tight">TalklyAI</span>
            <span className="text-[9px] font-semibold bg-[#DBB7F2]/20 text-[#DBB7F2] px-1.5 py-0.5 rounded uppercase">Beta</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium leading-none mt-0.5">AI Voice Assistant</span>
        </div>
      </div>

      {/* Design Lab Button */}
      <div className="px-3 mt-1 mb-4">
        <button className="w-full flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 px-3 py-2 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-[#DBB7F2]/20 text-[#DBB7F2] flex items-center justify-center">
              <span className="text-[10px] font-bold">D</span>
            </div>
            <span className="text-[13px] font-semibold text-white">Design Lab</span>
          </div>
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-5 pb-4">
        {/* Main Nav */}
        <div className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={16} className={isActive ? 'text-[#DBB7F2]' : 'text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-white/5 mx-3" />

        {/* Secondary Nav */}
        <div className="space-y-0.5">
          {secondaryNav.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-white/5 hover:text-white transition-colors">
              <div className="flex items-center gap-3">
                <item.icon size={16} className="text-gray-500" />
                {item.name}
              </div>
              {(item.name === 'Integrations' || item.name === 'Settings' || item.name === 'Lists') && (
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>
          ))}
        </div>

        <div className="h-px bg-white/5 mx-3" />

        {/* Bottom Nav */}
        <div className="space-y-0.5">
          {bottomNav.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-white/5 hover:text-white transition-colors">
              <item.icon size={16} className="text-gray-500" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Usage Stats & Pro Button */}
      <div className="p-4 space-y-4 mb-2">
        {/* Text Credits */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <div className="w-4 h-4 rounded bg-[#DBB7F2] flex items-center justify-center">
               <span className="block w-2 h-2 bg-[#0F0F13] rounded-sm" />
            </div>
            <span>5,941 <span className="text-gray-500 font-medium">/ 50,000 Text Credits</span></span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#DBB7F2] rounded-full" style={{ width: '12%' }} />
          </div>
        </div>

        {/* Voice Minutes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <div className="w-4 h-4 rounded bg-[#DBB7F2] flex items-center justify-center">
               <span className="block w-2 h-2 bg-[#0F0F13] rounded-sm" />
            </div>
            <span>2 <span className="text-gray-500 font-medium">/ 11 Voice minutes</span></span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-[#DBB7F2] rounded-full" style={{ width: '18%' }} />
          </div>
        </div>

        {/* Upgrade Button */}
        <button className="w-full flex items-center justify-between bg-gradient-to-r from-[#8E7BF0] to-[#BC8EFE] hover:opacity-90 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(188,142,254,0.15)] transition-all">
          <span>Upgraded to Pro</span>
          <Zap size={16} className="fill-white" />
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </aside>
  );
};
