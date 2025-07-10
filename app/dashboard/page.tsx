"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building2,
  FileText,
  Phone,
  Search,
  ExternalLink,
  Star,
  StarOff,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp,
  ArrowRight,
  LogOut,
  Settings,
  Bell,
  User,
} from "lucide-react"
import {
  getPublishedPosts,
  getLinksForUser,
  getCategoriesForUser,
  getExtensions,
  getUser,
  toggleFavorite,
  isFavorite,
  formatTimeAgo,
  getPostTypeIcon,
  getPriorityColor,
  type User as UserType,
  type Link,
  type Category,
  type Post,
  type Extension,
} from "@/lib/local-storage"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { user: authUser, authUser: fullAuthUser, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authLoading) return

    if (!authUser) {
      console.log("❌ Usuário não autenticado, redirecionando para login...")
      router.replace("/login")
      return
    }

    console.log("✅ Usuário autenticado:", authUser.email)
    loadDashboardData()
  }, [authUser, authLoading, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Buscar dados do usuário completo
      const userData = getUser(authUser!.email)
      if (!userData) {
        throw new Error("Dados do usuário não encontrados")
      }
      setCurrentUser(userData)

      // Carregar dados do dashboard
      const [postsData, linksData, categoriesData, extensionsData] = await Promise.all([
        Promise.resolve(getPublishedPosts()),
        Promise.resolve(getLinksForUser(userData)),
        Promise.resolve(getCategoriesForUser(userData)),
        Promise.resolve(getExtensions()),
      ])

      setPosts(postsData)
      setLinks(linksData)
      setCategories(categoriesData)
      setExtensions(extensionsData)

      console.log("✅ Dados do dashboard carregados:", {
        posts: postsData.length,
        links: linksData.length,
        categories: categoriesData.length,
        extensions: extensionsData.length,
      })
    } catch (error: any) {
      console.error("❌ Erro ao carregar dashboard:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = (linkId: string) => {
    if (!currentUser) return
    toggleFavorite(currentUser.id, linkId)
    // Forçar re-render
    setLinks([...links])
  }

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.replace("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Filtrar links
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || link.category === selectedCategory
    const matchesFavorites = !showFavoritesOnly || (currentUser && isFavorite(currentUser.id, link.id))

    return matchesSearch && matchesCategory && matchesFavorites
  })

  // Agrupar links por categoria
  const linksByCategory = filteredLinks.reduce(
    (acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = []
      }
      acc[link.category].push(link)
      return acc
    },
    {} as Record<string, Link[]>,
  )

  // Links favoritos
  const favoriteLinks = currentUser ? links.filter((link) => isFavorite(currentUser.id, link.id)) : []

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">INTRANET</h1>
                <p className="text-sm text-gray-500">Portal Corporativo</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {fullAuthUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{fullAuthUser?.name}</p>
                  <p className="text-xs text-gray-500">
                    {fullAuthUser?.role === "admin" ? "Administrador" : "Usuário"}
                  </p>
                </div>
              </div>

              {fullAuthUser?.role === "admin" && (
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Bem-vindo, {fullAuthUser?.name}! 👋</h2>
                  <p className="text-blue-100">Acesse rapidamente seus sistemas e informações corporativas</p>
                </div>
                <Sparkles className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="sistemas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="sistemas" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sistemas
            </TabsTrigger>
            <TabsTrigger value="ramais" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Ramais
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid gap-6">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum post disponível</h3>
                    <p className="text-gray-500">Não há comunicados ou notícias no momento.</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getPostTypeIcon(post.type)}</div>
                          <div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="secondary"
                                style={{
                                  backgroundColor: getPriorityColor(post.priority) + "20",
                                  color: getPriorityColor(post.priority),
                                }}
                              >
                                {post.priority === "high" ? "Alta" : post.priority === "medium" ? "Média" : "Baixa"}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(post.published_at || post.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {post.content.split("\n").map((line, index) => (
                          <p key={index} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                      {post.image_url && (
                        <div className="mt-4">
                          <img
                            src={post.image_url || "/placeholder.svg"}
                            alt="Imagem do post"
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Sistemas Tab */}
          <TabsContent value="sistemas" className="space-y-6">
            {/* Controles de Filtro */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar sistemas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todas as categorias</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={showFavoritesOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Favoritos
                    </Button>

                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção de Favoritos */}
            {favoriteLinks.length > 0 && !showFavoritesOnly && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seus Favoritos</h3>
                    <p className="text-sm text-gray-600">Acesso rápido aos seus sistemas preferidos</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favoriteLinks.slice(0, 4).map((link) => (
                    <Card
                      key={link.id}
                      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
                      onClick={() => handleLinkClick(link.url)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {link.image_url ? (
                              <img
                                src={link.image_url || "/placeholder.svg"}
                                alt={link.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-lg">
                                {link.icon}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{link.name}</h4>
                              <p className="text-xs text-gray-600 truncate">{link.description}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(link.id)
                            }}
                            className="opacity-100 text-yellow-600 hover:text-yellow-700"
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            {link.category}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Sistemas por Categoria */}
            <div className="space-y-6">
              {Object.entries(linksByCategory).map(([categoryName, categoryLinks]) => {
                const category = categories.find((c) => c.name === categoryName)

                return (
                  <div key={categoryName} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg text-white"
                        style={{ backgroundColor: category?.color || "#3B82F6" }}
                      >
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
                        <p className="text-sm text-gray-600">{category?.description}</p>
                      </div>
                    </div>

                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                          : "space-y-2"
                      }
                    >
                      {categoryLinks.map((link) => (
                        <Card
                          key={link.id}
                          className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${
                            viewMode === "list" ? "hover:bg-gray-50" : ""
                          }`}
                          onClick={() => handleLinkClick(link.url)}
                        >
                          <CardContent className={viewMode === "grid" ? "p-4" : "p-3"}>
                            <div
                              className={`flex items-start ${viewMode === "grid" ? "flex-col space-y-3" : "space-x-3"}`}
                            >
                              <div
                                className={`flex items-center ${viewMode === "grid" ? "w-full justify-between" : "space-x-3 flex-1"}`}
                              >
                                {link.image_url ? (
                                  <img
                                    src={link.image_url || "/placeholder.svg"}
                                    alt={link.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg text-white"
                                    style={{ backgroundColor: category?.color || "#3B82F6" }}
                                  >
                                    {link.icon}
                                  </div>
                                )}

                                {viewMode === "grid" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleToggleFavorite(link.id)
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                      currentUser && isFavorite(currentUser.id, link.id)
                                        ? "text-yellow-600 opacity-100"
                                        : "text-gray-400 hover:text-yellow-600"
                                    }`}
                                  >
                                    {currentUser && isFavorite(currentUser.id, link.id) ? (
                                      <Star className="h-4 w-4 fill-current" />
                                    ) : (
                                      <StarOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>

                              <div
                                className={`flex-1 min-w-0 ${viewMode === "grid" ? "" : "flex items-center justify-between"}`}
                              >
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">{link.name}</h4>
                                  <p className="text-sm text-gray-600 truncate">{link.description}</p>
                                </div>

                                {viewMode === "list" && (
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleToggleFavorite(link.id)
                                      }}
                                      className={`${
                                        currentUser && isFavorite(currentUser.id, link.id)
                                          ? "text-yellow-600"
                                          : "text-gray-400 hover:text-yellow-600"
                                      }`}
                                    >
                                      {currentUser && isFavorite(currentUser.id, link.id) ? (
                                        <Star className="h-4 w-4 fill-current" />
                                      ) : (
                                        <StarOff className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                  </div>
                                )}
                              </div>

                              {viewMode === "grid" && (
                                <div className="flex items-center justify-between w-full">
                                  <Badge variant="secondary" className="text-xs">
                                    {link.category}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredLinks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum sistema encontrado</h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all" || showFavoritesOnly
                      ? "Tente ajustar os filtros de busca."
                      : "Não há sistemas disponíveis para seu perfil."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ramais Tab */}
          <TabsContent value="ramais" className="space-y-6">
            <div className="grid gap-4">
              {extensions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ramal cadastrado</h3>
                    <p className="text-gray-500">A lista de ramais está vazia.</p>
                  </CardContent>
                </Card>
              ) : (
                extensions.map((extension) => (
                  <Card key={extension.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{extension.name}</h3>
                            <p className="text-sm text-gray-600">{extension.position}</p>
                            <p className="text-sm text-gray-500">{extension.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="font-mono text-lg font-semibold text-gray-900">{extension.extension}</span>
                          </div>
                          {extension.email && <p className="text-sm text-gray-600">{extension.email}</p>}
                          {extension.mobile && <p className="text-sm text-gray-600">{extension.mobile}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
