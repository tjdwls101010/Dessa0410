# 제품 요구사항 명세서 (PRD): 온누리마취통증의학과 예비 환자 자가 점검 및 안내 시스템

**버전:** 1.0
**기준 문서:** Documents/References/Overview.md (v0.1)

## 1. 개요 (Overview)

온누리마취통증의학과 방문을 고려하는 잠재 환자들이 자신의 통증 상태를 웹 기반 설문을 통해 자가 점검하고, AI(Gemini API) 및 규칙 기반 분석을 통해 생성된 리포트를 확인하며, 관련 정보를 챗봇으로 문의할 수 있는 시스템 개발.

**핵심 목표:** 사용자의 자가 점검 지원, 병원 방문 및 전문 진료 필요성 인지 유도. **의료 진단 도구가 아님.**

## 2. 목표 (Goals)

-   **사용자:**
    -   객관적 설문을 통한 통증 자가 점검.
    -   시각화된 리포트를 통한 분석 결과 및 관련 치료법(슈로스, 도수치료 등) 예비 정보 확인.
    -   챗봇을 통한 리포트 내용 및 병원 정보 문의/안내.
-   **병원 (간접적):** 잠재 환자 대상 병원/치료법 홍보 및 정보 기반 내원 유도.
-   **개발 (과제):** 데이터 수집, AI 분석, 결과 시각화, 정보 제공 기술 적용 프로토타입 개발.

## 3. 사용자 (Users)

-   **주요 사용자:** 근골격계 통증/불편함을 느끼며 온누리마취통증의학과 방문을 고려 중인 잠재 환자.

## 4. 주요 기능 (Key Features)

1.  **웹 기반 설문 시스템 (Frontend: Next.js, Backend: FastAPI):**
    -   단계별 설문 진행 (약 30-35개 문항).
    -   진행률 표시.
    -   다양한 문항 유형 지원.
    -   **비진단적 목적 고지.**
    -   응답 완료 시 분석 요청 버튼 활성화.
    -   설문 데이터 JSON 형태로 백엔드 전송 (`/submit_survey`).
2.  **설문 결과 분석 및 처리 (Backend: FastAPI, AI: Gemini API):**
    -   `POST /submit_survey` 엔드포인트.
    -   입력: 설문 응답 JSON.
    -   처리: 규칙 기반 분석 (Red Flag, 기능 제한 점수, 주요 지표) + AI 분석 (Gemini API - 통증 심각도/만성화, 기능 제한 해석, 잠재 원인, 통증 양상, 추천 치료법).
    -   출력: 분석 결과 JSON 객체.
3.  **분석 리포트 생성 및 조회 (Frontend: Next.js):**
    -   분석 결과 JSON 기반 동적 웹 리포트 생성.
    -   시각화 요소: 통증 부위(인체 그림), 기능 제한 대시보드(차트), 통증 강도/양상 요약, Red Flag 경고.
    -   추천 검사/치료법 리스트 및 설명.
    -   개인화된 설명 (사용자 응답 인용).
    -   **비진단적 목적 및 전문의 상담 필수 고지.**
    -   리포트 PDF 저장 기능.
4.  **RAG 기반 챗봇 (Frontend: Next.js, Backend: FastAPI, DB: Supabase):**
    -   표준 챗 UI (텍스트 입력, 대화 표시).
    -   백엔드 API (`/chat`) 호출.
    -   처리 (RAG): Supabase Q&A 데이터 검색 + 리포트 컨텍스트 활용 -> LLM 프롬프트 구성 -> LLM 답변 생성.
    -   **비진단적 목적 고지.**

## 5. 기술 스택 (Technology Stack)

-   **Frontend:** Next.js (React)
-   **Backend:** FastAPI (Python)
-   **Database:** Supabase (PostgreSQL + Vector)
-   **AI:** Google Gemini API
-   **기타:** UI 라이브러리, 차트 라이브러리 (Recharts/Chart.js), PDF 생성 (jsPDF, html2canvas), 상태 관리 (Zustand/Jotai), HTTP 클라이언트 (axios/fetch), RAG 프레임워크 (LangChain 고려).

## 6. 데이터 모델 (Data Models - Supabase)

-   **`SurveyResponses`:** 설문 응답 및 분석 결과 저장.
    -   `id`, `created_at`, `responses` (JSONB), `analysis_result` (JSONB), `is_test_data` (BOOLEAN), `report_access_key` (TEXT, Optional).
-   **`QnAData`:** 챗봇 RAG용 Q&A 데이터.
    -   `id`, `question`, `answer`, `category` (Optional), `embedding` (VECTOR), `created_at`.

## 7. API 명세 (API Specifications - FastAPI)

-   **`POST /submit_survey`:** 설문 응답 받아 분석 결과 반환.
-   **`POST /chat`:** 사용자 질문과 리포트 컨텍스트 기반으로 챗봇 답변 생성.

## 8. UI/UX 고려사항 (UI/UX Considerations)

-   **톤앤매너:** 신뢰감, 전문성, 차분함. 병원 웹사이트와 일관성 유지.
-   **설문:** 사용자 친화적, 단계별 진행, 명확한 안내. (참고: Typeform, Tally)
-   **리포트:** 시각적, 이해 용이, 쉬운 용어 사용, 비진단적 목적 강조. (참고: 건강 앱 대시보드, WebMD)
-   **챗봇:** 표준 UI, 로딩 표시, 답변 출처 명시 고려. (참고: Intercom, Drift)

## 9. 제약 조건 및 고려 사항 (Constraints & Considerations)

-   의료 데이터 제약 (실제 환자 데이터 X).
-   **비진단적 성격 명확화 및 반복 고지 (법적 책임 방지).**
-   AI 모델 한계 (환각, 부정확성) -> 규칙 기반 로직 병행, 결과 검증.
-   데이터 프라이버시 (익명 사용 권장).
-   확장성 및 보안 고려.

## 10. 향후 개선 방향 (Future Enhancements)

-   사용자 계정 및 이력 관리.
-   데이터 기반 설문/분석 로직 개선.
-   고도화된 분석 도구 통합.
-   병원 예약 시스템 연동 (장기적).
-   다국어 지원.
