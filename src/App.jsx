import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Components & Layout
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DataManagement from './pages/DataManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

// 1. Protected Route Guard
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-darkbg-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Verifying session details...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. Global Layout Template Shell
const LayoutShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-darkbg-900 text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* Sidebar Navigation Drawer */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Page Body Scroll View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-grid-dots">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              
              {/* Public Authenticating Paths */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Secure Protected Paths */}
              <Route element={<ProtectedRoute />}>
                <Route element={<LayoutShell />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/data" element={<DataManagement />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
