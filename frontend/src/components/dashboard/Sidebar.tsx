'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Mic,
  LogOut,
  PhoneIncoming,
  Settings as SettingsIcon
} from 'lucide-react';
import Image from 'next/image';

const mainNav = [
  { name: 'Dashboard', icon: Zap, href: '/dashboard' },
  { name: 'Voice Intelligence', icon: Mic, href: '/voice-intelligence' },
  { name: 'Live Monitoring', icon: Activity, href: '/live-monitoring' },
  { name: 'Inbound Calls', icon: PhoneIncoming, href: '/inbound' },
];

const secondaryNav = [
  { name: 'Lead Intelligence', icon: Target, href: '/lead-intelligence' },
  { name: 'Agent Performance', icon: PieChart, href: '/agent-performance' },
];

const bottomNav = [
  { name: 'Org Settings', icon: SettingsIcon, href: '/settings' },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState({
    name: 'John Doe',
    initials: 'JD',
    email: 'john@talkly.ai'
  });

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('talkly_user');
      if (savedUser) {
        const decoded = JSON.parse(savedUser);
        setUser({
          name: decoded.company_name || decoded.name || 'Company',
          initials: (decoded.company_name) ? decoded.company_name.substring(0, 2).toUpperCase() : (decoded.name ? decoded.name[0] : 'U'),
          email: decoded.email || ''
        });
      }
    } catch (e) { }
  }, []);

  const handleLogout = () => {
    document.cookie = "talkly_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  return (
    <aside className="w-60 h-full bg-gray-50 dark:bg-bg-dark-base border-r border-gray-200 dark:border-white/5 flex flex-col flex-shrink-0 text-gray-500 dark:text-gray-400 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand */}
      <div className="p-4 flex items-center gap-3 mt-1 pr-12 lg:pr-4">
        <Image
          src="/logo-white.png"
          alt="Logo"
          width={550}
          height={453}
          className="h-[42px] w-auto flex-shrink-0 object-contain hidden dark:block"
          priority
          unoptimized
        />
        <Image
          src="/logo-color.png"
          alt="Logo"
          width={550}
          height={453}
          className="h-[42px] w-auto flex-shrink-0 object-contain block dark:hidden"
          priority
          unoptimized
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-white font-bold text-base tracking-tight">TalklyAI</span>
            <span className="text-[9px] font-semibold bg-theme-100 dark:bg-brand-primary/20 text-theme-700 dark:text-brand-primary px-1.5 py-0.5 rounded uppercase">Beta</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium leading-none mt-0.5">AI Voice Assistant</span>
        </div>
      </div>



      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-5 pb-4 mt-4">
        {/* Main Nav */}
        <div className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(item.href + '/'));
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
                <item.icon size={16} className={isActive ? 'text-theme-600 dark:text-brand-primary' : 'text-gray-400 dark:text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* <div className="h-px bg-gray-200 dark:bg-white/5 mx-3" /> */}

        {/* Secondary Nav */}
        <div className="space-y-0.5">
          {secondaryNav.map((item) => {
            const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(item.href + '/'));
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
                <item.icon size={16} className={isActive ? 'text-theme-600 dark:text-brand-primary' : 'text-gray-400 dark:text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* <div className="h-px bg-gray-200 dark:bg-white/5 mx-3" /> */}

        {/* Bottom Nav */}
        <div className="space-y-0.5">
          {bottomNav.map((item) => {
            const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(item.href + '/'));
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
                <item.icon size={16} className={isActive ? 'text-theme-600 dark:text-brand-primary' : 'text-gray-400 dark:text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Usage Stats & Pro Button */}
      {/* <div className="p-4 space-y-4 mb-2">
 
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
            <div className="w-4 h-4 rounded bg-brand-primary flex items-center justify-center">
               <span className="block w-2 h-2 bg-white dark:bg-bg-dark-base rounded-sm" />
            </div>
            <span>5,941 <span className="text-gray-500 font-medium">/ 50,000 Text Credits</span></span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-theme-500 dark:bg-brand-primary rounded-full" style={{ width: '12%' }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
            <div className="w-4 h-4 rounded bg-brand-primary flex items-center justify-center">
               <span className="block w-2 h-2 bg-white dark:bg-bg-dark-base rounded-sm" />
            </div>
            <span>2 <span className="text-gray-500 font-medium">/ 11 Voice minutes</span></span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-theme-500 dark:bg-brand-primary rounded-full" style={{ width: '18%' }} />
          </div>
        </div>

  
        <button className="w-full flex items-center justify-between bg-gradient-to-r from-brand-grad-2 to-brand-grad-1 hover:opacity-90 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(188,142,254,0.15)] transition-all">
          <span>Upgraded to Pro</span>
          <Zap size={16} className="fill-white" />
        </button>
      </div> */}

      {/* User Profile & Signout */}
      <div className="p-4 mt-auto border-t border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-bg-dark-base/80 backdrop-blur-md sticky bottom-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-muted flex items-center justify-center flex-shrink-0 text-bg-dark-base font-black text-sm shadow-sm">
            {user.initials}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{user.name}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group flex-shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </aside>
  );
};
