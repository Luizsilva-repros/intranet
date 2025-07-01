"use client"

import { useState } from "react"
import { useDemoAuth } from "@/hooks/use-demo-auth"
import { demoCategories, demoLinks, demoAccessRequests } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DemoDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { authUser, signOut } = useDemoAuth()
  const router = useRouter()

  if (!authUser) {
    router.push("/demo/login")
    return null
  }

  const filteredLinks = demoLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getLinksByCategory = (categoryId: string) => {
    return filteredLinks.filter((link) => link.category_id === categoryId)
  }

  const pendingRequests = demoAccessRequests.filter((r) => r.status === "pending").length

  const handleSignOut = async () => {
    await signOut()
    router.push("/demo/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Intranet Corporativa</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                DEMO
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{authUser.name || authUser.email}</span>
                {authUser.role === "admin" && <Badge variant="secondary">Admin</Badge>}
              </div>

              {authUser.role === "admin" && (
                <Link href="/demo/admin">
                  <Button variant="outline" size="sm" className="relative bg-transparent">
                    Admin
                    {pendingRequests > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {pendingRequests}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar portais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories and Links */}
        <div className="space-y-8">
          {demoCategories.map((category) => {
            const categoryLinks = getLinksByCategory(category.id)
            if (categoryLinks.length === 0) return null

            return (
              <div key={category.id}>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                  {category.description && <span className="text-sm text-gray-500">- {category.description}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryLinks.map((link) => (
                    <Card key={link.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{link.title}</CardTitle>
                        {link.description && <CardDescription className="text-sm">{link.description}</CardDescription>}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Acessar Portal
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum portal encontrado.</p>
          </div>
        )}
      </main>
    </div>
  )
}
