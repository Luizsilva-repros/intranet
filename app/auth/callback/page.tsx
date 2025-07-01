"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro na autenticação:", error)
          router.push("/login?error=auth_failed")
          return
        }

        if (data.session) {
          // Usuário autenticado com sucesso
          router.push("/dashboard")
        } else {
          // Não há sessão, redirecionar para login
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro no callback:", error)
        router.push("/login?error=callback_failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Processando login...</p>
      </div>
    </div>
  )
}
