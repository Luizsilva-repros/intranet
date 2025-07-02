"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
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

  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    email: "",
    name: "",
    message: "",
  })
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")

  useEffect(() => {
    initializeData()

    // Carregar configurações
    const currentSettings = getSettings()
    setSettings(currentSettings)

    // Verificar se já está logado
    const savedUser = localStorage.getItem("intranet_user")
    if (savedUser) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    console.log(`🚀 Iniciando processo de login para: ${email}`)

    try {
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

      setSuccess(`Login realizado com sucesso! Bem-vindo, ${user.name}!`)

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error: any) {
      console.error(`❌ Erro no login:`, error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setRequestLoading(true)
    setRequestMessage("")
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setRequestMessage("Solicitação enviada! O administrador será notificado por email.")
      setRequestForm({ email: "", name: "", message: "" })
      setShowRequestForm(false)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setRequestLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Logo da empresa */}
          <div className="mx-auto mb-4 flex items-center justify-center">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url || "/placeholder.svg"}
                alt="Logo da empresa"
                className="h-16 w-auto max-w-[200px] object-contain"
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
              className={`h-12 w-12 items-center justify-center rounded-full bg-blue-100 ${
                settings?.logo_url ? "hidden" : "flex"
              }`}
              style={{ display: settings?.logo_url ? "none" : "flex" }}
            >
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">{settings?.company_name || "Intranet Corporativa"}</CardTitle>
          <CardDescription>Acesse com suas credenciais corporativas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={3}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Autenticando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRequestForm(!showRequestForm)}
                className="w-full"
              >
                Não tem acesso? Solicitar Autorização
              </Button>
            </div>

            {showRequestForm && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Solicitar Acesso</CardTitle>
                  <CardDescription>Preencha o formulário para solicitar acesso à intranet</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRequestAccess} className="space-y-4">
                    <div>
                      <Label htmlFor="request-email">Email Corporativo</Label>
                      <Input
                        id="request-email"
                        type="email"
                        placeholder="seu.email@empresa.com"
                        value={requestForm.email}
                        onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="request-name">Nome Completo</Label>
                      <Input
                        id="request-name"
                        placeholder="Seu nome completo"
                        value={requestForm.name}
                        onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="request-message">Justificativa (opcional)</Label>
                      <Textarea
                        id="request-message"
                        placeholder="Por que você precisa de acesso à intranet?"
                        value={requestForm.message}
                        onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {requestMessage && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{requestMessage}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={requestLoading}>
                      {requestLoading ? "Enviando..." : "Solicitar Acesso"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Apenas usuários autorizados podem acessar o sistema.</p>
            <p className="text-xs text-gray-500 mt-2">
              Problemas com login? Verifique se seu email está correto e se você foi cadastrado pelo administrador.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
