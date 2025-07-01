"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Settings, Database, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    connection: boolean | null
    tables: boolean | null
    admin: boolean | null
    error?: string
  }>({
    connection: null,
    tables: null,
    admin: null,
  })

  // Executar teste automaticamente ao carregar a página
  useEffect(() => {
    handleFullTest()
  }, [])

  const handleFullTest = async () => {
    setTesting(true)
    setResults({ connection: null, tables: null, admin: null })

    try {
      // Teste 1: Conexão básica
      const { data: connectionTest, error: connectionError } = await supabase
        .from("authorized_users")
        .select("count")
        .limit(1)

      const connectionSuccess = !connectionError

      // Teste 2: Verificar se tabelas existem
      let tablesExist = false
      if (connectionSuccess) {
        const { data: tablesData, error: tablesError } = await supabase.from("authorized_users").select("id").limit(1)
        tablesExist = !tablesError
      }

      // Teste 3: Verificar se admin existe
      let adminExists = false
      if (tablesExist) {
        const { data: adminData, error: adminError } = await supabase
          .from("authorized_users")
          .select("email, role")
          .eq("email", "luiz.silva@repros.com.br")
          .eq("role", "admin")
          .single()

        adminExists = !adminError && adminData !== null
      }

      setResults({
        connection: connectionSuccess,
        tables: tablesExist,
        admin: adminExists,
        error: connectionError?.message || "",
      })
    } catch (error: any) {
      setResults({
        connection: false,
        tables: false,
        admin: false,
        error: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Status da Intranet</CardTitle>
          <CardDescription>Verificação automática da configuração</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Configuração */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Diagnóstico do Sistema</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-gray-600" />
                  <span>Conexão com Supabase</span>
                </div>
                {testing ? (
                  <Badge variant="secondary">Testando...</Badge>
                ) : results.connection === null ? (
                  <Badge variant="secondary">Aguardando</Badge>
                ) : results.connection ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Erro
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-gray-600" />
                  <span>Tabela authorized_users</span>
                </div>
                {testing ? (
                  <Badge variant="secondary">Testando...</Badge>
                ) : results.tables === null ? (
                  <Badge variant="secondary">Aguardando</Badge>
                ) : results.tables ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Criada
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Não Existe
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span>Usuário Admin (luiz.silva@repros.com.br)</span>
                </div>
                {testing ? (
                  <Badge variant="secondary">Testando...</Badge>
                ) : results.admin === null ? (
                  <Badge variant="secondary">Aguardando</Badge>
                ) : results.admin ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Configurado
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Não Existe
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Botão de Re-teste */}
          <Button onClick={handleFullTest} disabled={testing} className="w-full bg-transparent" variant="outline">
            {testing ? "Testando..." : "🔄 Testar Novamente"}
          </Button>

          {/* Resultados */}
          {results.error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro:</strong> {results.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Status Final */}
          {!testing && results.connection === true && results.tables === true && results.admin === true && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>✅ Configuração Completa!</strong>
                <br />
                Sua intranet está pronta para uso. Você pode fazer login agora!
              </AlertDescription>
            </Alert>
          )}

          {/* Botão para Login */}
          {!testing && results.connection === true && results.tables === true && results.admin === true && (
            <Link href="/login">
              <Button className="w-full" size="lg">
                🚀 Fazer Login na Intranet
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}

          {/* Instruções se algo estiver faltando */}
          {!testing && (results.connection === false || results.tables === false || results.admin === false) && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>❌ Configuração Incompleta:</strong>
                <br />
                {!results.connection && "• Problema na conexão com Supabase"}
                <br />
                {results.connection && !results.tables && "• Tabela authorized_users não existe"}
                <br />
                {results.connection && results.tables && !results.admin && "• Usuário admin não encontrado"}
              </AlertDescription>
            </Alert>
          )}

          {/* Links Úteis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Painel Supabase</p>
              <p className="text-sm text-gray-600">Gerenciar banco</p>
            </a>

            <Link href="/login" className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Página de Login</p>
              <p className="text-sm text-gray-600">Acessar intranet</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
