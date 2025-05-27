import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const envStatus = {
      timestamp: new Date().toISOString(),
      supabaseUrl: {
        exists: !!supabaseUrl,
        value: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'null'
      },
      supabaseAnonKey: {
        exists: !!supabaseAnonKey,
        value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'null'
      },
      status: (!supabaseUrl || !supabaseAnonKey) ? 'error' : 'ok'
    };

    // Supabase 연결 테스트
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const testClient = createClient(supabaseUrl, supabaseAnonKey);
        
        // 간단한 쿼리로 연결 테스트
        const { data, error } = await testClient
          .from('surveys')
          .select('count')
          .limit(1);
          
        envStatus.connectionTest = {
          success: !error,
          error: error?.message || null
        };
      } catch (connectionError) {
        envStatus.connectionTest = {
          success: false,
          error: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
        };
      }
    }
    
    return NextResponse.json(envStatus);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 