import React, { useEffect, useState } from 'react';
import { getDashboardOverview } from '../services/db';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Activity, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Dashboard = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    metrics: { totalUsers: 0, totalSales: 0, totalRevenue: 0, activeSessions: 0, growthRate: 0 },
    trends: [],
    categories: [],
    usersDistribution: [],
    recentLogs: []
  });

  useEffect(() => {
    const fetchDashboardData = () => {
      try {
        // Simulate a 400ms delay to display our beautiful loading skeleton animations
        setTimeout(() => {
          const overview = getDashboardOverview();
          setData(overview);
          setLoading(false);
        }, 400);
      } catch (error) {
        showToast('Failed to load dashboard statistics.', 'error');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [showToast]);

  const gridColor = isDark ? '#1F2A45' : '#E2E8F0';
  const labelColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#151D30' : '#FFFFFF';
  const tooltipBorder = isDark ? '#1F2A45' : '#E2E8F0';

  const CATEGORY_COLORS = ['#0ea5e9', '#818cf8', '#fb7185', '#fbbf24', '#34d399', '#a78bfa'];

  const metricsCards = [
    {
      title: 'Total Platform Users',
      value: data.metrics.totalUsers,
      icon: Users,
      colorClass: 'text-sky-500 bg-sky-500/10',
      subtitle: 'Registered accounts'
    },
    {
      title: 'Total Gross Revenue',
      value: `$${parseFloat(data.metrics.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      colorClass: 'text-emerald-500 bg-emerald-500/10',
      subtitle: 'MoM overall billing'
    },
    {
      title: 'Total Units Sold',
      value: data.metrics.totalSales.toLocaleString(),
      icon: ShoppingCart,
      colorClass: 'text-violet-500 bg-violet-500/10',
      subtitle: 'Fulfilled orders count'
    },
    {
      title: 'Active User Sessions',
      value: data.metrics.activeSessions,
      icon: Activity,
      colorClass: 'text-rose-500 bg-rose-500/10',
      subtitle: 'Realtime active sessions'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-white dark:bg-darkbg-800 p-6 rounded-2xl border border-gray-100 dark:border-darkbg-700 h-28" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="animate-pulse bg-white dark:bg-darkbg-800 p-6 rounded-2xl border border-gray-100 dark:border-darkbg-700 h-80" />
          <div className="animate-pulse bg-white dark:bg-darkbg-800 p-6 rounded-2xl border border-gray-100 dark:border-darkbg-700 h-80" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="animate-pulse bg-white dark:bg-darkbg-800 p-6 rounded-2xl border border-gray-100 dark:border-darkbg-700 h-80 lg:col-span-2" />
          <div className="animate-pulse bg-white dark:bg-darkbg-800 p-6 rounded-2xl border border-gray-100 dark:border-darkbg-700 h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Overview</h2>
          <p className="text-xs text-gray-550 dark:text-gray-400">Enterprise operational parameters and persistence logs</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white dark:bg-darkbg-800 border border-gray-200 dark:border-darkbg-700 px-3 py-1.5 rounded-xl text-gray-500 dark:text-gray-400 font-semibold self-start md:self-auto">
          <Calendar className="h-4 w-4" />
          <span>Offline Local persistence enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-darkbg-700 flex items-start gap-4 transition-colors"
          >
            <div className={`p-3 rounded-xl ${card.colorClass}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">{card.title}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1 select-all">{card.value}</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-450 mt-1">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-650 text-white shadow-lg shadow-primary-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex gap-4 items-center">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold">MoM Growth Rate</h4>
            <p className="text-xs text-white/80">Monthly cumulative revenue comparisons calculate development margins</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold">{data.metrics.growthRate > 0 ? `+${data.metrics.growthRate}%` : `${data.metrics.growthRate}%`}</span>
          <p className="text-[10px] text-white/80 mt-1">Relative to last month</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Area Chart */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-darkbg-700">
          <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Revenue Stream Performance</h4>
          <div className="h-64 sm:h-72">
            {data.trends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-xs">No records stored locally</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={labelColor} fontSize={11} tickLine={false} />
                  <YAxis stroke={labelColor} fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: labelColor }} />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-darkbg-700">
          <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Units Sold (Monthly Trends)</h4>
          <div className="h-64 sm:h-72">
            {data.trends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-xs">No records stored locally</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={labelColor} fontSize={11} tickLine={false} />
                  <YAxis stroke={labelColor} fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }} />
                  <Bar dataKey="sales" fill="#818cf8" radius={[4, 4, 0, 0]} name="Sales Units" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Pie Chart */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-darkbg-700 lg:col-span-1">
          <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Category Share Distribution</h4>
          <div className="h-60 flex flex-col items-center justify-center">
            {data.categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-xs">No products cataloged</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={data.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="revenue"
                      nameKey="category"
                    >
                      {data.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `$${val.toLocaleString()}`} contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2.5 justify-center mt-2.5 max-h-20 overflow-y-auto w-full px-2">
                  {data.categories.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-gray-450 font-medium">
                      <span className="h-2.5 w-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <span className="truncate max-w-[80px]">{c.category}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Audit Log / Recent Activities */}
        <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl shadow-sm border border-gray-150 dark:border-darkbg-700 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-darkbg-700 pb-3 mb-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Workspace Operations Log</h4>
            <span className="text-[10px] font-bold text-primary-500 uppercase">Audit Trail</span>
          </div>
          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-60 pr-1">
            {data.recentLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Activity className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-xs">No activities recorded</p>
              </div>
            ) : (
              data.recentLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-3 text-xs p-2.5 rounded-xl border border-gray-50 dark:border-darkbg-900 bg-gray-50/50 dark:bg-darkbg-900/30">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-850 dark:text-gray-200">{log.action}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                      <span>By: <span className="font-bold text-gray-500 dark:text-gray-450">{log.user_name}</span></span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">{log.created_at.replace('T', ' ').substring(0, 16)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
