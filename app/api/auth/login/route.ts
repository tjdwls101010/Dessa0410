import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json();
    
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: '이름, 전화번호, 예약 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 전화번호 형식을 정규화 (하이픈 제거)
    const normalizedPhone = phone.replace(/-/g, '');
    
    // Supabase에서 해당 이름, 전화번호, 비밀번호와 일치하는 레코드 찾기
    const { data, error } = await supabase
      .from('surveys')
      .select('id, reservation_name, reservation_phone, reservation_password')
      .eq('reservation_name', name)
      .eq('reservation_password', password)
      .or(`reservation_phone.eq.${phone},reservation_phone.eq.${normalizedPhone}`)
      .single();
    
    if (error || !data) {
      console.error('로그인 실패:', error);
      return NextResponse.json(
        { error: '입력하신 정보와 일치하는 예약을 찾을 수 없습니다. 정보를 다시 확인해주세요.' },
        { status: 401 }
      );
    }
    
    // 인증 성공 - 세션 쿠키에 사용자 정보 저장
    const cookieStore = cookies();
    cookieStore.set('user_session', JSON.stringify({
      reportId: data.id,
      name: data.reservation_name,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    }), { 
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7일 동안 유효
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return NextResponse.json({
      success: true,
      reportId: data.id
    });
    
  } catch (error) {
    console.error('로그인 처리 오류:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 