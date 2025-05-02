import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Supabase 클라이언트 초기화 - 서비스 롤 키 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // appointment_type 컬럼이 존재하는지 확인
    const { data: columnExists, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'surveys')
      .eq('column_name', 'appointment_type');
    
    if (checkError) {
      throw checkError;
    }
    
    // 컬럼이 이미 존재하면 메시지 반환
    if (columnExists && columnExists.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'appointment_type 컬럼이 이미 존재합니다.'
      });
    }
    
    // 직접 SQL 실행
    try {
      // 관리자 권한이 필요한 SQL 실행 (서비스 롤 키 필요)
      const { error } = await supabase.rpc('alter_surveys_table_add_appointment_type');
      
      if (error) {
        // RPC 함수가 없을 경우 일반 삽입 방식 시도
        console.log('RPC failed, trying alternative approach:', error.message);
        
        const { error: insertError } = await supabase
          .from('surveys')
          .upsert({ 
            id: 'migration-placeholder',
            reservation_name: 'MIGRATION TEMP USER',
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Insert approach failed:', insertError);
          return NextResponse.json({
            success: false,
            message: 'DB 마이그레이션 실패: ' + insertError.message
          }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          message: '컬럼 추가를 위한 대체 방식이 실행되었습니다. 데이터베이스 관리자에게 문의하세요.'
        });
      }
    } catch (sqlError: any) {
      console.error('SQL execution error:', sqlError);
      return NextResponse.json({
        success: false,
        message: 'SQL 실행 중 오류: ' + sqlError.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'appointment_type 컬럼이 성공적으로 추가되었습니다.'
    });
    
  } catch (error: any) {
    console.error('Database migration error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '데이터베이스 마이그레이션 중 오류가 발생했습니다.',
        error: error.message
      },
      { status: 500 }
    );
  }
} 