# 프론트엔드 PRD: 웹 기반 설문 시스템

**버전:** 1.0
**기준 문서:** Documents/PRDs/PRD_Project.md, Documents/References/Overview.md

## 1. 개요 (Overview)

사용자가 온누리마취통증의학과 예비 환자 자가 점검 시스템의 설문(약 30-35개 문항)에 응답하고 제출하는 웹 인터페이스 개발. 사용자의 응답 데이터는 구조화된 JSON 형태로 백엔드 API(`/submit_survey`)로 전송된다.

## 2. 목표 (Goals)

-   사용자 친화적인 인터페이스를 통해 설문 응답 과정을 원활하게 지원한다.
-   설문 진행 상황을 명확하게 인지시킨다.
-   다양한 형태의 질문(단일 선택, 다중 선택, 숫자 입력 등)을 효과적으로 처리한다.
-   설문 시작 전, 서비스의 비진단적 목적을 명확히 고지한다.
-   수집된 데이터를 정확하게 구조화하여 백엔드로 전송한다.

## 3. 사용자 인터페이스 (UI) 및 경험 (UX)

-   **페이지 구성:**
    -   **시작 안내 페이지/팝업:** 설문의 목적, 예상 소요 시간, **의료 진단이 아님**을 명확히 고지. "시작하기" 버튼 포함.
    -   **설문 진행 페이지:**
        -   한 번에 너무 많은 문항을 표시하지 않고, 논리적 단위(예: 섹션별 또는 몇 개 문항씩)로 나누어 단계별 진행. (예: 섹션 A, B, C, D, E, F)
        -   상단 또는 측면에 전체 진행률 표시 바 (Progress Bar) 표시.
        -   현재 진행 중인 섹션 또는 질문 번호 표시.
        -   각 질문과 선택지/입력 필드 명확히 구분.
        -   질문 유형에 맞는 컴포넌트 사용 (Radio buttons, Checkboxes, Number input, Text input 등).
        -   '이전', '다음' 버튼으로 단계 간 이동 가능. (첫 단계에서는 '이전' 비활성화, 마지막 단계에서는 '다음' 대신 '결과 분석 요청' 버튼)
        -   필수 문항 표시 (예: 별표 *).
    -   **결과 분석 요청 페이지 (마지막 단계):** 모든 필수 문항 응답 완료 시 '결과 분석 요청' 버튼 활성화. 버튼 클릭 시 백엔드로 데이터 전송 및 로딩 상태 표시 후 리포트 페이지로 이동.
-   **컴포넌트 상세:**
    -   **진행률 표시 바:** 현재 진행 단계를 시각적으로 표시 (예: `value/max`).
    -   **질문 카드:** 질문 텍스트, 부연 설명(필요시), 응답 컴포넌트 포함.
    -   **응답 컴포넌트:**
        -   단일 선택: Radio button 그룹.
        -   다중 선택: Checkbox 그룹.
        -   숫자 입력: Number input (min/max 설정 가능).
        -   텍스트 입력: Text input / Textarea.
        -   통증 부위 선택: 인체 그림 기반 인터페이스 (`react-body-highlighter` 또는 SVG 활용). 사용자가 클릭/터치하여 부위 선택.
    -   **네비게이션 버튼:** '이전', '다음', '결과 분석 요청'. 비활성화 상태 명확히 표시.
-   **디자인:** `PRD_Project.md`의 UI/UX 고려사항 참조 (신뢰감, 전문성, 차분함). 반응형 디자인 필수.

## 4. 기능 요구사항 (Functional Requirements)

