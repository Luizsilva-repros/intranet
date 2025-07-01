"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  ExternalLink,
  Search,
  Phone,
  Mail,
  Smartphone,
  User,
  Calendar,
  Settings,
  LogOut,
  Plus,
  FileText,
  Users,
  LinkIcon,
  Info,
} from "lucide-react"
import {
  initializeData,
  getCategoriesForUser,
  getLinksForUser,
  getPublishedPosts,
  getExtensions,
  getSettings,
  getSystemInfo,
  resetAllData,
  getPostTypeIcon,
  getPostTypeName,
  getPriorityColor,
  type User as UserType,
  type Category,
  type Link,
  type Post,
  type Extension,
  type Settings as SettingsType,
} from "@/lib/local-storage"

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const [systemInfo, setSystemInfo] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    initializeData()

    const savedUser = localStorage.getItem("intranet_user")
    if (!savedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(savedUser)
      setUser(userData)

      const userCategories = getCategoriesForUser(userData)
      const userLinks = getLinksForUser(userData)
      const publishedPosts = getPublishedPosts()
      const allExtensions = getExtensions()
      const appSettings = getSettings()
      const sysInfo = getSystemInfo()

      setCategories(userCategories)
      setLinks(userLinks)
      setPosts(publishedPosts)
      setExtensions(allExtensions)
      setSettings(appSettings)
      setSystemInfo(sysInfo)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty("--primary-color", settings.primary_color)
      document.documentElement.style.setProperty("--secondary-color", settings.secondary_color)
      document.documentElement.style.setProperty("--accent-color", settings.accent_color)
    }
  }, [settings])

  const handleLogout = () => {
    localStorage.removeItem("intranet_user")
    router.push("/login")
  }

  const handleAdminPanel = () => {
    router.push("/admin")
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "agora"
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`
  }

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const filteredExtensions = extensions.filter(
    (ext) =>
      ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.extension.includes(searchTerm) ||
      (ext.position && ext.position.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const extensionsByDepartment = filteredExtensions.reduce(
    (acc, ext) => {
      if (!acc[ext.department]) {
        acc[ext.department] = []
      }
      acc[ext.department].push(ext)
      return acc
    },
    {} as Record<string, Extension[]>,
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url || "/placeholder.svg"}
                alt="Logo"
                className="object-contain rounded-lg h-20 w-36"
              />
            ) : (
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{settings?.company_name || "Intranet Corporativa"}</h1>
              {systemInfo && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {systemInfo.isInitialized ? "✅ Ativo" : "⚠️ Inicializando"}
                  </Badge>
                  {systemInfo.initDate && (
                    <span className="text-xs text-gray-500">
                      Desde {systemInfo.initDate.toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                {user.role === "admin" && (
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {user.role === "admin" && (
              <Button variant="outline" size="sm" onClick={handleAdminPanel}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            {user.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm("⚠️ Resetar todos os dados? Isso irá recarregar a página e apagar TUDO!")) {
                    resetAllData()
                  }
                }}
              >
                🔄 Reset
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo, {user.name}!</h2>
          <p className="text-gray-600">Fique por dentro das novidades da empresa e acesse os sistemas corporativos.</p>

          {/* Info do Sistema para Admins */}
          {user.role === "admin" && systemInfo && (
            <Card className="mt-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Status do Sistema</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Usuários:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.users}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Categorias:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.categories}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Links:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.links}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Posts:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.posts}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Ramais:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.extensions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Feed de Notícias</span>
              <Badge variant="secondary" className="ml-2">
                {posts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="portals" className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4" />
              <span>Portais</span>
              <Badge variant="secondary" className="ml-2">
                {links.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="extensions" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Ramais</span>
              <Badge variant="secondary" className="ml-2">
                {extensions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Últimas Atualizações</h3>
                <p className="text-sm text-gray-600">Novidades, eventos e comunicados da empresa</p>
              </div>
              {user.role === "admin" && (
                <Button onClick={() => router.push("/admin/posts")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Publicação
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma publicação encontrada</h3>
                    <p className="text-gray-600 text-center">
                      Não há publicações ativas no momento. Volte mais tarde para ver as novidades!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getPostTypeIcon(post.type)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Badge variant="outline" style={{ borderColor: getPriorityColor(post.priority) }}>
                                {getPostTypeName(post.type)}
                              </Badge>
                              <span>•</span>
                              <span>Usuário</span>
                              <span>•</span>
                              <span>{formatTimeAgo(post.published_at || post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="text-center space-y-4">
                      {post.image_url && (
                        <div className="flex justify-center mb-4">
                          <img
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.title}
                            className="max-w-sm max-h-80 w-auto h-auto object-contain rounded-lg shadow-sm border"
                            style={{ maxWidth: "400px", maxHeight: "600px" }}
                          />
                        </div>
                      )}

                      <div className="text-center">
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      </div>

                      {post.expires_at && (
                        <div className="flex justify-center pt-2 border-t border-gray-100">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Válido até: {formatExpiryDate(post.expires_at)}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="portals" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistemas Corporativos</h3>
              <p className="text-sm text-gray-600">Acesse os sistemas e ferramentas da empresa</p>
            </div>

            {categories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <LinkIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum portal disponível</h3>
                  <p className="text-gray-600 text-center">
                    Você não tem acesso a nenhum portal no momento. Entre em contato com o administrador.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {categories.map((category) => {
                  const categoryLinks = links.filter((link) => link.category_id === category.id)

                  if (categoryLinks.length === 0) return null

                  return (
                    <Card key={category.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                          <Badge variant="secondary">{categoryLinks.length}</Badge>
                        </CardTitle>
                        {category.description && <CardDescription>{category.description}</CardDescription>}
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {categoryLinks.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                                  {link.title}
                                </h4>
                                {link.description && (
                                  <p className="text-sm text-gray-600 truncate">{link.description}</p>
                                )}
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 ml-2 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="extensions" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lista de Ramais</h3>
                <p className="text-sm text-gray-600">Contatos internos da empresa</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, departamento ou ramal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
            </div>

            {Object.keys(extensionsByDepartment).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Phone className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ramal encontrado</h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? "Tente ajustar os termos da busca." : "Não há ramais cadastrados no momento."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {Object.entries(extensionsByDepartment).map(([department, deptExtensions]) => (
                  <Card key={department}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>{department}</span>
                        <Badge variant="secondary">{deptExtensions.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {deptExtensions.map((ext) => (
                          <div
                            key={ext.id}
                            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  <User className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{ext.name}</h4>
                                {ext.position && <p className="text-sm text-gray-600 truncate">{ext.position}</p>}
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span className="font-mono">{ext.extension}</span>
                                  </div>
                                  {ext.email && (
                                    <div className="flex items-center space-x-2 text-sm">
                                      <Mail className="h-3 w-3 text-gray-400" />
                                      <a
                                        href={`mailto:${ext.email}`}
                                        className="text-blue-600 hover:text-blue-800 truncate"
                                      >
                                        {ext.email}
                                      </a>
                                    </div>
                                  )}
                                  {ext.mobile && (
                                    <div className="flex items-center space-x-2 text-sm">
                                      <Smartphone className="h-3 w-3 text-gray-400" />
                                      <a href={`tel:${ext.mobile}`} className="text-blue-600 hover:text-blue-800">
                                        {ext.mobile}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
