import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // 세션 쿠키 가져오기
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { isLoggedIn: false },
        { status: 200 }
      );
    }
    
    // 세션 정보 파싱 (사용자 정보)
    const sessionData = JSON.parse(sessionCookie.value);
    
    // 세션 만료 확인 (7일 후)
    const loginTime = new Date(sessionData.loginTime);
    const expiryTime = new Date(loginTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > expiryTime) {
      // 세션 만료 - 쿠키 삭제
      cookieStore.delete('user_session');
      return NextResponse.json(
        { isLoggedIn: false, message: '세션이 만료되었습니다.' },
        { status: 200 }
      );
    }
    
    // 민감한 정보 제외하고 반환
    return NextResponse.json({
      isLoggedIn: true,
      name: sessionData.name,
      reportId: sessionData.reportId
    });
    
  } catch (error) {
    console.error('세션 정보 처리 오류:', error);
    return NextResponse.json(
      { error: '세션 정보 처리 중 오류가 발생했습니다.', isLoggedIn: false },
      { status: 500 }
    );
  }
} 