-   **FR-SURVEY-001:** 설문 시작 시 안내 팝업/페이지 표시 (비진단적 목적 고지).
-   **FR-SURVEY-002:** 단계별 설문 진행 기능 (섹션 또는 문항 그룹 단위).
-   **FR-SURVEY-003:** 전체 설문 진행률 표시 기능.
-   **FR-SURVEY-004:** 다양한 응답 유형 지원 (단일/다중 선택, 숫자, 텍스트, 신체 부위 선택).
-   **FR-SURVEY-005:** 필수 응답 항목 검증 기능 (미응답 시 다음 단계 진행 불가 또는 경고 표시).
-   **FR-SURVEY-006:** '이전'/'다음' 버튼을 통한 단계 이동 기능.
-   **FR-SURVEY-007:** 모든 필수 항목 응답 완료 시 '결과 분석 요청' 버튼 활성화.
-   **FR-SURVEY-008:** '결과 분석 요청' 버튼 클릭 시 사용자 응답 데이터를 JSON 형태로 구조화.
-   **FR-SURVEY-009:** 구조화된 설문 응답 JSON 데이터를 백엔드 API (`POST /submit_survey`)로 전송.
-   **FR-SURVEY-010:** 데이터 전송 중 로딩 상태 표시.
-   **FR-SURVEY-011:** API 호출 성공 시 응답으로 받은 `response_id` 및 `analysis_result`를 상태에 저장하고 리포트 페이지로 리디렉션.
-   **FR-SURVEY-012:** API 호출 실패 시 사용자에게 오류 메시지 표시.
-   **FR-SURVEY-013:** 반응형 디자인 적용 (데스크탑, 모바일).

## 5. 데이터 흐름 (Data Flow)

1.  사용자가 설문 시작.
2.  단계별로 응답 입력. 응답 값은 프론트엔드 상태(State)에 저장 (예: Zustand, Jotai 사용).
3.  마지막 단계에서 '결과 분석 요청' 클릭.
4.  프론트엔드 상태에 저장된 모든 응답 값을 취합하여 지정된 JSON 구조로 변환.
    ```json
    // 예시 구조
    {
      "responses": {
        "sectionA": { "A1": "...", "A2": "..." },
        "sectionB": { "B1": ["...", "..."], "B4": ["목", "어깨"], ... },
        // ... 나머지 섹션 응답
      }
    }
    ```
5.  백엔드 API (`POST /submit_survey`)에 해당 JSON을 Request Body로 전송.
6.  백엔드 응답 (성공 시 `{ "analysis_result": {...}, "response_id": "..." }`, 실패 시 `{ "detail": "..." }`) 수신.
7.  성공 시: `analysis_result`와 `response_id`를 상태에 저장 후, 리포트 페이지로 이동 (결과 데이터 전달).
8.  실패 시: 오류 메시지 표시.

## 6. 기술 고려사항 (Technical Considerations)

-   **프레임워크:** Next.js (React)
-   **상태 관리:** Zustand 또는 Jotai (설문 진행 상태, 응답 데이터 관리).
-   **UI 라이브러리:** Shadcn/ui, Tailwind CSS 등 활용 고려.
-   **HTTP 클라이언트:** `fetch` API 또는 `axios`.
-   **통증 부위 선택:** `react-body-highlighter` 라이브러리 또는 커스텀 SVG 구현.
-   **유효성 검사:** 각 단계 전환 시 또는 제출 시 입력 값 유효성 검사 로직 구현.

## 7. 비기능 요구사항 (Non-Functional Requirements)

-   **성능:** 페이지 로딩 및 단계 전환이 빨라야 함.
-   **사용성:** 직관적이고 쉽게 사용할 수 있어야 함.
-   **보안:** 민감 정보(API Key 등) 클라이언트 측 노출 금지.
-   **호환성:** 주요 최신 웹 브라우저(Chrome, Firefox, Safari, Edge) 호환.

## 8. 향후 개선 (Future Enhancements)

-   설문 중간 저장 기능.
-   A/B 테스트를 통한 UI/UX 개선.

## 9. 데이터베이스 구조 (Supabase)

### 주요 테이블 구조

#### 1. survey_responses
설문 응답 데이터와 분석 결과를 저장하는 테이블입니다.

```sql
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID, -- 향후 사용자 인증 기능 추가시 활용
  responses JSONB NOT NULL, -- 설문 응답 데이터
  analysis_result JSONB, -- 분석 결과
  report_access_key TEXT UNIQUE, -- 결과 페이지 접근용 고유 키
  is_test_data BOOLEAN DEFAULT FALSE,
  session_id TEXT -- 브라우저 세션 ID
);

-- 인덱스 생성
CREATE INDEX idx_survey_responses_report_access_key ON survey_responses(report_access_key);
CREATE INDEX idx_survey_responses_created_at ON survey_responses(created_at);
```

