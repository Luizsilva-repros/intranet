"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  LogOut,
  Search,
  Grid3X3,
  List,
  Star,
  ExternalLink,
  Filter,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Heart,
  X,
} from "lucide-react"
import {
  getUser,
  getLinks,
  getCategories,
  toggleFavorite,
  isFavorite,
  getSettings,
  updateLink,
  addLink,
  deleteLink,
  getExtensions,
  addExtension,
  deleteExtension,
  updateExtension,
} from "@/lib/local-storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface Link {
  id: string
  title: string
  url: string
  description: string
  category: string
  icon?: string
  image_url?: string
  active: boolean
  group_access?: string[]
}

interface Extension {
  id: string
  name: string
  description: string
  version: string
  author: string
  icon?: string
  active: boolean
  install_url?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAddExtensionDialog, setShowAddExtensionDialog] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null)
  const router = useRouter()

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    icon: "🔗",
    image_url: "",
    active: true,
    group_access: [] as string[],
  })

  const [newExtension, setNewExtension] = useState({
    name: "",
    description: "",
    version: "1.0.0",
    author: "",
    icon: "🧩",
    active: true,
    install_url: "",
  })

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(userData)
    setLinks(getLinks())
    setExtensions(getExtensions())
    setCategories(getCategories())
    setSettings(getSettings())

    // Carregar favoritos
    const savedFavorites = localStorage.getItem("intranet_favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("intranet_user")
    router.push("/login")
  }

  const handleToggleFavorite = (linkId: string) => {
    toggleFavorite(linkId)
    const savedFavorites = localStorage.getItem("intranet_favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || link.category === selectedCategory
    return matchesSearch && matchesCategory && link.active
  })

  const favoriteLinks = filteredLinks.filter((link) => isFavorite(link.id))
  const regularLinks = filteredLinks.filter((link) => !isFavorite(link.id))

  const groupedLinks = categories.reduce(
    (acc, category) => {
      acc[category.id] = regularLinks.filter((link) => link.category === category.id)
      return acc
    },
    {} as Record<string, Link[]>,
  )

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const link = addLink(newLink)
      setLinks(getLinks())
      setNewLink({
        title: "",
        url: "",
        description: "",
        category: "",
        icon: "🔗",
        image_url: "",
        active: true,
        group_access: [],
      })
      setShowAddDialog(false)
    }
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setNewLink({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
      icon: link.icon || "🔗",
      image_url: link.image_url || "",
      active: link.active,
      group_access: link.group_access || [],
    })
    setShowAddDialog(true)
  }

  const handleUpdateLink = () => {
    if (editingLink && newLink.title && newLink.url) {
      updateLink(editingLink.id, newLink)
      setLinks(getLinks())
      setEditingLink(null)
      setNewLink({
        title: "",
        url: "",
        description: "",
        category: "",
        icon: "🔗",
        image_url: "",
        active: true,
        group_access: [],
      })
      setShowAddDialog(false)
    }
  }

  const handleDeleteLink = (linkId: string) => {
    if (confirm("Tem certeza que deseja excluir este link?")) {
      deleteLink(linkId)
      setLinks(getLinks())
    }
  }

  const handleAddExtension = () => {
    if (newExtension.name && newExtension.description) {
      const extension = addExtension(newExtension)
      setExtensions(getExtensions())
      setNewExtension({
        name: "",
        description: "",
        version: "1.0.0",
        author: "",
        icon: "🧩",
        active: true,
        install_url: "",
      })
      setShowAddExtensionDialog(false)
    }
  }

  const handleEditExtension = (extension: Extension) => {
    setEditingExtension(extension)
    setNewExtension({
      name: extension.name,
      description: extension.description,
      version: extension.version,
      author: extension.author,
      icon: extension.icon || "🧩",
      active: extension.active,
      install_url: extension.install_url || "",
    })
    setShowAddExtensionDialog(true)
  }

  const handleUpdateExtension = () => {
    if (editingExtension && newExtension.name && newExtension.description) {
      updateExtension(editingExtension.id, newExtension)
      setExtensions(getExtensions())
      setEditingExtension(null)
      setNewExtension({
        name: "",
        description: "",
        version: "1.0.0",
        author: "",
        icon: "🧩",
        active: true,
        install_url: "",
      })
      setShowAddExtensionDialog(false)
    }
  }

  const handleDeleteExtension = (extensionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta extensão?")) {
      deleteExtension(extensionId)
      setExtensions(getExtensions())
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Arquivo muito grande. Máximo 2MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Criar canvas para redimensionar
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          // Definir tamanho 64x64
          canvas.width = 64
          canvas.height = 64

          // Desenhar imagem redimensionada
          ctx?.drawImage(img, 0, 0, 64, 64)

          // Converter para base64
          const resizedImageUrl = canvas.toDataURL("image/png")
          setNewLink({ ...newLink, image_url: resizedImageUrl })
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const LinkCard = ({ link }: { link: Link }) => (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {link.image_url ? (
              <img
                src={link.image_url || "/placeholder.svg"}
                alt={link.title}
                className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                {link.icon || "🔗"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{link.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                handleToggleFavorite(link.id)
              }}
              className="h-8 w-8 p-0 hover:bg-yellow-100"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite(link.id) ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}`}
              />
            </Button>
            {user?.role === "admin" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    handleEditLink(link)
                  }}
                  className="h-8 w-8 p-0 hover:bg-blue-100"
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDeleteLink(link.id)
                  }}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                >
                  🗑️
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
            {categories.find((c) => c.id === link.category)?.name || link.category}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(link.url, "_blank")}
            className="h-8 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Abrir
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {settings?.logo_url ? (
                <img src={settings.logo_url || "/placeholder.svg"} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">INTRANET</h1>
                <p className="text-sm text-gray-600">{settings?.company_name || "Portal Corporativo"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.department || user.email}</p>
              </div>
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-700 border-0 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}! 👋</h2>
                <p className="text-blue-100 text-lg">Acesse rapidamente os sistemas e ferramentas corporativas</p>
              </div>
              <div className="hidden md:block">
                <Sparkles className="h-16 w-16 text-blue-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="portals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="feed" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="portals" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Sistemas
            </TabsTrigger>
            <TabsTrigger
              value="extensions"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Extensões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Feed de Atualizações
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Últimas novidades e comunicados da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🎉 Nova versão da intranet disponível!</h4>
                    <p className="text-gray-600 text-sm">
                      Confira as novas funcionalidades e melhorias implementadas no sistema.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Há 2 horas</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-2">📢 Manutenção programada</h4>
                    <p className="text-gray-600 text-sm">
                      Sistema ficará indisponível no domingo das 2h às 6h para manutenção.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Ontem</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portals" className="space-y-6">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar sistemas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-gray-300">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-9"
                >
                  <List className="h-4 w-4" />
                </Button>
                {user?.role === "admin" && (
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Adicionar Sistema
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingLink ? "Editar Sistema" : "Adicionar Novo Sistema"}</DialogTitle>
                        <DialogDescription>
                          {editingLink ? "Edite as informações do sistema" : "Preencha as informações do novo sistema"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={newLink.title}
                            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                            placeholder="Nome do sistema"
                          />
                        </div>
                        <div>
                          <Label htmlFor="url">URL</Label>
                          <Input
                            id="url"
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={newLink.description}
                            onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                            placeholder="Descrição do sistema"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Select
                            value={newLink.category}
                            onValueChange={(value) => setNewLink({ ...newLink, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="icon">Ícone/Emoji</Label>
                          <Input
                            id="icon"
                            value={newLink.icon}
                            onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                            placeholder="🔗"
                          />
                        </div>
                        <div>
                          <Label htmlFor="image">Imagem Personalizada</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="flex-1"
                            />
                            {newLink.image_url && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setNewLink({ ...newLink, image_url: "" })}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {newLink.image_url && (
                            <div className="mt-2">
                              <img
                                src={newLink.image_url || "/placeholder.svg"}
                                alt="Preview"
                                className="w-16 h-16 rounded-lg object-cover border"
                              />
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1">Máximo 2MB. Será redimensionada para 64x64px.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="active"
                            checked={newLink.active}
                            onCheckedChange={(checked) => setNewLink({ ...newLink, active: checked })}
                          />
                          <Label htmlFor="active">Sistema ativo</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={editingLink ? handleUpdateLink : handleAddLink} className="flex-1">
                            {editingLink ? "Atualizar" : "Adicionar"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddDialog(false)
                              setEditingLink(null)
                              setNewLink({
                                title: "",
                                url: "",
                                description: "",
                                category: "",
                                icon: "🔗",
                                image_url: "",
                                active: true,
                                group_access: [],
                              })
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Favoritos */}
            {favoriteLinks.length > 0 && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-1">
                  <div className="bg-white rounded-md p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <h3 className="text-lg font-semibold text-gray-900">Sistemas Favoritos</h3>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{favoriteLinks.length}</Badge>
                    </div>
                    <div
                      className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
                    >
                      {favoriteLinks.map((link) => (
                        <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                          <LinkCard link={link} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sistemas por Categoria */}
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryLinks = groupedLinks[category.id] || []
                if (categoryLinks.length === 0) return null

                return (
                  <div key={category.id} className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1">
                      <div className="bg-white rounded-md p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {category.icon || "📁"}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {categoryLinks.length} {categoryLinks.length === 1 ? "sistema" : "sistemas"}
                          </Badge>
                        </div>
                        <div
                          className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
                        >
                          {categoryLinks.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <LinkCard link={link} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredLinks.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum sistema encontrado</h3>
                  <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="extensions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Extensões Disponíveis</h3>
                <p className="text-gray-600">Ferramentas e plugins para expandir funcionalidades</p>
              </div>
              {user?.role === "admin" && (
                <Dialog open={showAddExtensionDialog} onOpenChange={setShowAddExtensionDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Adicionar Extensão
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingExtension ? "Editar Extensão" : "Adicionar Nova Extensão"}</DialogTitle>
                      <DialogDescription>
                        {editingExtension
                          ? "Edite as informações da extensão"
                          : "Preencha as informações da nova extensão"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newExtension.name}
                          onChange={(e) => setNewExtension({ ...newExtension, name: e.target.value })}
                          placeholder="Nome da extensão"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newExtension.description}
                          onChange={(e) => setNewExtension({ ...newExtension, description: e.target.value })}
                          placeholder="Descrição da extensão"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="version">Versão</Label>
                          <Input
                            id="version"
                            value={newExtension.version}
                            onChange={(e) => setNewExtension({ ...newExtension, version: e.target.value })}
                            placeholder="1.0.0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="author">Autor</Label>
                          <Input
                            id="author"
                            value={newExtension.author}
                            onChange={(e) => setNewExtension({ ...newExtension, author: e.target.value })}
                            placeholder="Nome do autor"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="icon">Ícone/Emoji</Label>
                        <Input
                          id="icon"
                          value={newExtension.icon}
                          onChange={(e) => setNewExtension({ ...newExtension, icon: e.target.value })}
                          placeholder="🧩"
                        />
                      </div>
                      <div>
                        <Label htmlFor="install_url">URL de Instalação (opcional)</Label>
                        <Input
                          id="install_url"
                          value={newExtension.install_url}
                          onChange={(e) => setNewExtension({ ...newExtension, install_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="active"
                          checked={newExtension.active}
                          onCheckedChange={(checked) => setNewExtension({ ...newExtension, active: checked })}
                        />
                        <Label htmlFor="active">Extensão ativa</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={editingExtension ? handleUpdateExtension : handleAddExtension}
                          className="flex-1"
                        >
                          {editingExtension ? "Atualizar" : "Adicionar"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddExtensionDialog(false)
                            setEditingExtension(null)
                            setNewExtension({
                              name: "",
                              description: "",
                              version: "1.0.0",
                              author: "",
                              icon: "🧩",
                              active: true,
                              install_url: "",
                            })
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {extensions
                .filter((ext) => ext.active)
                .map((extension) => (
                  <Card key={extension.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl">
                            {extension.icon || "🧩"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{extension.name}</h4>
                            <p className="text-sm text-gray-600">v{extension.version}</p>
                          </div>
                        </div>
                        {user?.role === "admin" && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExtension(extension)}
                              className="h-8 w-8 p-0"
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExtension(extension.id)}
                              className="h-8 w-8 p-0"
                            >
                              🗑️
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{extension.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">por {extension.author}</span>
                        {extension.install_url && (
                          <Button
                            size="sm"
                            onClick={() => window.open(extension.install_url, "_blank")}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Instalar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {extensions.filter((ext) => ext.active).length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Building2 className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma extensão disponível</h3>
                  <p className="text-gray-600">Extensões serão exibidas aqui quando adicionadas.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
