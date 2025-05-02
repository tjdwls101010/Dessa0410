import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json();
    
    // 관리자 자격 증명 확인
    const isValidAdmin = name === "운영자" && phone === "12345678900" && password === "111111";
    
    if (!isValidAdmin) {
      return NextResponse.json(
        { error: '관리자 자격 증명이 유효하지 않습니다.' },
        { status: 401 }
      );
    }
    
    // 인증 성공 - 세션 쿠키에 관리자 정보 저장
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({
      name: '운영자',
      isLoggedIn: true,
      isAdmin: true, // 관리자 권한 표시
      loginTime: new Date().toISOString(),
    }), { 
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7일 동안 유효
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return NextResponse.json({
      success: true
    });
    
  } catch (error) {
    console.error('관리자 로그인 처리 오류:', error);
    return NextResponse.json(
      { error: '관리자 로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 