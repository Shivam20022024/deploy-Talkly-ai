import React, { useState, useEffect } from 'react';
import { Mic, Menu, X, UploadCloud, LayoutDashboard, Library, Lightbulb } from 'lucide-react';
import Button from './ui/Button';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenRecordModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenRecordModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm' : 'bg-white border-b border-slate-200'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group mr-8" 
            onClick={() => handleNavClick('DASHBOARD')}
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden transform group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="TalklyAI" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Talkly<span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            <button 
               onClick={() => handleNavClick('DASHBOARD')}
               className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 transition-colors"
            >
               <LayoutDashboard size={16} />
               Dashboard
            </button>
            <button 
               onClick={() => handleNavClick('DASHBOARD')}
               className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
               <Library size={16} />
               Audio Library
            </button>
            <button 
               onClick={() => handleNavClick('DASHBOARD')}
               className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
               <Lightbulb size={16} />
               Insights
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 gap-2 text-slate-700" onClick={onOpenRecordModal}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              Record Live Audio
            </Button>
            <Button className="gap-2" onClick={() => {
               document.getElementById("file-upload")?.click();
               if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <UploadCloud size={16} />
              Upload Audio
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 shadow-lg animate-slide-up">
          <div className="flex flex-col gap-2">
            <button 
              className="flex items-center gap-2 w-full text-left py-2.5 px-3 rounded-lg text-blue-700 bg-blue-50 font-medium"
              onClick={() => handleNavClick('DASHBOARD')}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              className="flex items-center gap-2 w-full text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              onClick={() => handleNavClick('DASHBOARD')}
            >
              <Library size={18} /> Audio Library
            </button>
            <button 
              className="flex items-center gap-2 w-full text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              onClick={() => handleNavClick('DASHBOARD')}
            >
              <Lightbulb size={18} /> Insights
            </button>

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-center gap-2" onClick={() => {
                 setIsMobileMenuOpen(false);
                 onOpenRecordModal();
              }}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Record Live Audio
              </Button>
              <Button className="w-full justify-center gap-2" onClick={() => {
                 setIsMobileMenuOpen(false);
                 document.getElementById("file-upload")?.click();
                 if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <UploadCloud size={18} /> Upload Audio
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
