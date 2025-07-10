// Tipos
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  active: boolean
  group_ids: string[]
  groups: string[]
  link_permissions: string[] // IDs dos links específicos que o usuário pode acessar
  password_hash?: string
  last_password_reset?: string
  last_login?: string // Data do último login
  created_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  color: string
  permissions: string[] // IDs das categorias/links que o grupo pode acessar
  created_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  groups: string[]
  created_at: string
}

export interface Link {
  id: string
  title: string
  name: string
  url: string
  description?: string
  icon?: string
  image_url?: string // Nova propriedade para imagem personalizada
  category_id: string
  category: string
  groups: string[]
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  type: "news" | "event" | "announcement" | "birthday" | "general" | "departure"
  priority: "low" | "medium" | "high"
  status: "draft" | "published" | "archived"
  published: boolean
  created_by: string
  created_at: string
  published_at?: string
  expires_at?: string
  updated_at: string
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
  created_at: string
}

export interface Settings {
  id: string
  company_name: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  accent_color: string
  created_at: string
  updated_at: string
}

// Dados iniciais (apenas para primeira inicialização)
const initialGroups: Group[] = [
  {
    id: "1",
    name: "Administradores",
    description: "Acesso total ao sistema",
    color: "#ef4444",
    permissions: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Recursos Humanos",
    description: "Acesso aos sistemas de RH",
    color: "#10b981",
    permissions: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Financeiro",
    description: "Acesso aos sistemas financeiros",
    color: "#f59e0b",
    permissions: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Vendas",
    description: "Acesso aos sistemas de vendas",
    color: "#8b5cf6",
    permissions: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "TI",
    description: "Acesso aos sistemas de TI",
    color: "#3b82f6",
    permissions: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Usuários Padrão",
    description: "Acesso básico ao sistema",
    color: "#6b7280",
    permissions: [],
    created_at: new Date().toISOString(),
  },
]

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Sistemas Financeiros",
    description: "ERP, Contabilidade e Faturamento",
    color: "#10B981",
    icon: "💰",
    groups: ["admin", "financeiro"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Recursos Humanos",
    description: "Gestão de Pessoas e Benefícios",
    color: "#3B82F6",
    icon: "👥",
    groups: ["admin", "rh"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Vendas e CRM",
    description: "Gestão Comercial e Relacionamento",
    color: "#8B5CF6",
    icon: "📈",
    groups: ["admin", "vendas"],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Suporte Técnico",
    description: "Helpdesk e Documentação",
    color: "#F59E0B",
    icon: "🛠️",
    groups: ["admin", "ti", "suporte"],
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Comunicação",
    description: "Email, Chat e Videoconferência",
    color: "#06B6D4",
    icon: "💬",
    groups: ["admin", "user"],
    created_at: new Date().toISOString(),
  },
]

