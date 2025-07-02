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
  Calendar,
  Settings,
  LogOut,
  Plus,
  FileText,
  Users,
  LinkIcon,
  Info,
  Star,
  Clock,
  Zap,
  Globe,
  Shield,
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
  formatTimeAgo,
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
  const [favoriteLinks, setFavoriteLinks] = useState<string[]>([])
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

      // Carregar favoritos do localStorage
      const savedFavorites = localStorage.getItem(`favorites_${userData.id}`)
      if (savedFavorites) {
        setFavoriteLinks(JSON.parse(savedFavorites))
      }
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

  const toggleFavorite = (linkId: string) => {
    if (!user) return

    const newFavorites = favoriteLinks.includes(linkId)
      ? favoriteLinks.filter((id) => id !== linkId)
      : [...favoriteLinks, linkId]

    setFavoriteLinks(newFavorites)
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites))
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
                  {user.last_login && (
                    <span className="text-xs text-gray-500">Último login: {formatTimeAgo(user.last_login)}</span>
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
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Usuários:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.users}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Grupos:</span>
                    <span className="ml-1 text-blue-900">{systemInfo.dataCount.groups}</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sistemas Corporativos</h3>
                <p className="text-sm text-gray-600">Acesse os sistemas e ferramentas da empresa</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Star className="h-3 w-3 mr-1" />
                  {favoriteLinks.length} Favoritos
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Globe className="h-3 w-3 mr-1" />
                  {links.length} Sistemas
                </Badge>
              </div>
            </div>

            {/* Links Favoritos */}
            {favoriteLinks.length > 0 && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-yellow-800">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span>Seus Favoritos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {links
                      .filter((link) => favoriteLinks.includes(link.id))
                      .map((link) => (
                        <div
                          key={link.id}
                          className="group relative bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-yellow-200 hover:border-yellow-300 hover:bg-white transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-lg shadow-md">
                              {link.icon || "🔗"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate group-hover:text-yellow-700 transition-colors">
                                {link.title}
                              </h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(link.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </Button>
                          </div>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none hover:from-yellow-500 hover:to-orange-600"
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Acessar
                            </Button>
                          </a>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"
                              style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                            >
                              {category.icon || "📁"}
                            </div>
                            <div>
                              <span className="text-lg font-bold text-gray-900">{category.name}</span>
                              <Badge variant="secondary" className="ml-3">
                                {categoryLinks.length} {categoryLinks.length === 1 ? "sistema" : "sistemas"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Shield className="h-3 w-3 mr-1" />
                              Autorizado
                            </Badge>
                          </div>
                        </div>
                        {category.description && (
                          <CardDescription className="text-gray-600 font-medium">
                            {category.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {categoryLinks.map((link) => (
                            <div
                              key={link.id}
                              className="group relative p-5 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-lg"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="relative">
                                  <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg shadow-md group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: category.color }}
                                  >
                                    {link.icon || "🔗"}
                                  </div>
                                  <div className="absolute -top-1 -right-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleFavorite(link.id)}
                                      className="w-6 h-6 p-0 rounded-full bg-white shadow-sm hover:bg-yellow-50 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                      <Star
                                        className={`h-3 w-3 ${
                                          favoriteLinks.includes(link.id)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-400"
                                        }`}
                                      />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 truncate text-lg group-hover:text-blue-600 transition-colors mb-1">
                                    {link.title}
                                  </h4>
                                  {link.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{link.description}</p>
                                  )}

                                  <div className="flex items-center space-x-2 mb-3">
                                    <Badge variant="outline" className="text-xs">
                                      <Globe className="h-3 w-3 mr-1" />
                                      Sistema Web
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      24/7
                                    </Badge>
                                  </div>

                                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 bg-transparent"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Acessar Sistema
                                      <Zap className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                  </a>
                                </div>
                              </div>
                            </div>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ramal encontrado</h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? "Tente ajustar os termos da busca." : "Não há ramais cadastrados no momento."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {Object.entries(extensionsByDepartment).map(([department, deptExtensions]) => {
                  // Cores para diferentes departamentos
                  const departmentColors = {
                    Administração: {
                      bg: "from-purple-100 to-purple-200",
                      icon: "text-purple-600",
                      border: "border-purple-200",
                    },
                    "Recursos Humanos": {
                      bg: "from-green-100 to-green-200",
                      icon: "text-green-600",
                      border: "border-green-200",
                    },
                    TI: { bg: "from-blue-100 to-blue-200", icon: "text-blue-600", border: "border-blue-200" },
                    Financeiro: {
                      bg: "from-yellow-100 to-yellow-200",
                      icon: "text-yellow-600",
                      border: "border-yellow-200",
                    },
                    Vendas: { bg: "from-red-100 to-red-200", icon: "text-red-600", border: "border-red-200" },
                    Marketing: { bg: "from-pink-100 to-pink-200", icon: "text-pink-600", border: "border-pink-200" },
                    Suporte: {
                      bg: "from-indigo-100 to-indigo-200",
                      icon: "text-indigo-600",
                      border: "border-indigo-200",
                    },
                    Jurídico: { bg: "from-gray-100 to-gray-200", icon: "text-gray-600", border: "border-gray-200" },
                    Faturamento: {
                      bg: "from-orange-100 to-orange-200",
                      icon: "text-orange-600",
                      border: "border-orange-200",
                    },
                  }

                  const colors = departmentColors[department as keyof typeof departmentColors] || departmentColors["TI"]

                  return (
                    <Card
                      key={department}
                      className={`border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <CardHeader className={`bg-gradient-to-r ${colors.bg} rounded-t-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md`}
                            >
                              <Users className={`h-5 w-5 ${colors.icon}`} />
                            </div>
                            <div>
                              <span className={`text-lg font-bold ${colors.icon}`}>{department}</span>
                              <Badge variant="secondary" className="ml-3 bg-white/80 text-gray-700">
                                {deptExtensions.length} {deptExtensions.length === 1 ? "pessoa" : "pessoas"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                          {deptExtensions.map((ext) => (
                            <div
                              key={ext.id}
                              className="group p-5 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-lg"
                            >
                              <div className="flex items-start space-x-4">
                                {/* Avatar com iniciais */}
                                <div className="relative">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white font-bold text-lg">
                                      {ext.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 truncate text-lg group-hover:text-blue-600 transition-colors">
                                    {ext.name}
                                  </h4>
                                  {ext.position && (
                                    <p className="text-sm text-gray-600 truncate font-medium mb-3">{ext.position}</p>
                                  )}

                                  <div className="space-y-2">
                                    {/* Ramal */}
                                    <div className="flex items-center space-x-3 group/item hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                                        <Phone className="h-4 w-4 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-mono text-sm font-bold text-gray-900">
                                          {ext.extension}
                                        </span>
                                        <p className="text-xs text-gray-500">Ramal interno</p>
                                      </div>
                                    </div>

                                    {/* Email */}
                                    {ext.email && (
                                      <div className="flex items-center space-x-3 group/item hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                                          <Mail className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <a
                                            href={`mailto:${ext.email}`}
                                            className="text-sm text-blue-600 hover:text-blue-800 truncate block font-medium hover:underline"
                                          >
                                            {ext.email}
                                          </a>
                                          <p className="text-xs text-gray-500">Email corporativo</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Celular */}
                                    {ext.mobile && (
                                      <div className="flex items-center space-x-3 group/item hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                                          <Smartphone className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <a
                                            href={`tel:${ext.mobile}`}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline"
                                          >
                                            {ext.mobile}
                                          </a>
                                          <p className="text-xs text-gray-500">Celular</p>
                                        </div>
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
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
