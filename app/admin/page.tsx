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
  getGroups,
  getCategories,
  getLinks,
  getPosts,
  getExtensions,
  addUser,
  updateUser,
  deleteUser,
  addGroup,
  updateGroup,
  deleteGroup,
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
  formatTimeAgo,
} from "@/lib/local-storage"
import type { User, Group, Category, Link as LinkType, Post, Extension, Settings } from "@/lib/local-storage"
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
  Shield,
  UserCheck,
  Clock,
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
  const [groups, setGroups] = useState<Group[]>([])
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
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
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
    link_permissions: [] as string[],
  })
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    color: "#6b7280",
    permissions: [] as string[],
  })
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "📁",
    groups: [] as string[],
  })
  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    description: "",
    icon: "🔗",
    image_url: "",
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
  const [showGroupDialog, setShowGroupDialog] = useState(false)
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
    setGroups(getGroups())
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
      link_permissions: [],
    })
  }

  const resetNewGroup = () => {
    setNewGroup({
      name: "",
      description: "",
      color: "#6b7280",
      permissions: [],
    })
  }

  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "📁",
      groups: [],
    })
  }

  const resetNewLink = () => {
    setNewLink({
      name: "",
      url: "",
      description: "",
      icon: "🔗",
      image_url: "",
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
        link_permissions: newUser.link_permissions,
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
        link_permissions: editingUser.link_permissions,
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

  const handleCreateGroup = () => {
    if (!newGroup.name) {
      showMessage("Nome do grupo é obrigatório")
      return
    }

    try {
      addGroup({
        name: newGroup.name,
        description: newGroup.description,
        color: newGroup.color,
        permissions: newGroup.permissions,
      })

      resetNewGroup()
      setShowGroupDialog(false)
      loadData()
      showMessage("Grupo criado com sucesso!")
    } catch (error) {
      showMessage("Erro ao criar grupo")
    }
  }

  const handleUpdateGroup = () => {
    if (!editingGroup || !editingGroup.name) {
      showMessage("Nome do grupo é obrigatório")
      return
    }

    try {
      updateGroup(editingGroup.id, {
        name: editingGroup.name,
        description: editingGroup.description,
        color: editingGroup.color,
        permissions: editingGroup.permissions,
      })

      setEditingGroup(null)
      setShowGroupDialog(false)
      loadData()
      showMessage("Grupo atualizado com sucesso!")
    } catch (error) {
      showMessage("Erro ao atualizar grupo")
    }
  }

  const handleDeleteGroup = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este grupo?")) {
      try {
        deleteGroup(id)
        loadData()
        showMessage("Grupo excluído com sucesso!")
      } catch (error) {
        showMessage("Erro ao excluir grupo")
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
        icon: newCategory.icon,
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
        icon: editingCategory.icon,
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
        description: newLink.description,
        icon: newLink.icon,
        image_url: newLink.image_url,
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
        description: editingLink.description,
        icon: editingLink.icon,
        image_url: editingLink.image_url,
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

  const toggleLinkPermission = (permissions: string[], linkId: string) => {
    return permissions.includes(linkId) ? permissions.filter((id) => id !== linkId) : [...permissions, linkId]
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

  // Função para redimensionar imagem para links:
  const resizeLinkImage = (file: File, maxWidth = 64, maxHeight = 64): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        canvas.width = maxWidth
        canvas.height = maxHeight

        // Calcular dimensões mantendo proporção
        let { width, height } = img
        const aspectRatio = width / height

        if (aspectRatio > 1) {
          width = maxWidth
          height = maxWidth / aspectRatio
        } else {
          height = maxHeight
          width = maxHeight * aspectRatio
        }

        // Centralizar a imagem no canvas
        const x = (maxWidth - width) / 2
        const y = (maxHeight - height) / 2

        ctx.fillStyle = "#f8f9fa"
        ctx.fillRect(0, 0, maxWidth, maxHeight)
        ctx.drawImage(img, x, y, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.9))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleLinkImageSelect = async (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showMessage("Por favor, selecione apenas arquivos de imagem")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage("A imagem deve ter no máximo 2MB")
      return
    }

    try {
      const resizedBase64 = await resizeLinkImage(file, 64, 64)
      if (editingLink) {
        setEditingLink({ ...editingLink, image_url: resizedBase64 })
      } else {
        setNewLink({ ...newLink, image_url: resizedBase64 })
      }
    } catch (error) {
      showMessage("Erro ao processar a imagem")
    }
  }

  const removeLinkImage = () => {
    if (editingLink) {
      setEditingLink({ ...editingLink, image_url: "" })
    } else {
      setNewLink({ ...newLink, image_url: "" })
    }
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Grupos
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
              Config
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
                          {userItem.active && (
                            <Badge variant="default" className="bg-green-600">
                              Ativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{userItem.email}</p>
                        {userItem.last_login && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Último login: {formatTimeAgo(userItem.last_login)}</span>
                          </div>
                        )}
                        {userItem.groups && userItem.groups.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {userItem.groups.map((group) => (
                              <Badge key={group} variant="secondary" className="text-xs capitalize">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {userItem.link_permissions && userItem.link_permissions.length > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-blue-600">
                            <UserCheck className="h-3 w-3" />
                            <span>{userItem.link_permissions.length} links específicos</span>
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

          {/* Grupos */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Grupos de Acesso</h2>
              <Button
                onClick={() => {
                  setEditingGroup(null)
                  resetNewGroup()
                  setShowGroupDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </div>

            <div className="grid gap-4">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                          <h3 className="font-medium">{group.name}</h3>
                        </div>
                        {group.description && <p className="text-sm text-gray-600">{group.description}</p>}
                        {group.permissions && group.permissions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {group.permissions.map((permission) => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {permission}
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
                            setEditingGroup(group)
                            setShowGroupDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGroup(group.id)}>
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
                          <span className="text-lg">{category.icon}</span>
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
                            <span className="text-lg">{link.icon}</span>
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
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: settings.primary_color }} />
                          <span className="text-sm">Primária</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: settings.secondary_color }} />
                          <span className="text-sm">Secundária</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: settings.accent_color }} />
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
      </main>

      {/* Dialog para Usuários */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Edite as informações do usuário" : "Preencha os dados do novo usuário"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, email: e.target.value })
                      : setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={editingUser ? editingUser.role : newUser.role}
                  onValueChange={(value: "admin" | "user") =>
                    editingUser
                      ? setEditingUser({ ...editingUser, role: value })
                      : setNewUser({ ...newUser, role: value })
                  }
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
                <Label htmlFor="password">Senha {!editingUser && "*"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={editingUser ? "Deixe em branco para manter" : "Digite a senha"}
                  value={editingUser ? editingUser.password || "" : newUser.password}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, password: e.target.value })
                      : setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Grupos de Acesso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {availableGroups.map((group) => (
                  <div key={group} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group}`}
                      checked={
                        editingUser ? editingUser.groups?.includes(group) || false : newUser.groups.includes(group)
                      }
                      onCheckedChange={(checked) => {
                        if (editingUser) {
                          const newGroups = checked
                            ? [...(editingUser.groups || []), group]
                            : (editingUser.groups || []).filter((g) => g !== group)
                          setEditingUser({ ...editingUser, groups: newGroups })
                        } else {
                          setNewUser({
                            ...newUser,
                            groups: toggleGroupSelection(newUser.groups, group),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`group-${group}`} className="text-sm capitalize">
                      {group}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Permissões Específicas de Links</Label>
              <p className="text-xs text-gray-500 mb-2">
                Se selecionado, o usuário terá acesso apenas aos links específicos marcados abaixo (ignora grupos)
              </p>
              <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                {linksData.map((link) => (
                  <div key={link.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`link-${link.id}`}
                      checked={
                        editingUser
                          ? editingUser.link_permissions?.includes(link.id) || false
                          : newUser.link_permissions.includes(link.id)
                      }
                      onCheckedChange={(checked) => {
                        if (editingUser) {
                          const newPermissions = checked
                            ? [...(editingUser.link_permissions || []), link.id]
                            : (editingUser.link_permissions || []).filter((id) => id !== link.id)
                          setEditingUser({ ...editingUser, link_permissions: newPermissions })
                        } else {
                          setNewUser({
                            ...newUser,
                            link_permissions: toggleLinkPermission(newUser.link_permissions, link.id),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`link-${link.id}`} className="text-sm">
                      {link.icon} {link.name}
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
                {editingUser ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Grupos */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? "Editar Grupo" : "Novo Grupo"}</DialogTitle>
            <DialogDescription>
              {editingGroup ? "Edite as informações do grupo" : "Preencha os dados do novo grupo"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="group-name">Nome *</Label>
              <Input
                id="group-name"
                value={editingGroup ? editingGroup.name : newGroup.name}
                onChange={(e) =>
                  editingGroup
                    ? setEditingGroup({ ...editingGroup, name: e.target.value })
                    : setNewGroup({ ...newGroup, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="group-description">Descrição</Label>
              <Textarea
                id="group-description"
                value={editingGroup ? editingGroup.description : newGroup.description}
                onChange={(e) =>
                  editingGroup
                    ? setEditingGroup({ ...editingGroup, description: e.target.value })
                    : setNewGroup({ ...newGroup, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="group-color">Cor</Label>
              <div className="flex gap-2 mt-2">
                {categoryColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded border-2 ${
                      (editingGroup ? editingGroup.color : newGroup.color) === color
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      editingGroup ? setEditingGroup({ ...editingGroup, color }) : setNewGroup({ ...newGroup, color })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGroupDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}>
                {editingGroup ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Categorias */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Edite as informações da categoria" : "Preencha os dados da nova categoria"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category-name">Nome *</Label>
                <Input
                  id="category-name"
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, name: e.target.value })
                      : setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="category-icon">Ícone</Label>
                <Input
                  id="category-icon"
                  value={editingCategory ? editingCategory.icon : newCategory.icon}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, icon: e.target.value })
                      : setNewCategory({ ...newCategory, icon: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-description">Descrição</Label>
              <Textarea
                id="category-description"
                value={editingCategory ? editingCategory.description : newCategory.description}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({ ...editingCategory, description: e.target.value })
                    : setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="category-color">Cor</Label>
              <div className="flex gap-2 mt-2">
                {categoryColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded border-2 ${
                      (editingCategory ? editingCategory.color : newCategory.color) === color
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, color })
                        : setNewCategory({ ...newCategory, color })
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Grupos com Acesso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {availableGroups.map((group) => (
                  <div key={group} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-group-${group}`}
                      checked={
                        editingCategory
                          ? editingCategory.groups?.includes(group) || false
                          : newCategory.groups.includes(group)
                      }
                      onCheckedChange={(checked) => {
                        if (editingCategory) {
                          const newGroups = checked
                            ? [...(editingCategory.groups || []), group]
                            : (editingCategory.groups || []).filter((g) => g !== group)
                          setEditingCategory({ ...editingCategory, groups: newGroups })
                        } else {
                          setNewCategory({
                            ...newCategory,
                            groups: toggleGroupSelection(newCategory.groups, group),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`category-group-${group}`} className="text-sm capitalize">
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
                {editingCategory ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Links */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? "Editar Link" : "Novo Link"}</DialogTitle>
            <DialogDescription>
              {editingLink ? "Edite as informações do link" : "Preencha os dados do novo link"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="link-name">Nome *</Label>
                <Input
                  id="link-name"
                  value={editingLink ? editingLink.name : newLink.name}
                  onChange={(e) =>
                    editingLink
                      ? setEditingLink({ ...editingLink, name: e.target.value })
                      : setNewLink({ ...newLink, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="link-icon">Ícone</Label>
                <Input
                  id="link-icon"
                  value={editingLink ? editingLink.icon : newLink.icon}
                  onChange={(e) =>
                    editingLink
                      ? setEditingLink({ ...editingLink, icon: e.target.value })
                      : setNewLink({ ...newLink, icon: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                type="url"
                value={editingLink ? editingLink.url : newLink.url}
                onChange={(e) =>
                  editingLink
                    ? setEditingLink({ ...editingLink, url: e.target.value })
                    : setNewLink({ ...newLink, url: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="link-description">Descrição</Label>
              <Textarea
                id="link-description"
                value={editingLink ? editingLink.description : newLink.description}
                onChange={(e) =>
                  editingLink
                    ? setEditingLink({ ...editingLink, description: e.target.value })
                    : setNewLink({ ...newLink, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="link-category">Categoria</Label>
              <Select
                value={editingLink ? editingLink.category_id : newLink.category_id}
                onValueChange={(value) =>
                  editingLink
                    ? setEditingLink({ ...editingLink, category_id: value })
                    : setNewLink({ ...newLink, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grupos com Acesso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {availableGroups.map((group) => (
                  <div key={group} className="flex items-center space-x-2">
                    <Checkbox
                      id={`link-group-${group}`}
                      checked={
                        editingLink ? editingLink.groups?.includes(group) || false : newLink.groups.includes(group)
                      }
                      onCheckedChange={(checked) => {
                        if (editingLink) {
                          const newGroups = checked
                            ? [...(editingLink.groups || []), group]
                            : (editingLink.groups || []).filter((g) => g !== group)
                          setEditingLink({ ...editingLink, groups: newGroups })
                        } else {
                          setNewLink({
                            ...newLink,
                            groups: toggleGroupSelection(newLink.groups, group),
                          })
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

            {/* Dentro do Dialog para Links, após o campo de ícone */}
            <div>
              <Label>Imagem do Sistema (opcional)</Label>
              <p className="text-xs text-gray-500 mb-2">
                Faça upload de uma imagem para usar como ícone personalizado (64x64px, máx 2MB)
              </p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLinkImageSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="link-image-upload"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("link-image-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                  {(editingLink?.image_url || newLink.image_url) && (
                    <Button type="button" variant="outline" onClick={removeLinkImage}>
                      <X className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  )}
                </div>
                {(editingLink?.image_url || newLink.image_url) && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                    <img
                      src={editingLink?.image_url || newLink.image_url || "/placeholder.svg"}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div className="text-sm text-gray-600">
                      <p>Imagem carregada com sucesso</p>
                      <p className="text-xs">Esta imagem será usada como ícone do sistema</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={editingLink ? handleUpdateLink : handleCreateLink}>
                {editingLink ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Posts */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Publicação</DialogTitle>
            <DialogDescription>Edite as informações da publicação</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="post-title">Título *</Label>
              <Input
                id="post-title"
                value={editPostForm.title}
                onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="post-content">Conteúdo *</Label>
              <Textarea
                id="post-content"
                rows={6}
                value={editPostForm.content}
                onChange={(e) => setEditPostForm({ ...editPostForm, content: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="post-type">Tipo</Label>
                <Select
                  value={editPostForm.type}
                  onValueChange={(value: Post["type"]) => setEditPostForm({ ...editPostForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="news">Notícia</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="announcement">Comunicado</SelectItem>
                    <SelectItem value="birthday">Aniversário</SelectItem>
                    <SelectItem value="departure">Desligamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="post-priority">Prioridade</Label>
                <Select
                  value={editPostForm.priority}
                  onValueChange={(value: Post["priority"]) => setEditPostForm({ ...editPostForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="post-expires">Data de Expiração (opcional)</Label>
              <Input
                id="post-expires"
                type="date"
                value={editPostForm.expires_at ? editPostForm.expires_at.split("T")[0] : ""}
                onChange={(e) =>
                  setEditPostForm({
                    ...editPostForm,
                    expires_at: e.target.value ? new Date(e.target.value).toISOString() : "",
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="post-published"
                checked={editPostForm.published}
                onCheckedChange={(checked) => setEditPostForm({ ...editPostForm, published: checked })}
              />
              <Label htmlFor="post-published">Publicado</Label>
            </div>

            {/* Upload de Imagem */}
            <div>
              <Label>Imagem (opcional)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-upload"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                  {editImagePreview && (
                    <Button type="button" variant="outline" onClick={removeImage}>
                      <X className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  )}
                </div>
                {editImagePreview && (
                  <div className="mt-4">
                    <img
                      src={editImagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-xs max-h-48 object-contain rounded border shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPostDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdatePost}>Atualizar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Ramais */}
      <Dialog open={showExtensionDialog} onOpenChange={setShowExtensionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExtension ? "Editar Ramal" : "Novo Ramal"}</DialogTitle>
            <DialogDescription>
              {editingExtension ? "Edite as informações do ramal" : "Preencha os dados do novo ramal"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ext-name">Nome *</Label>
                <Input
                  id="ext-name"
                  value={editingExtension ? editingExtension.name : newExtension.name}
                  onChange={(e) =>
                    editingExtension
                      ? setEditingExtension({ ...editingExtension, name: e.target.value })
                      : setNewExtension({ ...newExtension, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ext-extension">Ramal *</Label>
                <Input
                  id="ext-extension"
                  value={editingExtension ? editingExtension.extension : newExtension.extension}
                  onChange={(e) =>
                    editingExtension
                      ? setEditingExtension({ ...editingExtension, extension: e.target.value })
                      : setNewExtension({ ...newExtension, extension: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ext-department">Departamento *</Label>
                <Input
                  id="ext-department"
                  value={editingExtension ? editingExtension.department : newExtension.department}
                  onChange={(e) =>
                    editingExtension
                      ? setEditingExtension({ ...editingExtension, department: e.target.value })
                      : setNewExtension({ ...newExtension, department: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ext-position">Cargo</Label>
                <Input
                  id="ext-position"
                  value={editingExtension ? editingExtension.position : newExtension.position}
                  onChange={(e) =>
                    editingExtension
                      ? setEditingExtension({ ...editingExtension, position: e.target.value })
                      : setNewExtension({ ...newExtension, position: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ext-email">Email</Label>
                <Input
                  id="ext-email"
                  type="email"
                  value={editingExtension ? editingExtension.email : newExtension.email}
                  onChange={(e) =>
                    editingExtension
                      ? setEditingExtension({ ...editingExtension, email: e.target.value })
                      : setNewExtension({ ...newExtension, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ext-mobile">Celular</Label>
                <Input
                  id="ext-mobile"
                  value={editingExtension ? editingExtension.mobile : newExtension.mobile}
                  onChange={(e) =>
                    editingExtension
                      ? setEditingExtension({ ...editingExtension, mobile: e.target.value })
                      : setNewExtension({ ...newExtension, mobile: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExtensionDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={editingExtension ? handleUpdateExtension : handleCreateExtension}>
                {editingExtension ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Configurações */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações do Sistema</DialogTitle>
            <DialogDescription>Edite as configurações gerais do sistema</DialogDescription>
          </DialogHeader>
          {editingSettings && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="settings-company">Nome da Empresa *</Label>
                <Input
                  id="settings-company"
                  value={editingSettings.company_name}
                  onChange={(e) => setEditingSettings({ ...editingSettings, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Logo da Empresa</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          showMessage("A imagem deve ter no máximo 2MB")
                          return
                        }

                        try {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string
                            setEditingSettings({ ...editingSettings, logo_url: base64 })
                          }
                          reader.readAsDataURL(file)
                        } catch (error) {
                          showMessage("Erro ao processar a imagem")
                        }
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingSettings.logo_url && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={editingSettings.logo_url || "/placeholder.svg"}
                        alt="Preview"
                        className="h-12 w-auto max-w-[120px] object-contain border rounded"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSettings({ ...editingSettings, logo_url: "" })}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label>Cores do Sistema</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="primary-color">Cor Primária</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={editingSettings.primary_color}
                      onChange={(e) => setEditingSettings({ ...editingSettings, primary_color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Cor Secundária</Label>
                    <Input
                      id="secondary-color"
                      type="color"
                      value={editingSettings.secondary_color}
                      onChange={(e) => setEditingSettings({ ...editingSettings, secondary_color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accent-color">Cor de Destaque</Label>
                    <Input
                      id="accent-color"
                      type="color"
                      value={editingSettings.accent_color}
                      onChange={(e) => setEditingSettings({ ...editingSettings, accent_color: e.target.value })}
                    />
                  </div>
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
    </div>
  )
}