#### 2. survey_sections
설문 섹션 정보를 관리하는 테이블입니다. 설문 섹션 구조를 데이터베이스에서 관리할 경우에 사용합니다.

```sql
CREATE TABLE survey_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  section_key TEXT UNIQUE NOT NULL, -- 시스템 내부 식별자 (예: 'basic_info')
  section_name TEXT NOT NULL, -- 화면 표시용 이름 (예: '기본 정보')
  section_order INTEGER NOT NULL, -- 섹션 순서
  section_description TEXT, -- 섹션 설명
  is_active BOOLEAN DEFAULT TRUE -- 섹션 활성화 여부
);
```

#### 3. survey_questions
개별 설문 문항 정보를 관리하는 테이블입니다. 설문 문항 자체를 데이터베이스에서 관리할 경우에 사용합니다.

```sql
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  section_id UUID REFERENCES survey_sections(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL, -- 시스템 내부 식별자 (예: 'age')
  question_text TEXT NOT NULL, -- 질문 텍스트
  question_type TEXT NOT NULL, -- 질문 유형 (radio, checkbox, number, text, body-part 등)
  question_order INTEGER NOT NULL, -- 질문 순서
  is_required BOOLEAN DEFAULT TRUE, -- 필수 응답 여부
  options JSONB, -- 선택지 정보 (단일/다중 선택 문항용)
  config JSONB, -- 추가 설정 (min/max 등)
  is_active BOOLEAN DEFAULT TRUE -- 문항 활성화 여부
);

-- 인덱스 생성
CREATE INDEX idx_survey_questions_section_id ON survey_questions(section_id);
```

### responses 필드 JSON 구조

Survey.md 문서에 정의된 설문 문항을 기준으로 설계된 JSON 구조입니다.

```json
{
  "basic_info": {
    "age": "30대",
    "gender": "남성",
    "occupation": "사무직/학생"
  },
  "pain_location": {
    "primary_location": "허리",
    "secondary_locations": ["목", "어깨"]
  },
  "pain_characteristics": {
    "duration": "1개월~3개월",
    "symptoms": ["욱신거림 / 쑤심", "뻐근함 / 결림 / 뻣뻣함"],
    "radiation": "예",
    "touch_sensitivity": "아니오",
    "sensory_changes": "예"
  },
  "pain_intensity": {
    "worst_pain": 7,
    "average_pain": 4,
    "aggravating_factors": ["오래 앉아있기", "물건 들기"],
    "relieving_factors": ["휴식", "스트레칭"]
  },
  "functional_limitations": {
    "personal_hygiene": 2,
    "dressing": 1,
    "lifting": 3,
    "walking": 2,
    "sitting": 3,
    "standing": 3,
    "sleeping": 3,
    "concentration": 2,
    "work_study": 3,
    "transportation": 2,
    "leisure": 3,
    "emotional": 2
  },
  "lifestyle_history": {
    "regular_exercise": "아니오",
    "exercise_type": "", // 운동을 한다면 어떤 종류인지
    "sitting_hours": "8-12시간",
    "posture_perception": "좋지 않다",
    "stress_level": "그렇다"
  },
  "treatment_history": {
    "previous_treatment": "예",
    "treatment_details": "물리치료 받았으나 효과 제한적",
    "medical_conditions": "없음"
  },
  "red_flags": {
    "flags": ["해당 사항 없음"]
  },
  "hospital_intention": {
    "consultation_need": "그렇다",
    "treatment_interest": ["운동 치료(슈로스 등)", "도수 치료"]
  }
}
```

### analysis_result 필드 JSON 구조

Calculation.md 문서에 기반한 분석 결과의 JSON 구조입니다.

