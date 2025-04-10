# ToDo List: 온누리마취통증의학과 자가 점검 시스템 개발

**버전:** 1.1
**기준 문서:** Documents/PRDs/ (전체 PRD 문서)
**최종 업데이트:** 2024-04-30

## 0. 프로젝트 설정 및 환경 구성

-   [x] **공통:** Git 저장소 초기화 및 기본 설정 파일 추가 (`.gitignore`, `README.md` 등).
-   [x] **Frontend:** Next.js 프로젝트 생성 (`frontend` 디렉토리).
-   [x] **Frontend:** 필요한 기본 라이브러리 설치 (React, Next.js, TypeScript).
-   [x] **Frontend:** Tailwind CSS 및 UI 라이브러리(예: Shadcn/ui) 설정.
-   [x] **Frontend:** 상태 관리 라이브러리(예: Zustand/Jotai) 설치 및 설정.
-   [ ] ~~**Backend:** Python 가상 환경 설정 및 FastAPI 프로젝트 생성 (`backend` 디렉토리).~~
-   [ ] ~~**Backend:** 필요한 Python 라이브러리 설치 (`requirements.txt` 생성: fastapi, uvicorn, pydantic, supabase-py, google-generativeai, python-dotenv 등).~~
-   [ ] ~~**Backend:** FastAPI 기본 설정 (`main.py`, `core/config.py`).~~
-   [ ] **Backend:** Next.js API 라우트 설정 및 MCP 패턴 적용 (`app/api/` 디렉토리).
-   [ ] **Database:** Supabase 프로젝트 생성.
-   [ ] **Database:** Supabase 테이블 생성 (`survey_responses`, `survey_sections`, `qna_data`) 스키마 정의 (Directory_Project.md 참조).
-   [ ] **Database:** Supabase Vector Extension 활성화.
-   [ ] **공통:** 환경 변수 파일 생성 (`.env`, `.env.local`) 및 설정 (API Keys, DB URL 등 - 실제 값은 별도 관리).
-   [ ] **공통:** Supabase 클라이언트 설정 (`lib/supabase/client.ts`).

## 1. 백엔드 개발 (Next.js API Routes + MCP 패턴)

-   **API: `/api/survey` (PRD_SubmitSurvey.md)**
    -   [ ] TypeScript 타입 정의 (`lib/supabase/types.ts` - Request: `SurveyResponsesInput`, Response: `SurveyAnalysisResponse`).
    -   [ ] `/api/survey/route.ts` 엔드포인트 기본 구조 구현.
    -   [ ] 입력 데이터 유효성 검사 로직 구현.
    -   [ ] **Model:** Supabase 연동 함수 구현 (`lib/supabase/survey.ts`):
        -   [ ] `survey_responses` 테이블 데이터 삽입 로직.
        -   [ ] `survey_responses` 테이블 데이터 조회 로직.
    -   [ ] **Controller:** 규칙 기반 분석 로직 구현 (`app/api/survey/analysis/route.ts`):
        -   [ ] Red Flag 식별 로직.
        -   [ ] 기능 제한 점수 계산 로직 (`Calculation.md` 참조).
        -   [ ] 주요 지표 추출 로직.
    -   [ ] **Controller:** Gemini API 연동 로직 구현 (`app/api/survey/analysis/route.ts`):
        -   [ ] 프롬프트 생성 로직 (시스템 + 사용자).
        -   [ ] Gemini API 호출 및 응답 파싱 로직.
        -   [ ] 오류 처리 (API 호출 실패 등).
    -   [ ] **Presenter:** 결과 통합 및 포맷팅 로직 구현.
    -   [ ] 엔드포인트 내 전체 로직 통합 및 비동기 처리 적용.
-   **API: `/api/chat` (PRD_Chat.md)**
    -   [ ] TypeScript 타입 정의 (`lib/supabase/types.ts` - Request: `ChatInput`, Response: `ChatResponse`).
    -   [ ] `/api/chat/route.ts` 엔드포인트 기본 구조 구현.
    -   [ ] 입력 데이터 유효성 검사 로직 구현.
    -   [ ] **Model:** Supabase 연동 함수 구현 (`lib/supabase/chat.ts`):
        -   [ ] Vector 검색 로직 구현.
    -   [ ] **Controller:** RAG 파이프라인 구현:
        -   [ ] 사용자 질문 임베딩 생성 로직 (Gemini 임베딩 모델 또는 다른 모델).
        -   [ ] 프롬프트 생성 로직 (시스템 + 사용자 + 검색 결과 + 컨텍스트).
        -   [ ] Gemini API 호출 및 응답 생성 로직.
        -   [ ] 오류 처리 (검색 실패, API 호출 실패 등).
    -   [ ] **Presenter:** 응답 포맷팅 로직 구현.
    -   [ ] 엔드포인트 내 RAG 파이프라인 호출 및 응답 반환 로직 구현.
