// Tipos
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
  department?: string
  title?: string
  active: boolean
  created_at: string
  last_login?: string
  groups?: string[]
  link_permissions?: string[]
}

export interface Post {
  id: string
  title: string
  content: string
  author: string
  type: "general" | "news" | "event" | "announcement" | "birthday" | "departure"
  priority: "low" | "medium" | "high"
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  expires_at?: string
  image_url?: string
}

export interface Portal {
  id: string
  name: string
  description: string
  url: string
  icon: string
  category: string
  access_level: "public" | "restricted" | "admin"
  favorite?: boolean
  color?: string
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

export interface Group {
  id: string
  name: string
  description: string
  color: string
  permissions: string[]
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  groups: string[]
}

export interface Link {
  id: string
  name: string
  url: string
  description: string
  icon: string
  image_url?: string
  category: string
  category_id?: string
  groups: string[]
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
    password: "admin",
    role: "admin",
    department: "TI",
    title: "Administrador do Sistema",
    active: true,
    created_at: new Date().toISOString(),
    groups: ["admin"],
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@repros.com.br",
    password: "123456",
    role: "user",
    department: "Vendas",
    title: "Consultor de Vendas",
    active: true,
    created_at: new Date().toISOString(),
    groups: ["user", "vendas"],
  },
]

const initialPosts: Post[] = [
  {
    id: "1",
    title: "Bem-vindos ao novo portal da REPROS!",
    content:
      "Estamos felizes em apresentar o novo portal corporativo da REPROS. Aqui você encontrará todas as informações importantes da empresa, comunicados, sistemas e muito mais.",
    author: "Administrador",
    type: "announcement",
    priority: "high",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Reunião mensal de resultados",
    content:
      "A reunião mensal de apresentação dos resultados acontecerá na próxima sexta-feira, às 14h, no auditório principal.",
    author: "RH",
    type: "event",
    priority: "medium",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const initialPortals: Portal[] = [
  {
    id: "1",
    name: "Sistema ERP",
    description: "Sistema integrado de gestão empresarial",
    url: "https://erp.repros.com.br",
    icon: "Database",
    category: "Gestão",
    access_level: "restricted",
    color: "blue",
  },
  {
    id: "2",
    name: "Portal RH",
    description: "Recursos humanos e folha de pagamento",
    url: "https://rh.repros.com.br",
    icon: "Users",
    category: "RH",
    access_level: "restricted",
    color: "green",
  },
  {
    id: "3",
    name: "Sistema Financeiro",
    description: "Controle financeiro e contábil",
    url: "https://financeiro.repros.com.br",
    icon: "DollarSign",
    category: "Financeiro",
    access_level: "restricted",
    color: "yellow",
  },
]

const initialExtensions: Extension[] = [
  {
    id: "1",
    name: "João Silva",
    extension: "1001",
    department: "Vendas",
    position: "Consultor",
    email: "joao@repros.com.br",
  },
  {
    id: "2",
    name: "Maria Santos",
    extension: "1002",
    department: "RH",
    position: "Analista",
    email: "maria@repros.com.br",
  },
  {
    id: "3",
    name: "Pedro Costa",
    extension: "1003",
    department: "Financeiro",
    position: "Contador",
    email: "pedro@repros.com.br",
  },
]

const initialSettings: Settings = {
  company_name: "REPROS",
  primary_color: "#2563eb",
  secondary_color: "#dc2626",
  accent_color: "#7c3aed",
}

// Funções de inicialização
export function initializeData() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("intranet_users")) {
    localStorage.setItem("intranet_users", JSON.stringify(initialUsers))
  }
  if (!localStorage.getItem("intranet_posts")) {
    localStorage.setItem("intranet_posts", JSON.stringify(initialPosts))
  }
  if (!localStorage.getItem("intranet_portals")) {
    localStorage.setItem("intranet_portals", JSON.stringify(initialPortals))
  }
  if (!localStorage.getItem("intranet_extensions")) {
    localStorage.setItem("intranet_extensions", JSON.stringify(initialExtensions))
  }
  if (!localStorage.getItem("intranet_settings")) {
    localStorage.setItem("intranet_settings", JSON.stringify(initialSettings))
  }
}

// Funções de autenticação
export function login(email: string, password: string): User | null {
  if (typeof window === "undefined") return null

  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password && u.active)

  if (user) {
    const updatedUser = { ...user, last_login: new Date().toISOString() }
    updateUser(user.id, updatedUser)
    localStorage.setItem("intranet_user", JSON.stringify(updatedUser))
    return updatedUser
  }

  return null
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem("intranet_user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("intranet_user")
  return userStr ? JSON.parse(userStr) : null
}

// Funções CRUD para Users
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("intranet_users")
  return users ? JSON.parse(users) : []
}

export function addUser(userData: Omit<User, "id" | "created_at">): User {
  const users = getUsers()
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem("intranet_users", JSON.stringify(users))
  return newUser
}

export function updateUser(id: string, userData: Partial<User>): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...userData }
    localStorage.setItem("intranet_users", JSON.stringify(users))
  }
}

export function deleteUser(id: string): void {
  const users = getUsers().filter((u) => u.id !== id)
  localStorage.setItem("intranet_users", JSON.stringify(users))
}

// Funções CRUD para Posts
export function getPosts(): Post[] {
  if (typeof window === "undefined") return []
  const posts = localStorage.getItem("intranet_posts")
  return posts ? JSON.parse(posts) : []
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem("intranet_posts", JSON.stringify(posts))
}

export function deletePost(id: string): void {
  const posts = getPosts().filter((p) => p.id !== id)
  savePosts(posts)
}

