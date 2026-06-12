import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  FileBarChart, 
  UserCircle, 
  LogOut, 
  X,
  TrendingUp
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Data Management', path: '/data', icon: Database },
    ...(isAdmin ? [{ name: 'User Management', path: '/users', icon: Users }] : []),
    { name: 'Reports & Insights', path: '/reports', icon: FileBarChart },
    { name: 'Profile Settings', path: '/profile', icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Core Wrapper */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-gray-200 bg-white dark:border-darkbg-700 dark:bg-darkbg-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-150 dark:border-darkbg-700">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Insight Hub<span className="text-primary-500">.</span>
            </span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 mx-4 mt-6 rounded-xl bg-gray-50 dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Active Account</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-base">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-gray-800 dark:text-white">{user?.name}</p>
              <p className="text-xs truncate text-gray-450 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${isActive 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-darkbg-900 dark:hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-gray-150 dark:border-darkbg-700">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
