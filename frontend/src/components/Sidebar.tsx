import React from 'react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Mic, 
  BarChart3, 
  PhoneCall,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { id: 'DASHBOARD' as ViewState, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'LEADS' as ViewState, label: 'Lead Intelligence', icon: Users },
    { id: 'WHATSAPP_ANALYZER' as ViewState, label: 'Voice Note Intelligence', icon: Mic },
    { id: 'LIVE_CALL' as ViewState, label: 'Live Analysis', icon: PhoneCall },
    { id: 'AGENT_ANALYTICS' as ViewState, label: 'Agent Performance', icon: BarChart3 },
  ];

  return (
    <div className="sidebar">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <img src="/logo.png" alt="TalklyAI" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold leading-tight">TalklyAI</h1>
        </div>
      </div>

      <nav className="flex-1">
        <p className="text-[#64748b] text-[10px] uppercase tracking-widest font-bold mb-4 px-4">Menu</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-link w-full border-none cursor-pointer ${currentView === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-6">
        <div className="px-4 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700">
            <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold truncate w-24">{user?.name}</span>
            <span className="text-[9px] text-slate-500 font-medium">{user?.id}</span>
          </div>
        </div>
        <button 
          onClick={() => {
            logout();
            onNavigate('LOGIN');
          }}
          className="nav-link w-full border-none cursor-pointer text-slate-400 hover:text-white"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
