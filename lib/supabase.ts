import { createClient } from "@supabase/supabase-js"

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://imzjwdkamgshwisusdeg.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltemp3ZGthbWdzaHdpc3VzZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzY0ODUsImV4cCI6MjA2Njk1MjQ4NX0._CO6bWYQLIHMOShRk7X1Xi-mpLOFe4y164PB_WK6MqA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para testar conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("authorized_users").select("count").limit(1)
    return { success: !error, error }
  } catch (err) {
    return { success: false, error: err }
  }
}
