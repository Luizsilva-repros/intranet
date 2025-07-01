// Serviço de Autenticação com suporte a Active Directory

export interface AuthUser {
  id: string
  email: string
  name: string
  displayName: string
  department?: string
  title?: string
  manager?: string
  groups: string[]
  role: "admin" | "user"
  source: "ad" | "local"
  lastLogin: string
}

export interface ADConfig {
  enabled: boolean
  domain: string
  server?: string
  baseDN?: string
  adminUser?: string
  adminPassword?: string
}

// Configuração do AD (pode ser movida para settings)
const AD_CONFIG: ADConfig = {
  enabled: true, // Habilitar/desabilitar integração AD
  domain: "repros.com.br",
  server: "ldap://dc.repros.com.br:389",
  baseDN: "DC=repros,DC=com,DC=br",
  adminUser: "admin@repros.com.br",
  adminPassword: "admin123",
}

// Simulação de usuários do Active Directory
// Em produção, isso viria do AD real via LDAP
const AD_USERS = [
  {
    id: "ad_001",
    email: "luiz.silva@repros.com.br",
    username: "luiz.silva",
    name: "Luiz Carlos Silva",
    displayName: "Luiz Carlos Silva",
    department: "Administração",
    title: "Diretor Geral",
    manager: null,
    groups: ["Domain Admins", "Administradores", "Diretoria"],
    role: "admin" as const,
    active: true,
    passwordHash: "ad_hash_luiz123", // Em AD real, a senha é validada pelo servidor
  },
  {
    id: "ad_002",
    email: "maria.santos@repros.com.br",
    username: "maria.santos",
    name: "Maria Santos",
    displayName: "Maria Santos",
    department: "Recursos Humanos",
    title: "Gerente de RH",
    manager: "luiz.silva@repros.com.br",
    groups: ["RH", "Gerentes", "Domain Users"],
    role: "user" as const,
    active: true,
    passwordHash: "ad_hash_maria123",
  },
  {
    id: "ad_003",
    email: "joao.silva@repros.com.br",
    username: "joao.silva",
    name: "João Silva",
    displayName: "João Silva",
    department: "TI",
    title: "Coordenador de TI",
    manager: "luiz.silva@repros.com.br",
    groups: ["TI", "Domain Users", "Administradores TI"],
    role: "admin" as const,
    active: true,
    passwordHash: "ad_hash_joao123",
  },
  {
    id: "ad_004",
    email: "ana.costa@repros.com.br",
    username: "ana.costa",
    name: "Ana Costa",
    displayName: "Ana Costa",
    department: "Financeiro",
    title: "Analista Financeiro",
    manager: "luiz.silva@repros.com.br",
    groups: ["Financeiro", "Domain Users"],
    role: "user" as const,
    active: true,
    passwordHash: "ad_hash_ana123",
  },
  {
    id: "ad_005",
    email: "carlos.oliveira@repros.com.br",
    username: "carlos.oliveira",
    name: "Carlos Oliveira",
    displayName: "Carlos Oliveira",
    department: "Vendas",
    title: "Consultor de Vendas",
    manager: "luiz.silva@repros.com.br",
    groups: ["Vendas", "Domain Users"],
    role: "user" as const,
    active: true,
    passwordHash: "ad_hash_carlos123",
  },
]

// Mapeamento de grupos AD para grupos da intranet
const AD_GROUP_MAPPING = {
  "Domain Admins": ["admin"],
  Administradores: ["admin"],
  "Administradores TI": ["admin", "ti"],
  Diretoria: ["admin"],
  Gerentes: ["admin"],
  RH: ["rh", "user"],
  TI: ["ti", "user"],
  Financeiro: ["financeiro", "user"],
  Vendas: ["vendas", "user"],
  Marketing: ["marketing", "user"],
  "Domain Users": ["user"],
}

// Função para mapear grupos AD para grupos da intranet
function mapADGroupsToIntranetGroups(adGroups: string[]): string[] {
  const intranetGroups = new Set<string>()

  adGroups.forEach((adGroup) => {
    const mappedGroups = AD_GROUP_MAPPING[adGroup as keyof typeof AD_GROUP_MAPPING]
    if (mappedGroups) {
      mappedGroups.forEach((group) => intranetGroups.add(group))
    }
  })

  // Garantir que sempre tenha pelo menos "user"
  if (intranetGroups.size === 0) {
    intranetGroups.add("user")
  }

  return Array.from(intranetGroups)
}

