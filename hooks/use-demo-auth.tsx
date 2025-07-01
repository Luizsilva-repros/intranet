"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { demoUsers } from "@/lib/demo-data"

interface DemoUser {
  id: string
  email: string
  name: string | null
  role: "admin" | "user"
  is_active: boolean
}

interface DemoAuthContextType {
  user: { email: string } | null
  authUser: DemoUser | null
  loading: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const DemoAuthContext = createContext<DemoAuthContextType>({
  user: null,
  authUser: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
})

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authUser, setAuthUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string) => {
    setLoading(true)

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = demoUsers.find((u) => u.email === email)

    if (foundUser) {
      setUser({ email })
      setAuthUser(foundUser)
    } else {
      throw new Error("Usuário não autorizado")
    }

    setLoading(false)
  }

  const signOut = async () => {
    setUser(null)
    setAuthUser(null)
  }

  return (
    <DemoAuthContext.Provider value={{ user, authUser, loading, signIn, signOut }}>{children}</DemoAuthContext.Provider>
  )
}

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext)
  if (!context) {
    throw new Error("useDemoAuth deve ser usado dentro de DemoAuthProvider")
  }
  return context
}
