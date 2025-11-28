import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Edit3, 
  LogOut, 
  Shield,
  X,
  Save,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');
  const [profileData, setProfileData] = useState({
    name: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordResetStatus, setPasswordResetStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  // Sync profileData with user data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true);
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordChangeStatus({ type: null, message: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'New passwords do not match'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'Password must be at least 6 characters'
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/auth/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordChangeStatus({
          type: 'success',
          message: 'Password updated successfully!'
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Update token if returned
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      } else {
        setPasswordChangeStatus({
          type: 'error',
          message: data.message || 'Failed to update password'
        });
      }
    } catch (error) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'An error occurred while updating password'
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setPasswordResetStatus({ type: null, message: '' });
    setIsSendingResetEmail(true);

    try {
      const response = await fetch('/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user.email })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordResetStatus({
          type: 'success',
          message: 'Password reset link has been sent to your email!'
        });
      } else {
        setPasswordResetStatus({
          type: 'error',
          message: data.message || 'Failed to send reset email'
        });
      }
    } catch (error) {
      setPasswordResetStatus({
        type: 'error',
        message: 'An error occurred while sending reset email'
      });
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
                  <p className="text-blue-100 text-sm">Welcome back, {user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 text-white"
                  title="Logout"
                >
                  <LogOut className="size-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 text-white"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeSection === 'profile'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="size-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeSection === 'password'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Lock className="size-4" />
              Password
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {activeSection === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profile Settings</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isUpdatingProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="size-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="size-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.name}</h4>
                      <p className="text-slate-600 dark:text-slate-400 capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing || isUpdatingProfile}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                        />
                        <span className="absolute right-3 top-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                          Cannot be changed
                        </span>
                      </div>
                    </div>

                    {isEditing && (
                      <button
                        onClick={handleProfileUpdate}
                        disabled={isUpdatingProfile}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="size-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'password' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Change Password Section */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Change Password</h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 space-y-4">
                    {passwordChangeStatus.type && (
                      <div className={`flex items-center gap-2 p-4 rounded-lg ${
                        passwordChangeStatus.type === 'success' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {passwordChangeStatus.type === 'success' ? (
                          <CheckCircle className="size-5" />
                        ) : (
                          <AlertCircle className="size-5" />
                        )}
                        <p>{passwordChangeStatus.message}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        disabled={isChangingPassword}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        disabled={isChangingPassword}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        disabled={isChangingPassword}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="size-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reset Password via Email Section */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Reset via Email</h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 space-y-4">
                    {passwordResetStatus.type && (
                      <div className={`flex items-center gap-2 p-4 rounded-lg ${
                        passwordResetStatus.type === 'success' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {passwordResetStatus.type === 'success' ? (
                          <CheckCircle className="size-5" />
                        ) : (
                          <AlertCircle className="size-5" />
                        )}
                        <p>{passwordResetStatus.message}</p>
                      </div>
                    )}

                    <p className="text-slate-600 dark:text-slate-400">
                      Forgot your password? Click below to receive a password reset link at <strong>{user.email}</strong>
                    </p>

                    <button
                      onClick={handlePasswordReset}
                      disabled={isSendingResetEmail}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingResetEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="size-4" />
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;