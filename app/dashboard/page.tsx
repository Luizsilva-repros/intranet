"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bell,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  LogOut,
  MessageSquare,
  Phone,
  Search,
  Settings,
  Shield,
  Star,
  TrendingUp,
  User,
  Users,
  FileText,
  Megaphone,
  Cake,
  UserMinus,
  Building,
  Mail,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import {
  getPosts,
  getPortals,
  getExtensions,
  togglePortalFavorite,
  formatTimeAgo,
  getCurrentUser,
  logout,
  type User as UserType,
  type Post,
  type Portal,
  type Extension,
} from "@/lib/local-storage"

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [portals, setPortals] = useState<Portal[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log("🔧 Inicializando dashboard...")

    // Usar getCurrentUser em vez de localStorage diretamente
    const currentUser = getCurrentUser()
    console.log("👤 Usuário atual no dashboard:", currentUser)

    if (!currentUser) {
      console.log("❌ Nenhum usuário logado, redirecionando para login...")
      router.push("/login")
      return
    }

    console.log("✅ Usuário autenticado no dashboard:", currentUser.name, "Role:", currentUser.role)
    setUser(currentUser)

    // Carregar dados
    setPosts(getPosts().filter((post) => post.published))
    setPortals(getPortals())
    setExtensions(getExtensions())
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    console.log("🚪 Fazendo logout...")
    logout()
    router.push("/login")
  }

  const handleFavoriteToggle = (portalId: string) => {
    togglePortalFavorite(portalId)
    setPortals(getPortals())
  }

  const getPostIcon = (type: string) => {
    const icons = {
      general: <FileText className="h-4 w-4" />,
      news: <TrendingUp className="h-4 w-4" />,
      event: <Calendar className="h-4 w-4" />,
      announcement: <Megaphone className="h-4 w-4" />,
      birthday: <Cake className="h-4 w-4" />,
      departure: <UserMinus className="h-4 w-4" />,
    }
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />
  }

  const getPostTypeLabel = (type: string) => {
    const labels = {
      general: "Geral",
      news: "Notícia",
      event: "Evento",
      announcement: "Comunicado",
      birthday: "Aniversário",
      departure: "Desligamento",
    }
    return labels[type as keyof typeof labels] || "Geral"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const filteredExtensions = extensions.filter(
    (ext) =>
      ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.extension.includes(searchTerm),
  )

  const favoritePortals = portals.filter((portal) => portal.favorite)
  const publicPortals = portals.filter((portal) => portal.access_level === "public")
  const restrictedPortals = portals.filter((portal) => portal.access_level === "restricted")
  const adminPortals = portals.filter((portal) => portal.access_level === "admin")

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">REPROS</h1>
                  <p className="text-sm text-gray-500">Portal Corporativo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Admin Button - Only show for admins */}
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.department || "Funcionário"}</p>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo, {user.name.split(" ")[0]}! 👋</h2>
          <p className="text-gray-600">Aqui está um resumo das atividades da empresa.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Posts and Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Admin Panel Card - Only show for admins */}
              {user.role === "admin" && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-blue-900">Administração</CardTitle>
                    </div>
                    <CardDescription className="text-blue-700">
                      Acesso rápido às funções administrativas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Painel Administrativo
                      </Button>
                    </Link>
                    <Link href="/admin/posts">
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Gerenciar Posts
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <ExternalLink className="h-5 w-5" />
                    <span>Acesso Rápido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Corporativo
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendário
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Briefcase className="h-4 w-4 mr-2" />
                    RH Online
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Comunicados Recentes</span>
                </CardTitle>
                <CardDescription>Últimas atualizações e comunicados da empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0 mt-1">{getPostIcon(post.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{post.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {getPostTypeLabel(post.type)}
                          </Badge>
                          {post.priority === "high" && (
                            <Badge variant="destructive" className="text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(post.published_at || post.created_at)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum comunicado disponível no momento.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Meu Perfil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.title || "Funcionário"}</p>
                    <p className="text-sm text-gray-500">{user.department || "Departamento"}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.last_login && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Último acesso: {formatTimeAgo(user.last_login)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Favorite Portals */}
            {favoritePortals.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Favoritos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {favoritePortals.slice(0, 5).map((portal) => (
                      <a
                        key={portal.id}
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-${portal.color}-100 flex items-center justify-center`}>
                          <ExternalLink className={`h-4 w-4 text-${portal.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{portal.name}</p>
                          <p className="text-xs text-gray-500 truncate">{portal.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleFavoriteToggle(portal.id)
                          }}
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Extensions Search */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Ramais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar ramal..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredExtensions.slice(0, 10).map((extension) => (
                      <div
                        key={extension.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{extension.name}</p>
                          <p className="text-xs text-gray-500">{extension.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-gray-900">{extension.extension}</p>
                        </div>
                      </div>
                    ))}
                    {filteredExtensions.length === 0 && searchTerm && (
                      <p className="text-sm text-gray-500 text-center py-4">Nenhum ramal encontrado.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Portals Section */}
        <div className="mt-12">
          <Tabs defaultValue="public" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Sistemas e Portais</h3>
              <TabsList>
                <TabsTrigger value="public">Públicos</TabsTrigger>
                <TabsTrigger value="restricted">Restritos</TabsTrigger>
                {user.role === "admin" && <TabsTrigger value="admin">Admin</TabsTrigger>}
              </TabsList>
            </div>

            <TabsContent value="public" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicPortals.map((portal) => (
                  <Card key={portal.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-lg bg-${portal.color}-100 flex items-center justify-center`}>
                          <ExternalLink className={`h-6 w-6 text-${portal.color}-600`} />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavoriteToggle(portal.id)}
                          className="p-1"
                        >
                          <Heart
                            className={`h-4 w-4 ${portal.favorite ? "fill-current text-red-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{portal.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{portal.description}</p>
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        Acessar
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restricted" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restrictedPortals.map((portal) => (
                  <Card key={portal.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-lg bg-${portal.color}-100 flex items-center justify-center`}>
                          <ExternalLink className={`h-6 w-6 text-${portal.color}-600`} />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavoriteToggle(portal.id)}
                          className="p-1"
                        >
                          <Heart
                            className={`h-4 w-4 ${portal.favorite ? "fill-current text-red-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{portal.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{portal.description}</p>
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        Acessar
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {user.role === "admin" && (
              <TabsContent value="admin" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminPortals.map((portal) => (
                    <Card key={portal.id} className="hover:shadow-md transition-shadow border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-${portal.color}-100 flex items-center justify-center`}
                          >
                            <ExternalLink className={`h-6 w-6 text-${portal.color}-600`} />
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-orange-600" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFavoriteToggle(portal.id)}
                              className="p-1"
                            >
                              <Heart
                                className={`h-4 w-4 ${portal.favorite ? "fill-current text-red-500" : "text-gray-400"}`}
                              />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{portal.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{portal.description}</p>
                        <a
                          href={portal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          Acessar
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
