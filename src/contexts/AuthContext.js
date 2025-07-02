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
      
      setUser(session?.user ?? null)
      if (session?.user) {
        setProfile({ full_name: '', username: '' })
      } else {
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
    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
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