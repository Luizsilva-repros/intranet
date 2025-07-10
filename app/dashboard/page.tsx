"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getCurrentUser,
  logout,
  getPosts,
  getPortals,
  getExtensions,
  togglePortalFavorite,
  formatDate,
  type User,
  type Post,
  type Portal,
  type Extension,
} from "@/lib/local-storage"
import {
  Building2,
  Search,
  Star,
  Users,
  Database,
  DollarSign,
  TrendingUp,
  Headphones,
  BarChart3,
  Phone,
  Mail,
  LogOut,
  Settings,
  Bell,
  Calendar,
  FileText,
  Clock,
  Filter,
  Grid3X3,
  List,
  Heart,
  ExternalLink,
} from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [portals, setPortals] = useState<Portal[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.replace("/login")
      return
    }

    setUser(currentUser)
    setPosts(getPosts())
    setPortals(getPortals())
    setExtensions(getExtensions())
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  const handleToggleFavorite = (portalId: string) => {
    togglePortalFavorite(portalId)
    setPortals(getPortals())
  }

  const filteredPortals = portals.filter((portal) => {
    const matchesSearch =
      portal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || portal.category === selectedCategory
    const hasAccess =
      portal.access_level === "public" ||
      (portal.access_level === "restricted" && user) ||
      (portal.access_level === "admin" && user?.role === "admin")

    return matchesSearch && matchesCategory && hasAccess
  })

  const categories = ["Todos", ...Array.from(new Set(portals.map((p) => p.category)))]

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Database,
      Users,
      DollarSign,
      TrendingUp,
      Headphones,
      BarChart3,
      Building2,
    }
    return icons[iconName] || Building2
  }

  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      purple: "from-purple-500 to-purple-600",
      red: "from-red-500 to-red-600",
      indigo: "from-indigo-500 to-indigo-600",
    }
    return colors[color] || "from-gray-500 to-gray-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Título */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                  INTRANET REPROS
                </h1>
                <p className="text-sm text-gray-500">Sistema Online</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-3 pl-4 border-l">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-red-500 text-white text-sm">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role === "admin" ? "Administrador" : "Usuário"}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo, {user?.name}! 👋</h2>
          <p className="text-gray-600">Mantenha-se por dentro das novidades da REPROS.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Posts Recentes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Últimas Notícias
                </h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {posts.length} posts
                </Badge>
              </div>

              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                        </div>
                        <Badge className={`ml-4 ${getPriorityColor(post.priority)}`}>
                          {post.priority === "high" ? "Alta" : post.priority === "medium" ? "Média" : "Baixa"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(post.created_at)}
                        </span>
                        <span>{post.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Portais e Sistemas */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-blue-600" />
                  Portais e Sistemas
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar portais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid de Portais */}
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}
              >
                {filteredPortals.map((portal) => {
                  const IconComponent = getIconComponent(portal.icon)
                  return (
                    <Card
                      key={portal.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                        portal.favorite ? "ring-2 ring-yellow-400" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClass(portal.color)} flex items-center justify-center`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(portal.id)
                            }}
                            className="p-1 h-8 w-8"
                          >
                            <Heart
                              className={`h-4 w-4 ${portal.favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{portal.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{portal.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {portal.category}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredPortals.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum portal encontrado</h4>
                  <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ramais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Ramais
                </CardTitle>
                <CardDescription>Contatos internos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {extensions.slice(0, 5).map((ext) => (
                  <div key={ext.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{ext.name}</p>
                      <p className="text-xs text-gray-600">{ext.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-blue-600">{ext.extension}</p>
                      {ext.email && (
                        <a href={`mailto:${ext.email}`} className="text-xs text-gray-500 hover:text-blue-600">
                          <Mail className="h-3 w-3 inline mr-1" />
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Portais Disponíveis</span>
                  <span className="font-semibold text-blue-600">{portals.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Favoritos</span>
                  <span className="font-semibold text-yellow-600">{portals.filter((p) => p.favorite).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Últimas Notícias</span>
                  <span className="font-semibold text-green-600">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ramais</span>
                  <span className="font-semibold text-purple-600">{extensions.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Acesso Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Acesso Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Corporativo
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Diretório
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
