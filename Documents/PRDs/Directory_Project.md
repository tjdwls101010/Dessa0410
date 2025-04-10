# 프로젝트 디렉토리 구조

**버전:** 1.1
**기준 문서:** Documents/PRDs/PRD_Project.md
**최종 업데이트:** 2024-04-10

```
/
├── app/                        # Next.js App Router
│   ├── page.tsx                # 메인 랜딩 페이지
│   └── layout.tsx              # 루트 레이아웃
├── components/                 # React 컴포넌트
│   └── ui/                     # Shadcn UI 컴포넌트
├── hooks/                      # 커스텀 React Hooks
├── lib/                        # 유틸리티 함수, API 클라이언트 등
├── public/                     # 정적 파일 (이미지 등)
├── styles/                     # 전역 스타일
├── Documents/                  # 프로젝트 문서
│   ├── ToDo.md                 # 프로젝트 진행 상황 체크리스트
│   ├── Directory_Project.md    # 프로젝트 디렉토리 구조 문서 (현재 문서)
│   ├── PRDs/                   # 제품 요구사항 명세서
│   │   ├── PRD_Project.md
│   │   ├── Directory_Project.md
│   │   ├── ToDo.md
│   │   ├── Frontend/
│   │   └── Backend/
│   └── References/             # 참고 자료
├── next.config.mjs             # Next.js 설정
├── package.json                # 의존성 관리
├── pnpm-lock.yaml              # PNPM 락 파일
├── postcss.config.mjs          # PostCSS 설정
├── tailwind.config.ts          # Tailwind CSS 설정
├── tsconfig.json               # TypeScript 설정
└── .gitignore                  # Git 무시 파일 목록
```

## 현재 상태

현재 프로젝트는 Next.js 프레임워크와 Shadcn UI를 기반으로 구성되어 있습니다. PRD에서 제안한 원래 구조와 달리 프론트엔드와 백엔드가 분리되어 있지 않고, Next.js 프로젝트 단독으로 구성되어 있습니다.

### 프론트엔드 구조

- **app/**: Next.js의 App Router 구조를 따르고 있습니다.
- **components/**: UI 컴포넌트를 포함하며, Shadcn UI 라이브러리가 설치되어 있습니다.
- **hooks/**, **lib/**: 커스텀 훅과 유틸리티 함수를 위한 디렉토리가 준비되어 있습니다.
- **styles/**: 전역 스타일 설정을 위한 디렉토리입니다.

### 백엔드 구조

현재는 백엔드가 구현되어 있지 않습니다. 원래 계획대로 별도의 FastAPI 백엔드를 구현할 수도 있고, Next.js의 API 라우트를 활용할 수도 있습니다.

## 향후 개발 방향

1. **백엔드 구현 방식 결정:**
   - 옵션 1: 별도의 FastAPI 백엔드 구현 (`backend/` 디렉토리 생성)
   - 옵션 2: Next.js API 라우트 활용 (`app/api/` 디렉토리 구성)

2. **기능별 디렉토리 구성:**
   - 설문 관련: `app/(main)/survey/`, `components/survey/`
   - 리포트 관련: `app/(main)/report/`, `components/report/`
   - 챗봇 관련: `app/(main)/chat/`, `components/chat/`

3. **상태 관리 구성:**
   - Context API 또는 Zustand/Jotai 활용

4. **데이터베이스 연결:**
   - Supabase 프로젝트 생성 및 연결 설정 