# 프로젝트 디렉토리 구조

**버전:** 1.2
**기준 문서:** Documents/PRDs/PRD_Project.md
**최종 업데이트:** 2024-04-30

```
/
├── app/                        # Next.js App Router
│   ├── page.tsx                # 메인 랜딩 페이지
│   └── layout.tsx              # 루트 레이아웃
├── components/                 # React 컴포넌트
│   └── ui/                     # Shadcn UI 컴포넌트
│   └── survey/                 # 설문조사 관련 컴포넌트
│   └── ppt/                    # 프레젠테이션 슬라이드 HTML 파일
│       ├── Slide_1.html        # 슬라이드 1
│       ├── Slide_2.html        # 슬라이드 2
│       ├── ...                 # 중간 슬라이드들
│       └── Slide_11.html       # 슬라이드 11
├── hooks/                      # 커스텀 React Hooks
├── lib/                        # 유틸리티 함수, API 클라이언트 등
│   └── supabase/               # Supabase 클라이언트 및 관련 기능
│       ├── client.ts           # Supabase 클라이언트 초기화
│       ├── survey.ts           # 설문조사 관련 Supabase 함수
│       └── types.ts            # Supabase 관련 타입 정의
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

현재 프로젝트는 Next.js 프레임워크와 Shadcn UI를 기반으로 구성되어 있습니다. PRD에서 제안한 원래 구조와 달리 프론트엔드와 백엔드가 분리되어 있지 않고, Next.js 프로젝트 단독으로 구성되어 있습니다. 설문조사 UI 컴포넌트 개발이 완료되었습니다.

**배포 상태:** Vercel을 통해 프로젝트가 성공적으로 배포되었습니다.
**배포 URL:** https://dessa0410-qraoffbf3-seongjin-ahns-projects.vercel.app

### 프론트엔드 구조

- **app/**: Next.js의 App Router 구조를 따르고 있습니다.
- **components/**: UI 컴포넌트를 포함하며, Shadcn UI 라이브러리가 설치되어 있습니다.
  - **components/survey/**: 설문조사의 각 단계별 컴포넌트가 개발되어 있습니다. 각 컴포넌트는 자체적으로 필수 항목 유효성 검사를 수행하고, 응답 상태(총 문항 수, 응답 문항 수)를 부모 컴포넌트(`app/survey/page.tsx`)에 보고합니다. 유효성 검사 실패 시, 부모 컴포넌트에서 토스트 알림을 표시하도록 수정되었습니다.
- **hooks/**, **lib/**: 커스텀 훅과 유틸리티 함수를 위한 디렉토리가 준비되어 있습니다.
- **styles/**: 전역 스타일 설정을 위한 디렉토리입니다.

### 백엔드 구조

현재는 백엔드가 구현되어 있지 않습니다. Next.js의 API 라우트를 활용하여 Supabase와 연동할 계획입니다.

## Supabase 데이터베이스 구조

### 테이블 구조

1. **survey_responses**: 설문조사 응답 및 분석 결과 저장
   ```
   - id: uuid (PRIMARY KEY)
   - created_at: timestamp with time zone
   - user_id: uuid (FOREIGN KEY, 필요시)
   - responses: jsonb
   - analysis_result: jsonb
   - report_access_key: text
   - is_test_data: boolean
   ```

2. **survey_sections**: 설문조사 섹션 정보
   ```
   - id: uuid (PRIMARY KEY)
   - created_at: timestamp with time zone
   - section_name: text
   - section_order: integer
   - section_description: text
   ```

3. **qna_data**: 챗봇 RAG용 Q&A 데이터
   ```
   - id: uuid (PRIMARY KEY)
   - created_at: timestamp with time zone
   - question: text
   - answer: text
   - category: text
   - embedding: vector
   ```

### responses 필드의 JSON 구조 (예시)

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

### analysis_result 필드의 JSON 구조 (예시)

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

## 향후 개발 방향

1. **백엔드 구현 방식:**
   - Next.js API 라우트를 활용한 Supabase 연동 (`app/api/` 디렉토리 구성)
   - MCP(Model-Controller-Presenter) 패턴 적용:
     - **Model**: Supabase 테이블과 연동하는 데이터 모델
     - **Controller**: API 라우트에서 요청 처리 로직
     - **Presenter**: 클라이언트에 전달할 데이터 형식 변환 로직

2. **API 라우트 구성:**
   ```
   /app/api/
   ├── survey/
   │   ├── route.ts         # 설문조사 제출 및 결과 조회
   │   └── analysis/
   │       └── route.ts     # 설문조사 분석 로직
   └── chat/
       └── route.ts         # 챗봇 대화 처리
   ```

3. **Supabase 연동 구현:**
   ```
   /lib/supabase/
   ├── client.ts            # Supabase 클라이언트 초기화
   ├── survey.ts            # 설문조사 관련 Supabase 함수
   ├── chat.ts              # 챗봇 관련 Supabase 함수
   └── types.ts             # Supabase 관련 타입 정의
   ```

4. **상태 관리 구성:**
   - Zustand 상태 라이브러리 활용

5. **데이터 처리 흐름:**
   - 설문조사 제출 → API 라우트 → 규칙 기반 분석 + AI 분석 → Supabase 저장 → 결과 반환 → 리포트 표시
