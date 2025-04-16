import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "노션 | 온누리마취통증의학과",
  description: "온누리마취통증의학과 노션 페이지",
}

// 노션 페이지 정보
const NOTION_PAGE = {
  id: "1c30ffd9516c801087baf57dd51e5cca",
  // 방법 1: 공개 페이지 URL (관리자가 '웹에 공개' 설정 필요)
  publicUrl: "https://1c30ffd9516c801087baf57dd51e5cca.notion.site",
  // 방법 2: NotionHero 같은 무료 서비스 사용 (https://notionhero.io/ 에서 변환 필요)
  notionHeroUrl: "https://notionhero.io/notion/1c30ffd9516c801087baf57dd51e5cca",
  // 방법 3: API 프록시 경로 (서버에서 CORS, X-Frame-Options 헤더 제거 필요)
  proxyUrl: "/api/notion-proxy"
}

export default function NotionPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">노션 페이지</h1>
      
      {/* 임베드 옵션 1: 공개 페이지로 직접 임베드 */}
      <div className="w-full rounded-lg overflow-hidden border shadow-sm mb-6">
        <iframe
          src={NOTION_PAGE.publicUrl}
          className="w-full h-[80vh]"
          title="온누리마취통증의학과 노션 페이지"
          frameBorder="0"
          allow="fullscreen"
          loading="lazy"
        />
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">노션 페이지 접근 안내</h3>
        <p className="text-sm text-yellow-700 mb-2">
          아래 방법을 통해 노션 페이지를 확인할 수 있습니다:
        </p>
        <ol className="list-decimal pl-5 text-sm text-yellow-700">
          <li className="mb-1">
            <Link 
              href={`https://www.notion.so/${NOTION_PAGE.id}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-medium hover:underline"
            >
              Notion 공식 사이트에서 직접 방문
            </Link>
          </li>
          <li className="mb-1">
            <Link 
              href={NOTION_PAGE.notionHeroUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-medium hover:underline"
            >
              NotionHero 서비스를 통해 열기
            </Link>
            (프록시 서비스)
          </li>
          <li className="mb-1">
            노션 앱에서 열기: <span className="font-medium">notion://www.notion.so/{NOTION_PAGE.id}</span>
          </li>
        </ol>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">관리자 안내사항</h3>
        <p className="text-sm text-blue-700 mb-2">
          노션 페이지가 표시되지 않는 경우 다음 사항을 확인해주세요:
        </p>
        <ol className="list-decimal pl-5 text-sm text-blue-700">
          <li className="mb-1">
            노션 페이지를 <strong>'웹에 공개'</strong>로 설정해주세요.
          </li>
          <li className="mb-1">
            직접 iframe 임베드가 안 될 경우, <Link 
              href="https://notionhero.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-medium hover:underline"
            >
              NotionHero
            </Link>나 <Link 
              href="https://embednotionpages.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-medium hover:underline"
            >
              Embed Notion Pages
            </Link> 같은 무료 임베딩 서비스를 사용해보세요.
          </li>
          <li className="mb-1">
            <Link 
              href="/api/notion-proxy" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-primary font-medium hover:underline"
            >
              API 프록시 방식
            </Link>을 활성화해주세요.
          </li>
        </ol>
      </div>
    </main>
  )
} 