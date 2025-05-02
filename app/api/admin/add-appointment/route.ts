import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화 (서버 측)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const data = await request.json();
    
    console.log('서버에서 예약 추가 요청 받음:', data);
    
    // Supabase에 예약 데이터 추가
    const { data: insertedData, error } = await supabase
      .from('surveys')
      .insert([{
        reservation_name: data.patientName,
        reservation_phone: data.patientPhone,
        reservation_day0: data.dateStr,
        reservation_time0: data.timeStr,
        reservation_status: 'confirmed',
        // 설문조사 필수 필드에 기본값 설정
        a1_age: '',
        a2_gender: '',
        report_generated: false,
        // 메모 필드
        reservation_memo: data.memo || '관리자가 직접 등록한 예약',
        // 예약 유형
        appointment_type: data.appointmentType
      }])
      .select();
      
    if (error) {
      console.error('Supabase 오류:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: insertedData 
    });
  } catch (err) {
    console.error('예약 추가 중 오류:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : '알 수 없는 오류' }, 
      { status: 500 }
    );
  }
} 