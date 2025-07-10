export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  department?: string
  title?: string
  active?: boolean
  last_login?: string
  groups?: string[]
  link_permissions?: string[]
  password?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  color?: string
  permissions?: string[]
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  groups?: string[]
}

export interface Link {
  id: string
  name: string
  url: string
  description?: string
  icon?: string
  image_url?: string
  category?: string
  category_id?: string
  groups?: string[]
}

export interface Post {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at?: string
  published_at?: string
  expires_at?: string
  priority: "high" | "medium" | "low"
  type: "general" | "news" | "event" | "announcement" | "birthday" | "departure"
  published: boolean
  image_url?: string
}

export interface Extension {
  id: string
  name: string
  extension: string
  department: string
  position?: string
  email?: string
  mobile?: string
}

export interface Settings {
  company_name: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  accent_color: string
}

// Dados iniciais
const initialUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@repros.com.br",
    role: "admin",
    department: "TI",
    title: "Administrador do Sistema",
    active: true,
    groups: ["admin"],
    link_permissions: [],
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@repros.com.br",
    role: "user",
    department: "Vendas",
    title: "Analista de Vendas",
    active: true,
    groups: ["user"],
    link_permissions: [],
  },
]

const initialPosts: Post[] = [
  {
    id: "1",
    title: "🎉 Aniversariantes de Janeiro",
    content:
      "Parabéns aos aniversariantes do mês! 🎂 Desejamos muito sucesso e felicidades! 😊 Maria Santos - 15/01 😊 João Silva - 22/01 😊 Ana Costa - 28/01",
    author: "RH",
    created_at: "2025-01-02T08:13:00Z",
    priority: "medium",
    type: "birthday",
    published: true,
    published_at: "2025-01-02T08:13:00Z",
  },
  {
    id: "2",
    title: "📢 Comunicado Importante - Horário de Funcionamento",
    content:
      "Informamos que a partir de segunda-feira (06/01), o horário de funcionamento da empresa será: ⏰ Segunda a Quinta: 8h às 18h ⏰ Sexta-feira: 8h às 17h Contamos com a colaboração de todos!",
    author: "Diretoria",
    created_at: "2025-01-02T09:13:00Z",
    priority: "high",
    type: "announcement",
    published: true,
    published_at: "2025-01-02T09:13:00Z",
  },
  {
    id: "3",
    title: "🔧 Manutenção Sistema Financeiro",
    content:
      "O sistema financeiro passará por manutenção programada: 📅 Data: Sábado, 11/01/2025 🕐 Horário: 8h às 12h Durante este período, o acesso estará temporariamente indisponível. Pedimos a compreensão de todos!",
    author: "TI",
    created_at: "2025-01-02T09:43:00Z",
    priority: "high",
    type: "news",
    published: true,
    published_at: "2025-01-02T09:43:00Z",
  },
]

const initialPortals: Link[] = [
  {
    id: "1",
    name: "Sistema ERP",
    description: "Sistema integrado de gestão empresarial",
    url: "https://erp.repros.com.br",
    icon: "Database",
    category: "Gestão",
    groups: ["admin", "user"],
  },
  {
    id: "2",
    name: "Portal RH",
    description: "Gestão de recursos humanos e folha de pagamento",
    url: "https://rh.repros.com.br",
    icon: "Users",
    category: "RH",
    groups: ["admin", "rh"],
  },
  {
    id: "3",
    name: "Sistema Financeiro",
    description: "Controle financeiro e contábil",
    url: "https://financeiro.repros.com.br",
    icon: "DollarSign",
    category: "Financeiro",
    groups: ["admin", "financeiro"],
  },
  {
    id: "4",
    name: "CRM Vendas",
    description: "Gestão de clientes e oportunidades de vendas",
    url: "https://crm.repros.com.br",
    icon: "TrendingUp",
    category: "Vendas",
    groups: ["admin", "vendas"],
  },
  {
    id: "5",
    name: "Suporte Técnico",
    description: "Central de atendimento e suporte aos clientes",
    url: "https://suporte.repros.com.br",
    icon: "Headphones",
    category: "Suporte",
    groups: ["admin", "suporte"],
  },
  {
    id: "6",
    name: "Business Intelligence",
    description: "Relatórios e análises de dados empresariais",
    url: "https://bi.repros.com.br",
    icon: "BarChart3",
    category: "Análise",
    groups: ["admin"],
  },
]

