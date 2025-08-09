import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultMode = 'signup' }) => {
  const { signUp, signIn, isAuthenticated, loading, error } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'signup' | 'signin'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose?.();
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      if (mode === 'signup') {
        const { error: signUpErr } = await signUp(email, password, {});
        if (signUpErr) setLocalError(signUpErr.message || 'Failed to sign up');
      } else {
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) setLocalError(signInErr.message || 'Failed to sign in');
      }
    } catch (e) {
      setLocalError(e.message || 'Authentication failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200 p-6"
          >
            <div className="mb-4 text-center">
              <h3 className="text-xl font-semibold text-slate-900">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h3>
              <p className="text-sm text-slate-500 mt-1">Sign {mode === 'signup' ? 'up' : 'in'} to copy your build prompt</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {(localError || error) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600">
                  {localError || error}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode((m) => (m === 'signup' ? 'signin' : 'signup'))}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  {mode === 'signup' ? 'Have an account? Sign in' : "New here? Create account"}
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
                >
                  {mode === 'signup' ? 'Sign up' : 'Sign in'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

