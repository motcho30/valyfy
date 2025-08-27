import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabase';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Log URL parameters for debugging
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    console.log('Reset password URL params:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
    console.log('Password reset page loaded - ready for password update');
    
    // Don't perform any upfront validation - let the password update handle authentication
    // This prevents false error messages while maintaining security through the updateUser call
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to update password...');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        setError(error.message || 'Failed to update password. Please try again.');
      } else {
        console.log('Password updated successfully');
        setSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Password update exception:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-black mb-4">
            Password Updated Successfully!
          </h1>
          <p className="text-black/60 mb-6">
            Your password has been reset. You'll be redirected to the dashboard shortly.
          </p>
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-jersey text-3xl md:text-4xl text-black leading-tight mb-2">
            Reset Your Password
          </h1>
          <p className="text-black/60">
            Enter your new password below
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl p-8 shadow-lg"
          style={{ 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full pl-12 pr-12 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent bg-white/50 backdrop-blur-sm placeholder-black/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full pl-12 pr-12 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent bg-white/50 backdrop-blur-sm placeholder-black/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black/60"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-vibe-cyan text-black py-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-black/60 hover:text-black transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