const initialExtensions: Extension[] = [
  {
    id: "1",
    name: "Maria Santos",
    extension: "1001",
    department: "Recepção",
    email: "maria@repros.com.br",
  },
  {
    id: "2",
    name: "João Silva",
    extension: "1002",
    department: "Vendas",
    email: "joao@repros.com.br",
  },
  {
    id: "3",
    name: "Ana Costa",
    extension: "1003",
    department: "RH",
    email: "ana@repros.com.br",
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    extension: "1004",
    department: "TI",
    email: "carlos@repros.com.br",
  },
  {
    id: "5",
    name: "Fernanda Lima",
    extension: "1005",
    department: "Financeiro",
    email: "fernanda@repros.com.br",
  },
]

const initialGroups: Group[] = [
  { id: "1", name: "admin", description: "Administradores", color: "#ef4444" },
  { id: "2", name: "user", description: "Usuários", color: "#3b82f6" },
  { id: "3", name: "rh", description: "Recursos Humanos", color: "#10b981" },
  { id: "4", name: "financeiro", description: "Financeiro", color: "#f59e0b" },
  { id: "5", name: "vendas", description: "Vendas", color: "#8b5cf6" },
  { id: "6", name: "suporte", description: "Suporte", color: "#06b6d4" },
]

const initialCategories: Category[] = [
  { id: "1", name: "Gestão", description: "Sistemas de gestão", color: "#3b82f6", icon: "📊" },
  { id: "2", name: "RH", description: "Recursos Humanos", color: "#10b981", icon: "👥" },
  { id: "3", name: "Financeiro", description: "Sistemas financeiros", color: "#f59e0b", icon: "💰" },
  { id: "4", name: "Vendas", description: "Sistemas de vendas", color: "#8b5cf6", icon: "📈" },
  { id: "5", name: "Suporte", description: "Sistemas de suporte", color: "#06b6d4", icon: "🎧" },
  { id: "6", name: "Análise", description: "Business Intelligence", color: "#6366f1", icon: "📊" },
]

const initialSettings: Settings = {
  company_name: "REPROS",
  logo_url: "",
  primary_color: "#3b82f6",
  secondary_color: "#ef4444",
  accent_color: "#10b981",
}

// Storage keys
const STORAGE_KEYS = {
  users: "intranet_users",
  groups: "intranet_groups",
  categories: "intranet_categories",
  links: "intranet_links",
  posts: "intranet_posts",
  extensions: "intranet_extensions",
  settings: "intranet_settings",
  currentUser: "intranet_current_user",
}

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Initialize data
export function initializeData(): void {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    saveToStorage(STORAGE_KEYS.users, initialUsers)
  }
  if (!localStorage.getItem(STORAGE_KEYS.groups)) {
    saveToStorage(STORAGE_KEYS.groups, initialGroups)
  }
  if (!localStorage.getItem(STORAGE_KEYS.categories)) {
    saveToStorage(STORAGE_KEYS.categories, initialCategories)
  }
  if (!localStorage.getItem(STORAGE_KEYS.links)) {
    saveToStorage(STORAGE_KEYS.links, initialPortals)
  }
  if (!localStorage.getItem(STORAGE_KEYS.posts)) {
    saveToStorage(STORAGE_KEYS.posts, initialPosts)
  }
  if (!localStorage.getItem(STORAGE_KEYS.extensions)) {
    saveToStorage(STORAGE_KEYS.extensions, initialExtensions)
  }
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    saveToStorage(STORAGE_KEYS.settings, initialSettings)
  }
}

