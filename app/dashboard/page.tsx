"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getCategoriesForUser,
  getLinksForUser,
  getPublishedPosts,
  getExtensions,
  getSettings,
  initializeData,
  formatTimeAgo,
} from "@/lib/local-storage"
import type { User, Category, Link, Post, Extension, Settings } from "@/lib/local-storage"
import {
  ExternalLink,
  FileText,
  Phone,
  Search,
  Star,
  StarOff,
  Clock,
  Calendar,
  Users,
  SettingsIcon,
  LogOut,
  Shield,
  Building2,
  Grid3X3,
  List,
  Filter,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()

  useEffect(() => {
    loadDashboard()
  }, [router])

  const loadDashboard = async () => {
    try {
      console.log("🔄 Carregando dashboard...")

      // Inicializar dados se necessário
      initializeData()

      // Verificar usuário logado
      const savedUser = localStorage.getItem("intranet_user")
      if (!savedUser) {
        console.log("❌ Usuário não encontrado, redirecionando para login")
        router.replace("/login")
        return
      }

      const userData = JSON.parse(savedUser)
      console.log("✅ Usuário encontrado:", userData.name)
      setUser(userData)

      // Carregar dados baseados no usuário
      console.log("📊 Carregando dados do sistema...")

      const userCategories = getCategoriesForUser(userData)
      const userLinks = getLinksForUser(userData)
      const publishedPosts = getPublishedPosts()
      const allExtensions = getExtensions()
      const currentSettings = getSettings()

      setCategories(userCategories)
      setLinks(userLinks)
      setPosts(publishedPosts)
      setExtensions(allExtensions)
      setSettings(currentSettings)

      // Carregar favoritos do localStorage
      const savedFavorites = localStorage.getItem(`favorites_${userData.id}`)
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }

      console.log("✅ Dashboard carregado com sucesso:", {
        categorias: userCategories.length,
        links: userLinks.length,
        posts: publishedPosts.length,
        extensions: allExtensions.length,
      })
    } catch (error) {
      console.error("❌ Erro ao carregar dashboard:", error)
      // Em caso de erro, redirecionar para login
      router.replace("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("intranet_user")
    router.replace("/login")
  }

  const toggleFavorite = (linkId: string) => {
    const newFavorites = favorites.includes(linkId) ? favorites.filter((id) => id !== linkId) : [...favorites, linkId]

    setFavorites(newFavorites)
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites))
    }
  }

  const filteredExtensions = extensions.filter(
    (ext) =>
      ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.extension.includes(searchTerm),
  )

  const groupedExtensions = filteredExtensions.reduce(
    (acc, ext) => {
      if (!acc[ext.department]) {
        acc[ext.department] = []
      }
      acc[ext.department].push(ext)
      return acc
    },
    {} as Record<string, Extension[]>,
  )

  const favoriteLinks = links.filter((link) => favorites.includes(link.id))

  // Filtrar links por busca e categoria
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || link.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Moderno */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                {settings?.logo_url ? (
                  <img
                    src={settings.logo_url || "/placeholder.svg"}
                    alt="Logo"
                    className="h-10 w-auto max-w-[150px] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                ) : null}
                <div
                  className={`h-10 w-10 items-center justify-center rounded bg-blue-100 ${
                    settings?.logo_url ? "hidden" : "flex"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">INTRANET</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                  {user.last_login && (
                    <div className="flex items-center space-x-1">
                      <span>•</span>
                      <span>Último acesso: {formatTimeAgo(user.last_login)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  {user.role === "admin" && (
                    <Badge variant="destructive" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>

              <div className="flex items-center space-x-2">
                {user.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Bem-vindo, {user.name.split(" ")[0]}! 👋</h2>
                <p className="text-blue-100 text-lg">
                  Acesse rapidamente os sistemas corporativos e fique por dentro das novidades da empresa.
                </p>
              </div>
              <div className="hidden md:block">
                <Sparkles className="h-16 w-16 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger
              value="portals"
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Sistemas</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {links.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              <span>Notícias</span>
              {posts.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {posts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="extensions"
              className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Phone className="h-4 w-4" />
              <span>Ramais</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {extensions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Sistemas Corporativos */}
          <TabsContent value="portals" className="space-y-8">
            {/* Header com controles modernos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sistemas Corporativos</h3>
                  <p className="text-gray-600">Acesse rapidamente os sistemas e ferramentas da empresa</p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Busca */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar sistemas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                  </div>

                  {/* Controles de visualização */}
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <Badge variant="outline" className="bg-white">
                    {filteredLinks.length} sistemas
                  </Badge>
                </div>
              </div>

              {/* Filtros por categoria */}
              <div className="flex gap-2 flex-wrap mt-6">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="bg-white border-gray-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-white border-gray-200"
                    style={{
                      backgroundColor: selectedCategory === category.id ? category.color : "white",
                      borderColor: category.color,
                      color: selectedCategory === category.id ? "white" : category.color,
                    }}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Seção de Favoritos */}
            {favoriteLinks.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-yellow-900">Acesso Rápido</h4>
                      <p className="text-yellow-700">Seus sistemas favoritos</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-200 text-yellow-800">{favoriteLinks.length} favoritos</Badge>
                </div>

                <div
                  className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}
                >
                  {favoriteLinks.map((link) => {
                    const category = categories.find((cat) => cat.id === link.category_id)
                    return (
                      <div
                        key={link.id}
                        className={`group relative bg-white rounded-xl border-2 border-yellow-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                          viewMode === "list" ? "flex items-center space-x-4" : ""
                        }`}
                        onClick={() => window.open(link.url, "_blank")}
                      >
                        <div
                          className={`flex ${viewMode === "list" ? "items-center space-x-4 flex-1" : "flex-col items-center text-center space-y-3"}`}
                        >
                          {/* Ícone/Imagem */}
                          <div
                            className={`${viewMode === "list" ? "w-12 h-12" : "w-16 h-16"} rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white border-2 border-yellow-200`}
                          >
                            {link.image_url ? (
                              <img
                                src={link.image_url || "/placeholder.svg"}
                                alt={link.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className={`${viewMode === "list" ? "text-xl" : "text-2xl"}`}>
                                {link.icon || "🔗"}
                              </span>
                            )}
                          </div>

                          <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                            <h5
                              className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors ${
                                viewMode === "list" ? "text-base" : "text-sm"
                              }`}
                            >
                              {link.name}
                            </h5>
                            {link.description && (
                              <p
                                className={`text-gray-600 ${viewMode === "list" ? "text-sm mt-1" : "text-xs mt-1"} line-clamp-2`}
                              >
                                {link.description}
                              </p>
                            )}
                            {category && (
                              <Badge
                                variant="secondary"
                                className="text-xs mt-2"
                                style={{ backgroundColor: category.color + "20", color: category.color }}
                              >
                                {category.name}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div
                          className={`${viewMode === "list" ? "flex items-center space-x-2" : "absolute top-2 right-2"}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(link.id)
                            }}
                            className="text-yellow-500 hover:text-yellow-600"
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                          {viewMode === "list" && (
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sistemas por Categoria */}
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryLinks = filteredLinks.filter((link) => link.category_id === category.id)
                if (categoryLinks.length === 0) return null

                return (
                  <div key={category.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div
                      className="p-6 text-white relative"
                      style={{
                        background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white/20 rounded-xl">
                            <span className="text-3xl">{category.icon}</span>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold">{category.name}</h4>
                            {category.description && <p className="text-white/90 mt-1">{category.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {categoryLinks.length} sistemas
                          </Badge>
                          <TrendingUp className="h-6 w-6 text-white/80" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div
                        className={`grid gap-4 ${
                          viewMode === "grid"
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-1"
                        }`}
                      >
                        {categoryLinks.map((link) => (
                          <div
                            key={link.id}
                            className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-300 ${
                              viewMode === "list" ? "flex items-center space-x-4" : ""
                            }`}
                            onClick={() => window.open(link.url, "_blank")}
                          >
                            <div
                              className={`flex ${viewMode === "list" ? "items-center space-x-4 flex-1" : "flex-col items-center text-center space-y-3"}`}
                            >
                              {/* Ícone/Imagem */}
                              <div
                                className={`${viewMode === "list" ? "w-12 h-12" : "w-16 h-16"} rounded-xl flex items-center justify-center shadow-sm overflow-hidden border`}
                                style={{ backgroundColor: category.color + "10", borderColor: category.color + "30" }}
                              >
                                {link.image_url ? (
                                  <img
                                    src={link.image_url || "/placeholder.svg"}
                                    alt={link.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className={`${viewMode === "list" ? "text-xl" : "text-2xl"}`}>
                                    {link.icon || "🔗"}
                                  </span>
                                )}
                              </div>

                              <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                                <h5
                                  className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors ${
                                    viewMode === "list" ? "text-base" : "text-sm"
                                  }`}
                                >
                                  {link.name}
                                </h5>
                                {link.description && (
                                  <p
                                    className={`text-gray-600 ${viewMode === "list" ? "text-sm mt-1" : "text-xs mt-1"} line-clamp-2`}
                                  >
                                    {link.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div
                              className={`${viewMode === "list" ? "flex items-center space-x-2" : "absolute top-2 right-2"}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(link.id)
                                }}
                                className={
                                  favorites.includes(link.id)
                                    ? "text-yellow-500 hover:text-yellow-600"
                                    : "text-gray-400 hover:text-yellow-500"
                                }
                              >
                                {favorites.includes(link.id) ? (
                                  <Star className="h-4 w-4 fill-current" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </Button>
                              {viewMode === "list" && (
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {/* Indicador de acesso rápido */}
                            {viewMode === "grid" && (
                              <div className="absolute bottom-2 left-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Zap className="h-3 w-3" />
                                  <span>Clique para acessar</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredLinks.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                <ExternalLink className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhum sistema encontrado" : "Nenhum sistema disponível"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Tente ajustar sua busca ou filtros"
                    : "Você não tem acesso a nenhum sistema no momento"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory(null)
                    }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Feed de Notícias */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Últimas Notícias</h3>
              <Badge variant="outline">{posts.length} publicações</Badge>
            </div>

            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia disponível</h3>
                  <p className="text-gray-600">Aguarde novas publicações da empresa.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {post.image_url && (
                          <div className="flex-shrink-0">
                            <img
                              src={post.image_url || "/placeholder.svg"}
                              alt={post.title}
                              className="w-24 h-32 object-cover rounded-lg border shadow-sm"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                            <Badge variant="outline">{post.type}</Badge>
                            {post.priority === "high" && <Badge variant="destructive">Urgente</Badge>}
                          </div>
                          <div className="prose prose-sm max-w-none text-gray-700">
                            {post.content.split("\n").map((line, index) => (
                              <p key={index} className="mb-2">
                                {line}
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR")}</span>
                            </div>
                            {post.expires_at && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>Expira em {new Date(post.expires_at).toLocaleDateString("pt-BR")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ramais */}
          <TabsContent value="extensions" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold">Diretório de Ramais</h3>
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

            {Object.keys(groupedExtensions).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "Nenhum resultado encontrado" : "Nenhum ramal cadastrado"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Tente buscar com outros termos." : "Aguarde o cadastro dos ramais."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedExtensions).map(([department, deptExtensions]) => (
                  <div key={department}>
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{department}</h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {deptExtensions.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {deptExtensions.map((extension) => (
                        <Card key={extension.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                                  {extension.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-900 truncate">{extension.name}</h5>
                                {extension.position && (
                                  <p className="text-sm text-gray-600 truncate">{extension.position}</p>
                                )}
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="font-mono font-medium">{extension.extension}</span>
                                  </div>
                                  {extension.email && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <span>📧</span>
                                      <span className="truncate">{extension.email}</span>
                                    </div>
                                  )}
                                  {extension.mobile && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <span>📱</span>
                                      <span>{extension.mobile}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