-   **Database:**
    -   [ ] `qna_data` 테이블에 병원 Q&A 데이터 입력 및 임베딩 생성/저장 스크립트 작성 (초기 데이터 로딩용).
    -   [ ] `survey_sections` 테이블에 설문조사 섹션 정보 입력 스크립트 작성.

## 2. 프론트엔드 개발 (Next.js)

-   **공통:**
    -   [x] 기본 레이아웃 설정 (`app/layout.tsx`).
    -   [ ] 상태 관리 설정 (Zustand 활용).
    -   [ ] API 클라이언트 모듈 구현 (`lib/apiClient.ts`).
    -   [ ] 타입 정의 (`types/` 디렉토리).
-   **메인 랜딩 페이지 (PRD_MainPage.md)**
    -   [x] 메인 페이지 라우팅 설정 (`app/page.tsx` 또는 `app/(main)/page.tsx`).
    -   [ ] **UI 컴포넌트 개발 (`components/ui/`, `components/landing/` 등):**
        -   [ ] Hero 섹션 컴포넌트 (CTA 버튼 포함).
        -   [ ] 전문 진료 분야 섹션 컴포넌트.
        -   [ ] 핵심 비수술 치료법 섹션 컴포넌트 (카드 등).
        -   [ ] 특화 클리닉 섹션 컴포넌트.
        -   [ ] Footer 컴포넌트.
    -   [ ] `Information_Hospital.md` 기반 정적 콘텐츠 렌더링 로직 구현.
    -   [ ] CTA 버튼 클릭 시 설문 페이지 이동 로직 구현.
    -   [ ] 반응형 디자인 적용.
-   **설문 시스템 (PRD_Survey.md)**
    -   [ ] 설문 페이지 라우팅 설정 (`app/(main)/survey/page.tsx`).
    -   [x] 설문 단계별 상태 관리 로직 구현 (현재 단계, 응답 데이터 등).
    -   [x] **UI 컴포넌트 개발 (`components/survey/`, `components/ui/`):**
        -   [x] 시작 안내 팝업/페이지 컴포넌트.
        -   [x] 진행률 표시 바 컴포넌트.
        -   [x] 질문 카드 컴포넌트.
        -   [x] 응답 유형별 컴포넌트 (Radio, Checkbox, Input, BodyHighlighter 등).
        -   [x] 네비게이션 버튼 컴포넌트.
    -   [x] 단계별 설문 렌더링 로직 구현.
    -   [x] 설문 진행률 계산 로직 수정 (단계 기반 -> 응답 문항 수 기반).
    -   [x] 단계별 필수 항목 응답 여부 검증 로직 강화 및 미응답 시 다음 단계 이동 제한.
    -   [x] 미응답 항목 존재 시 토스트 알림으로 경고 표시 기능 수정 (기존 정적 Alert 제거).
    -   [ ] '결과 분석 요청' 시 `/api/survey` API 호출 로직 구현.
    -   [ ] API 응답 처리 및 리포트 페이지 이동 로직 구현.
    -   [x] 반응형 디자인 적용.
-   **분석 리포트 페이지 (PRD_Report.md)**
    -   [ ] 리포트 페이지 라우팅 설정 (`app/(main)/report/page.tsx`).
    -   [ ] 설문 페이지로부터 `analysis_result` 데이터 수신 로직 구현.
    -   [ ] **UI 컴포넌트 개발 (`components/report/`, `components/ui/`):**
        -   [ ] 리포트 섹션별 컴포넌트 (요약, Red Flag, 통증 정보, 기능 제한 등).
        -   [ ] 차트 컴포넌트 (`Recharts` 등 활용).
        -   [ ] 인체 그림 하이라이터 컴포넌트 (`react-body-highlighter` 등 활용).
        -   [ ] 추천 치료법 설명 팝업/패널 컴포넌트.
        -   [ ] PDF 저장 버튼 컴포넌트.
    -   [ ] `analysis_result` 데이터를 기반으로 동적 리포트 렌더링 로직 구현.
    -   [ ] PDF 저장 기능 구현 (`jsPDF`, `html2canvas` 활용).
    -   [ ] 챗봇 페이지 이동 버튼 구현.
    -   [ ] 비진단적 목적 고지 문구 표시.
    -   [ ] 반응형 디자인 적용.