// Authentication functions
export function login(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.active !== false)

  if (!user) return null

  // Simple password validation for demo
  const validPasswords: Record<string, string> = {
    "admin@repros.com.br": "admin",
    "joao@repros.com.br": "123456",
  }

  if (validPasswords[email] === password) {
    const updatedUser = { ...user, last_login: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.currentUser, updatedUser)
    return updatedUser
  }

  return null
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.currentUser)
  }
}

export function getCurrentUser(): User | null {
  return loadFromStorage<User | null>(STORAGE_KEYS.currentUser, null)
}

// User CRUD operations
export function getUsers(): User[] {
  return loadFromStorage<User[]>(STORAGE_KEYS.users, initialUsers)
}

export function addUser(userData: Omit<User, "id">): User {
  const users = getUsers()
  const newUser: User = {
    id: generateId(),
    ...userData,
    active: userData.active ?? true,
  }
  users.push(newUser)
  saveToStorage(STORAGE_KEYS.users, users)
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], ...updates }
  saveToStorage(STORAGE_KEYS.users, users)
  return users[userIndex]
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.id !== id)
  if (filteredUsers.length === users.length) return false

  saveToStorage(STORAGE_KEYS.users, filteredUsers)
  return true
}

// Group CRUD operations
export function getGroups(): Group[] {
  return loadFromStorage<Group[]>(STORAGE_KEYS.groups, initialGroups)
}

export function addGroup(groupData: Omit<Group, "id">): Group {
  const groups = getGroups()
  const newGroup: Group = {
    id: generateId(),
    ...groupData,
  }
  groups.push(newGroup)
  saveToStorage(STORAGE_KEYS.groups, groups)
  return newGroup
}

export function updateGroup(id: string, updates: Partial<Group>): Group | null {
  const groups = getGroups()
  const groupIndex = groups.findIndex((g) => g.id === id)
  if (groupIndex === -1) return null

  groups[groupIndex] = { ...groups[groupIndex], ...updates }
  saveToStorage(STORAGE_KEYS.groups, groups)
  return groups[groupIndex]
}

export function deleteGroup(id: string): boolean {
  const groups = getGroups()
  const filteredGroups = groups.filter((g) => g.id !== id)
  if (filteredGroups.length === groups.length) return false

  saveToStorage(STORAGE_KEYS.groups, filteredGroups)
  return true
}

// Category CRUD operations
export function getCategories(): Category[] {
  return loadFromStorage<Category[]>(STORAGE_KEYS.categories, initialCategories)
}

export function addCategory(categoryData: Omit<Category, "id">): Category {
  const categories = getCategories()
  const newCategory: Category = {
    id: generateId(),
    ...categoryData,
  }
  categories.push(newCategory)
  saveToStorage(STORAGE_KEYS.categories, categories)
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories()
  const categoryIndex = categories.findIndex((c) => c.id === id)
  if (categoryIndex === -1) return null

  categories[categoryIndex] = { ...categories[categoryIndex], ...updates }
  saveToStorage(STORAGE_KEYS.categories, categories)
  return categories[categoryIndex]
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const filteredCategories = categories.filter((c) => c.id !== id)
  if (filteredCategories.length === categories.length) return false

  saveToStorage(STORAGE_KEYS.categories, filteredCategories)
  return true
}

// Link CRUD operations
export function getLinks(): Link[] {
  return loadFromStorage<Link[]>(STORAGE_KEYS.links, initialPortals)
}

export function addLink(linkData: Omit<Link, "id">): Link {
  const links = getLinks()
  const newLink: Link = {
    id: generateId(),
    ...linkData,
  }
  links.push(newLink)
  saveToStorage(STORAGE_KEYS.links, links)
  return newLink
}

export function updateLink(id: string, updates: Partial<Link>): Link | null {
  const links = getLinks()
  const linkIndex = links.findIndex((l) => l.id === id)
  if (linkIndex === -1) return null

  links[linkIndex] = { ...links[linkIndex], ...updates }
  saveToStorage(STORAGE_KEYS.links, links)
  return links[linkIndex]
}