```json
{
  "summary": {
    "severity_level": "중등도",
    "chronicity": "아급성",
    "functional_score": 27,
    "functional_impact": "중등도~심한 기능 제한",
    "red_flags": false
  },
  "pain_analysis": {
    "primary_location": "허리",
    "duration": "1개월~3개월",
    "intensity": {
      "worst": 7,
      "average": 4,
      "description": "중등도에서 심한 통증"
    },
    "pattern": {
      "main_symptoms": ["욱신거림/쑤심", "뻐근함/결림"],
      "neuropathic_features": true,
      "radiation": true
    }
  },
  "functional_impact": {
    "most_affected": ["물건 들기", "앉아 있기", "서 있기", "수면"],
    "least_affected": ["옷 입기", "개인 위생"],
    "overall_score": 27,
    "category": "중등도~심한 기능 제한"
  },
  "potential_causes": {
    "posture_related": true,
    "activity_related": true,
    "possible_factors": [
      "장시간 앉은 자세", 
      "좋지 않은 자세 습관",
      "높은 스트레스 수준",
      "물건 들 때 부적절한 자세"
    ]
  },
  "recommendations": {
    "treatment_options": [
      {
        "name": "슈로스 운동 치료",
        "description": "자세 교정과 근력 강화에 효과적인 운동 기법",
        "priority": "높음"
      },
      {
        "name": "도수 치료",
        "description": "관절과 근육의 움직임 회복을 위한 전문가의 손 기술",
        "priority": "높음"
      }
    ],
    "lifestyle_changes": [
      "앉아있는 시간 줄이기와 규칙적인 휴식",
      "올바른 자세 유지하기",
      "스트레스 관리 기법 적용"
    ],
    "consultation_urgency": "일반적"
  },
  "ai_insights": {
    "additional_observations": "통증이 다리로 방사되는 증상과 감각 이상은 신경 압박 가능성을 시사합니다.",
    "personalized_advice": "사무직 특성상 장시간 앉아있는 동안 허리의 중립 자세를 유지하는 것이 중요합니다. 1시간마다 가벼운 스트레칭을 권장합니다."
  }
}
```

### RLS(Row Level Security) 설정

데이터 보안을 위한 RLS 정책입니다.

```sql
-- survey_responses 테이블에 RLS 활성화
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 익명 사용자도 응답을 생성할 수 있도록 정책 설정
CREATE POLICY "누구나 응답 생성 가능" ON survey_responses FOR INSERT WITH CHECK (true);

-- 자신의 응답만 읽고 수정할 수 있는 정책 (report_access_key 기반)
CREATE POLICY "report_access_key로 응답 조회" ON survey_responses 
  FOR SELECT USING (auth.uid() IS NOT NULL OR report_access_key = current_setting('request.headers')::json->'x-report-access-key');

-- survey_sections 및 survey_questions 테이블에 RLS 활성화
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

-- 누구나 섹션 및 질문 정보를 읽을 수 있음
CREATE POLICY "누구나 섹션 정보 조회 가능" ON survey_sections FOR SELECT USING (true);
CREATE POLICY "누구나 질문 정보 조회 가능" ON survey_questions FOR SELECT USING (true);

-- 관리자만 섹션 및 질문 정보를 수정할 수 있음
CREATE POLICY "관리자만 섹션 정보 수정 가능" ON survey_sections 
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
CREATE POLICY "관리자만 질문 정보 수정 가능" ON survey_questions 
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
```

### 데이터베이스 연동 구현 가이드

프론트엔드에서 Supabase 데이터베이스를 연동하는 방법입니다.

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// lib/supabase/survey.ts
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

export async function submitSurveyResponse(responses: any) {
  // 고유 접근 키 생성
  const reportAccessKey = uuidv4();
  
  const { data, error } = await supabase
    .from('survey_responses')
    .insert({
      responses,
      report_access_key: reportAccessKey,
      session_id: getSessionId() // 세션 ID 생성 함수 구현 필요
    })
    .select('id');
    
  if (error) {
    throw new Error(`Survey submission error: ${error.message}`);
  }
  
  return {
    response_id: data[0].id,
    report_access_key: reportAccessKey
  };
}

export async function getSurveyResponseById(responseId: string, accessKey: string) {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('id', responseId)
    .eq('report_access_key', accessKey)
    .single();
    
  if (error) {
    throw new Error(`Failed to fetch survey response: ${error.message}`);
  }
  
  return data;
}

// 세션 ID 생성 함수 (예시)
function getSessionId() {
  // 클라이언트 측에서 세션 ID가 없으면 생성하고 저장
  let sessionId = localStorage.getItem('survey_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('survey_session_id', sessionId);
  }
  return sessionId;
}
```