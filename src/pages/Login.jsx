import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      showToast('Your session has expired. Please login again.', 'warning');
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all input fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back! Login successful.', 'success');
      navigate('/');
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-darkbg-900 px-4 py-12 sm:px-6 lg:px-8 bg-grid-dots">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 bg-white dark:bg-darkbg-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-darkbg-700"
      >
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-xl shadow-primary-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Sign in to your Dashboard
          </h2>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Or{' '}
            <button 
              onClick={() => navigate('/register')}
              className="font-semibold text-primary-500 hover:text-primary-600 transition"
            >
              create a new enterprise account
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-455">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-455">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-1">
                  Access Console <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-darkbg-900 border border-gray-150 dark:border-darkbg-700 text-xs text-gray-500 dark:text-gray-450">
          <p className="font-bold text-gray-700 dark:text-gray-200 mb-1.5">⚡ Offline Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <p className="font-semibold">Admin role:</p>
              <p>admin@example.com</p>
              <p>admin123</p>
            </div>
            <div>
              <p className="font-semibold">User role:</p>
              <p>user@example.com</p>
              <p>user123</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
