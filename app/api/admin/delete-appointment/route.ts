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
    const data = await req.json();
    const { appointmentId } = data;
    
    if (!appointmentId) {
      return NextResponse.json(
        { error: '예약 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // Supabase에서 해당 예약 삭제
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', appointmentId);
    
    if (error) {
      console.error('예약 삭제 오류:', error);
      return NextResponse.json(
        { error: '예약 삭제 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '예약이 성공적으로 삭제되었습니다.'
    });
    
  } catch (error) {
    console.error('예약 삭제 처리 오류:', error);
    return NextResponse.json(
      { error: '예약 삭제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 