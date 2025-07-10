"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthUser {
  email: string
  name: string
  role: "admin" | "user"
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
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("intranet_user")
    console.log("🔍 Verificando usuário salvo:", savedUser)

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log("✅ Dados do usuário encontrados:", userData)
        setUser({ email: userData.email })
        setAuthUser(userData)
      } catch (error) {
        console.error("❌ Erro ao carregar usuário:", error)
        localStorage.removeItem("intranet_user")
      }
    } else {
      console.log("ℹ️ Nenhum usuário salvo encontrado")
    }

    setLoading(false)
  }, [])

  const signOut = async () => {
    console.log("🚪 Fazendo logout...")
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
