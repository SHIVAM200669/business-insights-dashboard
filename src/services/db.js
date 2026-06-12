// Local Storage Database Simulation Manager

const KEY_USERS = 'users';
const KEY_CURRENT_USER = 'currentUser';
const KEY_ANALYTICS = 'analyticsData';
const KEY_REPORTS = 'reports';
const KEY_LOGS = 'activityLogs';

// 1. Initial Mock Seeding Data
const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // plaintext matching for client simulation convenience
    role: 'Admin',
    createdAt: '2026-01-01T10:00:00.000Z'
  },
  {
    id: 2,
    name: 'Standard User',
    email: 'user@example.com',
    password: 'user123',
    role: 'User',
    createdAt: '2026-01-02T12:00:00.000Z'
  }
];

const DEFAULT_ANALYTICS = [
  { id: 1, category: 'Electronics', value: 150, sales: 45, revenue: 12500.00, date: '2026-01-15', user_name: 'Admin User', user_id: 1 },
  { id: 2, category: 'SaaS Subscriptions', value: 320, sales: 80, revenue: 24000.00, date: '2026-01-20', user_name: 'Admin User', user_id: 1 },
  { id: 3, category: 'Consulting', value: 90, sales: 15, revenue: 18000.00, date: '2026-01-22', user_name: 'Admin User', user_id: 1 },
  { id: 4, category: 'Office Supplies', value: 450, sales: 120, revenue: 4500.00, date: '2026-01-28', user_name: 'Standard User', user_id: 2 },
  { id: 5, category: 'Electronics', value: 180, sales: 52, revenue: 14800.00, date: '2026-02-05', user_name: 'Admin User', user_id: 1 },
  { id: 6, category: 'SaaS Subscriptions', value: 340, sales: 85, revenue: 25500.00, date: '2026-02-12', user_name: 'Admin User', user_id: 1 },
  { id: 7, category: 'Consulting', value: 110, sales: 18, revenue: 22000.00, date: '2026-02-18', user_name: 'Standard User', user_id: 2 },
  { id: 8, category: 'Office Supplies', value: 420, sales: 110, revenue: 4100.00, date: '2026-02-25', user_name: 'Standard User', user_id: 2 },
  { id: 9, category: 'Electronics', value: 210, sales: 60, revenue: 17200.00, date: '2026-03-04', user_name: 'Admin User', user_id: 1 },
  { id: 10, category: 'SaaS Subscriptions', value: 360, sales: 92, revenue: 27600.00, date: '2026-03-11', user_name: 'Standard User', user_id: 2 },
  { id: 11, category: 'Consulting', value: 95, sales: 16, revenue: 19500.00, date: '2026-03-20', user_name: 'Standard User', user_id: 2 },
  { id: 12, category: 'Office Supplies', value: 490, sales: 130, revenue: 5200.00, date: '2026-03-27', user_name: 'Admin User', user_id: 1 },
  { id: 13, category: 'Electronics', value: 240, sales: 70, revenue: 21000.00, date: '2026-04-02', user_name: 'Admin User', user_id: 1 },
  { id: 14, category: 'SaaS Subscriptions', value: 410, sales: 105, revenue: 31500.00, date: '2026-04-10', user_name: 'Admin User', user_id: 1 },
  { id: 15, category: 'Consulting', value: 120, sales: 20, revenue: 24000.00, date: '2026-04-15', user_name: 'Standard User', user_id: 2 },
  { id: 16, category: 'Office Supplies', value: 510, sales: 145, revenue: 5900.00, date: '2026-04-28', user_name: 'Standard User', user_id: 2 },
  { id: 17, category: 'Electronics', value: 280, sales: 85, revenue: 25600.00, date: '2026-05-03', user_name: 'Admin User', user_id: 1 },
  { id: 18, category: 'SaaS Subscriptions', value: 450, sales: 118, revenue: 35400.00, date: '2026-05-12', user_name: 'Standard User', user_id: 2 },
  { id: 19, category: 'Consulting', value: 130, sales: 22, revenue: 26000.00, date: '2026-05-20', user_name: 'Admin User', user_id: 1 },
  { id: 20, category: 'Office Supplies', value: 530, sales: 150, revenue: 6100.00, date: '2026-05-29', user_name: 'Admin User', user_id: 1 },
  { id: 21, category: 'Electronics', value: 310, sales: 95, revenue: 29000.00, date: '2026-06-02', user_name: 'Admin User', user_id: 1 },
  { id: 22, category: 'SaaS Subscriptions', value: 490, sales: 130, revenue: 39000.00, date: '2026-06-08', user_name: 'Standard User', user_id: 2 },
  { id: 23, category: 'Consulting', value: 140, sales: 25, revenue: 30000.00, date: '2026-06-10', user_name: 'Standard User', user_id: 2 },
  { id: 24, category: 'Office Supplies', value: 580, sales: 165, revenue: 6800.00, date: '2026-06-11', user_name: 'Admin User', user_id: 1 }
];

