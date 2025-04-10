# 백엔드 PRD: 설문 결과 분석 및 처리 (`/submit_survey`)

**버전:** 1.0
**기준 문서:** Documents/PRDs/PRD_Project.md, Documents/References/Overview.md, Documents/References/Survey.md, Documents/References/Calculation.md

## 1. 개요 (Overview)

프론트엔드로부터 전송된 사용자의 설문 응답 JSON 데이터를 받아, 규칙 기반 로직과 AI(Gemini API) 분석을 결합하여 최종 분석 결과 JSON 객체를 생성하고, 이를 데이터베이스(Supabase `SurveyResponses` 테이블)에 저장한 후 프론트엔드에 반환하는 FastAPI 엔드포인트 (`POST /submit_survey`)를 개발한다.

## 2. 목표 (Goals)

-   설문 응답 데이터를 정확하게 수신하고 유효성을 검사한다.
-   사전 정의된 규칙 기반 로직을 적용하여 주요 지표(Red Flag, 기능 제한 점수 등)를 계산하고 추출한다.
-   Gemini API를 활용하여 설문 내용 기반의 심층 분석(통증 심각도, 잠재 원인, 추천 치료법 등)을 수행한다.
-   규칙 기반 결과와 AI 분석 결과를 통합하여 구조화된 최종 분석 결과 객체를 생성한다.
-   원본 설문 응답과 분석 결과를 데이터베이스에 안정적으로 저장한다.
-   처리 결과를 프론트엔드에 적절한 형식으로 반환한다.

## 3. API 명세 (API Specification)

-   **Endpoint:** `POST /submit_survey`
-   **Request:**
    -   **Content-Type:** `application/json`
    -   **Body:**
        ```json
        {
          "responses": { // 프론트엔드에서 구조화하여 전송하는 설문 응답 객체
            "sectionA": { ... },
            "sectionB": { ... },
            // ... C, D, E, F 섹션 응답
          }
        }
        ```
-   **Response (Success - 200 OK):**
    -   **Content-Type:** `application/json`
    -   **Body:**
        ```json
        {
          "analysis_result": { // 최종 분석 결과 객체
            "red_flags": ["...", "..."], // F항목 기반 Red Flag 텍스트 배열
            "functional_limit_score": 75, // D항목 기반 계산된 기능 제한 점수 (ODI/NDI 개념)
            "functional_limit_level": "Severe", // 점수에 따른 심각도 레벨
            "pain_severity_avg": 7, // C11(현재), C12(평균) 통증 강도 평균 또는 주요 값
            "pain_duration": "3개월 이상", // B6 기반 통증 기간
            "pain_pattern": "신경병증성 통증 양상 의심", // AI 분석 또는 규칙 기반 추론 결과
            "potential_causes": ["잘못된 자세", "오래 앉아있는 생활 습관"], // AI 분석 결과
            "recommended_services": ["도수 치료", "슈로스 운동"], // AI 분석 결과 (병원 제공 서비스 기반)
            "report_summary_text": "AI가 생성한 리포트 요약 텍스트...", // Gemini 생성
            "personalized_comments": ["오래 앉아있을 때 통증이 심해진다고 하셨는데..."], // Gemini 생성
            "raw_gemini_output": "Gemini API 원본 응답 텍스트..." // 디버깅/참고용
            // 기타 필요한 분석 결과 필드 추가 가능
          },
          "response_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // Supabase에 저장된 응답 레코드의 UUID
        }
        ```
-   **Response (Error):**
    -   **400 Bad Request:** 입력 데이터 유효성 검사 실패 시 (`{ "detail": "Invalid input data format." }`)
    -   **500 Internal Server Error:** 서버 내부 오류, AI API 호출 실패 등 (`{ "detail": "Error processing survey results." }` 또는 구체적인 오류 메시지)

## 4. 처리 로직 (Processing Logic)

1.  **입력 데이터 수신 및 유효성 검사:**
    -   Request Body에서 `responses` JSON 객체 추출.
    -   필수 섹션/문항 데이터 존재 여부 등 기본 유효성 검사 수행. (Pydantic 모델 활용)
