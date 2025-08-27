import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    // Force loading to false after 2 seconds max
    const forceLoadComplete = setTimeout(() => {
      if (mounted) {
        console.log('Force completing auth loading')
        setLoading(false)
      }
    }, 2000)

    // Simple auth check
    const initAuth = async () => {
      try {
        // Quick check for existing session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.warn('Auth session error:', error)
        } else if (session?.user) {
          setUser(session.user)
          setProfile({ full_name: '', username: '' }) // Simple default profile
        }
      } catch (error) {
        console.warn('Auth init error:', error)
      }
      
      if (mounted) {
        setLoading(false)
        clearTimeout(forceLoadComplete)
      }
    }

    initAuth()

    // Simple auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      
      console.log('🔄 Auth state change:', { event, hasSession: !!session, userId: session?.user?.id })
      
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('✅ User authenticated:', session.user.email)
        setProfile({ full_name: '', username: '' })
      } else {
        console.log('❌ User not authenticated')
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      clearTimeout(forceLoadComplete)
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    console.log('🚀 AuthContext signUp called with:', { email, metadata })
    try {
      setError(null)
      console.log('📡 Calling Supabase auth.signUp...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: metadata,
          emailRedirectTo: null // Disable email verification
        }
      })
      console.log('📊 Supabase signUp response:', { data, error })
      if (error) {
        console.error('❌ Supabase signUp error:', error)
        throw error
      }
      console.log('✅ signUp successful, returning data')
      return { data, error: null }
    } catch (error) {
      console.error('💥 signUp exception:', error)
      setError(error.message)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      return { error: null }
    } catch (error) {
      setError(error.message)
      return { error }
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      console.log('🔐 Attempting password reset for:', email)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('❌ Password reset error:', error)
        throw error
      }
      
      console.log('✅ Password reset email sent successfully')
      return { error: null }
    } catch (error) {
      console.error('💥 Password reset exception:', error)
      setError(error.message)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setError(null)
      if (!user) throw new Error('No user logged in')
      
      // Just update local state for now
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      return { data: updatedProfile, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext