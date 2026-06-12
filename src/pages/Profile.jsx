import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile, updatePassword } from '../services/db';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Key, Save, Lock } from 'lucide-react';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const { showToast } = useToast();

  // Profile forms state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Security credentials change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please enter both name and email.', 'warning');
      return;
    }

    setUpdatingProfile(true);
    try {
      const updatedUser = updateProfile(user.id, name, email);
      updateProfileState(updatedUser);
      showToast('Profile credentials updated successfully.', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update profile details.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Please enter all password parameters.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      updatePassword(user.id, oldPassword, newPassword);
      showToast('Password updated successfully.', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showToast(error.message || 'Failed to reset password.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-xs text-gray-550 dark:text-gray-400">Manage account information, roles, and password credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl border border-gray-150 dark:border-darkbg-700 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-bold text-3xl shadow-xl shadow-primary-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white mt-4">{user?.name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">{user?.email}</p>

            <div className="w-full border-t border-gray-100 dark:border-darkbg-700 my-4" />

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-450">
              <Shield className="h-4 w-4 text-primary-500" />
              <span>Access Role: <span className="text-primary-500">{user?.role}</span></span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Update details */}
          <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl border border-gray-150 dark:border-darkbg-700">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-darkbg-700 pb-3 mb-4 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary-500" />
              <span>Update account details</span>
            </h3>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-xs font-bold text-white shadow-md shadow-primary-500/10 transition disabled:opacity-50 mt-2"
              >
                {updatingProfile ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save credentials</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="bg-white dark:bg-darkbg-800 p-5 rounded-2xl border border-gray-150 dark:border-darkbg-700">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-darkbg-700 pb-3 mb-4 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-violet-500" />
              <span>Change Security Password</span>
            </h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Old Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><Lock className="h-4 w-4" /></span>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><Lock className="h-4 w-4" /></span>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-455"><Lock className="h-4 w-4" /></span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-bold text-white shadow-md shadow-violet-600/10 transition disabled:opacity-50 mt-2"
              >
                {updatingPassword ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>Reset password credentials</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
