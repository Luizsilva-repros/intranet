import { createClient } from "@supabase/supabase-js"

// TEMPORÁRIO: Substitua pelas suas credenciais reais do Supabase
// Depois de criar seu projeto no Supabase, substitua os valores abaixo:

const supabaseUrl = "https://SEU_PROJECT_ID.supabase.co"
const supabaseAnonKey = "SUA_ANON_KEY_AQUI"

// ⚠️ IMPORTANTE: Substitua os valores acima pelas suas credenciais reais!
// Você encontra essas informações em: Settings → API no painel do Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl !== "https://SEU_PROJECT_ID.supabase.co" && supabaseAnonKey !== "SUA_ANON_KEY_AQUI"
}