const DEFAULT_LOGS = [
  { id: 1, action: 'Local Database system initialization', user_name: 'System', created_at: '2026-06-12T10:00:00.000Z' },
  { id: 2, action: 'User account seeded: admin@example.com', user_name: 'System', created_at: '2026-06-12T10:01:00.000Z' },
  { id: 3, action: 'User account seeded: user@example.com', user_name: 'System', created_at: '2026-06-12T10:02:00.000Z' }
];

// Initialize database in Local Storage
export const initLocalStorageDB = () => {
  if (!localStorage.getItem(KEY_USERS)) {
    localStorage.setItem(KEY_USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(KEY_ANALYTICS)) {
    localStorage.setItem(KEY_ANALYTICS, JSON.stringify(DEFAULT_ANALYTICS));
  }
  if (!localStorage.getItem(KEY_LOGS)) {
    localStorage.setItem(KEY_LOGS, JSON.stringify(DEFAULT_LOGS));
  }
  if (!localStorage.getItem(KEY_REPORTS)) {
    localStorage.setItem(KEY_REPORTS, JSON.stringify([]));
  }
};

// Seed on module evaluation
initLocalStorageDB();

// 2. Generic read/write helpers
const read = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Local Storage read error for ${key}:`, e);
    return [];
  }
};

const write = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Local Storage write error for ${key}:`, e);
  }
};

// 3. Activity Auditing Logger
export const logActivity = (action, userName = 'System') => {
  const logs = read(KEY_LOGS);
  const newLog = {
    id: Date.now(),
    action,
    user_name: userName,
    created_at: new Date().toISOString()
  };
  write(KEY_LOGS, [newLog, ...logs].slice(0, 100)); // cap at 100 logs
};

export const getAuditLogs = () => {
  return read(KEY_LOGS);
};

// 4. Session Manager
export const getCurrentSession = () => {
  try {
    const session = localStorage.getItem(KEY_CURRENT_USER);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
};

export const loginUser = (email, password) => {
  const users = read(KEY_USERS);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.');
  }

  const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(sessionUser));
  logActivity('User logged in successfully', user.name);
  return sessionUser;
};

export const registerUser = (name, email, password, role = 'User') => {
  const users = read(KEY_USERS);
  const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

  if (emailExists) {
    throw new Error('A user with this email address already exists.');
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString()
  };

  write(KEY_USERS, [...users, newUser]);
  logActivity(`New account registered: ${email} (${role})`, name);
  return newUser;
};

export const destroySession = () => {
  const session = getCurrentSession();
  if (session) {
    logActivity('User logged out', session.name);
  }
  localStorage.removeItem(KEY_CURRENT_USER);
};

export const updateProfile = (userId, name, email) => {
  const users = read(KEY_USERS);
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) throw new Error('User not found.');

  // Check email uniqueness
  const emailTaken = users.some(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
  if (emailTaken) throw new Error('Email address is already in use.');

  users[userIdx].name = name;
  users[userIdx].email = email;
  write(KEY_USERS, users);

  // Update session
  const currentSession = getCurrentSession();
  if (currentSession && currentSession.id === userId) {
    currentSession.name = name;
    currentSession.email = email;
    localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(currentSession));
  }

  logActivity(`Updated profile details: ${name} (${email})`, name);
  return users[userIdx];
};

export const updatePassword = (userId, oldPassword, newPassword) => {
  const users = read(KEY_USERS);
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) throw new Error('User not found.');

  if (users[userIdx].password !== oldPassword) {
    throw new Error('Old password is incorrect.');
  }

  users[userIdx].password = newPassword;
  write(KEY_USERS, users);
  logActivity('Changed account password', users[userIdx].name);
};

// 5. Admin User operations
export const getAllUsers = () => {
  return read(KEY_USERS).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
};

export const createUserByAdmin = (name, email, password, role) => {
  const currentSession = getCurrentSession();
  const newUser = registerUser(name, email, password, role);
  logActivity(`Admin created user account: ${email} (${role})`, currentSession?.name || 'Admin');
  return newUser;
};