-   **챗봇 인터페이스 (PRD_Chatbot.md)**
    -   [ ] 챗봇 페이지 라우팅 설정 (`app/(main)/chat/page.tsx`).
    -   [ ] 대화 기록 상태 관리 로직 구현.
    -   [ ] 리포트 컨텍스트 수신/관리 로직 구현.
    -   [ ] **UI 컴포넌트 개발 (`components/chat/`, `components/ui/`):**
        -   [ ] 대화 내용 표시 영역 컴포넌트.
        -   [ ] 메시지 버블 컴포넌트 (사용자/챗봇 구분).
        -   [ ] 텍스트 입력창 및 전송 버튼 컴포넌트.
        -   [ ] 로딩 인디케이터 컴포넌트.
    -   [ ] 질문 전송 시 `/api/chat` API 호출 로직 구현 (리포트 컨텍스트 포함).
    -   [ ] API 응답 처리 및 챗봇 답변 표시 로직 구현.
    -   [ ] 자동 스크롤 로직 구현.
    -   [ ] 비진단적 목적 고지 문구 표시.
    -   [ ] 반응형 디자인 적용.

## 3. 테스트

-   [ ] **Backend:** API 라우트 단위 테스트 (각 엔드포인트 동작 검증).
-   [ ] **Backend:** Supabase 연동 테스트 (데이터 삽입, 조회 등).
-   [ ] **Frontend:** 컴포넌트 테스트 (Jest/React Testing Library).
-   [ ] **Frontend:** E2E 테스트 (Playwright 등 - 주요 사용자 시나리오 검증: 설문 완료 -> 리포트 확인 -> 챗봇 사용).
-   [ ] **공통:** 수동 테스트 수행 (다양한 시나리오, 브라우저 호환성).

## 4. 배포

-   [x] 배포 환경 선택 (Vercel).
-   [x] **Frontend:** Vercel을 사용한 빌드 및 배포 완료.
-   [x] 환경 변수 설정 (배포 환경).
-   [ ] CI/CD 파이프라인 구축 (선택적).
-   [ ] 도메인 연결 및 HTTPS 설정 (필요시).

**배포 URL:** https://dessa0410-qraoffbf3-seongjin-ahns-projects.vercel.app

## 5. 문서화

-   [ ] `README.md` 업데이트 (프로젝트 설명, 설치 방법, 실행 방법, 배포 정보 등).
-   [ ] API 문서 자동 생성 설정 (필요시).
-   [ ] 코드 내 주석 및 문서화 개선.
-   [ ] 최종 사용자 가이드 작성 (필요시).

## 6. 프로젝트 실행 메모

-   [x] 로컬 개발 환경 설정
-   [x] Next.js 개발 서버 실행 확인 (http://localhost:3000)
-   [ ] Supabase 연결 확인

## 7. Supabase 데이터베이스 메모

### 테이블 설계

1. **survey_responses**
   - 목적: 사용자의 설문 응답 및 분석 결과 저장
   - 필드:
     - id: uuid (PRIMARY KEY, 자동 생성)
     - created_at: timestamp with time zone (자동 생성)
     - user_id: uuid (FOREIGN KEY, 추후 사용자 관리 기능 추가 시)
     - responses: jsonb (설문 응답 데이터)
     - analysis_result: jsonb (규칙 기반 + AI 분석 결과)
     - report_access_key: text (리포트 접근용 고유 키)
     - is_test_data: boolean (테스트 데이터 여부)

2. **survey_sections**
   - 목적: 설문조사 섹션 정보 관리
   - 필드:
     - id: uuid (PRIMARY KEY, 자동 생성)
     - created_at: timestamp with time zone (자동 생성)
     - section_name: text (섹션 이름)
     - section_order: integer (섹션 순서)
     - section_description: text (섹션 설명)

3. **qna_data**
   - 목적: 챗봇 RAG용 Q&A 데이터 저장
   - 필드:
     - id: uuid (PRIMARY KEY, 자동 생성)
     - created_at: timestamp with time zone (자동 생성)
     - question: text (질문)
     - answer: text (답변)
     - category: text (카테고리)
     - embedding: vector (질문 임베딩 벡터)

### RLS(Row Level Security) 설정

- **survey_responses**: 레코드 생성은 누구나 가능, 조회는 report_access_key를 알고 있는 사용자만 가능
- **survey_sections**: 읽기만 가능 (관리자만 쓰기 가능)
- **qna_data**: 읽기만 가능 (관리자만 쓰기 가능)

### 인덱스 설정

- **survey_responses**: report_access_key에 인덱스 추가
- **qna_data**: embedding 필드에 벡터 인덱스 추가
