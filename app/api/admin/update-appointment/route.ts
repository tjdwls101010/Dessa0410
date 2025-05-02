import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const { 
      appointmentId, 
      patientName, 
      patientPhone, 
      dateStr, 
      timeStr, 
      memo, 
      appointmentType 
    } = await request.json();
    
    console.log("예약 수정 요청:", { appointmentId, patientName, appointmentType });
    
    // 입력값 검증
    if (!appointmentId) {
      return NextResponse.json({ error: '예약 ID가 필요합니다.' }, { status: 400 });
    }
    
    if (!patientName) {
      return NextResponse.json({ error: '환자 이름이 필요합니다.' }, { status: 400 });
    }
    
    // Supabase에 예약 정보 업데이트
    const { data, error } = await supabase
      .from('surveys')
      .update({
        reservation_name: patientName,
        reservation_phone: patientPhone,
        reservation_day0: dateStr,
        reservation_time0: timeStr,
        appointment_type: appointmentType
      })
      .eq('id', appointmentId)
      .select();
    
    if (error) {
      console.error("Supabase 업데이트 오류:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '예약이 성공적으로 수정되었습니다.', 
      data
    });
    
  } catch (error) {
    console.error("예약 수정 중 오류 발생:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: '알 수 없는 오류가 발생했습니다.' }, { status: 500 });
  }
} 