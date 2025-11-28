import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const PasswordReset: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (password.length < 6) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 6 characters long'
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Password reset successful! Redirecting to login...'
        });
        
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to reset password. The link may have expired.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="size-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-blue-100 text-sm">Enter your new password below</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {status.type && (
              <div className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
                status.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle className="size-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="size-5 flex-shrink-0" />
                )}
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || status.type === 'success'}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="size-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a 
                href="/admin/login" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          © {new Date().getFullYear()} MECOSO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PasswordReset;