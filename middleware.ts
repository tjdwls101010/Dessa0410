import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인이 필요한 경로 목록
const protectedRoutes = [
  '/my-reservation',
  '/report'
];

// 로그인 없이 접근 가능한 경로
const publicRoutes = [
  '/',
  '/login',
  '/survey'
];

export function middleware(request: NextRequest) {
  // 현재 경로
  const path = request.nextUrl.pathname;
  
  // 세션 쿠키 확인
  const sessionCookie = request.cookies.get('user_session')?.value;
  const isLoggedIn = sessionCookie ? JSON.parse(sessionCookie).isLoggedIn : false;
  
  // URL 쿼리 파라미터 확인
  const { searchParams } = request.nextUrl;
  const isNewReport = searchParams.has('new') || searchParams.has('skipAuth');
  
  // /report/ 경로로 시작하는 URL 처리
  const isReportRoute = path.startsWith('/report/');
  
  // 새로 생성된 리포트는 로그인 없이 접근 가능
  if (isReportRoute && isNewReport) {
    return NextResponse.next();
  }
  
  // 보호된 경로 체크 (접두사 기반)
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // 로그인되지 않은 사용자가 보호된 경로에 접근하려는 경우
  if (isProtectedRoute && !isLoggedIn) {
    // 로그인 후 돌아올 URL을 쿼리 파라미터로 포함하여 로그인 페이지로 리다이렉트
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // 로그인된 사용자가 로그인 페이지에 접근하려는 경우 메인 페이지로 리다이렉트
  if (path === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 그 외의 경우는 정상적으로 페이지 표시
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 