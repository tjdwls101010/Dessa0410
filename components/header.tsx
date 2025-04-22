import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
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
          <Link href="/ppt_mid" className="text-sm font-medium hover:text-primary">
            중간 발표 자료 V1
          </Link>
          <Link href="/ppt_final" className="text-sm font-medium hover:text-primary">
            중간 발표 자료 V2
          </Link>
          <Link href="/ppt_mid_v3" className="text-sm font-medium hover:text-primary">
            중간 발표 자료 V3
          </Link>
        </nav>
        <Link href="https://www.notion.so/1c30ffd9516c801087baf57dd51e5cca" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2 bg-white text-black border border-gray-200 hover:bg-gray-50">
            <Image 
              src="/Notion Logo.png" 
              alt="Notion" 
              width={16} 
              height={16} 
            />
            <span>노션 바로가기</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