// Função para determinar role baseado nos grupos
function determineRoleFromGroups(groups: string[]): "admin" | "user" {
  const adminGroups = ["Domain Admins", "Administradores", "Administradores TI", "Diretoria"]
  return groups.some((group) => adminGroups.includes(group)) ? "admin" : "user"
}

// Simulação de autenticação LDAP
async function authenticateWithAD(email: string, password: string): Promise<AuthUser | null> {
  // Simular delay de rede para autenticação AD
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Em produção, aqui seria uma chamada LDAP real
    // const ldapClient = ldap.createClient({ url: AD_CONFIG.server })
    // const userDN = `CN=${username},${AD_CONFIG.baseDN}`
    // await ldapClient.bind(userDN, password)

    // Simulação: buscar usuário na lista
    const adUser = AD_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.active)

    if (!adUser) {
      console.log(`❌ Usuário ${email} não encontrado no AD`)
      return null
    }

    // Simular validação de senha (em AD real, isso é feito pelo servidor)
    const expectedHash = `ad_hash_${password}`
    if (adUser.passwordHash !== expectedHash) {
      console.log(`❌ Senha incorreta para ${email}`)
      return null
    }

    console.log(`✅ Autenticação AD bem-sucedida para ${email}`)

    // Mapear dados do AD para formato da intranet
    const intranetGroups = mapADGroupsToIntranetGroups(adUser.groups)
    const role = determineRoleFromGroups(adUser.groups)

    return {
      id: adUser.id,
      email: adUser.email,
      name: adUser.name,
      displayName: adUser.displayName,
      department: adUser.department,
      title: adUser.title,
      manager: adUser.manager,
      groups: intranetGroups,
      role: role,
      source: "ad",
      lastLogin: new Date().toISOString(),
    }
  } catch (error) {
    console.error("❌ Erro na autenticação AD:", error)
    return null
  }
}

// Função principal de autenticação
export async function authenticateUser(
  email: string,
  password: string,
): Promise<{
  success: boolean
  user?: AuthUser
  error?: string
  source: "ad" | "local"
}> {
  // 1. Tentar autenticação com Active Directory primeiro (se habilitado)
  if (AD_CONFIG.enabled) {
    console.log(`🔍 Tentando autenticação AD para ${email}...`)

    try {
      const adUser = await authenticateWithAD(email, password)

      if (adUser) {
        // Salvar/atualizar usuário no localStorage para cache
        await syncADUserToLocal(adUser)

        return {
          success: true,
          user: adUser,
          source: "ad",
        }
      }
    } catch (error) {
      console.warn("⚠️ Falha na autenticação AD, tentando local:", error)
    }
  }

  // 2. Fallback para autenticação local
  console.log(`🔍 Tentando autenticação local para ${email}...`)

  const { isEmailAuthorized, validatePassword } = await import("./local-storage")
  const localUser = isEmailAuthorized(email)

  if (!localUser) {
    return {
      success: false,
      error: "Email não autorizado",
      source: "local",
    }
  }

  const isValidPassword = validatePassword(password, localUser.password_hash || "")
  if (!isValidPassword) {
    return {
      success: false,
      error: "Senha incorreta",
      source: "local",
    }
  }

  console.log(`✅ Autenticação local bem-sucedida para ${email}`)

  // Converter usuário local para formato AuthUser
  const authUser: AuthUser = {
    id: localUser.id,
    email: localUser.email,
    name: localUser.name,
    displayName: localUser.name,
    groups: localUser.groups || ["user"],
    role: localUser.role,
    source: "local",
    lastLogin: new Date().toISOString(),
  }

  return {
    success: true,
    user: authUser,
    source: "local",
  }
}

