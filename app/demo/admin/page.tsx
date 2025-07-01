"use client"

import { useState } from "react"
import { useDemoAuth } from "@/hooks/use-demo-auth"
import { demoUsers, demoCategories, demoLinks, demoAccessRequests } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DemoAdminPage() {
  const { authUser } = useDemoAuth()
  const router = useRouter()
  const [accessRequests, setAccessRequests] = useState(demoAccessRequests)

  if (!authUser || authUser.role !== "admin") {
    router.push("/demo/login")
    return null
  }

  const approveRequest = (requestId: string) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const, reviewed_at: new Date().toISOString() } : req,
      ),
    )
  }

  const rejectRequest = (requestId: string) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" as const, reviewed_at: new Date().toISOString() } : req,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/demo/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Administração</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                DEMO
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Solicitações</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          {/* Solicitações de Acesso */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <span>Solicitações de Acesso</span>
                  {accessRequests.filter((r) => r.status === "pending").length > 0 && (
                    <Badge variant="destructive">{accessRequests.filter((r) => r.status === "pending").length}</Badge>
                  )}
                </CardTitle>
                <CardDescription>Gerencie solicitações de acesso à intranet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {accessRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{request.name || request.email}</h3>
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "default"
                                  : request.status === "approved"
                                    ? "default"
                                    : "destructive"
                              }
                            >
                              {request.status === "pending"
                                ? "Pendente"
                                : request.status === "approved"
                                  ? "Aprovado"
                                  : "Rejeitado"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {request.email}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            <strong>Solicitado em:</strong> {new Date(request.requested_at).toLocaleString("pt-BR")}
                          </p>
                          {request.message && (
                            <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                              <strong>Justificativa:</strong> {request.message}
                            </p>
                          )}
                        </div>

                        {request.status === "pending" && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => approveRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Aprovar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectRequest(request.id)}>
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outras abas com dados de demonstração */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuários Autorizados</CardTitle>
                <CardDescription>Lista de usuários com acesso à intranet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{user.name || user.email}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                        <Badge variant="default">Ativo</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Categorias de links organizacionais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {demoCategories.map((category) => (
                    <Card key={category.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <CardTitle className="text-base">{category.name}</CardTitle>
                        </div>
                        {category.description && <CardDescription>{category.description}</CardDescription>}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Links dos Portais</CardTitle>
                <CardDescription>Links para sistemas da empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{link.title}</p>
                          <Badge variant="default">Ativo</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{link.url}</p>
                        {link.description && <p className="text-sm text-gray-600">{link.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
