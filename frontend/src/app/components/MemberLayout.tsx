import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ListChecks,
  LogOut
} from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/member/login');
  };

  const menuItems = [
    { path: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/member/tasks', icon: ListChecks, label: 'My Tasks' }
  ];

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-emerald-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">ProjectFlow</h1>
                <p className="text-xs text-emerald-600">Team Member</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-600">
                    {currentUser?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{currentUser?.name}</p>
                  <p className="text-xs text-emerald-600">{currentUser?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-emerald-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition ${
                    isActive
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
