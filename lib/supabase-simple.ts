import { createClient } from "@supabase/supabase-js"

// Configuração mais robusta
const supabaseUrl = "https://imzjwdkamgshwisusdeg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiss3MiOiJzdXBhYmFzZSIsInJlZiI6Imltemp3ZGthbWdzaHdpc3VzZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzY0ODUsImV4cCI6MjA2Njk1MjQ4NX0._CO6bWYQLIHMOShRk7X1Xi-mpLOFe4y164PB_WK6MqA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
  },
})

// Função para verificar se o Supabase está funcionando
export const checkSupabaseHealth = async () => {
  try {
    const { data, error } = await supabase.from("authorized_users").select("count").limit(1)

    return {
      isHealthy: !error,
      error: error?.message,
      data,
    }
  } catch (err: any) {
    return {
      isHealthy: false,
      error: err.message || "Erro de conexão",
      data: null,
    }
  }
}
