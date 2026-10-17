import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthUser { token: string; userId: number; username: string; email: string }
interface AuthCtx { user: AuthUser | null; login: (u: AuthUser) => void; logout: () => void }

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const s = localStorage.getItem('sm_user')
    return s ? JSON.parse(s) : null
  })

  const login = (u: AuthUser) => { setUser(u); localStorage.setItem('sm_user', JSON.stringify(u)) }
  const logout = () => { setUser(null); localStorage.removeItem('sm_user') }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
