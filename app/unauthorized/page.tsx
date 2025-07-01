"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function UnauthorizedPage() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Acesso Negado</CardTitle>
          <CardDescription>Você não tem permissão para acessar esta intranet</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Seu email não está na lista de usuários autorizados. Entre em contato com o administrador do sistema para
            solicitar acesso.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
            Fazer Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
