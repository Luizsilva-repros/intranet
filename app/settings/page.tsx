"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentUser, getSettings, updateSettings, updateUser, type User, type Settings } from "@/lib/local-storage"
import { ArrowLeft, UserIcon, SettingsIcon, Palette, Save, CheckCircle, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettingsState] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Estados para formulários
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    department: "",
    title: "",
    password: "",
    confirmPassword: "",
  })

  const [settingsForm, setSettingsForm] = useState({
    company_name: "",
    primary_color: "",
    secondary_color: "",
    accent_color: "",
    logo_url: "",
  })

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    weekly_digest: false,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setUserForm({
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department || "",
      title: currentUser.title || "",
      password: "",
      confirmPassword: "",
    })

    const currentSettings = getSettings()
    setSettingsState(currentSettings)
    setSettingsForm({
      company_name: currentSettings.company_name,
      primary_color: currentSettings.primary_color,
      secondary_color: currentSettings.secondary_color,
      accent_color: currentSettings.accent_color,
      logo_url: currentSettings.logo_url || "",
    })

    setLoading(false)
  }, [router])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleUserUpdate = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Validar senhas se fornecidas
      if (userForm.password && userForm.password !== userForm.confirmPassword) {
        showMessage("As senhas não coincidem")
        setSaving(false)
        return
      }

      const updateData: Partial<User> = {
        name: userForm.name,
        email: userForm.email,
        department: userForm.department,
        title: userForm.title,
      }

      if (userForm.password) {
        updateData.password = userForm.password
      }

      updateUser(user.id, updateData)

      // Atualizar usuário logado
      const updatedUser = { ...user, ...updateData }
      setUser(updatedUser)
      localStorage.setItem("intranet_user", JSON.stringify(updatedUser))

      showMessage("Perfil atualizado com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleSettingsUpdate = async () => {
    if (user?.role !== "admin") {
      showMessage("Apenas administradores podem alterar configurações do sistema")
      return
    }

    setSaving(true)
    try {
      updateSettings(settingsForm)
      showMessage("Configurações atualizadas com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-red-500 rounded-lg flex items-center justify-center">
                <SettingsIcon className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-red-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                  {user.role === "admin" ? "Admin" : "Usuário"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message Alert */}
      {message && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Perfil do Usuário</span>
              </CardTitle>
              <CardDescription>Gerencie suas informações pessoais e credenciais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Cargo</Label>
                  <Input
                    id="title"
                    value={userForm.title}
                    onChange={(e) => setUserForm({ ...userForm, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        placeholder="Deixe em branco para manter a atual"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUserUpdate} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Perfil"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure como você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-gray-500">Receba comunicados importantes por email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email_notifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notificações Push</Label>
                  <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push_notifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push_notifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest">Resumo Semanal</Label>
                  <p className="text-sm text-gray-500">Receba um resumo das atividades da semana</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={notifications.weekly_digest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weekly_digest: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings - Only for Admins */}
          {user.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Configurações do Sistema</span>
                </CardTitle>
                <CardDescription>Configure a aparência e informações da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={settingsForm.company_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-url">URL do Logo</Label>
                  <Input
                    id="logo-url"
                    value={settingsForm.logo_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Cor Primária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={settingsForm.primary_color}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primary_color: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settingsForm.primary_color}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primary_color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Cor Secundária</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={settingsForm.secondary_color}
                        onChange={(e) => setSettingsForm({ ...settingsForm, secondary_color: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settingsForm.secondary_color}
                        onChange={(e) => setSettingsForm({ ...settingsForm, secondary_color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Cor de Destaque</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={settingsForm.accent_color}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accent_color: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settingsForm.accent_color}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accent_color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSettingsUpdate} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
