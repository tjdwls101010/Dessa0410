import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    const session = sessionCookie ? JSON.parse(sessionCookie.value) : null;
    
    if (!session?.isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }
    
    // 요청 데이터 파싱
    const formData = await req.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: '예약 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // Supabase에서 해당 예약 상태 업데이트
    const { error } = await supabase
      .from('surveys')
      .update({ reservation_status: 'cancelled' })
      .eq('id', id);
    
    if (error) {
      console.error('예약 취소 오류:', error);
      return NextResponse.json(
        { error: '예약 취소 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // 리다이렉트
    return NextResponse.redirect(new URL('/admin', req.url));
    
  } catch (error) {
    console.error('예약 취소 처리 오류:', error);
    return NextResponse.json(
      { error: '예약 취소 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 