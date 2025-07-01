// Dados de demonstração para testar sem Supabase
export const demoUsers = [
  {
    id: "1",
    email: "luiz.silva@repros.com.br",
    name: "Luiz Carlos",
    role: "admin" as const,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "usuario@repros.com.br",
    name: "Usuário Teste",
    role: "user" as const,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const demoCategories = [
  {
    id: "1",
    name: "Recursos Humanos",
    description: "Sistemas de RH e benefícios",
    icon: "Users",
    color: "#10B981",
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Financeiro",
    description: "Sistemas financeiros e contábeis",
    icon: "DollarSign",
    color: "#F59E0B",
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "TI e Sistemas",
    description: "Ferramentas de TI e desenvolvimento",
    icon: "Monitor",
    color: "#3B82F6",
    order_index: 3,
    created_at: new Date().toISOString(),
  },
]

export const demoLinks = [
  {
    id: "1",
    title: "Portal RH",
    description: "Sistema de gestão de recursos humanos",
    url: "https://rh.repros.com.br",
    icon: null,
    category_id: "1",
    is_active: true,
    order_index: 1,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sistema Financeiro",
    description: "ERP financeiro da empresa",
    url: "https://financeiro.repros.com.br",
    icon: null,
    category_id: "2",
    is_active: true,
    order_index: 1,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Help Desk",
    description: "Sistema de chamados de TI",
    url: "https://helpdesk.repros.com.br",
    icon: null,
    category_id: "3",
    is_active: true,
    order_index: 1,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const demoAccessRequests = [
  {
    id: "1",
    email: "funcionario@repros.com.br",
    name: "João Silva",
    message: "Preciso de acesso para consultar documentos do RH",
    status: "pending" as const,
    requested_at: new Date().toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "maria@repros.com.br",
    name: "Maria Santos",
    message: "Sou nova funcionária e preciso acessar os sistemas",
    status: "pending" as const,
    requested_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    reviewed_at: null,
    reviewed_by: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]
