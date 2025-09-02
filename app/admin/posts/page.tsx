"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  Upload,
  X,
} from "lucide-react"
import Link from "next/link"
import {
  getPosts,
  savePosts,
  getUsers,
  initializeData,
  getPostTypeIcon,
  getPostTypeName,
  getPriorityColor,
  getCurrentUser,
  type User as UserType,
  type Post,
} from "@/lib/local-storage"

export default function AdminPostsPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const [imagePreview, setImagePreview] = useState("")
  const [editImagePreview, setEditImagePreview] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null)

  const router = useRouter()

  // Estados para formulário de novo post
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    type: "general" as Post["type"],
    priority: "medium" as Post["priority"],
    published: true,
    expires_at: "",
    image_url: "",
  })

  // Estados para edição de post
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editPostForm, setEditPostForm] = useState({
    title: "",
    content: "",
    type: "general" as Post["type"],
    priority: "medium" as Post["priority"],
    published: true,
    expires_at: "",
    image_url: "",
  })
  const [editPostDialogOpen, setEditPostDialogOpen] = useState(false)

  useEffect(() => {
    console.log("🔧 Inicializando página admin posts...")
    initializeData()

    // Usar getCurrentUser em vez de localStorage diretamente
    const currentUser = getCurrentUser()
    console.log("👤 Usuário atual:", currentUser)

    if (!currentUser) {
      console.log("❌ Nenhum usuário logado, redirecionando...")
      router.push("/login")
      return
    }

    if (currentUser.role !== "admin") {
      console.log("❌ Usuário não é admin, redirecionando...")
      router.push("/dashboard")
      return
    }

    console.log("✅ Usuário admin autenticado:", currentUser.name)
    setUser(currentUser)

    // Carregar posts
    setPosts(getPosts())
    setLoading(false)
  }, [router])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Função para redimensionar imagem
  const resizeImage = (file: File, maxWidth = 400, maxHeight = 600): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calcular proporções mantendo aspect ratio
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

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height)

        // Converter para base64 com qualidade otimizada
        resolve(canvas.toDataURL("image/jpeg", 0.8))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Função para lidar com seleção de arquivo
  const handleFileSelect = async (file: File | null, isEdit = false) => {
    if (!file) return

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      showMessage("Por favor, selecione apenas arquivos de imagem")
      return
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("A imagem deve ter no máximo 5MB")
      return
    }

    try {
      // Redimensionar imagem para tamanho otimizado
      const resizedBase64 = await resizeImage(file, 400, 600)

      if (isEdit) {
        setEditSelectedFile(file)
        setEditImagePreview(resizedBase64)
        setEditPostForm({ ...editPostForm, image_url: resizedBase64 })
      } else {
        setSelectedFile(file)
        setImagePreview(resizedBase64)
        setNewPost({ ...newPost, image_url: resizedBase64 })
      }
    } catch (error) {
      showMessage("Erro ao processar a imagem")
    }
  }

  // Função para remover imagem
  const removeImage = (isEdit = false) => {
    if (isEdit) {
      setEditSelectedFile(null)
      setEditImagePreview("")
      setEditPostForm({ ...editPostForm, image_url: "" })
    } else {
      setSelectedFile(null)
      setImagePreview("")
      setNewPost({ ...newPost, image_url: "" })
    }
  }

  const addPost = () => {
    if (!newPost.title || !newPost.content) {
      showMessage("Título e conteúdo são obrigatórios")
      return
    }

    if (!user) return

    const now = new Date().toISOString()
    const newPostData: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      type: newPost.type,
      priority: newPost.priority,
      published: newPost.published,
      published_at: newPost.published ? now : undefined,
      expires_at: newPost.expires_at || undefined,
      created_by: user.id,
      created_at: now,
      updated_at: now,
      image_url: newPost.image_url || undefined,
    }

    const updatedPosts = [newPostData, ...posts]
    setPosts(updatedPosts)
    savePosts(updatedPosts)

    // Limpar formulário
    setNewPost({
      title: "",
      content: "",
      type: "general",
      priority: "medium",
      published: true,
      expires_at: "",
      image_url: "",
    })
    setSelectedFile(null)
    setImagePreview("")

    showMessage("Post criado com sucesso!")
  }

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
    setEditSelectedFile(null)
    setEditPostDialogOpen(true)
  }

  const saveEditPost = () => {
    if (!editingPost || !editPostForm.title || !editPostForm.content) {
      showMessage("Título e conteúdo são obrigatórios")
      return
    }

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
    setEditPostDialogOpen(false)
    setEditingPost(null)
    setEditSelectedFile(null)
    setEditImagePreview("")
    showMessage("Post atualizado com sucesso!")
  }

  const togglePostStatus = (postId: string) => {
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

  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId)
    setPosts(updatedPosts)
    savePosts(updatedPosts)
    showMessage("Post removido!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAuthorName = (authorId: string) => {
    const users = getUsers()
    const author = users.find((u) => u.id === authorId)
    return author?.name || "Usuário"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando gerenciador de posts...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const publishedPosts = posts.filter((p) => p.published)
  const draftPosts = posts.filter((p) => !p.published)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Posts</h1>
            </div>
            <Badge variant="secondary">Admin: {user.name}</Badge>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Criar Post</TabsTrigger>
            <TabsTrigger value="published">Publicados ({publishedPosts.length})</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos ({draftPosts.length})</TabsTrigger>
          </TabsList>

          {/* Criar Post */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Nova Publicação</span>
                </CardTitle>
                <CardDescription>Crie anúncios, avisos de eventos, aniversários e mais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="post-title">Título</Label>
                    <Input
                      id="post-title"
                      placeholder="Ex: Festa de fim de ano"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-type">Tipo</Label>
                    <Select
                      value={newPost.type}
                      onValueChange={(value: Post["type"]) => setNewPost({ ...newPost, type: value })}
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
                    <Label htmlFor="post-priority">Prioridade</Label>
                    <Select
                      value={newPost.priority}
                      onValueChange={(value: Post["priority"]) => setNewPost({ ...newPost, priority: value })}
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
                  <div>
                    <Label htmlFor="post-expires">Data de Expiração (opcional)</Label>
                    <Input
                      id="post-expires"
                      type="datetime-local"
                      value={newPost.expires_at}
                      onChange={(e) => setNewPost({ ...newPost, expires_at: e.target.value })}
                    />
                  </div>
                </div>

                {/* Upload de Imagem */}
                <div>
                  <Label htmlFor="post-image">Imagem (opcional)</Label>
                  <div className="mt-2">
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Clique para fazer upload ou arraste uma imagem
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">PNG, JPG, GIF até 5MB</span>
                          </label>
                          <input
                            id="file-upload"
                            name="file-upload"
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
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full max-w-md h-auto rounded-lg border shadow-sm"
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
                        <div className="mt-2 text-sm text-gray-600">
                          {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="post-content">Conteúdo</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Digite o conteúdo da publicação..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={6}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="post-published"
                    checked={newPost.published}
                    onCheckedChange={(checked) => setNewPost({ ...newPost, published: checked })}
                  />
                  <Label htmlFor="post-published">Publicar imediatamente</Label>
                </div>

                <Button onClick={addPost} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  {newPost.published ? "Publicar" : "Salvar como Rascunho"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Publicados */}
          <TabsContent value="published" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Posts Publicados</CardTitle>
                <CardDescription>Gerencie suas publicações ativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishedPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                            <h3 className="font-medium">{post.title}</h3>
                            <Badge variant="outline" style={{ borderColor: getPriorityColor(post.priority) }}>
                              {getPostTypeName(post.type)}
                            </Badge>
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
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{getAuthorName(post.created_by)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(post.published_at || post.created_at)}</span>
                            </div>
                            {post.expires_at && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Expira: {formatDate(post.expires_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => openEditPostDialog(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => togglePostStatus(post.id)}>
                            <EyeOff className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {publishedPosts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum post publicado ainda.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rascunhos */}
          <TabsContent value="drafts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rascunhos</CardTitle>
                <CardDescription>Posts salvos que ainda não foram publicados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {draftPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                            <h3 className="font-medium">{post.title}</h3>
                            <Badge variant="secondary">Rascunho</Badge>
                            <Badge variant="outline" style={{ borderColor: getPriorityColor(post.priority) }}>
                              {getPostTypeName(post.type)}
                            </Badge>
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
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{getAuthorName(post.created_by)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Criado: {formatDate(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => openEditPostDialog(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => togglePostStatus(post.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {draftPosts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum rascunho salvo.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para editar post */}
        <Dialog open={editPostDialogOpen} onOpenChange={setEditPostDialogOpen}>
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
                          onChange={(e) => handleFileSelect(e.target.files?.[0] || null, true)}
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
                        onClick={() => removeImage(true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {editSelectedFile && (
                        <div className="mt-2 text-sm text-gray-600">
                          {editSelectedFile.name} ({(editSelectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
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
              <Button variant="outline" onClick={() => setEditPostDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveEditPost}>Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
