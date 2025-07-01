"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  getUsers,
  getCategories,
  getLinks,
  getPosts,
  getExtensions,
  addUser,
  updateUser,
  deleteUser,
  addCategory,
  updateCategory,
  deleteCategory,
  addLink,
  updateLink,
  deleteLink,
  addExtension,
  updateExtension,
  deleteExtension,
  deletePost,
  getSettings,
  updateSettings,
  initializeData,
  savePosts,
} from "@/lib/local-storage"
import type { User, Category, Link as LinkType, Post, Extension, Settings } from "@/lib/local-storage"
import {
  Users,
  FolderOpen,
  ExternalLink,
  SettingsIcon,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  FileText,
  Phone,
  Eye,
  EyeOff,
  Upload,
  X,
} from "lucide-react"

const availableGroups = ["admin", "rh", "financeiro", "vendas", "ti", "suporte", "user"]

const categoryColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
]

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [linksData, setLinksData] = useState<LinkType[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Estados para formulários
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingLink, setEditingLink] = useState<LinkType | null>(null)
  const [editingSettings, setEditingSettings] = useState<Settings | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null)

  // Estados para novos itens
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
    password: "",
    groups: [] as string[],
  })
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    groups: [] as string[],
  })
  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    description: "",
    category_id: "",
    groups: [] as string[],
  })
  const [newExtension, setNewExtension] = useState({
    name: "",
    extension: "",
    department: "",
    position: "",
    email: "",
    mobile: "",
  })

  // Estados para diálogos
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [showExtensionDialog, setShowExtensionDialog] = useState(false)

  // Estados para edição de posts
  const [editPostForm, setEditPostForm] = useState({
    title: "",
    content: "",
    type: "general" as Post["type"],
    priority: "medium" as Post["priority"],
    published: true,
    expires_at: "",
    image_url: "",
  })
  const [editImagePreview, setEditImagePreview] = useState("")

  useEffect(() => {
    initializeData()

    const savedUser = localStorage.getItem("intranet_user")
    if (!savedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(savedUser)
      if (userData.role !== "admin") {
        router.push("/dashboard")
        return
      }
      setUser(userData)
      loadData()
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
      localStorage.removeItem("intranet_user")
      router.push("/login")
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  const loadData = () => {
    setUsers(getUsers())
    setCategories(getCategories())
    setLinksData(getLinks())
    setPosts(getPosts())
    setExtensions(getExtensions())
    setSettings(getSettings())
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("intranet_user")
    router.push("/login")
  }

  const resetNewUser = () => {
    setNewUser({
      name: "",
      email: "",
      role: "user",
      password: "",
      groups: [],
    })
  }

  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      color: "#3B82F6",
      groups: [],
    })
  }

  const resetNewLink = () => {
    setNewLink({
      name: "",
      url: "",
      description: "",
      category_id: "",
      groups: [],
    })
  }

  const resetNewExtension = () => {
    setNewExtension({
      name: "",
      extension: "",
      department: "",
      position: "",
      email: "",
      mobile: "",
    })
  }

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      showMessage("Preencha todos os campos obrigatórios")
      return
    }

    try {
      addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
        groups: newUser.groups.length > 0 ? newUser.groups : ["user"],
      })

      resetNewUser()
      setShowUserDialog(false)
      loadData()
      showMessage("Usuário criado com sucesso!")
    } catch (error) {
      showMessage("Erro ao criar usuário")
    }
  }

  const handleUpdateUser = () => {
    if (!editingUser || !editingUser.name || !editingUser.email) {
      showMessage("Preencha todos os campos obrigatórios")
      return
    }

    try {
      updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        password: editingUser.password,
        groups: editingUser.groups,
      })

      setEditingUser(null)
      setShowUserDialog(false)
      loadData()
      showMessage("Usuário atualizado com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar usuário")
    }
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        deleteUser(id)
        loadData()
        showMessage("Usuário excluído com sucesso!")
      } catch (error) {
        showMessage("Erro ao excluir usuário")
      }
    }
  }

  const handleCreateCategory = () => {
    if (!newCategory.name) {
      showMessage("Nome da categoria é obrigatório")
      return
    }

    try {
      addCategory({
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
        groups: newCategory.groups.length > 0 ? newCategory.groups : ["admin"],
      })

      resetNewCategory()
      setShowCategoryDialog(false)
      loadData()
      showMessage("Categoria criada com sucesso!")
    } catch (error) {
      showMessage("Erro ao criar categoria")
    }
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name) {
      showMessage("Nome da categoria é obrigatório")
      return
    }

    try {
      updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
        color: editingCategory.color,
        groups: editingCategory.groups,
      })

      setEditingCategory(null)
      setShowCategoryDialog(false)
      loadData()
      showMessage("Categoria atualizada com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar categoria")
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        deleteCategory(id)
        loadData()
        showMessage("Categoria excluída com sucesso!")
      } catch (error) {
        showMessage("Erro ao excluir categoria")
      }
    }
  }

  const handleCreateLink = () => {
    if (!newLink.name || !newLink.url) {
      showMessage("Nome e URL são obrigatórios")
      return
    }

    try {
      const category = categories.find((c) => c.id === newLink.category_id)
      addLink({
        name: newLink.name,
        url: newLink.url,
        category: category?.name || "",
        groups: newLink.groups.length > 0 ? newLink.groups : ["admin"],
      })

      resetNewLink()
      setShowLinkDialog(false)
      loadData()
      showMessage("Link criado com sucesso!")
    } catch (error) {
      showMessage("Erro ao criar link")
    }
  }

  const handleUpdateLink = () => {
    if (!editingLink || !editingLink.name || !editingLink.url) {
      showMessage("Nome e URL são obrigatórios")
      return
    }

    try {
      const category = categories.find((c) => c.id === editingLink.category_id)
      updateLink(editingLink.id, {
        name: editingLink.name,
        url: editingLink.url,
        category: category?.name || "",
        groups: editingLink.groups,
      })

      setEditingLink(null)
      setShowLinkDialog(false)
      loadData()
      showMessage("Link atualizado com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar link")
    }
  }

  const handleDeleteLink = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este link?")) {
      try {
        deleteLink(id)
        loadData()
        showMessage("Link excluído com sucesso!")
      } catch (error) {
        showMessage("Erro ao excluir link")
      }
    }
  }

  const handleCreateExtension = () => {
    if (!newExtension.name || !newExtension.extension || !newExtension.department) {
      showMessage("Nome, ramal e departamento são obrigatórios")
      return
    }

    try {
      addExtension({
        name: newExtension.name,
        extension: newExtension.extension,
        department: newExtension.department,
        position: newExtension.position,
        email: newExtension.email,
        mobile: newExtension.mobile,
      })

      resetNewExtension()
      setShowExtensionDialog(false)
      loadData()
      showMessage("Ramal criado com sucesso!")
    } catch (error) {
      showMessage("Erro ao criar ramal")
    }
  }

  const handleUpdateExtension = () => {
    if (!editingExtension || !editingExtension.name || !editingExtension.extension || !editingExtension.department) {
      showMessage("Nome, ramal e departamento são obrigatórios")
      return
    }

    try {
      updateExtension(editingExtension.id, {
        name: editingExtension.name,
        extension: editingExtension.extension,
        department: editingExtension.department,
        position: editingExtension.position,
        email: editingExtension.email,
        mobile: editingExtension.mobile,
      })

      setEditingExtension(null)
      setShowExtensionDialog(false)
      loadData()
      showMessage("Ramal atualizado com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar ramal")
    }
  }

  const handleDeleteExtension = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este ramal?")) {
      try {
        deleteExtension(id)
        loadData()
        showMessage("Ramal excluído com sucesso!")
      } catch (error) {
        showMessage("Erro ao excluir ramal")
      }
    }
  }

  // Funções para posts
  const openEditPostDialog = (post: Post) => {
    setEditingPost(post)
    setEditPostForm({
      title: post.title,
      content: post.content,
      type: post.type,
      priority: post.priority,
      published: post.published,
      expires_at: post.expires_at || "",
      image_url: post.image_url || "",
    })
    setEditImagePreview(post.image_url || "")
    setShowPostDialog(true)
  }

  const handleUpdatePost = () => {
    if (!editingPost || !editPostForm.title || !editPostForm.content) {
      showMessage("Título e conteúdo são obrigatórios")
      return
    }

    try {
      const now = new Date().toISOString()
      const updatedPosts = posts.map((post) =>
        post.id === editingPost.id
          ? {
              ...post,
              title: editPostForm.title,
              content: editPostForm.content,
              type: editPostForm.type,
              priority: editPostForm.priority,
              published: editPostForm.published,
              published_at: editPostForm.published && !post.published ? now : post.published_at,
              expires_at: editPostForm.expires_at || undefined,
              updated_at: now,
              image_url: editPostForm.image_url || undefined,
            }
          : post,
      )

      setPosts(updatedPosts)
      savePosts(updatedPosts)
      setShowPostDialog(false)
      setEditingPost(null)
      setEditImagePreview("")
      showMessage("Post atualizado com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar post")
    }
  }

  const handleTogglePostStatus = (postId: string) => {
    const now = new Date().toISOString()
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            published: !post.published,
            published_at: !post.published ? now : post.published_at,
            updated_at: now,
          }
        : post,
    )
    setPosts(updatedPosts)
    savePosts(updatedPosts)
    showMessage("Status do post atualizado!")
  }

  const handleDeletePost = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      try {
        deletePost(id)
        loadData()
        showMessage("Post excluído com sucesso!")
      } catch (error) {
        showMessage("Erro ao excluir post")
      }
    }
  }

  const handleUpdateSettings = () => {
    if (!editingSettings || !editingSettings.company_name) {
      showMessage("Nome da empresa é obrigatório")
      return
    }

    try {
      updateSettings({
        company_name: editingSettings.company_name,
        logo_url: editingSettings.logo_url,
        primary_color: editingSettings.primary_color,
        secondary_color: editingSettings.secondary_color,
        accent_color: editingSettings.accent_color,
      })

      setEditingSettings(null)
      setShowSettingsDialog(false)
      loadData()
      showMessage("Configurações atualizadas com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar configurações")
    }
  }

  const toggleGroupSelection = (groups: string[], group: string) => {
    return groups.includes(group) ? groups.filter((g) => g !== group) : [...groups, group]
  }

  // Função para redimensionar imagem
  const resizeImage = (file: File, maxWidth = 400, maxHeight = 600): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.8))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showMessage("Por favor, selecione apenas arquivos de imagem")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("A imagem deve ter no máximo 5MB")
      return
    }

    try {
      const resizedBase64 = await resizeImage(file, 400, 600)
      setEditImagePreview(resizedBase64)
      setEditPostForm({ ...editPostForm, image_url: resizedBase64 })
    } catch (error) {
      showMessage("Erro ao processar a imagem")
    }
  }

  const removeImage = () => {
    setEditImagePreview("")
    setEditPostForm({ ...editPostForm, image_url: "" })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} className="w-full">
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Admin: {user.name}</Badge>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Message Alert */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="extensions" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Ramais
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Usuários */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
              <Button
                onClick={() => {
                  setEditingUser(null)
                  resetNewUser()
                  setShowUserDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            <div className="grid gap-4">
              {users.map((userItem) => (
                <Card key={userItem.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{userItem.name}</h3>
                          {userItem.role === "admin" && <Badge variant="destructive">Admin</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{userItem.email}</p>
                        {userItem.groups && userItem.groups.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {userItem.groups.map((group) => (
                              <Badge key={group} variant="secondary" className="text-xs capitalize">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingUser(userItem)
                            setShowUserDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(userItem.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categorias */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Categorias</h2>
              <Button
                onClick={() => {
                  setEditingCategory(null)
                  resetNewCategory()
                  setShowCategoryDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <h3 className="font-medium">{category.name}</h3>
                        </div>
                        {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                        {category.groups && category.groups.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {category.groups.map((group) => (
                              <Badge key={group} variant="secondary" className="text-xs capitalize">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category)
                            setShowCategoryDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Links */}
          <TabsContent value="links" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Links</h2>
              <Button
                onClick={() => {
                  setEditingLink(null)
                  resetNewLink()
                  setShowLinkDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Link
              </Button>
            </div>

            <div className="grid gap-4">
              {linksData.map((link) => {
                const category = categories.find((c) => c.id === link.category_id)
                return (
                  <Card key={link.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{link.name}</h3>
                            {category && (
                              <Badge style={{ backgroundColor: category.color, color: "white" }}>{category.name}</Badge>
                            )}
                          </div>
                          {link.description && <p className="text-sm text-gray-600">{link.description}</p>}
                          <p className="text-sm text-blue-600">{link.url}</p>
                          {link.groups && link.groups.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {link.groups.map((group) => (
                                <Badge key={group} variant="secondary" className="text-xs capitalize">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingLink(link)
                              setShowLinkDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteLink(link.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Posts */}
          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Gerenciar Publicações</h2>
                <p className="text-sm text-gray-600">Gerencie posts, comunicados e eventos</p>
              </div>
              <Button onClick={() => router.push("/admin/posts")}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Publicação
              </Button>
            </div>

            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Publicado" : "Rascunho"}
                          </Badge>
                          <Badge variant="outline">{post.type}</Badge>
                          {post.priority === "high" && <Badge variant="destructive">Urgente</Badge>}
                        </div>
                        {post.image_url && (
                          <div className="mb-2">
                            <img
                              src={post.image_url || "/placeholder.svg"}
                              alt={post.title}
                              className="w-24 h-32 object-cover rounded border shadow-sm"
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Criado: {new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
                          {post.published_at && (
                            <span>Publicado: {new Date(post.published_at).toLocaleDateString("pt-BR")}</span>
                          )}
                          {post.expires_at && (
                            <span>Expira: {new Date(post.expires_at).toLocaleDateString("pt-BR")}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => openEditPostDialog(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePostStatus(post.id)}
                          title={post.published ? "Despublicar" : "Publicar"}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {posts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma publicação encontrada</h3>
                    <p className="text-gray-600">Crie sua primeira publicação para começar.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Extensions */}
          <TabsContent value="extensions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Ramais</h2>
              <Button
                onClick={() => {
                  setEditingExtension(null)
                  resetNewExtension()
                  setShowExtensionDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Ramal
              </Button>
            </div>

            <div className="grid gap-4">
              {extensions.map((extension) => (
                <Card key={extension.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{extension.name}</h3>
                          <Badge variant="outline">{extension.department}</Badge>
                        </div>
                        {extension.position && <p className="text-sm text-gray-600">{extension.position}</p>}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-mono">📞 {extension.extension}</span>
                          {extension.email && <span>📧 {extension.email}</span>}
                          {extension.mobile && <span>📱 {extension.mobile}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingExtension(extension)
                            setShowExtensionDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteExtension(extension.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {extensions.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ramal encontrado</h3>
                    <p className="text-gray-600">Adicione ramais para facilitar a comunicação interna.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
              <Button
                onClick={() => {
                  setEditingSettings(settings)
                  setShowSettingsDialog(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Configurações
              </Button>
            </div>

            {settings && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Nome da Empresa</h3>
                      <p className="text-sm text-gray-600">{settings.company_name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Logo da Empresa</h3>
                      {settings.logo_url ? (
                        <img src={settings.logo_url || "/placeholder.svg"} alt="Logo" className="h-12 w-auto" />
                      ) : (
                        <p className="text-sm text-gray-500">Nenhum logo configurado</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Cores do Sistema</h3>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border" style={{ backgroundColor: settings.primary_color }} />
                          <span className="text-sm">Primária</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: settings.secondary_color }}
                          />
                          <span className="text-sm">Secundária</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border" style={{ backgroundColor: settings.accent_color }} />
                          <span className="text-sm">Destaque</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog para Usuários */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Edite as informações do usuário" : "Adicione um novo usuário ao sistema"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name">Nome</Label>
                <Input
                  id="user-name"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={(e) => {
                    if (editingUser) {
                      setEditingUser({ ...editingUser, name: e.target.value })
                    } else {
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={(e) => {
                    if (editingUser) {
                      setEditingUser({ ...editingUser, email: e.target.value })
                    } else {
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="user-password">Senha</Label>
                <Input
                  id="user-password"
                  type="password"
                  value={editingUser ? editingUser.password || "" : newUser.password}
                  onChange={(e) => {
                    if (editingUser) {
                      setEditingUser({ ...editingUser, password: e.target.value })
                    } else {
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="user-role">Função</Label>
                <Select
                  value={editingUser ? editingUser.role : newUser.role}
                  onValueChange={(value: "admin" | "user") => {
                    if (editingUser) {
                      setEditingUser({ ...editingUser, role: value })
                    } else {
                      setNewUser({ ...newUser, role: value })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grupos</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableGroups.map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-group-${group}`}
                        checked={
                          editingUser ? editingUser.groups?.includes(group) || false : newUser.groups.includes(group)
                        }
                        onCheckedChange={() => {
                          if (editingUser) {
                            const currentGroups = editingUser.groups || []
                            const newGroups = toggleGroupSelection(currentGroups, group)
                            setEditingUser({ ...editingUser, groups: newGroups })
                          } else {
                            const newGroups = toggleGroupSelection(newUser.groups, group)
                            setNewUser({ ...newUser, groups: newGroups })
                          }
                        }}
                      />
                      <Label htmlFor={`user-group-${group}`} className="text-sm capitalize">
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                  {editingUser ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Categorias */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Edite as informações da categoria" : "Adicione uma nova categoria"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Nome</Label>
                <Input
                  id="category-name"
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    } else {
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="category-description">Descrição</Label>
                <Textarea
                  id="category-description"
                  value={editingCategory ? editingCategory.description : newCategory.description}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, description: e.target.value })
                    } else {
                      setNewCategory({ ...newCategory, description: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        (editingCategory ? editingCategory.color : newCategory.color) === color
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        if (editingCategory) {
                          setEditingCategory({ ...editingCategory, color })
                        } else {
                          setNewCategory({ ...newCategory, color })
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>Grupos com Acesso</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableGroups.map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-group-${group}`}
                        checked={
                          editingCategory
                            ? editingCategory.groups?.includes(group) || false
                            : newCategory.groups.includes(group)
                        }
                        onCheckedChange={() => {
                          if (editingCategory) {
                            const currentGroups = editingCategory.groups || []
                            const newGroups = toggleGroupSelection(currentGroups, group)
                            setEditingCategory({ ...editingCategory, groups: newGroups })
                          } else {
                            const newGroups = toggleGroupSelection(newCategory.groups, group)
                            setNewCategory({ ...newCategory, groups: newGroups })
                          }
                        }}
                      />
                      <Label htmlFor={`cat-group-${group}`} className="text-sm capitalize">
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                  {editingCategory ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Links */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLink ? "Editar Link" : "Novo Link"}</DialogTitle>
              <DialogDescription>
                {editingLink ? "Edite as informações do link" : "Adicione um novo link"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-name">Nome</Label>
                <Input
                  id="link-name"
                  value={editingLink ? editingLink.name : newLink.name}
                  onChange={(e) => {
                    if (editingLink) {
                      setEditingLink({ ...editingLink, name: e.target.value })
                    } else {
                      setNewLink({ ...newLink, name: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  type="url"
                  value={editingLink ? editingLink.url : newLink.url}
                  onChange={(e) => {
                    if (editingLink) {
                      setEditingLink({ ...editingLink, url: e.target.value })
                    } else {
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="link-description">Descrição</Label>
                <Textarea
                  id="link-description"
                  value={editingLink ? editingLink.description || "" : newLink.description}
                  onChange={(e) => {
                    if (editingLink) {
                      setEditingLink({ ...editingLink, description: e.target.value })
                    } else {
                      setNewLink({ ...newLink, description: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="link-category">Categoria</Label>
                <Select
                  value={editingLink ? editingLink.category_id : newLink.category_id}
                  onValueChange={(value) => {
                    if (editingLink) {
                      setEditingLink({ ...editingLink, category_id: value })
                    } else {
                      setNewLink({ ...newLink, category_id: value })
                    }
                  }}
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
                <Label>Grupos com Acesso</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableGroups.map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={`link-group-${group}`}
                        checked={
                          editingLink ? editingLink.groups?.includes(group) || false : newLink.groups.includes(group)
                        }
                        onCheckedChange={() => {
                          if (editingLink) {
                            const currentGroups = editingLink.groups || []
                            const newGroups = toggleGroupSelection(currentGroups, group)
                            setEditingLink({ ...editingLink, groups: newGroups })
                          } else {
                            const newGroups = toggleGroupSelection(newLink.groups, group)
                            setNewLink({ ...newLink, groups: newGroups })
                          }
                        }}
                      />
                      <Label htmlFor={`link-group-${group}`} className="text-sm capitalize">
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingLink ? handleUpdateLink : handleCreateLink}>
                  {editingLink ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Extensions */}
        <Dialog open={showExtensionDialog} onOpenChange={setShowExtensionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingExtension ? "Editar Ramal" : "Novo Ramal"}</DialogTitle>
              <DialogDescription>
                {editingExtension ? "Edite as informações do ramal" : "Adicione um novo ramal"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ext-name">Nome</Label>
                <Input
                  id="ext-name"
                  value={editingExtension ? editingExtension.name : newExtension.name}
                  onChange={(e) => {
                    if (editingExtension) {
                      setEditingExtension({ ...editingExtension, name: e.target.value })
                    } else {
                      setNewExtension({ ...newExtension, name: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="ext-extension">Ramal</Label>
                <Input
                  id="ext-extension"
                  value={editingExtension ? editingExtension.extension : newExtension.extension}
                  onChange={(e) => {
                    if (editingExtension) {
                      setEditingExtension({ ...editingExtension, extension: e.target.value })
                    } else {
                      setNewExtension({ ...newExtension, extension: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="ext-department">Departamento</Label>
                <Input
                  id="ext-department"
                  value={editingExtension ? editingExtension.department : newExtension.department}
                  onChange={(e) => {
                    if (editingExtension) {
                      setEditingExtension({ ...editingExtension, department: e.target.value })
                    } else {
                      setNewExtension({ ...newExtension, department: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="ext-position">Cargo (opcional)</Label>
                <Input
                  id="ext-position"
                  value={editingExtension ? editingExtension.position || "" : newExtension.position}
                  onChange={(e) => {
                    if (editingExtension) {
                      setEditingExtension({ ...editingExtension, position: e.target.value })
                    } else {
                      setNewExtension({ ...newExtension, position: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="ext-email">Email (opcional)</Label>
                <Input
                  id="ext-email"
                  type="email"
                  value={editingExtension ? editingExtension.email || "" : newExtension.email}
                  onChange={(e) => {
                    if (editingExtension) {
                      setEditingExtension({ ...editingExtension, email: e.target.value })
                    } else {
                      setNewExtension({ ...newExtension, email: e.target.value })
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="ext-mobile">Celular (opcional)</Label>
                <Input
                  id="ext-mobile"
                  value={editingExtension ? editingExtension.mobile || "" : newExtension.mobile}
                  onChange={(e) => {
                    if (editingExtension) {
                      setEditingExtension({ ...editingExtension, mobile: e.target.value })
                    } else {
                      setNewExtension({ ...newExtension, mobile: e.target.value })
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowExtensionDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingExtension ? handleUpdateExtension : handleCreateExtension}>
                  {editingExtension ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Configurações */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configurações do Sistema</DialogTitle>
              <DialogDescription>Configure as informações gerais do sistema</DialogDescription>
            </DialogHeader>
            {editingSettings && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={editingSettings.company_name}
                    onChange={(e) => setEditingSettings({ ...editingSettings, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo-url">URL do Logo</Label>
                  <Input
                    id="logo-url"
                    type="url"
                    value={editingSettings.logo_url || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, logo_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Cor Primária</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {categoryColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingSettings.primary_color === color ? "border-gray-900" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingSettings({ ...editingSettings, primary_color: color })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Cor Secundária</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {categoryColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingSettings.secondary_color === color ? "border-gray-900" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingSettings({ ...editingSettings, secondary_color: color })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Cor de Destaque</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {categoryColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingSettings.accent_color === color ? "border-gray-900" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingSettings({ ...editingSettings, accent_color: color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateSettings}>Salvar</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para editar post */}
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Post</DialogTitle>
              <DialogDescription>Faça as alterações necessárias na publicação.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editPostForm.title}
                  onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select
                    value={editPostForm.type}
                    onValueChange={(value: Post["type"]) => setEditPostForm({ ...editPostForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">🔹 Geral</SelectItem>
                      <SelectItem value="announcement">📢 Comunicado</SelectItem>
                      <SelectItem value="event">🎉 Evento</SelectItem>
                      <SelectItem value="birthday">🎂 Aniversário</SelectItem>
                      <SelectItem value="departure">👋 Desligamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Prioridade</Label>
                  <Select
                    value={editPostForm.priority}
                    onValueChange={(value: Post["priority"]) => setEditPostForm({ ...editPostForm, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Baixa</SelectItem>
                      <SelectItem value="medium">🟡 Média</SelectItem>
                      <SelectItem value="high">🔴 Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expires">Data de Expiração</Label>
                <Input
                  id="edit-expires"
                  type="datetime-local"
                  value={editPostForm.expires_at}
                  onChange={(e) => setEditPostForm({ ...editPostForm, expires_at: e.target.value })}
                />
              </div>

              {/* Upload de Imagem no Dialog de Edição */}
              <div className="grid gap-2">
                <Label>Imagem (opcional)</Label>
                <div className="mt-2">
                  {!editImagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="edit-file-upload" className="cursor-pointer">
                          <span className="text-sm font-medium text-gray-900">Clique para fazer upload</span>
                          <span className="block text-xs text-gray-500">PNG, JPG, GIF até 5MB</span>
                        </label>
                        <input
                          id="edit-file-upload"
                          name="edit-file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={editImagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full max-w-sm h-auto rounded-lg border shadow-sm"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage()}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-content">Conteúdo</Label>
                <Textarea
                  id="edit-content"
                  value={editPostForm.content}
                  onChange={(e) => setEditPostForm({ ...editPostForm, content: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-published"
                  checked={editPostForm.published}
                  onCheckedChange={(checked) => setEditPostForm({ ...editPostForm, published: checked })}
                />
                <Label htmlFor="edit-published">Publicado</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPostDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdatePost}>Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
