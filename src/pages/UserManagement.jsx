import React, { useEffect, useState } from 'react';
import { 
  getAllUsers, 
  getAuditLogs, 
  createUserByAdmin, 
  updateUserByAdmin, 
  deleteUserByAdmin 
} from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { 
  ShieldAlert, 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit2, 
  UserCheck, 
  Mail, 
  User, 
  Key,
  ShieldCheck,
  ClipboardList,
  Terminal
} from 'lucide-react';

const UserManagement = () => {
  const { isAdmin, user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add User');
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });

  const fetchData = () => {
    setLoading(true);
    try {
      const allUsers = getAllUsers();
      const allLogs = getAuditLogs();
      setUsers(allUsers);
      setLogs(allLogs);
    } catch (error) {
      showToast('Failed to load administration accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const openCreateModal = () => {
    setEditingId(null);
    setModalTitle('Create Dashboard Account');
    setFormData({ name: '', email: '', password: '', role: 'User' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setModalTitle(`Edit User #${user.id}`);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', 
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editingId && !formData.password)) {
      showToast('Please enter all required fields.', 'error');
      return;
    }

    try {
      if (editingId) {
        updateUserByAdmin(editingId, formData.name, formData.email, formData.role);
        showToast('User account updated successfully.', 'success');
      } else {
        createUserByAdmin(formData.name, formData.email, formData.password, formData.role);
        showToast('User account created successfully.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to modify account.', 'error');
    }
  };

  const handleDelete = (id, email) => {
    if (id === currentUser.id) {
      showToast('Administrative block: Self-deletion is denied.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${email}"?`)) {
      return;
    }

    try {
      deleteUserByAdmin(id);
      showToast('User account deleted successfully.', 'success');
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to delete account.', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4 animate-bounce">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Forbidden</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          This panel is restricted to users holding administrative roles. Please contact your administrator if you require permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-sans">User Management Console</h2>
          <p className="text-xs text-gray-550 dark:text-gray-400">Configure roles, details, and inspect security logs</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-sm font-bold text-white shadow-md shadow-primary-500/10 transition self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add User Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left: Accounts table */}
        <div className="bg-white dark:bg-darkbg-800 rounded-2xl shadow-sm border border-gray-150 dark:border-darkbg-700 overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-gray-150 dark:border-darkbg-700">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary-500" />
              <span>Registered Accounts</span>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 dark:border-darkbg-700 bg-gray-50/50 dark:bg-darkbg-900/30 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-5">User ID</th>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Email Address</th>
                  <th className="py-3 px-5">Security Role</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-darkbg-700 text-sm">
                {loading ? (
                  [...Array(4)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-5"><div className="h-4 w-6 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                      <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                      <td className="py-4 px-5"><div className="h-4 w-32 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                      <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-200 dark:bg-darkbg-700 rounded" /></td>
                      <td className="py-4 px-5"><div className="h-4 w-12 bg-gray-200 dark:bg-darkbg-700 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-darkbg-900/20 text-gray-800 dark:text-gray-200 transition-colors">
                      <td className="py-3 px-5 font-mono text-xs">{u.id}</td>
                      <td className="py-3 px-5 font-semibold">{u.name}</td>
                      <td className="py-3 px-5">{u.email}</td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                          ${u.role === 'Admin' 
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-950/40 dark:text-primary-350' 
                            : 'bg-gray-100 text-gray-700 dark:bg-darkbg-700 dark:text-gray-300'
                          }
                        `}>
                          {u.role === 'Admin' ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-darkbg-700 dark:hover:text-primary-400 rounded-lg transition"
                            title="Edit User Details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.email)}
                            disabled={u.id === currentUser.id}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500 dark:hover:bg-darkbg-700 dark:hover:text-rose-450 rounded-lg transition disabled:opacity-30"
                            title="Delete User"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Security logs */}
        <div className="bg-white dark:bg-darkbg-800 rounded-2xl shadow-sm border border-gray-150 dark:border-darkbg-700 overflow-hidden lg:col-span-1 flex flex-col h-[500px]">
          <div className="px-5 py-4 border-b border-gray-150 dark:border-darkbg-700">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-violet-500" />
              <span>Full Security Audit Logs</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 bg-gray-100 dark:bg-darkbg-900 rounded animate-pulse" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No audit actions logged yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-2.5 bg-gray-50 dark:bg-darkbg-900 rounded-xl border border-gray-150 dark:border-darkbg-700">
                  <div className="flex items-center gap-1.5 text-primary-500 font-bold mb-1">
                    <Terminal className="h-3 w-3" />
                    <span>LOG_ITEM #{log.id}</span>
                  </div>
                  <p className="text-gray-750 dark:text-gray-300 font-medium">{log.action}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[9px] text-gray-450">
                    <span>By: {log.user_name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Account Editor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Account Holder Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><User className="h-4 w-4" /></span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="E.g. Elon Musk"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><Mail className="h-4 w-4" /></span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@company.com"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
              />
            </div>
          </div>

          {!editingId && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Set Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><Key className="h-4 w-4" /></span>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Assigned Access Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><Shield className="h-4 w-4" /></span>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white transition appearance-none cursor-pointer"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-darkbg-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-darkbg-700 bg-white dark:bg-darkbg-850 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-sm font-bold text-white transition shadow-md shadow-primary-500/10"
            >
              Save Account
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default UserManagement;