const initialLinks: Link[] = [
  {
    id: "1",
    title: "Sistema ERP",
    name: "Sistema ERP",
    url: "https://erp.empresa.com.br",
    description: "Gestão empresarial integrada",
    icon: "🏢",
    category_id: "1",
    category: "Sistemas Financeiros",
    groups: ["admin", "financeiro"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Portal RH",
    name: "Portal RH",
    url: "https://rh.empresa.com.br",
    description: "Gestão de colaboradores",
    icon: "👤",
    category_id: "2",
    category: "Recursos Humanos",
    groups: ["admin", "rh"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "CRM Vendas",
    name: "CRM Vendas",
    url: "https://crm.empresa.com.br",
    description: "Gestão de clientes e vendas",
    icon: "💼",
    category_id: "3",
    category: "Vendas e CRM",
    groups: ["admin", "vendas"],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Helpdesk",
    name: "Helpdesk",
    url: "https://suporte.empresa.com.br",
    description: "Central de atendimento",
    icon: "🎧",
    category_id: "4",
    category: "Suporte Técnico",
    groups: ["admin", "ti", "suporte"],
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Email Corporativo",
    name: "Email Corporativo",
    url: "https://mail.empresa.com.br",
    description: "Webmail da empresa",
    icon: "📧",
    category_id: "5",
    category: "Comunicação",
    groups: ["admin", "user"],
    created_at: new Date().toISOString(),
  },
]

const initialUsers: User[] = [
  {
    id: "1",
    email: "admin@repros.com.br",
    name: "Administrador",
    role: "admin",
    active: true,
    group_ids: ["1"],
    groups: ["admin"],
    link_permissions: [], // Admin tem acesso a tudo
    password_hash: "hashed_admin123_1",
    last_password_reset: new Date().toISOString(),
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "luiz.silva@repros.com.br",
    name: "Luiz Carlos",
    role: "admin",
    active: true,
    group_ids: ["1"],
    groups: ["admin"],
    link_permissions: [],
    password_hash: "hashed_123456_2",
    last_password_reset: new Date().toISOString(),
    last_login: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    email: "lucas.souza@repros.com.br",
    name: "Lucas Souza",
    role: "user",
    active: true,
    group_ids: ["2", "6"],
    groups: ["rh", "user"],
    link_permissions: ["2", "5"], // Acesso específico ao Portal RH e Email
    password_hash: "hashed_123456_3",
    last_password_reset: new Date().toISOString(),
    last_login: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
    created_at: new Date().toISOString(),
  },
]

const initialPosts: Post[] = [
  {
    id: "1",
    title: "🎂 Aniversariantes de Janeiro",
    content:
      "Parabéns aos aniversariantes do mês! 🎉\n\nDesejamos muito sucesso e felicidades!\n\n🎂 Maria Santos - 15/01\n🎂 João Silva - 22/01\n🎂 Ana Costa - 28/01",
    type: "birthday",
    priority: "medium",
    status: "published",
    published: true,
    created_by: "2",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "📢 Comunicado Importante - Horário de Funcionamento",
    content:
      "Informamos que a partir de segunda-feira (06/01), o horário de funcionamento da empresa será:\n\n🕐 Segunda a Quinta: 8h às 18h\n🕐 Sexta-feira: 8h às 17h\n\nContamos com a colaboração de todos!",
    type: "announcement",
    priority: "high",
    status: "published",
    published: true,
    created_by: "1",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "🔧 Manutenção Sistema Financeiro",
    content:
      "O sistema financeiro passará por manutenção programada:\n\n📅 Data: Sábado, 11/01/2025\n⏰ Horário: 8h às 12h\n\nDurante este período, o acesso estará temporariamente indisponível.\n\nPedimos a compreensão de todos!",
    type: "announcement",
    priority: "high",
    status: "published",
    published: true,
    created_by: "1",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expires_at: new Date("2025-01-12").toISOString(),
  },
  {
    id: "4",
    title: "🎉 Festa de Confraternização 2025",
    content:
      "Venha participar da nossa festa de confraternização!\n\n📅 Data: 25 de Janeiro de 2025\n⏰ Horário: 19h\n📍 Local: Salão de Eventos da Empresa\n\n🍽️ Haverá jantar e música ao vivo!\n\nConfirme sua presença com o RH até dia 20/01.",
    type: "event",
    priority: "medium",
    status: "published",
    published: true,
    created_by: "1",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date("2025-01-26").toISOString(),
    image_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-e2RlkzW4vmxUCJDZuzjHlUjAmH9OXw.png",
  },
]

const initialExtensions: Extension[] = [
  {
    id: "1",
    name: "Luiz Carlos",
    extension: "1001",
    department: "Administração",
    position: "Diretor Geral",
    email: "luiz.carlos@repros.com.br",
    mobile: "(11) 99999-1001",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Maria Santos",
    extension: "1002",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    email: "maria.santos@repros.com.br",
    mobile: "(11) 99999-1002",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "João Silva",
    extension: "1003",
    department: "TI",
    position: "Coordenador de TI",
    email: "joao.silva@repros.com.br",
    mobile: "(11) 99999-1003",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Ana Costa",
    extension: "1004",
    department: "Financeiro",
    position: "Analista Financeiro",
    email: "ana.costa@repros.com.br",
    mobile: "(11) 99999-1004",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Carlos Oliveira",
    extension: "1005",
    department: "Vendas",
    position: "Consultor de Vendas",
    email: "carlos.oliveira@repros.com.br",
    mobile: "(11) 99999-1005",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Fernanda Lima",
    extension: "1006",
    department: "Marketing",
    position: "Analista de Marketing",
    email: "fernanda.lima@repros.com.br",
    mobile: "(11) 99999-1006",
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Ricardo Pereira",
    extension: "1007",
    department: "Suporte",
    position: "Técnico de Suporte",
    email: "ricardo.pereira@repros.com.br",
    mobile: "(11) 99999-1007",
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Juliana Rocha",
    extension: "1008",
    department: "Jurídico",
    position: "Advogada",
    email: "juliana.rocha@repros.com.br",
    mobile: "(11) 99999-1008",
    created_at: new Date().toISOString(),
  },
]

const initialSettings: Settings = {
  id: "1",
  company_name: "Intranet Corporativa",
  logo_url: "",
  primary_color: "#3B82F6",
  secondary_color: "#10B981",
  accent_color: "#8B5CF6",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ✅ FUNÇÃO DE INICIALIZAÇÃO PROTEGIDA - NÃO SOBRESCREVE DADOS EXISTENTES
export function initializeData() {
  // Verificar se é a primeira vez que o sistema está sendo executado
  const isFirstRun = !localStorage.getItem("intranet_initialized")

  // Só inicializar com dados padrão se for a primeira execução
  if (isFirstRun) {
    console.log("🚀 Primeira execução - Inicializando dados padrão...")

    // Inicializar apenas se não existir
    if (!localStorage.getItem("intranet_groups")) {
      localStorage.setItem("intranet_groups", JSON.stringify(initialGroups))
      console.log("✅ Grupos iniciais criados")
    }

    if (!localStorage.getItem("intranet_categories")) {
      localStorage.setItem("intranet_categories", JSON.stringify(initialCategories))
      console.log("✅ Categorias iniciais criadas")
    }

    if (!localStorage.getItem("intranet_links")) {
      localStorage.setItem("intranet_links", JSON.stringify(initialLinks))
      console.log("✅ Links iniciais criados")
    }

    if (!localStorage.getItem("intranet_users")) {
      localStorage.setItem("intranet_users", JSON.stringify(initialUsers))
      console.log("✅ Usuários iniciais criados")
    }

    if (!localStorage.getItem("intranet_posts")) {
      localStorage.setItem("intranet_posts", JSON.stringify(initialPosts))
      console.log("✅ Posts iniciais criados")
    }

    if (!localStorage.getItem("intranet_extensions")) {
      localStorage.setItem("intranet_extensions", JSON.stringify(initialExtensions))
      console.log("✅ Ramais iniciais criados")
    }

    if (!localStorage.getItem("intranet_settings")) {
      localStorage.setItem("intranet_settings", JSON.stringify(initialSettings))
      console.log("✅ Configurações iniciais criadas")
    }

    // Marcar que o sistema já foi inicializado
    localStorage.setItem("intranet_initialized", "true")
    localStorage.setItem("intranet_init_date", new Date().toISOString())
    console.log("🎯 Sistema inicializado com sucesso!")
  } else {
    console.log("✅ Sistema já inicializado - Mantendo dados existentes")

    // Verificar se algum dado essencial está faltando e criar apenas o que não existe
    if (!localStorage.getItem("intranet_groups")) {
      localStorage.setItem("intranet_groups", JSON.stringify([]))
      console.log("⚠️ Grupos não encontrados - Criando estrutura vazia")
    }

    if (!localStorage.getItem("intranet_categories")) {
      localStorage.setItem("intranet_categories", JSON.stringify([]))
      console.log("⚠️ Categorias não encontradas - Criando estrutura vazia")
    }

    if (!localStorage.getItem("intranet_links")) {
      localStorage.setItem("intranet_links", JSON.stringify([]))
      console.log("⚠️ Links não encontrados - Criando estrutura vazia")
    }

    if (!localStorage.getItem("intranet_users")) {
      localStorage.setItem("intranet_users", JSON.stringify([]))
      console.log("⚠️ Usuários não encontrados - Criando estrutura vazia")
    }

    if (!localStorage.getItem("intranet_posts")) {
      localStorage.setItem("intranet_posts", JSON.stringify([]))
      console.log("⚠️ Posts não encontrados - Criando estrutura vazia")
    }

    if (!localStorage.getItem("intranet_extensions")) {
      localStorage.setItem("intranet_extensions", JSON.stringify([]))
      console.log("⚠️ Ramais não encontrados - Criando estrutura vazia")
    }

    if (!localStorage.getItem("intranet_settings")) {
      localStorage.setItem("intranet_settings", JSON.stringify(initialSettings))
      console.log("⚠️ Configurações não encontradas - Criando configurações padrão")
    }
  }
}

// ✅ FUNÇÃO PARA VERIFICAR STATUS DO SISTEMA
export function getSystemInfo() {
  const isInitialized = localStorage.getItem("intranet_initialized") === "true"
  const initDate = localStorage.getItem("intranet_init_date")

  return {
    isInitialized,
    initDate: initDate ? new Date(initDate) : null,
    dataCount: {
      users: getUsers().length,
      groups: getGroups().length,
      categories: getCategories().length,
      links: getLinks().length,
      posts: getPosts().length,
      extensions: getExtensions().length,
    },
  }
}

// ✅ FUNÇÃO PARA RESET COMPLETO (APENAS PARA DESENVOLVIMENTO/EMERGÊNCIA)
export function resetAllData() {
  if (confirm("⚠️ ATENÇÃO: Isso irá apagar TODOS os dados do sistema!\n\nTem certeza que deseja continuar?")) {
    if (
      confirm(
        "🚨 ÚLTIMA CONFIRMAÇÃO: Todos os usuários, posts, links e configurações serão perdidos!\n\nConfirma o reset completo?",
      )
    ) {
      localStorage.removeItem("intranet_groups")
      localStorage.removeItem("intranet_categories")
      localStorage.removeItem("intranet_links")
      localStorage.removeItem("intranet_users")
      localStorage.removeItem("intranet_posts")
      localStorage.removeItem("intranet_extensions")
      localStorage.removeItem("intranet_settings")
      localStorage.removeItem("intranet_initialized")
      localStorage.removeItem("intranet_init_date")

      console.log("🔄 Sistema resetado - Recarregando página...")
      window.location.reload()
    }
  }
}

// Funções para Groups
export function getGroups(): Group[] {
  const data = localStorage.getItem("intranet_groups")
  return data ? JSON.parse(data) : []
}

export function saveGroups(groups: Group[]) {
  localStorage.setItem("intranet_groups", JSON.stringify(groups))
}

export function addGroup(groupData: {
  name: string
  description?: string
  color?: string
  permissions?: string[]
}): Group {
  const groups = getGroups()
  const newGroup: Group = {
    id: Date.now().toString(),
    name: groupData.name,
    description: groupData.description || "",
    color: groupData.color || "#6b7280",
    permissions: groupData.permissions || [],
    created_at: new Date().toISOString(),
  }
  const updatedGroups = [...groups, newGroup]
  saveGroups(updatedGroups)
  return newGroup
}

export function updateGroup(
  id: string,
  groupData: { name: string; description?: string; color?: string; permissions?: string[] },
): Group | null {
  const groups = getGroups()
  const groupIndex = groups.findIndex((group) => group.id === id)
  if (groupIndex === -1) return null

  const updatedGroup = {
    ...groups[groupIndex],
    name: groupData.name,
    description: groupData.description || "",
    color: groupData.color || groups[groupIndex].color,
    permissions: groupData.permissions || groups[groupIndex].permissions,
  }
  groups[groupIndex] = updatedGroup
  saveGroups(groups)
  return updatedGroup
}

export function deleteGroup(id: string): boolean {
  const groups = getGroups()
  const filteredGroups = groups.filter((group) => group.id !== id)
  if (filteredGroups.length === groups.length) return false
  saveGroups(filteredGroups)
  return true
}

// Funções para Categories
export function getCategories(): Category[] {
  const data = localStorage.getItem("intranet_categories")
  return data ? JSON.parse(data) : []
}

export function getCategoriesForUser(user: User): Category[] {
  const categories = getCategories()
  if (user.role === "admin") return categories
  return categories.filter((category) => category.groups.some((group) => user.groups.includes(group)))
}

export function saveCategories(categories: Category[]) {
  localStorage.setItem("intranet_categories", JSON.stringify(categories))
}

export function addCategory(categoryData: {
  name: string
  description?: string
  color?: string
  icon?: string
  groups?: string[]
}): Category {
  const categories = getCategories()
  const newCategory: Category = {
    id: Date.now().toString(),
    name: categoryData.name,
    description: categoryData.description || "",
    color: categoryData.color || "#3B82F6",
    icon: categoryData.icon || "📁",
    groups: categoryData.groups || ["admin"],
    created_at: new Date().toISOString(),
  }
  const updatedCategories = [...categories, newCategory]
  saveCategories(updatedCategories)
  return newCategory
}

export function updateCategory(
  id: string,
  categoryData: { name: string; description?: string; color?: string; icon?: string; groups?: string[] },
): Category | null {
  const categories = getCategories()
  const categoryIndex = categories.findIndex((cat) => cat.id === id)
  if (categoryIndex === -1) return null

  const updatedCategory = {
    ...categories[categoryIndex],
    name: categoryData.name,
    description: categoryData.description || "",
    color: categoryData.color || categories[categoryIndex].color,
    icon: categoryData.icon || categories[categoryIndex].icon,
    groups: categoryData.groups || categories[categoryIndex].groups,
  }
  categories[categoryIndex] = updatedCategory
  saveCategories(categories)
  return updatedCategory
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const filteredCategories = categories.filter((cat) => cat.id !== id)
  if (filteredCategories.length === categories.length) return false
  saveCategories(filteredCategories)
  return true
}

// Funções para Links
export function getLinks(): Link[] {
  const data = localStorage.getItem("intranet_links")
  return data ? JSON.parse(data) : []
}

export function getLinksForUser(user: User): Link[] {
  const links = getLinks()
  if (user.role === "admin") return links

  // Se o usuário tem permissões específicas de links, usar essas
  if (user.link_permissions && user.link_permissions.length > 0) {
    return links.filter((link) => user.link_permissions.includes(link.id))
  }

  // Caso contrário, usar permissões por grupo
  return links.filter((link) => link.groups.some((group) => user.groups.includes(group)))
}

export function saveLinks(links: Link[]) {
  localStorage.setItem("intranet_links", JSON.stringify(links))
}

export function addLink(linkData: {
  name: string
  url: string
  description?: string
  icon?: string
  image_url?: string
  category: string
  groups?: string[]
}): Link {
  const links = getLinks()
  const categories = getCategories()
  const category = categories.find((cat) => cat.name === linkData.category)

  const newLink: Link = {
    id: Date.now().toString(),
    title: linkData.name,
    name: linkData.name,
    url: linkData.url,
    description: linkData.description || "",
    icon: linkData.icon || "🔗",
    image_url: linkData.image_url || "",
    category_id: category?.id || "1",
    category: linkData.category,
    groups: linkData.groups || ["admin"],
    created_at: new Date().toISOString(),
  }
  const updatedLinks = [...links, newLink]
  saveLinks(updatedLinks)
  return newLink
}

export function updateLink(
  id: string,
  linkData: {
    name: string
    url: string
    description?: string
    icon?: string
    image_url?: string
    category: string
    groups?: string[]
  },
): Link | null {
  const links = getLinks()
  const linkIndex = links.findIndex((link) => link.id === id)
  if (linkIndex === -1) return null

  const categories = getCategories()
  const category = categories.find((cat) => cat.name === linkData.category)

  const updatedLink = {
    ...links[linkIndex],
    title: linkData.name,
    name: linkData.name,
    url: linkData.url,
    description: linkData.description || "",
    icon: linkData.icon || links[linkIndex].icon,
    image_url: linkData.image_url || links[linkIndex].image_url,
    category_id: category?.id || links[linkIndex].category_id,
    category: linkData.category,
    groups: linkData.groups || links[linkIndex].groups,
  }
  links[linkIndex] = updatedLink
  saveLinks(links)
  return updatedLink
}

export function deleteLink(id: string): boolean {
  const links = getLinks()
  const filteredLinks = links.filter((link) => link.id !== id)
  if (filteredLinks.length === links.length) return false
  saveLinks(filteredLinks)
  return true
}

// Funções para Users
export function getUsers(): User[] {
  const data = localStorage.getItem("intranet_users")
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]) {
  localStorage.setItem("intranet_users", JSON.stringify(users))
}

export function addUser(userData: {
  name: string
  email: string
  role: string
  password: string
  groups?: string[]
  link_permissions?: string[]
}): User {
  const users = getUsers()
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role as "admin" | "user",
    active: true,
    group_ids: userData.groups || ["user"],
    groups: userData.groups || ["user"],
    link_permissions: userData.link_permissions || [],
    password_hash: `hashed_${userData.password}_${Date.now()}`,
    last_password_reset: new Date().toISOString(),
    last_login: undefined,
    created_at: new Date().toISOString(),
  }
  const updatedUsers = [...users, newUser]
  saveUsers(updatedUsers)
  return newUser
}

export function updateUser(
  id: string,
  userData: {
    name: string
    email: string
    role: string
    password?: string
    groups?: string[]
    link_permissions?: string[]
  },
): User | null {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return null

  const updatedUser = {
    ...users[userIndex],
    name: userData.name,
    email: userData.email,
    role: userData.role as "admin" | "user",
    groups: userData.groups || users[userIndex].groups,
    group_ids: userData.groups || users[userIndex].group_ids,
    link_permissions: userData.link_permissions || users[userIndex].link_permissions,
  }

  if (userData.password) {
    updatedUser.password_hash = `hashed_${userData.password}_${Date.now()}`
    updatedUser.last_password_reset = new Date().toISOString()
  }

  users[userIndex] = updatedUser
  saveUsers(users)
  return updatedUser
}

export function updateUserLastLogin(email: string): void {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.email === email)
  if (userIndex !== -1) {
    users[userIndex].last_login = new Date().toISOString()
    saveUsers(users)
  }
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((user) => user.id !== id)
  if (filteredUsers.length === users.length) return false
  saveUsers(filteredUsers)
  return true
}

