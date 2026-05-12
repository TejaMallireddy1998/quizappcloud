import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as api from '../api/quizApi'

const AuthContext = createContext(null)

const STORAGE_KEY = 'quizzr.auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null)
  // auth shape: { token, userId, username, roles: [] }

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setAuth(parsed)
        api.setAuthToken(parsed.token)
      }
    } catch { /* ignore */ }
  }, [])

  // Logout handler
  const logout = useCallback(() => {
    setAuth(null)
    api.setAuthToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Wire global 401 handler → auto-logout
  useEffect(() => {
    api.setOnUnauthorized(logout)
  }, [logout])

  const login = async ({ username, password }) => {
    const res = await api.login({ username, password })
    const next = {
      token: res.token,
      userId: res.userId,
      username: res.username,
      roles: res.roles || [],
    }
    setAuth(next)
    api.setAuthToken(res.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  }

  const register = async (payload) => {
    await api.register(payload)
    // Auto-login after registering
    return login({ username: payload.username, password: payload.password })
  }

  const hasRole = (role) => (auth?.roles || []).includes(role)

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}