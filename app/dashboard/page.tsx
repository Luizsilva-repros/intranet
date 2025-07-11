"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  getCurrentUser,
  logout,
  getPosts,
  getPortals,
  getExtensions,
  formatTimeAgo,
  getPostTypeIcon,
  getPriorityColor,
  type User,
  type Post,
  type Portal,
  type Extension,
} from "@/lib/local-storage"
import {
  Building2,
  Search,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Megaphone,
  Cake,
  UserMinus,
  FileText,
  Newspaper,
  Database,
  DollarSign,
  Headphones,
  BarChart3,
} from "lucide-react"

const iconMap = {
  Database,
  Users,
  DollarSign,
  TrendingUp,
  Headphones,
  BarChart3,
  ExternalLink,
  FileText,
  Newspaper,
  Calendar,
  Megaphone,
  Cake,
  UserMinus,
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [portals, setPortals] = useState<Portal[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setPosts(
      getPosts()
        .filter((p) => p.published)
        .slice(0, 5),
    )
    setPortals(getPortals().slice(0, 6))
    setExtensions(getExtensions().slice(0, 8))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const filteredExtensions = extensions.filter(
    (ext) =>
      ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ext.extension.includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                  INTRANET REPROS
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSettingsClick}>
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-red-500 text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role === "admin" ? "Administrador" : "Usuário"}</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo, {user.name}! 👋</h2>
          <p className="text-gray-600">
            {user.department && `${user.department} • `}
            {user.title || "Colaborador"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Newspaper className="h-5 w-5" />
                  <span>Comunicados Recentes</span>
                </CardTitle>
                <CardDescription>Últimas atualizações e comunicados da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.map((post) => {
                  const IconComponent = iconMap[getPostTypeIcon(post.type) as keyof typeof iconMap] || FileText
                  return (
                    <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <IconComponent className="h-4 w-4 text-gray-500" />
                            <h3 className="font-medium text-gray-900">{post.title}</h3>
                            <Badge variant="outline" className={getPriorityColor(post.priority)}>
                              {post.priority === "high" ? "Alta" : post.priority === "medium" ? "Média" : "Baixa"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(post.created_at)}</span>
                            </span>
                            <span>Por {post.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Access Portals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Acesso Rápido</span>
                </CardTitle>
                <CardDescription>Sistemas e portais mais utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portals.map((portal) => {
                    const IconComponent = iconMap[portal.icon as keyof typeof iconMap] || ExternalLink
                    return (
                      <div
                        key={portal.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => window.open(portal.url, "_blank")}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {portal.name}
                            </h3>
                            <p className="text-sm text-gray-500">{portal.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Extensions */}
          <div className="space-y-6">
            {/* Extensions Directory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Ramais</span>
                </CardTitle>
                <CardDescription>Diretório de ramais internos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, ramal ou departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredExtensions.map((ext) => (
                    <div key={ext.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ext.name}</h4>
                        <p className="text-sm text-gray-600">{ext.department}</p>
                        {ext.email && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{ext.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="font-mono text-sm font-medium text-gray-900">{ext.extension}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Estatísticas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Comunicados Ativos</span>
                  <span className="font-semibold text-gray-900">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Portais Disponíveis</span>
                  <span className="font-semibold text-gray-900">{portals.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ramais Cadastrados</span>
                  <span className="font-semibold text-gray-900">{extensions.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Panel Access */}
            {user.role === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Administração</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    size="sm"
                    onClick={() => router.push("/admin")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Painel Administrativo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
