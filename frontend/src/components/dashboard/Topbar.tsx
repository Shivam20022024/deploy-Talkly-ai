'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, Sun, Moon, RotateCcw, Bell, Menu, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { theme, setTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<'history' | 'notifications' | 'profile' | null>(null);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
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
    <header className="h-14 px-4 md:px-6 flex items-center justify-between border-b border-white/5 bg-[#0D0B14] flex-shrink-0 relative z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white tracking-tight hidden sm:block">Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 justify-end sm:justify-center max-w-md mx-4 sm:mx-6">
        <div className="relative w-full max-w-[240px] sm:max-w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-gray-500 group-focus-within:text-[#DBB7F2] transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="block w-full pl-9 pr-10 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#DBB7F2]/40 focus:bg-white/[0.05] transition-colors"
            placeholder="Search"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <div className="hidden sm:flex items-center gap-1 text-[9px] font-medium text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              <span className="text-xs">⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-3 text-gray-400">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md hover:bg-white/5 hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* History Button */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'history')}
              className={`p-1.5 rounded-md transition-colors ${activeDropdown === 'history' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {activeDropdown === 'history' && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-64 bg-[#15121D] border border-white/10 rounded-xl shadow-xl shadow-black/50 py-2 overflow-hidden z-50"
                >
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</span>
                  </div>
                  <div className="px-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      Created "Nina" Template
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      Updated Campaign "Q3 Sales"
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'notifications')}
              className={`p-1.5 rounded-md transition-colors relative ${activeDropdown === 'notifications' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-[#0D0B14]"></span>
            </button>
            <AnimatePresence>
              {activeDropdown === 'notifications' && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-72 bg-[#15121D] border border-white/10 rounded-xl shadow-xl shadow-black/50 py-2 overflow-hidden z-50"
                >
                  <div className="px-4 py-2 border-b border-white/5 mb-1 flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] text-[#DBB7F2] cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="px-2">
                    <div className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                      <p className="text-[13px] text-white font-medium group-hover:text-[#DBB7F2] transition-colors">New Lead Captured</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Nina successfully scheduled an appointment.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-px h-6 bg-white/10 hidden sm:block" />

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={(e) => toggleDropdown(e, 'profile')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[13px] font-semibold text-white leading-none group-hover:text-[#DBB7F2] transition-colors">Alex Smith</span>
              <span className="text-[10px] text-gray-500 mt-1">New User</span>
            </div>
            <div className={`w-8 h-8 rounded-full overflow-hidden border ${activeDropdown === 'profile' ? 'border-[#DBB7F2]' : 'border-white/10 group-hover:border-white/30'} flex-shrink-0 transition-colors`}>
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <AnimatePresence>
            {activeDropdown === 'profile' && (
              <motion.div
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-3 w-48 bg-[#15121D] border border-white/10 rounded-xl shadow-xl shadow-black/50 py-1 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-1 sm:hidden">
                  <p className="text-[13px] font-semibold text-white">Alex Smith</p>
                  <p className="text-[11px] text-gray-500">New User</p>
                </div>
                <div className="px-1.5 py-1.5">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                    <SettingsIcon className="w-4 h-4" /> Account Settings
                  </button>
                  <div className="my-1 h-px bg-white/5 mx-2" />
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
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