export function authenticateUser(email: string): User | null {
  const users = getUsers()
  const user = users.find((user) => user.email === email)
  if (user) {
    // Atualizar último login
    updateUserLastLogin(email)
  }
  return user || null
}

// Funções para Posts
export function getPosts(): Post[] {
  const data = localStorage.getItem("intranet_posts")
  return data ? JSON.parse(data) : []
}

export function getPublishedPosts(): Post[] {
  const posts = getPosts()
  const now = new Date()

  return posts
    .filter((post) => {
      const isPublished = post.status === "published" || post.published === true
      const notExpired = !post.expires_at || new Date(post.expires_at) > now
      return isPublished && notExpired
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime()
      const dateB = new Date(b.published_at || b.created_at).getTime()
      if (dateB !== dateA) {
        return dateB - dateA
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
}

export function savePosts(posts: Post[]) {
  localStorage.setItem("intranet_posts", JSON.stringify(posts))
}

export function updatePost(id: string, postData: Partial<Post>): Post | null {
  const posts = getPosts()
  const postIndex = posts.findIndex((post) => post.id === id)
  if (postIndex === -1) return null

  const updatedPost = {
    ...posts[postIndex],
    ...postData,
    updated_at: new Date().toISOString(),
  }
  posts[postIndex] = updatedPost
  savePosts(posts)
  return updatedPost
}

export function deletePost(id: string): boolean {
  const posts = getPosts()
  const filteredPosts = posts.filter((post) => post.id !== id)
  if (filteredPosts.length === posts.length) return false
  savePosts(filteredPosts)
  return true
}

// Funções para Extensions
export function getExtensions(): Extension[] {
  const data = localStorage.getItem("intranet_extensions")
  return data ? JSON.parse(data) : []
}

export function saveExtensions(extensions: Extension[]) {
  localStorage.setItem("intranet_extensions", JSON.stringify(extensions))
}

export function addExtension(extensionData: {
  name: string
  extension: string
  department: string
  position?: string
  email?: string
  mobile?: string
}): Extension {
  const extensions = getExtensions()
  const newExtension: Extension = {
    id: Date.now().toString(),
    name: extensionData.name,
    extension: extensionData.extension,
    department: extensionData.department,
    position: extensionData.position || "",
    email: extensionData.email || "",
    mobile: extensionData.mobile || "",
    created_at: new Date().toISOString(),
  }
  const updatedExtensions = [...extensions, newExtension]
  saveExtensions(updatedExtensions)
  return newExtension
}

export function updateExtension(
  id: string,
  extensionData: {
    name: string
    extension: string
    department: string
    position?: string
    email?: string
    mobile?: string
  },
): Extension | null {
  const extensions = getExtensions()
  const extensionIndex = extensions.findIndex((ext) => ext.id === id)
  if (extensionIndex === -1) return null

  const updatedExtension = {
    ...extensions[extensionIndex],
    name: extensionData.name,
    extension: extensionData.extension,
    department: extensionData.department,
    position: extensionData.position || "",
    email: extensionData.email || "",
    mobile: extensionData.mobile || "",
  }
  extensions[extensionIndex] = updatedExtension
  saveExtensions(extensions)
  return updatedExtension
}

export function deleteExtension(id: string): boolean {
  const extensions = getExtensions()
  const filteredExtensions = extensions.filter((ext) => ext.id !== id)
  if (filteredExtensions.length === extensions.length) return false
  saveExtensions(filteredExtensions)
  return true
}

// Funções para Settings
export function getSettings(): Settings {
  const data = localStorage.getItem("intranet_settings")
  return data ? JSON.parse(data) : initialSettings
}

export function saveSettings(settings: Settings) {
  localStorage.setItem("intranet_settings", JSON.stringify(settings))
}

export function updateSettings(settingsData: {
  company_name: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  accent_color: string
}): Settings {
  const currentSettings = getSettings()
  const updatedSettings: Settings = {
    ...currentSettings,
    company_name: settingsData.company_name,
    logo_url: settingsData.logo_url || "",
    primary_color: settingsData.primary_color,
    secondary_color: settingsData.secondary_color,
    accent_color: settingsData.accent_color,
    updated_at: new Date().toISOString(),
  }
  saveSettings(updatedSettings)
  return updatedSettings
}

// Funções utilitárias para Posts
export function getPostTypeIcon(type: Post["type"]): string {
  const icons = {
    news: "📰",
    event: "📅",
    announcement: "📢",
    birthday: "🎂",
    general: "📄",
    departure: "👋",
  }
  return icons[type] || "📄"
}

export function getPostTypeName(type: Post["type"]): string {
  const names = {
    news: "Notícia",
    event: "Evento",
    announcement: "Comunicado",
    birthday: "Aniversário",
    general: "Geral",
    departure: "Desligamento",
  }
  return names[type] || "Post"
}

export function getPriorityColor(priority: Post["priority"]): string {
  const colors = {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#EF4444",
  }
  return colors[priority] || "#6B7280"
}

// ======================================================
// === FAVORITOS (Links favoritos por usuário) ==========
// ======================================================

type FavoritesMap = Record<string, string[]> // { [userId]: [linkId, ...] }

function getFavorites(): FavoritesMap {
  const data = localStorage.getItem("intranet_favorites")
  return data ? JSON.parse(data) : {}
}

function saveFavorites(favorites: FavoritesMap) {
  localStorage.setItem("intranet_favorites", JSON.stringify(favorites))
}

// Função para verificar se um email está autorizado
export function isEmailAuthorized(email: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email)
  return user || null
}

// Função para simular hash de senha
export function hashPassword(password: string): string {
  return `hashed_${password}_${Date.now()}`
}

export function validatePassword(inputPassword: string, storedHash: string): boolean {
  const expectedHash = `hashed_${inputPassword}_`
  return storedHash.startsWith(expectedHash)
}

export function createInitialHash(password: string, userId: string): string {
  return `hashed_${password}_${userId}`
}

// Função para formatar tempo relativo
export function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "agora"
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} dias atrás`
  return date.toLocaleDateString("pt-BR")
}

// ✅ Retorna um único usuário pelo id **ou** email
export function getUser(identifier: string): User | null {
  const users = getUsers()
  return users.find((u) => u.id === identifier || u.email === identifier) || null
}

// ✅ Verifica se um link é favorito para determinado usuário
export function isFavorite(userId: string, linkId: string): boolean {
  const favorites = getFavorites()
  return (favorites[userId] || []).includes(linkId)
}

// ✅ Adiciona ou remove um link da lista de favoritos do usuário
export function toggleFavorite(userId: string, linkId: string): void {
  const favorites = getFavorites()
  const userFavs = favorites[userId] || []
  const index = userFavs.indexOf(linkId)

  if (index > -1) {
    // Já é favorito → remover
    userFavs.splice(index, 1)
  } else {
    // Ainda não é favorito → adicionar
    userFavs.push(linkId)
  }

  favorites[userId] = userFavs
  saveFavorites(favorites)
}
