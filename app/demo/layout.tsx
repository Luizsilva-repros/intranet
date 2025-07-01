import type React from "react"
import { DemoAuthProvider } from "@/hooks/use-demo-auth"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DemoAuthProvider>{children}</DemoAuthProvider>
}
