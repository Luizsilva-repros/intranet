"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const router = useRouter()

  // Estados para estatísticas (apenas para admins)
  const [stats, setStats] = useState({
    totalUsers: 0,
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

      // Carregar dados baseados no usuário
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

      // Se for admin, carregar estatísticas
      if (userData.role === "admin") {
        const { getUsers, getCategories, getLinks, getPosts, getExtensions } = require("@/lib/local-storage")
        setStats({
          totalUsers: getUsers().length,
          totalCategories: getCategories().length,
          totalLinks: getLinks().length,
          totalPosts: getPosts().length,
          totalExtensions: getExtensions().length,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      localStorage.removeItem("intranet_user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("intranet_user")
    router.push("/login")
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                {settings?.logo_url ? (
                  <img
                    src={settings.logo_url || "/placeholder.svg"}
                    alt="Logo"
                    className="h-8 w-auto max-w-[120px] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                ) : null}
                <div
                  className={`h-8 w-8 items-center justify-center rounded bg-blue-100 ${
                    settings?.logo_url ? "hidden" : "flex"
                  }`}
                >
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{settings?.company_name || "Intranet Corporativa"}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Ativo</span>
                  </div>
                  {user.last_login && (
                    <div className="flex items-center space-x-1">
                      <span>•</span>
                      <span>Desde {formatTimeAgo(user.last_login)}</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo, {user.name.split(" ")[0]}!</h2>
          <p className="text-gray-600">Fique por dentro das novidades da empresa e acesse os sistemas corporativos.</p>
        </div>

        {/* Admin Stats */}
        {user.role === "admin" && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Status do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Usuários</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.totalCategories}</div>
                    <div className="text-sm text-gray-600">Categorias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalLinks}</div>
                    <div className="text-sm text-gray-600">Links</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.totalPosts}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.totalExtensions}</div>
                    <div className="text-sm text-gray-600">Ramais</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Feed de Notícias</span>
              {posts.length > 0 && <Badge variant="secondary">{posts.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="portals" className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Portais</span>
              <Badge variant="secondary">{links.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="extensions" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Ramais</span>
              <Badge variant="secondary">{extensions.length}</Badge>
            </TabsTrigger>
          </TabsList>

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

          {/* Portais */}
          <TabsContent value="portals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Sistemas Corporativos</h3>
              <p className="text-sm text-gray-600">Acesse os sistemas e ferramentas da empresa</p>
            </div>

            {/* Favoritos */}
            {favoriteLinks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-lg font-medium">Meus Favoritos</h4>
                  <Badge variant="secondary">{favoriteLinks.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteLinks.map((link) => {
                    const category = categories.find((cat) => cat.id === link.category_id)
                    return (
                      <Card
                        key={link.id}
                        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                                style={{ backgroundColor: category?.color + "20" }}
                              >
                                {link.icon || "🔗"}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {link.name}
                                </h5>
                                {category && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                    style={{ backgroundColor: category.color + "20", color: category.color }}
                                  >
                                    {category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
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
                          </div>
                          {link.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{link.description}</p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 bg-transparent"
                            onClick={() => window.open(link.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Acessar Sistema
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Categorias */}
            {categories.map((category) => {
              const categoryLinks = links.filter((link) => link.category_id === category.id)
              if (categoryLinks.length === 0) return null

              return (
                <div key={category.id} className="space-y-4">
                  <div
                    className="flex items-center space-x-3 p-4 rounded-lg"
                    style={{ backgroundColor: category.color + "10" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      {category.icon || "📁"}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold" style={{ color: category.color }}>
                        {category.name}
                      </h4>
                      {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {categoryLinks.length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryLinks.map((link) => (
                      <Card
                        key={link.id}
                        className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                                style={{ backgroundColor: category.color + "20" }}
                              >
                                {link.icon || "🔗"}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {link.name}
                                </h5>
                              </div>
                            </div>
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
                          </div>
                          {link.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{link.description}</p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 bg-transparent"
                            onClick={() => window.open(link.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Acessar Sistema
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}

            {links.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <ExternalLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum sistema disponível</h3>
                  <p className="text-gray-600">Você não tem acesso a nenhum sistema no momento.</p>
                </CardContent>
              </Card>
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
