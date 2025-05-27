import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다:', {
    url: supabaseUrl ? '설정됨' : '누락',
    key: supabaseAnonKey ? '설정됨' : '누락'
  });
  throw new Error(`Supabase 환경변수가 누락되었습니다. NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '설정됨' : '누락'}, NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '설정됨' : '누락'}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
