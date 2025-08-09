import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

const Auth = ({ onClose, redirectTo, defaultMode = 'signin' }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(defaultMode === 'signup')
  
  // Get redirect destination from props or URL params
  const getRedirectPath = () => {
    return redirectTo || searchParams.get('redirect') || '/dashboard'
  }
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: ''
  })
  
  const { signUp, signIn, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🔍 Auth form submitted:', { isSignUp, formData })
    
    try {
      if (isSignUp) {
        console.log('📝 Attempting signup with:', formData.email)
        const { data, error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          username: formData.username
        })
        console.log('📊 Signup result:', { data, error })
        
        if (!error) {
          console.log('✅ Signup successful!')
          
          // Check if user is immediately logged in (no email verification)
          if (data.session) {
            console.log('🎉 User logged in immediately')
            const redirectPath = getRedirectPath()
            console.log('🔄 Redirecting to:', redirectPath)
            onClose ? onClose() : navigate(redirectPath)
          } else if (data.user && !data.session) {
            // Email verification required - show success message but don't close
            console.log('📧 Email verification required')
            // Auto-switch to sign in mode
            setTimeout(() => {
              setIsSignUp(false)
              setFormData(prev => ({ ...prev, fullName: '', username: '' }))
            }, 2000)
          }
        } else {
          console.error('❌ Signup error:', error)
        }
      } else {
        console.log('🔑 Attempting signin with:', formData.email)
        const { data, error } = await signIn(formData.email, formData.password)
        console.log('📊 Signin result:', { data, error })
        if (!error) {
          console.log('✅ Signin successful!')
          const redirectPath = getRedirectPath()
          console.log('🔄 Redirecting to:', redirectPath)
          onClose ? onClose() : navigate(redirectPath)
        } else {
          console.error('❌ Signin error:', error)
        }
      }
    } catch (err) {
      console.error('💥 Auth exception:', err)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-black/60">
            {isSignUp ? 'Join Valyfy to start building amazing projects' : 'Sign in to continue building'}
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
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent bg-white/50 backdrop-blur-sm placeholder-black/40"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      className="w-full pl-12 pr-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent bg-white/50 backdrop-blur-sm placeholder-black/40"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent bg-white/50 backdrop-blur-sm placeholder-black/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}



            <div className="space-y-4">
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
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default Auth