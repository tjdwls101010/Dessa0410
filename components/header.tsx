"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const { user, logout, isLoading } = useAuth()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">온누리마취통증의학과</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            홈
          </Link>
          <Link href="/survey" className="text-sm font-medium hover:text-primary">
            통증 자가 점검
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            서비스 소개
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-primary">
            FAQ
          </Link>
          <Link href="/ppt_go" className="text-sm font-medium hover:text-primary">
            최종 발표
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}님</span>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm" 
                disabled={isLoading}
              >
                로그아웃
              </Button>
              {user.reportId && (
                <Link href={`/report/${user.reportId}`}>
                  <Button size="sm">내 예약 확인</Button>
                </Link>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                예약 확인
              </Button>
            </Link>
          )}
          {/* <Link href="https://www.notion.so/1c30ffd9516c801087baf57dd51e5cca" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 bg-white text-black border border-gray-200 hover:bg-gray-50">
              <Image 
                src="/Notion Logo.png" 
                alt="Notion" 
                width={16} 
                height={16} 
              />
              <span>노션 바로가기</span>
            </Button>
          </Link> */}
        </div>
      </div>
    </header>
  )
}
