import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-bold mb-4">온누리마취통증의학과</h3>
            <p className="text-sm text-muted-foreground">
              근골격계 통증 치료 전문 의료기관으로 환자 중심의 맞춤형 치료를 제공합니다.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">진료 시간</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>평일: 09:00 - 18:00</li>
              <li>토요일: 09:00 - 13:00</li>
              <li>일요일/공휴일: 휴진</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">연락처</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>전화: 051-714-1831</li>
              <li>이메일: info@onnuripain.com</li>
              <li>주소:부산광역시 동래구 동래로 25, 701호</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/survey" className="text-muted-foreground hover:text-primary">
                  통증 자가 점검
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 안성진 김도훈 김두현 김재훈 김정연 정현준. All rights reserved.</p>
          <p className="mt-2">
            본 서비스는 의학적 진단을 대체하지 않으며, 정확한 진단과 치료를 위해서는 전문의 상담이 필요합니다.
          </p>
        </div>
      </div>
    </footer>
  )
}

