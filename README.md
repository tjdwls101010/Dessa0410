# Dessa0410 예약 시스템

## 환경변수 설정

관리자 페이지가 정상적으로 작동하려면 다음 환경변수들이 설정되어야 합니다:

### Supabase 설정
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 로컬 개발 환경 설정
1. 프로젝트 루트에 `.env.local` 파일을 생성합니다
2. 위의 환경변수들을 설정합니다

### Vercel 배포 환경 설정
1. Vercel 대시보드에서 프로젝트 설정으로 이동
2. Environment Variables 섹션에서 환경변수들을 추가

## 관리자 페이지 문제 해결

### "TypeError: fetch failed" 오류가 발생하는 경우:
1. 환경변수가 올바르게 설정되었는지 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. Supabase URL과 Key가 유효한지 확인

### 환경변수 확인 방법:
- 브라우저 개발자 도구 콘솔에서 환경변수 설정 상태를 확인할 수 있습니다
- 서버 로그에서 Supabase 연결 오류 메시지를 확인할 수 있습니다 