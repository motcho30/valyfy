import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

const Auth = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [connectionTest, setConnectionTest] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: ''
  })
  
  const { signUp, signIn, loading, error } = useAuth()

  // Test Supabase connection
  const testConnection = async () => {
    console.log('🧪 Testing Supabase connection...')
    try {
      // Check environment variables
      const url = process.env.REACT_APP_SUPABASE_URL
      const key = process.env.REACT_APP_SUPABASE_ANON_KEY
      
      console.log('🔗 Supabase URL:', url ? '✅ Set' : '❌ Missing')
      console.log('🔑 Supabase Key:', key ? '✅ Set' : '❌ Missing')
      
      if (!url || !key) {
        setConnectionTest('❌ Environment variables missing')
        return
      }
      
      // Test simple query
      const { data, error } = await supabase.auth.getSession()
      console.log('📊 Session test:', { data, error })
      
      if (error) {
        setConnectionTest(`❌ Connection error: ${error.message}`)
      } else {
        setConnectionTest('✅ Supabase connected successfully')
      }
    } catch (err) {
      console.error('💥 Connection test failed:', err)
      setConnectionTest(`❌ Test failed: ${err.message}`)
    }
  }

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
            onClose && onClose()
          } else if (data.user && !data.session) {
            // Email verification required - show success message but don't close
            console.log('📧 Email verification required')
            setConnectionTest('✅ Account created! You can now sign in without email verification.')
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
          onClose && onClose()
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

            {/* Debug: Connection Test */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={testConnection}
                className="w-full py-2 px-4 border border-blue-200 text-blue-600 rounded-xl text-sm hover:bg-blue-50 transition-colors"
              >
                🧪 Test Supabase Connection
              </button>
              
              {connectionTest && (
                <div className={`p-3 rounded-xl text-sm ${
                  connectionTest.includes('✅') 
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {connectionTest}
                </div>
              )}
            </div>

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