2.  **규칙 기반 분석 (Rule-based Logic):**
    -   **Red Flag 식별:** 설문 F항목 응답 분석하여 Red Flag 징후 텍스트 목록 생성 (`red_flags`).
    -   **기능 제한 점수 계산:** 설문 D항목 응답 점수 합산 및 변환 로직 적용 (참고: `Calculation.md`). `functional_limit_score` 및 `functional_limit_level` 계산.
    -   **주요 지표 추출:** 통증 기간(B6), 통증 강도(C11, C12 평균 등), 통증 부위(B4, B5) 등 주요 정보 추출.
    -   **사전 정의된 규칙 적용:** 특정 응답 조합에 따른 추가 분석 또는 메시지 생성 (예: 특정 통증 양상 + 방사통 -> 신경학적 문제 가능성 언급).
3.  **AI 분석 (Gemini API 연동):**
    -   **프롬프트 생성:**
        -   시스템 프롬프트: AI의 역할(의료 조언가가 아닌 분석 보조), 분석 목표, 출력 형식(JSON 유사 구조 또는 마크다운), 병원 정보(치료법 목록 등) 제공. **"절대 의료 진단을 내리지 마시오."** 강조.
        -   사용자 프롬프트: 규칙 기반 분석 결과 일부(Red Flag, 기능 제한 점수 등)와 전체 설문 응답(`responses` 객체)을 텍스트 형식으로 변환하여 포함. 분석 요청 사항 명시 (통증 심각도/만성화 평가, 기능 제한 해석, 잠재 원인 추론, 통증 양상 분류, 적합한 병원 치료법 제안, 리포트 요약 및 개인화 코멘트 생성 등).
    -   **Gemini API 호출:** 생성된 프롬프트를 Gemini API에 전송.
    -   **응답 파싱:** Gemini API 응답(텍스트)을 파싱하여 필요한 정보 추출 (`pain_pattern`, `potential_causes`, `recommended_services`, `report_summary_text`, `personalized_comments` 등). `raw_gemini_output` 저장.
4.  **결과 통합:**
    -   규칙 기반 분석 결과와 AI 분석 결과를 종합하여 최종 `analysis_result` JSON 객체 생성.
5.  **데이터베이스 저장:**
    -   원본 `responses` 데이터와 생성된 `analysis_result` 데이터를 Supabase `SurveyResponses` 테이블에 삽입.
    -   `is_test_data`는 `true`로 설정.
    -   삽입된 레코드의 `id` (`response_id`) 확보.
6.  **응답 반환:**
    -   생성된 `analysis_result` 객체와 `response_id`를 포함한 JSON을 프론트엔드에 반환.

## 5. 오류 처리 (Error Handling)

-   **입력 유효성 오류:** 400 에러 반환.
-   **Gemini API 호출 오류:**
    -   타임아웃, API 키 오류, 네트워크 오류 등 발생 시 로깅 후 500 에러 반환.
    -   Fallback 로직 고려 (예: AI 분석 결과 없이 규칙 기반 결과만 반환하거나, 기본 메시지 반환).
-   **데이터베이스 오류:** Supabase 저장 실패 시 로깅 후 500 에러 반환.
-   **기타 내부 오류:** 포괄적인 예외 처리 및 로깅 후 500 에러 반환.

## 6. 기술 고려사항 (Technical Considerations)

-   **프레임워크:** FastAPI (Python)
-   **데이터 유효성 검사:** Pydantic 모델 사용.
-   **AI API 클라이언트:** Google AI Python SDK (`google-generativeai`).
-   **데이터베이스 연동:** `supabase-py` 라이브러리 사용.
-   **비동기 처리:** FastAPI의 `async`/`await`를 적극 활용하여 Gemini API 호출 등 I/O 바운드 작업 처리.
-   **환경 변수 관리:** Gemini API Key, Supabase URL/Key 등 민감 정보는 환경 변수로 관리 (`python-dotenv` 등).
-   **로깅:** 처리 과정 및 오류 로깅 구현.

## 7. 비기능 요구사항 (Non-Functional Requirements)

-   **성능:** API 응답 시간 최소화 (특히 Gemini API 호출 시간 고려). 비동기 처리 필수.
-   **확장성:** 향후 분석 로직 추가/변경 용이하도록 모듈화된 구조 설계.
-   **보안:** API Key 등 민감 정보 보안 관리 철저. 입력 데이터에 대한 기본적인 보안 검토 (과도한 길이 등).
-   **안정성:** 오류 발생 시 시스템 중단 없이 적절한 에러 응답 반환.

## 8. 향후 개선 (Future Enhancements)

-   분석 결과 캐싱 전략 도입 (동일 응답에 대한 반복 분석 방지).
-   Gemini API 외 다른 LLM 또는 특화된 모델 사용 고려.
-   규칙 기반 로직 고도화.
-   A/B 테스트를 통한 프롬프트 최적화.
