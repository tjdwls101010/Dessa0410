import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
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
    
    // surveys 테이블에 reservation_status 컬럼이 존재하는지 확인
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', 'surveys')
      .eq('column_name', 'reservation_status');
    
    if (columnsError) {
      return NextResponse.json(
        { error: '데이터베이스 스키마 확인 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // 이미 컬럼이 존재하면 종료
    if (columns && columns.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'reservation_status 컬럼이 이미 존재합니다.'
      });
    }
    
    // surveys 테이블에 reservation_status 컬럼 추가
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE surveys 
        ADD COLUMN IF NOT EXISTS reservation_status VARCHAR(20) DEFAULT NULL;
      `
    });
    
    if (error) {
      console.error('컬럼 추가 오류:', error);
      return NextResponse.json(
        { error: '컬럼 추가 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'reservation_status 컬럼이 성공적으로 추가되었습니다.'
    });
    
  } catch (error) {
    console.error('데이터베이스 마이그레이션 오류:', error);
    return NextResponse.json(
      { error: '데이터베이스 마이그레이션 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 