// Funções CRUD para Portals
export function getPortals(): Portal[] {
  if (typeof window === "undefined") return []
  const portals = localStorage.getItem("intranet_portals")
  return portals ? JSON.parse(portals) : []
}

export function togglePortalFavorite(id: string): void {
  const portals = getPortals()
  const index = portals.findIndex((p) => p.id === id)
  if (index !== -1) {
    portals[index].favorite = !portals[index].favorite
    localStorage.setItem("intranet_portals", JSON.stringify(portals))
  }
}

// Funções CRUD para Extensions
export function getExtensions(): Extension[] {
  if (typeof window === "undefined") return []
  const extensions = localStorage.getItem("intranet_extensions")
  return extensions ? JSON.parse(extensions) : []
}

export function addExtension(extensionData: Omit<Extension, "id">): Extension {
  const extensions = getExtensions()
  const newExtension: Extension = {
    ...extensionData,
    id: Date.now().toString(),
  }
  extensions.push(newExtension)
  localStorage.setItem("intranet_extensions", JSON.stringify(extensions))
  return newExtension
}

export function updateExtension(id: string, extensionData: Partial<Extension>): void {
  const extensions = getExtensions()
  const index = extensions.findIndex((e) => e.id === id)
  if (index !== -1) {
    extensions[index] = { ...extensions[index], ...extensionData }
    localStorage.setItem("intranet_extensions", JSON.stringify(extensions))
  }
}

export function deleteExtension(id: string): void {
  const extensions = getExtensions().filter((e) => e.id !== id)
  localStorage.setItem("intranet_extensions", JSON.stringify(extensions))
}

// Funções para Groups
export function getGroups(): Group[] {
  if (typeof window === "undefined") return []
  const groups = localStorage.getItem("intranet_groups")
  return groups ? JSON.parse(groups) : []
}

export function addGroup(groupData: Omit<Group, "id">): Group {
  const groups = getGroups()
  const newGroup: Group = {
    ...groupData,
    id: Date.now().toString(),
  }
  groups.push(newGroup)
  localStorage.setItem("intranet_groups", JSON.stringify(groups))
  return newGroup
}

export function updateGroup(id: string, groupData: Partial<Group>): void {
  const groups = getGroups()
  const index = groups.findIndex((g) => g.id === id)
  if (index !== -1) {
    groups[index] = { ...groups[index], ...groupData }
    localStorage.setItem("intranet_groups", JSON.stringify(groups))
  }
}

export function deleteGroup(id: string): void {
  const groups = getGroups().filter((g) => g.id !== id)
  localStorage.setItem("intranet_groups", JSON.stringify(groups))
}

// Funções para Categories
export function getCategories(): Category[] {
  if (typeof window === "undefined") return []
  const categories = localStorage.getItem("intranet_categories")
  return categories ? JSON.parse(categories) : []
}

export function addCategory(categoryData: Omit<Category, "id">): Category {
  const categories = getCategories()
  const newCategory: Category = {
    ...categoryData,
    id: Date.now().toString(),
  }
  categories.push(newCategory)
  localStorage.setItem("intranet_categories", JSON.stringify(categories))
  return newCategory
}

export function updateCategory(id: string, categoryData: Partial<Category>): void {
  const categories = getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...categoryData }
    localStorage.setItem("intranet_categories", JSON.stringify(categories))
  }
}

export function deleteCategory(id: string): void {
  const categories = getCategories().filter((c) => c.id !== id)
  localStorage.setItem("intranet_categories", JSON.stringify(categories))
}

// Funções para Links
export function getLinks(): Link[] {
  if (typeof window === "undefined") return []
  const links = localStorage.getItem("intranet_links")
  return links ? JSON.parse(links) : []
}

export function addLink(linkData: Omit<Link, "id">): Link {
  const links = getLinks()
  const newLink: Link = {
    ...linkData,
    id: Date.now().toString(),
  }
  links.push(newLink)
  localStorage.setItem("intranet_links", JSON.stringify(links))
  return newLink
}

export function updateLink(id: string, linkData: Partial<Link>): void {
  const links = getLinks()
  const index = links.findIndex((l) => l.id === id)
  if (index !== -1) {
    links[index] = { ...links[index], ...linkData }
    localStorage.setItem("intranet_links", JSON.stringify(links))
  }
}

export function deleteLink(id: string): void {
  const links = getLinks().filter((l) => l.id !== id)
  localStorage.setItem("intranet_links", JSON.stringify(links))
}

// Funções para Settings
export function getSettings(): Settings {
  if (typeof window === "undefined") return initialSettings
  const settings = localStorage.getItem("intranet_settings")
  return settings ? JSON.parse(settings) : initialSettings
}

export function updateSettings(settingsData: Partial<Settings>): void {
  const currentSettings = getSettings()
  const updatedSettings = { ...currentSettings, ...settingsData }
  localStorage.setItem("intranet_settings", JSON.stringify(updatedSettings))
}

// Funções utilitárias
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "agora"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d atrás`
  return formatDate(dateString)
}

export function getPostTypeIcon(type: string): string {
  const icons = {
    general: "FileText",
    news: "Newspaper",
    event: "Calendar",
    announcement: "Megaphone",
    birthday: "Cake",
    departure: "UserMinus",
  }
  return icons[type as keyof typeof icons] || "FileText"
}

/** Retorna um nome amigável (pt-BR) para o tipo de post */
export function getPostTypeName(type: string): string {
  const names: Record<string, string> = {
    general: "Geral",
    news: "Notícia",
    event: "Evento",
    announcement: "Comunicado",
    birthday: "Aniversário",
    departure: "Desligamento",
  }

  return names[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

export function getPriorityColor(priority: string): string {
  const colors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }
  return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
}
