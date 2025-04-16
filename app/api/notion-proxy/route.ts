import { NextResponse } from 'next/server'

// Notion 페이지 URL
const NOTION_URL = 'https://1c30ffd9516c801087baf57dd51e5cca.notion.site'

export async function GET() {
  try {
    // Notion 페이지 가져오기
    const response = await fetch(NOTION_URL)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Notion 페이지를 가져오는데 실패했습니다: ${response.status}` },
        { status: response.status }
      )
    }
    
    // 응답 HTML 가져오기
    const html = await response.text()
    
    // 응답 헤더 설정 (X-Frame-Options 헤더 제거)
    const headers = new Headers()
    headers.set('Content-Type', 'text/html')
    headers.set('Access-Control-Allow-Origin', '*')
    
    // CSP 헤더는 Notion 내부의 리소스 접근을 허용해야 함
    headers.set(
      'Content-Security-Policy',
      "default-src 'self' https://*.notion.so https://*.notion.site; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.notion.so https://*.notion.site; style-src 'self' 'unsafe-inline' https://*.notion.so https://*.notion.site; img-src * data:; font-src * data:; connect-src *;"
    )
    
    return new NextResponse(html, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error fetching Notion page:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 