// Sincronizar usuário AD com localStorage (cache)
async function syncADUserToLocal(adUser: AuthUser): Promise<void> {
  try {
    const { getUsers, saveUsers } = await import("./local-storage")
    const localUsers = getUsers()

    // Verificar se usuário já existe
    const existingUserIndex = localUsers.findIndex((u) => u.email === adUser.email)

    const localUserData = {
      id: adUser.id,
      email: adUser.email,
      name: adUser.name,
      role: adUser.role,
      active: true,
      group_ids: adUser.groups,
      groups: adUser.groups,
      password_hash: `ad_synced_${Date.now()}`, // Placeholder - senha é validada pelo AD
      last_password_reset: new Date().toISOString(),
      created_at: existingUserIndex >= 0 ? localUsers[existingUserIndex].created_at : new Date().toISOString(),
    }

    if (existingUserIndex >= 0) {
      // Atualizar usuário existente
      localUsers[existingUserIndex] = localUserData
      console.log(`🔄 Usuário AD ${adUser.email} atualizado no cache local`)
    } else {
      // Adicionar novo usuário
      localUsers.push(localUserData)
      console.log(`➕ Usuário AD ${adUser.email} adicionado ao cache local`)
    }

    saveUsers(localUsers)
  } catch (error) {
    console.error("❌ Erro ao sincronizar usuário AD:", error)
  }
}

// Função para buscar usuários do AD (para administração)
export async function searchADUsers(searchTerm = ""): Promise<any[]> {
  if (!AD_CONFIG.enabled) {
    return []
  }

  // Simular busca no AD
  await new Promise((resolve) => setTimeout(resolve, 500))

  return AD_USERS.filter(
    (user) =>
      user.active &&
      (searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())),
  ).map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    displayName: user.displayName,
    department: user.department,
    title: user.title,
    groups: user.groups,
    role: determineRoleFromGroups(user.groups),
  }))
}

// Função para obter configuração do AD
export function getADConfig(): ADConfig {
  return { ...AD_CONFIG }
}

// Função para atualizar configuração do AD
export function updateADConfig(config: Partial<ADConfig>): void {
  Object.assign(AD_CONFIG, config)
  localStorage.setItem("intranet_ad_config", JSON.stringify(AD_CONFIG))
}

// Função para testar conexão com AD
export async function testADConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  if (!AD_CONFIG.enabled) {
    return {
      success: false,
      message: "Integração AD está desabilitada",
    }
  }

  try {
    // Simular teste de conexão
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Em produção, aqui seria um teste real de conexão LDAP
    // const ldapClient = ldap.createClient({ url: AD_CONFIG.server })
    // await ldapClient.bind(AD_CONFIG.adminUser, AD_CONFIG.adminPassword)

    return {
      success: true,
      message: "Conexão com Active Directory estabelecida com sucesso",
      details: {
        server: AD_CONFIG.server,
        domain: AD_CONFIG.domain,
        usersFound: AD_USERS.length,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Falha na conexão com Active Directory",
      details: error,
    }
  }
}

// Função para sincronizar todos os usuários AD
export async function syncAllADUsers(): Promise<{
  success: boolean
  message: string
  synced: number
  errors: number
}> {
  if (!AD_CONFIG.enabled) {
    return {
      success: false,
      message: "Integração AD está desabilitada",
      synced: 0,
      errors: 0,
    }
  }

  let synced = 0
  let errors = 0

  try {
    for (const adUser of AD_USERS) {
      try {
        const authUser: AuthUser = {
          id: adUser.id,
          email: adUser.email,
          name: adUser.name,
          displayName: adUser.displayName,
          department: adUser.department,
          title: adUser.title,
          manager: adUser.manager,
          groups: mapADGroupsToIntranetGroups(adUser.groups),
          role: determineRoleFromGroups(adUser.groups),
          source: "ad",
          lastLogin: new Date().toISOString(),
        }

        await syncADUserToLocal(authUser)
        synced++
      } catch (error) {
        console.error(`❌ Erro ao sincronizar ${adUser.email}:`, error)
        errors++
      }
    }

    return {
      success: true,
      message: `Sincronização concluída: ${synced} usuários sincronizados, ${errors} erros`,
      synced,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      message: "Erro na sincronização em lote",
      synced,
      errors: errors + 1,
    }
  }
}