export const updateUserByAdmin = (id, name, email, role) => {
  const users = read(KEY_USERS);
  const userIdx = users.findIndex(u => u.id === id);
  if (userIdx === -1) throw new Error('User not found.');

  const emailTaken = users.some(u => u.id !== id && u.email.toLowerCase() === email.toLowerCase());
  if (emailTaken) throw new Error('Email address already in use.');

  users[userIdx].name = name;
  users[userIdx].email = email;
  users[userIdx].role = role;
  write(KEY_USERS, users);

  const currentSession = getCurrentSession();
  logActivity(`Admin updated user details for #${id} (Role: ${role})`, currentSession?.name || 'Admin');
  return users[userIdx];
};

export const deleteUserByAdmin = (id) => {
  const currentSession = getCurrentSession();
  if (currentSession && currentSession.id === id) {
    throw new Error('Administrative safety block: You cannot delete your own account.');
  }

  const users = read(KEY_USERS);
  const user = users.find(u => u.id === id);
  if (!user) throw new Error('User not found.');

  write(KEY_USERS, users.filter(u => u.id !== id));
  logActivity(`Admin deleted user account: ${user.email}`, currentSession?.name || 'Admin');
};

// 6. Analytics CRUD & Summary
export const getDashboardOverview = () => {
  const data = read(KEY_ANALYTICS);
  const users = read(KEY_USERS);
  const logs = read(KEY_LOGS);

  // Metrics
  const totalUsers = users.length;
  const totalSales = data.reduce((sum, item) => sum + parseInt(item.sales || 0), 0);
  const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0);
  const activeSessions = Math.floor(Math.random() * 10) + 12; // simulated active sessions count

  // Calculate Growth Rate
  // Compare revenue in current month vs previous month
  const curDate = new Date();
  const curMonthStr = `${curDate.getFullYear()}-${String(curDate.getMonth() + 1).padStart(2, '0')}`;
  
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  const curMonthRevenue = data
    .filter(item => item.date.startsWith(curMonthStr))
    .reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0);

  const prevMonthRevenue = data
    .filter(item => item.date.startsWith(prevMonthStr))
    .reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0);

  let growthRate = 12.5; // baseline fallback
  if (prevMonthRevenue > 0) {
    growthRate = parseFloat((((curMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1));
  } else if (curMonthRevenue > 0) {
    growthRate = 100;
  }

  // Monthly trends
  // Group sales/revenue by Month (YYYY-MM)
  const trendsMap = {};
  data.forEach(item => {
    const month = item.date.substring(0, 7); // get YYYY-MM
    if (!trendsMap[month]) {
      trendsMap[month] = { month, sales: 0, revenue: 0 };
    }
    trendsMap[month].sales += parseInt(item.sales || 0);
    trendsMap[month].revenue += parseFloat(item.revenue || 0);
  });
  const trends = Object.values(trendsMap).sort((a, b) => a.month.localeCompare(b.month));

  // Category performance
  const catMap = {};
  data.forEach(item => {
    const cat = item.category;
    if (!catMap[cat]) {
      catMap[cat] = { category: cat, sales: 0, revenue: 0, value: 0 };
    }
    catMap[cat].sales += parseInt(item.sales || 0);
    catMap[cat].revenue += parseFloat(item.revenue || 0);
    catMap[cat].value += parseInt(item.value || 0);
  });
  const categories = Object.values(catMap).sort((a, b) => b.revenue - a.revenue);

  // Users Distribution
  const roleMap = {};
  users.forEach(u => {
    if (!roleMap[u.role]) roleMap[u.role] = 0;
    roleMap[u.role]++;
  });
  const usersDistribution = Object.entries(roleMap).map(([role, count]) => ({ role, count }));

  return {
    metrics: { totalUsers, totalSales, totalRevenue, activeSessions, growthRate },
    trends,
    categories,
    usersDistribution,
    recentLogs: logs.slice(0, 7)
  };
};

export const getPaginatedRecords = ({ search = '', category = '', sortBy = 'date', sortOrder = 'DESC', page = 1, limit = 10 }) => {
  let data = read(KEY_ANALYTICS);

  // Search
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(r => 
      r.category.toLowerCase().includes(q) || 
      (r.user_name && r.user_name.toLowerCase().includes(q))
    );
  }

  // Filter
  if (category) {
    data = data.filter(r => r.category === category);
  }

  // Sort
  data.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'revenue') {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    } else if (sortBy === 'sales' || sortBy === 'value' || sortBy === 'id') {
      valA = parseInt(valA);
      valB = parseInt(valB);
    } else {
      valA = String(valA);
      valB = String(valB);
    }

    if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
    if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  });

  // Pagination
  const total = data.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  const paginatedData = data.slice(offset, offset + limitNum);

  return {
    data: paginatedData,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const createAnalyticsRecord = ({ category, value, sales, revenue, date }) => {
  const currentSession = getCurrentSession();
  const data = read(KEY_ANALYTICS);
  const newId = data.length > 0 ? Math.max(...data.map(r => r.id)) + 1 : 1;

  const newRecord = {
    id: newId,
    category,
    value: parseInt(value),
    sales: parseInt(sales),
    revenue: parseFloat(revenue),
    date,
    user_name: currentSession?.name || 'System',
    user_id: currentSession?.id || null
  };

  write(KEY_ANALYTICS, [newRecord, ...data]);
  logActivity(`Created analytics record #${newId} (Category: ${category})`, currentSession?.name || 'System');
  return newRecord;
};

export const updateAnalyticsRecord = (id, { category, value, sales, revenue, date }) => {
  const currentSession = getCurrentSession();
  const data = read(KEY_ANALYTICS);
  const idx = data.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Record not found.');

  data[idx] = {
    ...data[idx],
    category,
    value: parseInt(value),
    sales: parseInt(sales),
    revenue: parseFloat(revenue),
    date,
    user_name: currentSession?.name || data[idx].user_name,
    user_id: currentSession?.id || data[idx].user_id
  };

  write(KEY_ANALYTICS, data);
  logActivity(`Updated analytics record #${id} (Category: ${category})`, currentSession?.name || 'System');
  return data[idx];
};

export const deleteAnalyticsRecord = (id) => {
  const currentSession = getCurrentSession();
  const data = read(KEY_ANALYTICS);
  const record = data.find(r => r.id === id);
  if (!record) throw new Error('Record not found.');

  write(KEY_ANALYTICS, data.filter(r => r.id !== id));
  logActivity(`Deleted analytics record #${id} (Category: ${record.category})`, currentSession?.name || 'System');
};

// 7. Custom reports compilation
export const generatePeriodSummaryData = (startDate, endDate) => {
  const data = read(KEY_ANALYTICS).filter(r => r.date >= startDate && r.date <= endDate);

  // Totals
  const totalSales = data.reduce((sum, r) => sum + parseInt(r.sales || 0), 0);
  const totalRevenue = data.reduce((sum, r) => sum + parseFloat(r.revenue || 0), 0);
  const recordCount = data.length;

  // Category breakdown
  const catMap = {};
  data.forEach(r => {
    if (!catMap[r.category]) {
      catMap[r.category] = { category: r.category, sales: 0, revenue: 0 };
    }
    catMap[r.category].sales += parseInt(r.sales || 0);
    catMap[r.category].revenue += parseFloat(r.revenue || 0);
  });
  const categories = Object.values(catMap).sort((a, b) => b.revenue - a.revenue);

  // Daily trends
  const dailyMap = {};
  data.forEach(r => {
    if (!dailyMap[r.date]) {
      dailyMap[r.date] = { date: r.date, sales: 0, revenue: 0 };
    }
    dailyMap[r.date].sales += parseInt(r.sales || 0);
    dailyMap[r.date].revenue += parseFloat(r.revenue || 0);
  });
  const trends = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalSales,
    totalRevenue,
    recordCount,
    categories,
    trends
  };
};

export const savePeriodReport = (title, description, startDate, endDate, dataSummary) => {
  const currentSession = getCurrentSession();
  const reports = read(KEY_REPORTS);
  const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;

  const newReport = {
    id: newId,
    title,
    description,
    start_date: startDate,
    end_date: endDate,
    data_summary: dataSummary,
    creator_name: currentSession?.name || 'System',
    created_at: new Date().toISOString()
  };

  write(KEY_REPORTS, [newReport, ...reports]);
  logActivity(`Compiled and saved report #${newId}: ${title}`, currentSession?.name || 'System');
  return newReport;
};

export const getSavedReports = () => {
  return read(KEY_REPORTS);
};

export const deleteSavedReport = (id) => {
  const currentSession = getCurrentSession();
  const reports = read(KEY_REPORTS);
  const report = reports.find(r => r.id === id);
  if (!report) throw new Error('Report not found.');

  write(KEY_REPORTS, reports.filter(r => r.id !== id));
  logActivity(`Deleted report #${id}: ${report.title}`, currentSession?.name || 'System');
};
