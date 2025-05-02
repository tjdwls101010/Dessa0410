import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // 세션 쿠키 삭제
    const cookieStore = cookies();
    cookieStore.delete('user_session');
    
    return NextResponse.json({
      success: true,
      message: '로그아웃 되었습니다.'
    });
  } catch (error) {
    console.error('로그아웃 처리 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 