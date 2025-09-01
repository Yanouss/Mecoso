import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  User, 
  Edit3, 
  Image, 
  FileText, 
  LogOut, 
  Shield,
  X,
  Save,
  Upload
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'content' | 'media'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen || !user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: Image },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
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

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <div className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600/50'
                        }`}
                      >
                        <Icon className="size-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profile Settings</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
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
                        <p className="text-slate-600 dark:text-slate-400">{user.role}</p>
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
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 dark:disabled:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 dark:disabled:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      {isEditing && (
                        <button
                          onClick={handleProfileUpdate}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors duration-200 font-semibold"
                        >
                          <Save className="size-4" />
                          Save Changes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="max-w-4xl">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Content Management</h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <p className="text-slate-600 dark:text-slate-400 text-center py-12">
                      Content management features will be implemented here.
                      <br />
                      This will include editing hero sections, services, about content, etc.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="max-w-4xl">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Media Library</h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <div className="text-center py-12">
                      <Upload className="size-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Media upload and management features will be implemented here.
                      </p>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors duration-200 font-semibold">
                        Upload Media
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;