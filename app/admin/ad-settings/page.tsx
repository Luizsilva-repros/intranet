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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Settings,
  Shield,
  Server,
  Users,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  TestTube,
} from "lucide-react"
import Link from "next/link"
import {
  getADConfig,
  updateADConfig,
  testADConnection,
  searchADUsers,
  syncAllADUsers,
  type ADConfig,
} from "@/lib/auth-service"

export default function ADSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [adConfig, setAdConfig] = useState<ADConfig | null>(null)
  const [adUsers, setAdUsers] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("intranet_user")
    if (!savedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(savedUser)
      if (userData.role !== "admin") {
        router.push("/dashboard")
        return
      }
      setUser(userData)
      loadADConfig()
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const loadADConfig = async () => {
    const config = getADConfig()
    setAdConfig(config)

    if (config.enabled) {
      await testConnection()
      await loadADUsers()
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const result = await testADConnection()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: "Erro ao testar conexão",
      })
    } finally {
      setTesting(false)
    }
  }

  const loadADUsers = async () => {
    try {
      const users = await searchADUsers()
      setAdUsers(users)
    } catch (error) {
      console.error("Erro ao carregar usuários AD:", error)
    }
  }

  const handleSaveConfig = () => {
    if (!adConfig) return

    updateADConfig(adConfig)
    setMessage("Configurações do Active Directory salvas com sucesso!")
    setTimeout(() => setMessage(""), 3000)

    if (adConfig.enabled) {
      testConnection()
      loadADUsers()
    }
  }

  const handleSyncUsers = async () => {
    setSyncing(true)
    try {
      const result = await syncAllADUsers()
      setMessage(result.message)
      setTimeout(() => setMessage(""), 5000)
    } catch (error) {
      setMessage("Erro na sincronização de usuários")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando configurações do Active Directory...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Configurações Active Directory</h1>
            </div>
            <Badge variant="secondary">Admin: {user.name}</Badge>
          </div>
        </div>
      </header>

      {/* Message Alert */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários AD ({adUsers.length})
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Testes
            </TabsTrigger>
          </TabsList>

          {/* Configuração */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Configuração do Active Directory</span>
                </CardTitle>
                <CardDescription>Configure a integração com o Active Directory da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {adConfig && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ad-enabled"
                        checked={adConfig.enabled}
                        onCheckedChange={(checked) => setAdConfig({ ...adConfig, enabled: checked })}
                      />
                      <Label htmlFor="ad-enabled" className="font-medium">
                        Habilitar integração com Active Directory
                      </Label>
                    </div>

                    {adConfig.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="domain">Domínio</Label>
                          <Input
                            id="domain"
                            placeholder="empresa.com.br"
                            value={adConfig.domain}
                            onChange={(e) => setAdConfig({ ...adConfig, domain: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="server">Servidor LDAP</Label>
                          <Input
                            id="server"
                            placeholder="ldap://dc.empresa.com.br:389"
                            value={adConfig.server || ""}
                            onChange={(e) => setAdConfig({ ...adConfig, server: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="baseDN">Base DN</Label>
                          <Input
                            id="baseDN"
                            placeholder="DC=empresa,DC=com,DC=br"
                            value={adConfig.baseDN || ""}
                            onChange={(e) => setAdConfig({ ...adConfig, baseDN: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="adminUser">Usuário Admin (opcional)</Label>
                          <Input
                            id="adminUser"
                            placeholder="admin@empresa.com.br"
                            value={adConfig.adminUser || ""}
                            onChange={(e) => setAdConfig({ ...adConfig, adminUser: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
                      {adConfig.enabled && (
                        <Button variant="outline" onClick={testConnection} disabled={testing}>
                          {testing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Testando...
                            </>
                          ) : (
                            <>
                              <Server className="h-4 w-4 mr-2" />
                              Testar Conexão
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Status da Conexão */}
                    {connectionStatus && (
                      <Alert
                        className={
                          connectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                        }
                      >
                        {connectionStatus.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription className={connectionStatus.success ? "text-green-800" : "text-red-800"}>
                          {connectionStatus.message}
                          {connectionStatus.details && (
                            <div className="mt-2 text-sm">
                              <div>Servidor: {connectionStatus.details.server}</div>
                              <div>Domínio: {connectionStatus.details.domain}</div>
                              {connectionStatus.details.usersFound && (
                                <div>Usuários encontrados: {connectionStatus.details.usersFound}</div>
                              )}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuários AD */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Usuários do Active Directory</span>
                  </div>
                  <Button onClick={handleSyncUsers} disabled={syncing || !adConfig?.enabled}>
                    {syncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Sincronizar Usuários
                      </>
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Lista de usuários encontrados no Active Directory
                  {!adConfig?.enabled && " (Integração AD desabilitada)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!adConfig?.enabled ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Habilite a integração AD para ver os usuários</p>
                  </div>
                ) : adUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Nenhum usuário encontrado no Active Directory</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adUsers.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{user.displayName}</h3>
                              {user.role === "admin" && <Badge variant="destructive">Admin</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.department && (
                              <p className="text-sm text-gray-500">
                                {user.department} {user.title && `- ${user.title}`}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {user.groups.map((group: string) => (
                                <Badge key={group} variant="secondary" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testes */}
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Testes de Integração</span>
                </CardTitle>
                <CardDescription>Teste a conectividade e funcionalidades do Active Directory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={testConnection} disabled={testing || !adConfig?.enabled}>
                    {testing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Server className="h-4 w-4 mr-2" />
                    )}
                    Testar Conexão LDAP
                  </Button>

                  <Button variant="outline" onClick={loadADUsers} disabled={!adConfig?.enabled}>
                    <Users className="h-4 w-4 mr-2" />
                    Buscar Usuários
                  </Button>

                  <Button variant="outline" onClick={handleSyncUsers} disabled={syncing || !adConfig?.enabled}>
                    {syncing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Sincronizar Usuários
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      // Simular teste de autenticação
                      setMessage("Teste de autenticação: Use o login normal para testar")
                      setTimeout(() => setMessage(""), 3000)
                    }}
                    disabled={!adConfig?.enabled}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Testar Autenticação
                  </Button>
                </div>

                {/* Informações de teste */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Como testar:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>1. Configure o servidor LDAP e domínio</div>
                    <div>2. Teste a conexão com o botão acima</div>
                    <div>3. Sincronize os usuários do AD</div>
                    <div>4. Faça logout e teste o login com credenciais AD</div>
                    <div>5. Verifique se os grupos foram mapeados corretamente</div>
                  </div>
                </div>

                {/* Credenciais de teste */}
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">🧪 Credenciais de Teste (Simulação):</h4>
                  <div className="text-sm text-yellow-800 space-y-1">
                    <div>• luiz.silva@repros.com.br / luiz123 (Admin)</div>
                    <div>• maria.santos@repros.com.br / maria123 (RH)</div>
                    <div>• joao.silva@repros.com.br / joao123 (TI Admin)</div>
                    <div>• ana.costa@repros.com.br / ana123 (Financeiro)</div>
                    <div>• carlos.oliveira@repros.com.br / carlos123 (Vendas)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
