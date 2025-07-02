"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getUsers,
  getGroups,
  getCategories,
  getLinksForUser,
  getCategoriesForUser,
  getPublishedPosts,
  getExtensions,
  getSettings,
  initializeData,
  formatTimeAgo,
} from "@/lib/local-storage"
import type { User, Category, Link as LinkType, Post, Extension, Settings } from "@/lib/local-storage"
import {
  ExternalLink,
  SettingsIcon,
  Users,
  FolderOpen,
  FileText,
  Phone,
  Star,
  StarOff,
  Clock,
  TrendingUp,
  Shield,
  Calendar,
  Bell,
  Search,
  MessageSquare,
  Eye,
  ChevronRight,
  Building2,
  Mail,
  Briefcase,
} from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [links, setLinks] = useState<LinkType[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()

  // Estados para estatísticas (apenas para admins)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalCategories: 0,
    totalLinks: 0,
    totalPosts: 0,
    totalExtensions: 0,
  })

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
      loadData(userData)
      loadFavorites()
      loadStats()
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
      localStorage.removeItem("intranet_user")
      router.push("/login")
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  const loadData = (userData: User) => {
    setCategories(getCategoriesForUser(userData))
    setLinks(getLinksForUser(userData))
    setPosts(getPublishedPosts())
    setExtensions(getExtensions())
    setSettings(getSettings())
  }

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("intranet_favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }

  const loadStats = () => {
    setStats({
      totalUsers: getUsers().length,
      totalGroups: getGroups().length,
      totalCategories: getCategories().length,
      totalLinks: getLinksForUser({ role: "admin" } as User).length,
      totalPosts: getPublishedPosts().length,
      totalExtensions: getExtensions().length,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("intranet_user")
    router.push("/login")
  }

  const toggleFavorite = (linkId: string) => {
    const newFavorites = favorites.includes(linkId) ? favorites.filter((id) => id !== linkId) : [...favorites, linkId]

    setFavorites(newFavorites)
    localStorage.setItem("intranet_favorites", JSON.stringify(newFavorites))
  }

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || link.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const favoriteLinks = links.filter((link) => favorites.includes(link.id))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getPostTypeIcon = (type: Post["type"]) => {
    const icons = {
      news: "📰",
      event: "📅",
      announcement: "📢",
      birthday: "🎂",
      general: "📄",
      departure: "👋",
    }
    return icons[type] || "📄"
  }

  const getPriorityColor = (priority: Post["priority"]) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[priority] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {settings?.logo_url ? (
                <img src={settings.logo_url || "/placeholder.svg"} alt="Logo" className="h-8 w-auto" />
              ) : (
                <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{settings?.company_name || "Intranet Corporativa"}</h1>
                <p className="text-sm text-gray-600">Portal Corporativo</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Informações do usuário */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {user.role === "admin" && <Shield className="h-3 w-3" />}
                    <span className="capitalize">{user.role}</span>
                    {user.lastLogin && (
                      <>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(user.lastLogin)}</span>
                      </>
                    )}
                  </div>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                {user.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Coluna Principal - Links e Categorias */}
          <div className="lg:col-span-3 space-y-8">
            {/* Estatísticas para Admins */}
            {user.role === "admin" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Usuários</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Grupos</p>
                        <p className="text-2xl font-bold">{stats.totalGroups}</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Categorias</p>
                        <p className="text-2xl font-bold">{stats.totalCategories}</p>
                      </div>
                      <FolderOpen className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Links</p>
                        <p className="text-2xl font-bold">{stats.totalLinks}</p>
                      </div>
                      <ExternalLink className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-100 text-sm">Posts</p>
                        <p className="text-2xl font-bold">{stats.totalPosts}</p>
                      </div>
                      <FileText className="h-8 w-8 text-pink-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-teal-100 text-sm">Ramais</p>
                        <p className="text-2xl font-bold">{stats.totalExtensions}</p>
                      </div>
                      <Phone className="h-8 w-8 text-teal-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Seção de Favoritos */}
            {favoriteLinks.length > 0 && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Star className="h-5 w-5 fill-current" />
                    Meus Favoritos
                  </CardTitle>
                  <CardDescription className="text-yellow-700">Links que você marcou como favoritos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteLinks.map((link) => {
                      const category = categories.find((c) => c.id === link.category_id)
                      return (
                        <div
                          key={link.id}
                          className="group relative bg-white rounded-lg border border-yellow-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold text-white shadow-sm"
                                style={{ backgroundColor: category?.color || "#6B7280" }}
                              >
                                {link.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {link.name}
                                </h3>
                                {link.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2">{link.description}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(link.id)
                              }}
                              className="text-yellow-500 hover:text-yellow-600 transition-colors"
                            >
                              <Star className="h-4 w-4 fill-current" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            {category && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                  borderColor: `${category.color}40`,
                                }}
                              >
                                {category.name}
                              </Badge>
                            )}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Busca e Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar links e sistemas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Todas
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        style={{
                          backgroundColor: selectedCategory === category.id ? category.color : undefined,
                          borderColor: category.color,
                          color: selectedCategory === category.id ? "white" : category.color,
                        }}
                      >
                        {category.icon} {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de Links por Categoria */}
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryLinks = filteredLinks.filter((link) => link.category_id === category.id)
                if (categoryLinks.length === 0) return null

                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader
                      className="text-white"
                      style={{
                        background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                      }}
                    >
                      <CardTitle className="flex items-center gap-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <h2 className="text-xl font-bold">{category.name}</h2>
                          {category.description && <p className="text-white/90 text-sm">{category.description}</p>}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryLinks.map((link) => (
                          <div
                            key={link.id}
                            className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 hover:border-blue-300"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold text-white shadow-sm"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {link.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                    {link.name}
                                  </h3>
                                  {link.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">{link.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    toggleFavorite(link.id)
                                  }}
                                  className={`transition-colors ${
                                    favorites.includes(link.id)
                                      ? "text-yellow-500 hover:text-yellow-600"
                                      : "text-gray-400 hover:text-yellow-500"
                                  }`}
                                >
                                  {favorites.includes(link.id) ? (
                                    <Star className="h-4 w-4 fill-current" />
                                  ) : (
                                    <StarOff className="h-4 w-4" />
                                  )}
                                </button>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {link.groups?.join(", ") || "Geral"}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                <Eye className="h-3 w-3 inline mr-1" />
                                Acessar
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

            {filteredLinks.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <ExternalLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum link encontrado</h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Tente ajustar sua busca ou filtros" : "Não há links disponíveis para seu perfil"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Posts e Ramais */}
          <div className="space-y-6">
            {/* Posts Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Comunicados
                </CardTitle>
                <CardDescription>Últimas atualizações e notícias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="border-l-4 pl-4 py-2" style={{ borderColor: "#3B82F6" }}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-3 mt-1">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getPriorityColor(post.priority)}`}>{post.priority}</Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(post.published_at || post.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Nenhum comunicado disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ramais Rápidos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Ramais
                </CardTitle>
                <CardDescription>Contatos internos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {extensions.slice(0, 8).map((extension) => (
                  <div key={extension.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                          {getInitials(extension.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{extension.name}</p>
                        <p className="text-xs text-gray-600">{extension.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-blue-600">{extension.extension}</p>
                      {extension.email && (
                        <a href={`mailto:${extension.email}`} className="text-xs text-gray-500 hover:text-blue-600">
                          <Mail className="h-3 w-3 inline mr-1" />
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {extensions.length === 0 && (
                  <div className="text-center py-8">
                    <Phone className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Nenhum ramal cadastrado</p>
                  </div>
                )}
                {extensions.length > 8 && (
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    Ver todos os ramais
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Suporte Técnico
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agenda Corporativa
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Portal RH
                </Button>
                {user.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => router.push("/admin/posts")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Criar Comunicado
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
