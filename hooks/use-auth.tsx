"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  department?: string
  title?: string
  groups?: string[]
}

interface AuthContextType {
  user: { email: string } | null
  authUser: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authUser: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("intranet_user")

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser({ email: userData.email })
        setAuthUser(userData)
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        localStorage.removeItem("intranet_user")
      }
    }

    setLoading(false)
  }, [])

  const signOut = async () => {
    localStorage.removeItem("intranet_user")
    setUser(null)
    setAuthUser(null)
  }

  return <AuthContext.Provider value={{ user, authUser, loading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
