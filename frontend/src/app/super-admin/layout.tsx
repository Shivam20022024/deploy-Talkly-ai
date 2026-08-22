'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Building2, Users, LogOut, ArrowLeft } from 'lucide-react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, impersonatedCompany, stopImpersonating } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        const token = localStorage.getItem('talkly_user_token');
        if (!token) {
          window.location.reload();
        }
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  if (user?.role !== 'SUPER_ADMIN') {
    return null; // Let middleware handle redirect
  }

  const navItems = [
    { name: 'Overview', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Companies', href: '/super-admin/companies', icon: Building2 },
    { name: 'Users', href: '/super-admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">NOVALANTIS</h2>
          <p className="text-slate-400 text-sm mt-1">Super Admin</p>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {impersonatedCompany && (
          <div className="bg-amber-500 text-black px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              ⚠️ SUPER ADMIN MODE: Viewing Company ID {impersonatedCompany}
            </div>
            <button 
              onClick={() => {
                stopImpersonating();
                router.push('/super-admin/companies');
              }}
              className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Company View
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
