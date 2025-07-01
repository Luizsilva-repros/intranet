"use client"

import type React from "react"
import { useState } from "react"
import { useDemoAuth } from "@/hooks/use-demo-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail } from "lucide-react"

export default function DemoLoginPage() {
  const [email, setEmail] = useState("luiz.silva@repros.com.br")
  const [error, setError] = useState("")
  const { signIn, loading } = useDemoAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signIn(email)
      router.push("/demo/dashboard")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Intranet Corporativa</CardTitle>
          <CardDescription>Demonstração - Login Simulado</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar (Demo)"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-800">🎯 Modo Demonstração</p>
              <p className="text-blue-700">Use: luiz.silva@repros.com.br (Admin)</p>
              <p className="text-blue-700">Ou: usuario@repros.com.br (Usuário)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