export function deleteLink(id: string): boolean {
  const links = getLinks()
  const filteredLinks = links.filter((l) => l.id !== id)
  if (filteredLinks.length === links.length) return false

  saveToStorage(STORAGE_KEYS.links, filteredLinks)
  return true
}

// Post CRUD operations
export function getPosts(): Post[] {
  return loadFromStorage<Post[]>(STORAGE_KEYS.posts, initialPosts)
}

export function savePosts(posts: Post[]): void {
  saveToStorage(STORAGE_KEYS.posts, posts)
}

export function deletePost(id: string): boolean {
  const posts = getPosts()
  const filteredPosts = posts.filter((p) => p.id !== id)
  if (filteredPosts.length === posts.length) return false

  savePosts(filteredPosts)
  return true
}

// Extension CRUD operations
export function getExtensions(): Extension[] {
  return loadFromStorage<Extension[]>(STORAGE_KEYS.extensions, initialExtensions)
}

export function addExtension(extensionData: Omit<Extension, "id">): Extension {
  const extensions = getExtensions()
  const newExtension: Extension = {
    id: generateId(),
    ...extensionData,
  }
  extensions.push(newExtension)
  saveToStorage(STORAGE_KEYS.extensions, extensions)
  return newExtension
}

export function updateExtension(id: string, updates: Partial<Extension>): Extension | null {
  const extensions = getExtensions()
  const extensionIndex = extensions.findIndex((e) => e.id === id)
  if (extensionIndex === -1) return null

  extensions[extensionIndex] = { ...extensions[extensionIndex], ...updates }
  saveToStorage(STORAGE_KEYS.extensions, extensions)
  return extensions[extensionIndex]
}

export function deleteExtension(id: string): boolean {
  const extensions = getExtensions()
  const filteredExtensions = extensions.filter((e) => e.id !== id)
  if (filteredExtensions.length === extensions.length) return false

  saveToStorage(STORAGE_KEYS.extensions, filteredExtensions)
  return true
}

// Settings operations
export function getSettings(): Settings {
  return loadFromStorage<Settings>(STORAGE_KEYS.settings, initialSettings)
}

export function updateSettings(updates: Partial<Settings>): Settings {
  const currentSettings = getSettings()
  const newSettings = { ...currentSettings, ...updates }
  saveToStorage(STORAGE_KEYS.settings, newSettings)
  return newSettings
}

// Portal operations (compatibility)
export interface Portal {
  id: string
  name: string
  description: string
  url: string
  icon: string
  color: string
  category: string
  access_level: "public" | "restricted" | "admin"
  favorite: boolean
}

export function getPortals(): Portal[] {
  const links = getLinks()
  return links.map((link) => ({
    id: link.id,
    name: link.name || "",
    description: link.description || "",
    url: link.url,
    icon: link.icon || "ExternalLink",
    color: "blue",
    category: link.category || "Geral",
    access_level: "public" as const,
    favorite: false,
  }))
}

export function togglePortalFavorite(portalId: string): void {
  // This is a placeholder for portal favorite functionality
  console.log("Toggle favorite for portal:", portalId)
}

// Utility functions
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "agora"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}

export function getPostTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    general: "FileText",
    news: "Newspaper",
    event: "Calendar",
    announcement: "Megaphone",
    birthday: "Cake",
    departure: "UserMinus",
  }
  return iconMap[type] || "FileText"
}

export function getPostTypeName(type: string): string {
  const nameMap: Record<string, string> = {
    general: "Geral",
    news: "Notícia",
    event: "Evento",
    announcement: "Comunicado",
    birthday: "Aniversário",
    departure: "Desligamento",
  }
  return nameMap[type] || "Geral"
}

export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }
  return colorMap[priority] || "bg-gray-100 text-gray-800 border-gray-200"
}
