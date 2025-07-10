"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { initializeData, getSettings } from "@/lib/local-storage"
import { authenticateUser } from "@/lib/auth-service"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [settings, setSettings] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    console.log("🚀 Inicializando página de login...")
    initializeData()

    // Carregar configurações
    const currentSettings = getSettings()
    setSettings(currentSettings)

    // Verificar se já está logado
    const savedUser = localStorage.getItem("intranet_user")
    if (savedUser) {
      console.log("✅ Usuário já logado, redirecionando...")
      router.push("/dashboard")
    }

    // Mostrar informações de debug
    console.log("🔍 Informações de debug:")
    console.log("   - localStorage disponível:", typeof localStorage !== "undefined")
    console.log("   - Dados de usuários:", localStorage.getItem("intranet_users") ? "EXISTEM" : "NÃO EXISTEM")

    const usersData = localStorage.getItem("intranet_users")
    if (usersData) {
      try {
        const users = JSON.parse(usersData)
        console.log(`   - Total de usuários: ${users.length}`)
        console.log(
          "   - Emails cadastrados:",
          users.map((u: any) => u.email),
        )
      } catch (e) {
        console.error("   - Erro ao ler usuários:", e)
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    console.log(`🚀 === INICIANDO PROCESSO DE LOGIN ===`)
    console.log(`📧 Email: ${email}`)
    console.log(`🔐 Senha: ${password ? "[FORNECIDA]" : "[VAZIA]"}`)

    try {
      // Verificar se os dados básicos estão presentes
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios")
      }

      // Usar novo serviço de autenticação
      const authResult = await authenticateUser(email, password)

      console.log(`📋 Resultado da autenticação:`, authResult)

      if (!authResult.success) {
        console.log(`❌ Falha na autenticação: ${authResult.error}`)
        throw new Error(authResult.error || "Falha na autenticação")
      }

      const user = authResult.user!

      console.log(`✅ Usuário autenticado com sucesso:`, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        source: user.source,
      })

      // Salvar dados do usuário
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.displayName,
        department: user.department,
        title: user.title,
        role: user.role,
        active: true,
        group_ids: user.groups,
        groups: user.groups,
        source: user.source,
        lastLogin: user.lastLogin,
      }

      localStorage.setItem("intranet_user", JSON.stringify(userData))
      console.log(`✅ Dados do usuário salvos no localStorage`)

      setSuccess(`Login realizado com sucesso! Bem-vindo, ${user.name}!`)

      setTimeout(() => {
        console.log(`🔄 Redirecionando para dashboard...`)
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error: any) {
      console.error(`❌ ERRO NO LOGIN:`, error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-8 pt-8">
          {/* Logo da empresa */}
          <div className="mx-auto mb-6 flex items-center justify-center">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url || "/placeholder.svg"}
                alt="Logo da empresa"
                className="h-20 w-auto max-w-[280px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  const fallbackIcon = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallbackIcon) {
                    fallbackIcon.style.display = "flex"
                  }
                }}
              />
            ) : null}

            <div
              className={`h-16 w-16 items-center justify-center rounded-full bg-blue-100 ${
                settings?.logo_url ? "hidden" : "flex"
              }`}
              style={{ display: settings?.logo_url ? "none" : "flex" }}
            >
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">INTRANET</CardTitle>
          <CardDescription className="text-gray-600 text-lg">Acesse sua conta</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Login
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  required
                  minLength={3}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                onClick={() => alert("Funcionalidade em desenvolvimento")}
              >
                Esqueci minha senha
              </button>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                  {loading && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 inline-block ml-2"></div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
