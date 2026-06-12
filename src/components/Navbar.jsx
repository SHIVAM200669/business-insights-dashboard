import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Settings 
} from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock Notifications for professional feel
  const [notifications] = useState([
    { id: 1, text: 'Local Persistence initialized successfully', time: '10m ago', unread: true },
    { id: 2, text: 'Admin security dashboard seeded', time: '1h ago', unread: false },
    { id: 3, text: 'CSV export utility ready', time: '3h ago', unread: false },
  ]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Analytics Dashboard';
      case '/data': return 'Data Management';
      case '/users': return 'User Management';
      case '/reports': return 'Reports & Insights';
      case '/profile': return 'Profile Settings';
      default: return 'Management Console';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-darkbg-700 dark:bg-darkbg-800/80 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-150 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-darkbg-700 dark:hover:text-white lg:hidden transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-55 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-darkbg-700 dark:hover:text-white border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-800 transition"
          aria-label="Toggle Theme Mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Hub */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-55 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-darkbg-700 dark:hover:text-white border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-800 transition"
          >
            <Bell className="h-4 w-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-darkbg-800" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-3 w-80 z-50 rounded-2xl bg-white p-4 shadow-xl border border-gray-100 dark:border-darkbg-700 dark:bg-darkbg-800">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-darkbg-700 pb-2 mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h4>
                  <span className="text-xs font-semibold text-primary-500">New alerts</span>
                </div>
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs transition border
                        ${n.unread 
                          ? 'bg-primary-50/50 border-primary-100 dark:bg-primary-950/20 dark:border-primary-900/50' 
                          : 'bg-white border-transparent hover:bg-gray-50 dark:bg-darkbg-800 dark:hover:bg-darkbg-900'
                        }
                      `}
                    >
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{n.text}</p>
                      <span className="text-[10px] text-gray-400 block mt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown Controls */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl hover:bg-gray-55 dark:hover:bg-darkbg-700 transition"
          >
            <div className="h-8 w-8 rounded-xl bg-primary-500 text-white font-bold text-sm flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-xs font-semibold text-gray-700 dark:text-gray-200 pr-1">
              {user?.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Profile Actions Dropdown Card */}
          {profileDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
              <div className="absolute right-0 mt-3 w-56 z-50 rounded-2xl bg-white py-2 shadow-xl border border-gray-100 dark:border-darkbg-700 dark:bg-darkbg-800">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-darkbg-700">
                  <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs truncate text-gray-450 dark:text-gray-550 mt-0.5">{user?.email}</p>
                </div>
                
                <a
                  href="/profile"
                  onClick={(e) => {
                    e.preventDefault();
                    setProfileDropdownOpen(false);
                    window.location.href = '/profile';
                  }}
                  className="flex items-center gap-3.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-darkbg-900 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </a>

                <div className="border-t border-gray-100 dark:border-darkbg-700 my-1" />

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
