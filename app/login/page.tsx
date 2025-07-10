"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Building2 } from "lucide-react"
import { authenticateUser, initializeData, validatePassword } from "@/lib/local-storage"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Inicializar dados apenas uma vez
    if (!isInitialized) {
      console.log("🚀 Inicializando sistema...")
      initializeData()
      setIsInitialized(true)
    }

    // Verificar se já está logado
    const savedUser = localStorage.getItem("intranet_user")
    if (savedUser) {
      console.log("✅ Usuário já logado, redirecionando...")
      router.replace("/dashboard")
    }
  }, [router, isInitialized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError("")

    try {
      console.log("🔐 Tentando autenticar:", email)

      // Validações básicas
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios")
      }

      if (!email.includes("@")) {
        throw new Error("Email inválido")
      }

      // Buscar usuário
      const user = authenticateUser(email)
      if (!user) {
        throw new Error("Usuário não encontrado")
      }

      if (!user.active) {
        throw new Error("Usuário inativo")
      }

      // Validar senha
      if (!user.password_hash || !validatePassword(password, user.password_hash)) {
        throw new Error("Senha incorreta")
      }

      console.log("✅ Login realizado com sucesso:", user.name)

      // Salvar usuário logado
      localStorage.setItem("intranet_user", JSON.stringify(user))

      // Redirecionar após um pequeno delay
      setTimeout(() => {
        router.replace("/dashboard")
      }, 500)
    } catch (error: any) {
      console.error("❌ Erro no login:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INTRANET</h1>
            <p className="text-gray-600">Acesse sua conta</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Login
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                disabled={loading}
                className="h-12"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  disabled={loading}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Esqueci minha senha
              </a>
            </div>

            <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Credenciais de teste:</p>
            <p>admin@repros.com.br / admin123</p>
            <p>luiz.silva@repros.com.br / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
