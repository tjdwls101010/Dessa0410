import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

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
          <Link href="/ppt" className="text-sm font-medium hover:text-primary">
            발표 자료
          </Link>
        </nav>
        <Button variant="outline" size="sm" className="gap-2">
          <Phone className="h-4 w-4" />
          <span>예약 문의</span>
        </Button>
      </div>
    </header>
  )
}
