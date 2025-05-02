import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ClientProviders } from "@/components/client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "온누리마취통증의학과 | 자가 통증 점검 시스템",
  description: "통증 자가 점검 및 AI 분석 리포트를 통해 건강 관리에 도움을 드립니다.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}



import './globals.css'
