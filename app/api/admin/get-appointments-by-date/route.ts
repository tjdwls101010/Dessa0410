import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // 요청 바디에서 데이터 추출
    const body = await request.json();
    const { dateStr } = body;

    if (!dateStr) {
      return NextResponse.json(
        { error: '날짜 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase에서 해당 날짜에 예약된 슬롯 조회
    const { data: appointments, error } = await supabase
      .from('surveys')
      .select('id, reservation_time0')
      .eq('reservation_day0', dateStr)
      .eq('reservation_status', 'confirmed')
      .not('reservation_time0', 'is', null);

    if (error) {
      console.error('예약 정보 조회 오류:', error);
      return NextResponse.json(
        { error: '예약 정보를 조회하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 성공적으로 조회된 예약 정보 반환
    return NextResponse.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('예약 조회 처리 오류:', error);
    return NextResponse.json(
      { error: '예약 조회 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 