'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, Sun, Moon, RotateCcw, Bell, Menu, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  onMenuClick?: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/lead-intelligence': 'Lead Intelligence',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/agents': 'AI Agents',
  '/dashboard/settings': 'Settings',
};

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const SEARCH_LINKS = [
    { title: 'Dashboard Overview', href: '/dashboard' },
    { title: 'Live Monitoring', href: '/live-monitoring' },
    { title: 'Lead Intelligence', href: '/lead-intelligence' },
  ];

  const filteredLinks = SEARCH_LINKS.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => setMounted(true), []);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Resolve page title: exact match first, then partial prefix match, then format last segment
  const resolvedTitle = PAGE_TITLES[pathname]
    ?? Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key + '/'))?.[1]
    ?? pathname.split('/').filter(Boolean).at(-1)?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    ?? 'Dashboard';
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<'history' | 'notifications' | 'profile' | null>(null);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setActiveDropdown(null);
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        // give link clicks time to register
        setTimeout(() => setIsSearchFocused(false), 150);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, dropdown: 'history' | 'notifications' | 'profile') => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' as const } }
  };

  return (
    <header className="h-14 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white dark:bg-bg-dark-base flex-shrink-0 relative z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 justify-end sm:justify-center max-w-md mx-4 sm:mx-6">
        <div className="relative w-full max-w-[240px] sm:max-w-full group" ref={searchContainerRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 group-focus-within:text-theme-600 dark:group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="block w-full pl-9 pr-10 py-1.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-theme-300 dark:focus:border-brand-primary/40 focus:bg-white dark:focus:bg-white/[0.05] transition-colors"
            placeholder="Search"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button 
              onClick={() => searchInputRef.current?.focus()}
              className="hidden sm:flex items-center gap-1 text-[9px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 transition-colors"
            >
              <span className="text-xs">⌘</span>
              <span>K</span>
            </button>
          </div>

          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              >
                {filteredLinks.length > 0 ? (
                  <div className="py-2">
                    <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Links</p>
                    {filteredLinks.map((link, idx) => (
                      <Link 
                        key={idx} 
                        href={link.href}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-theme-600 dark:hover:text-brand-primary transition-colors"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Search className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-[13px] text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Toggle Theme"
            suppressHydrationWarning
          >
            {mounted ? (resolvedTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />) : <div className="h-4 w-4" />}
          </button>

          {/* History Button */}
          {/* <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'history')}
              className={`p-1.5 rounded-md transition-colors ${activeDropdown === 'history' ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {activeDropdown === 'history' && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/50 py-2 overflow-hidden z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Recent Activity</span>
                  </div>
                  <div className="px-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Created "Nina" Template
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Updated Campaign "Q3 Sales"
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

          {/* Notifications Button */}
          {/* <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'notifications')}
              className={`p-1.5 rounded-md transition-colors relative ${activeDropdown === 'notifications' ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-bg-dark-base"></span>
            </button>
            <AnimatePresence>
              {activeDropdown === 'notifications' && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/50 py-2 overflow-hidden z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 mb-1 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] text-theme-600 dark:text-brand-primary cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="px-2">
                    <div className="px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                      <p className="text-[13px] text-gray-900 dark:text-white font-medium group-hover:text-theme-600 dark:group-hover:text-brand-primary transition-colors">New Lead Captured</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-500 mt-0.5">Nina successfully scheduled an appointment.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden sm:block" />

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={(e) => toggleDropdown(e, 'profile')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white leading-none group-hover:text-theme-600 dark:group-hover:text-brand-primary transition-colors">{user?.name || "Loading..."}</span>
              <span className="text-[10px] text-gray-500 mt-1">{user?.role || ""}</span>
            </div>
            <div className={`w-8 h-8 rounded-full overflow-hidden border ${activeDropdown === 'profile' ? 'border-theme-600 dark:border-brand-primary' : 'border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/30'} flex-shrink-0 transition-colors flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-muted text-white dark:text-bg-dark-base font-black text-sm shadow-sm`}>
              {user?.name ? user.name.substring(0, 1).toUpperCase() : "?"}
            </div>
          </div>

          <AnimatePresence>
            {activeDropdown === 'profile' && (
              <motion.div
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-3 w-48 bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/50 py-1 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-1 sm:hidden">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "Loading..."}</span>
                  <span className="block text-xs text-gray-500">{user?.role || ""}</span>
                </div>
                <div className="px-1.5 py-1.5">
                  {/* <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <SettingsIcon className="w-4 h-4" /> Account Settings
                  </button> */}
                  {/* <div className="my-1 h-px bg-gray-100 dark:bg-white/5 mx-2" /> */}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};



