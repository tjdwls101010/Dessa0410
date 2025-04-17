"use client"

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, AlertTriangle, MessageSquare, Printer, ArrowLeft, Info, FileText } from "lucide-react";
import Link from "next/link";
import ChatbotDialog from "@/components/chatbot/chatbot-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card 컴포넌트 추가
import SurveyModal from "@/components/survey/survey-modal"; // SurveyModal 컴포넌트 추가

// API 응답 타입 정의 (필요에 따라 더 상세하게 정의 가능)
interface SurveyData {
  id: string;
  created_at: string;
  // ... surveys 테이블의 모든 컬럼들
  a1_age?: string;
  a2_gender?: string;
  a3_job?: string;
  b4_main_pain_area?: string;
  b5_other_pain_areas?: string[];
  b6_pain_onset?: string;
  b7_pain_pattern?: string[];
  c11_max_pain_vas?: number;
  c12_avg_pain_vas?: number;
  c13_aggravating_factors?: string[];
  c14_relieving_factors?: string[];
  d15_personal_hygiene?: number;
  d16_dressing?: number;
  d17_lifting?: number;
  d18_walking?: number;
  d19_sitting?: number;
  d20_standing?: number;
  d21_sleep?: number;
  d22_concentration?: number;
  d23_work_study?: number;
  d24_driving_transport?: number;
  d25_leisure?: number;
  d26_mood?: number;
  e27_exercise?: boolean;
  e28_sitting_hours?: string;
  e29_posture_awareness?: string;
  e30_recent_stress?: string;
  f33_red_flags?: string[];
  // ... 기타 필요한 컬럼들
}

interface AiAnalysis {
  painSeverity?: string;
  potentialCauses?: string[];
  functionalImpact?: string;
  chronicityRisk?: string;
  redFlagSummary?: string;
  lifestyleRecommendations?: string[];
  suggestedTreatments?: { treatment: string; justification: string }[]; // API 응답에 맞춰 추가 (이전 단계에서 추가됨)
  nextStepGeneral?: string[]; // API 응답에 맞춰 추가 (이전 단계에서 추가됨)
  error?: string; // AI 분석 실패 시 에러 메시지
  rawResponse?: string; // AI 분석 실패 시 원본 응답
}

interface ReportApiResponse {
  surveyData: SurveyData;
  aiAnalysis: AiAnalysis;
}

// 온누리마취통증의학과 치료법 정보 (여기 또는 별도 파일로 관리)
const treatmentInfo = {
  prolotherapy: {
    name: "프롤로테라피 (인대강화주사)",
    description: "고농도 포도당 주사로 인대/힘줄 재생 촉진. 만성 통증, 관절염, 인대 손상에 적용.",
    keywords: ["만성", "인대", "힘줄", "관절염", "재생", "어깨", "무릎", "팔꿈치", "발목"],
  },
  manualTherapy: {
    name: "도수치료 (카이로프랙틱, 롤핑)",
    description: "손으로 척추/관절 정렬 교정 및 근막 이완. 목/허리 통증, 자세 불균형, 가동성 제한에 적용.",
    keywords: ["척추", "관절", "정렬", "자세", "근막", "가동성", "목", "허리", "골반"],
  },
  schroth: {
    name: "슈로스 운동",
    description: "3차원 척추 교정 운동. 특발성 척추측만증(주로 청소년)에 특화.",
    keywords: ["척추측만증", "청소년", "교정운동", "호흡"],
  },
  sling: {
    name: "슬링 운동",
    description: "불안정한 줄 이용. 코어 근육 강화, 기능적 움직임 개선, 재활에 효과적.",
    keywords: ["코어", "근력", "재활", "기능개선", "허리통증"],
  },
  hilt: {
    name: "HILT (고강도 레이저)",
    description: "심부 조직 레이저 치료. 염증 감소, 통증 완화, 조직 재생 촉진. 급/만성 통증, 관절염, 힘줄염에 적용.",
    keywords: ["레이저", "염증", "통증완화", "조직재생", "관절염", "힘줄염", "급성"],
  },
  eswt: {
    name: "ESWT (체외충격파)",
    description: "충격파로 석회화 분해 및 혈류/재생 촉진. 만성 힘줄 문제, 석회화 건염, 족저근막염에 효과적.",
    keywords: ["충격파", "석회", "힘줄", "건염", "족저근막염", "오십견", "테니스엘보"],
  },
};

// 구체적인 치료 추천 생성 로직 (개선 필요)
function generateDetailedTreatmentSuggestions(
  surveyData: SurveyData | null,
  aiAnalysis: AiAnalysis | null
): { treatment: string; justification: string }[] {
  const suggestions: { treatment: string; justification: string }[] = [];
  if (!surveyData || !aiAnalysis) return suggestions;

  const {
    b4_main_pain_area,
    b6_pain_onset,
    b7_pain_pattern,
    c12_avg_pain_vas,
    d19_sitting, // 예시: 앉아있기 어려움
    e27_exercise, // 예시: 운동 여부
    e29_posture_awareness, // 예시: 자세 인지
  } = surveyData;
  const { potentialCauses, chronicityRisk, redFlagSummary } = aiAnalysis; // redFlagSummary 추가

  // --- 데이터 분석 및 조건 설정 ---
  const painArea = b4_main_pain_area || "";
  const isChronic = b6_pain_onset?.includes('개월') || b6_pain_onset?.includes('년') || chronicityRisk === '높음';
  const hasPostureIssue = e29_posture_awareness === '나쁨' || potentialCauses?.some(cause => cause.includes('자세'));
  const needsCoreStrength = potentialCauses?.some(cause => cause.includes('근력 부족') || cause.includes('코어'));
  const hasInflammationSigns = b7_pain_pattern?.some(p => p.includes('burning') || p.includes('throbbing')); // 염증 관련 패턴 체크
  const highPainIntensity = c12_avg_pain_vas && c12_avg_pain_vas >= 6;
  const isAdolescent = surveyData.a1_age?.includes('10대'); // 슈로스 대상 확인용 (임시) - surveyData에서 접근하도록 수정
  const hasRedFlags = surveyData.f33_red_flags && surveyData.f33_red_flags.length > 0;

  // --- 추천 로직 ---

  // 1. 프롤로테라피 추천 (만성 + 특정 부위 인대/힘줄 문제)
  if (isChronic && treatmentInfo.prolotherapy.keywords.some(k => painArea.includes(k))) {
     suggestions.push({
       treatment: treatmentInfo.prolotherapy.name,
       justification: `만성적인 ${painArea} 통증은 인대/힘줄 약화와 관련될 수 있습니다. ${treatmentInfo.prolotherapy.name}는 조직 재생을 유도하여 근본적인 회복을 도울 수 있습니다.`
     });
  }

  // 2. 도수치료 추천 (자세 문제 또는 척추/관절 관련 통증) - Red Flag 없을 때
  if (!hasRedFlags && hasPostureIssue && treatmentInfo.manualTherapy.keywords.some(k => painArea.includes(k) || k === '자세')) {
     // 카이로/롤핑 구분은 어려우므로 통합 추천
     suggestions.push({
       treatment: treatmentInfo.manualTherapy.name,
       justification: `${painArea} 통증과 함께 자세 불균형이 관찰됩니다. ${treatmentInfo.manualTherapy.name}를 통해 척추/관절 정렬을 바로잡고 근막 긴장을 완화하는 것이 도움될 수 있습니다.`
     });
  }

  // 3. 슬링 운동 추천 (코어 약화 또는 허리 통증 + 운동 부족)
  if (needsCoreStrength || (painArea.includes('허리') && !e27_exercise)) {
     suggestions.push({
       treatment: treatmentInfo.sling.name,
       justification: `코어 근력 약화는 ${painArea || '만성'} 통증의 주요 원인 중 하나입니다. ${treatmentInfo.sling.name} 운동으로 심부 근육을 강화하고 척추 안정성을 높이는 것이 중요합니다.`
     });
   }

  // 4. HILT 추천 (높은 통증 강도 + 염증 징후 또는 특정 부위)
  if (highPainIntensity && (hasInflammationSigns || treatmentInfo.hilt.keywords.some(k => painArea.includes(k)))) {
      suggestions.push({
        treatment: treatmentInfo.hilt.name,
        justification: `통증 강도가 높고 염증 소견이 의심되는 ${painArea} 부위에 ${treatmentInfo.hilt.name} 치료는 심부 조직까지 에너지를 전달하여 빠른 통증 감소 및 염증 완화 효과를 기대할 수 있습니다.`
      });
   }

  // 5. ESWT 추천 (만성 힘줄 문제 또는 특정 부위 통증)
  if (isChronic && treatmentInfo.eswt.keywords.some(k => painArea.includes(k) || potentialCauses?.some(cause => cause.includes(k)))) {
     suggestions.push({
       treatment: treatmentInfo.eswt.name,
       justification: `만성적인 ${painArea} 통증, 특히 힘줄 문제(건염 등)나 석회화가 의심될 경우 ${treatmentInfo.eswt.name} 치료가 효과적일 수 있습니다. 충격파가 조직 재생과 혈류 개선을 촉진합니다.`
     });
  }

  // 6. 슈로스 운동 추천 (청소년 + 척추측만증 의심 - AI 분석 결과 활용 시도)
  // 주의: 설문에 척추측만증 항목이 없으므로, AI가 'potentialCauses' 등에서 언급할 경우에만 추천 (정확도 한계 있음)
  if (isAdolescent && potentialCauses?.some(cause => cause.includes('척추측만증'))) {
     suggestions.push({
       treatment: treatmentInfo.schroth.name,
       justification: `청소년기의 척추측만증이 의심되는 경우, 3차원 교정 운동인 ${treatmentInfo.schroth.name}이 척추 만곡 진행을 막고 자세 개선에 도움이 될 수 있습니다. 정확한 진단이 우선 필요합니다.`
     });
   }

  // --- 추천 필터링 및 정리 ---
  // 1. 중복 제거 (같은 이름의 치료법이 여러 조건에 해당될 수 있으므로)
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
    index === self.findIndex((s) => s.treatment === suggestion.treatment)
  );

  // 2. 추천 개수가 3개 미만일 경우, 일반적인 치료법 추가 (중복 제외) - 항상 3개를 채우도록 보장
  const fallbackTreatments = [
    // 우선순위를 고려하여 배열 순서 조정 가능
    { treatment: treatmentInfo.manualTherapy.name, justification: "통증 완화 및 기능 개선을 위해 고려해볼 수 있는 일반적인 치료법입니다. 정확한 적용은 진단 후 결정됩니다." },
    { treatment: treatmentInfo.sling.name, justification: "코어 근력 강화 및 자세 개선은 많은 통증 관리에 도움이 될 수 있습니다." },
    { treatment: treatmentInfo.hilt.name, justification: "염증 및 통증 감소에 효과적인 비수술적 치료 옵션 중 하나입니다." },
    { treatment: treatmentInfo.prolotherapy.name, justification: "만성적인 인대/힘줄 문제 해결에 도움이 될 수 있는 재생 치료 옵션입니다." },
    { treatment: treatmentInfo.eswt.name, justification: "만성 힘줄 문제나 석회화 관련 통증에 적용될 수 있는 치료법입니다." },
  ];

  let finalSuggestions = [...uniqueSuggestions];
  const existingTreatmentNames = new Set(finalSuggestions.map(s => s.treatment)); // Set으로 변경하여 효율적인 중복 체크

  // 추천 개수가 3개 미만이 될 때까지 fallback 추가
  for (const fallback of fallbackTreatments) {
    if (finalSuggestions.length >= 3) break; // 3개 채워지면 중단
    if (!existingTreatmentNames.has(fallback.treatment)) { // Set.has() 사용
      finalSuggestions.push(fallback);
      existingTreatmentNames.add(fallback.treatment); // Set에 추가
    }
  }

  // 최종적으로 최대 3개 반환 (이미 위 로직에서 3개로 맞춰짐)
  return finalSuggestions;
}


// Update the params prop type to reflect it's a Promise
export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const [reportData, setReportData] = useState<ReportApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false); // 설문지 모달 상태 추가

  // Unwrap the params promise using React.use() and explicitly type the result
  const resolvedParams = use(params) as { id: string };

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null); // 이전 에러 초기화
      try {
        const response = await fetch(`/api/report/${resolvedParams.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: ReportApiResponse = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError((error as Error).message || "리포트 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchReportData();
    } else {
      setError("잘못된 접근입니다. 설문 ID가 필요합니다.");
      setLoading(false);
    }
  }, [resolvedParams.id]); // Use the resolved id in the dependency array

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">리포트를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4 text-red-700">오류 발생</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button asChild variant="outline">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    // 로딩이 끝났지만 데이터가 없는 경우 (이론상 발생하기 어려움, fetchReportData에서 처리됨)
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">리포트 정보 없음</h2>
          <p className="mb-6 text-gray-600">리포트 데이터를 찾을 수 없습니다.</p>
          <Button asChild variant="outline">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  // surveyData와 aiAnalysis 추출
  const { surveyData, aiAnalysis } = reportData;

  // 상세 치료 추천 생성
  const detailedSuggestions = generateDetailedTreatmentSuggestions(surveyData, aiAnalysis);

  // 위험 신호 관련 변수를 컴포넌트 스코프에서 정의
  const hasRedFlags = surveyData?.f33_red_flags && surveyData.f33_red_flags.length > 0;
  const redFlagSummary = aiAnalysis?.redFlagSummary; // AI 분석 결과에서 가져옴

  // --- Helper Functions ---

  // 통증 강도 (0-10)에 따른 색상 클래스 반환 함수
  const getPainColorClass = (intensity: number | undefined | null) => {
    if (intensity === null || intensity === undefined) return "bg-gray-300"; // 데이터 없을 경우 회색
    if (intensity <= 3) return "bg-green-500";
    if (intensity <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // 적합성에 따른 배지 스타일 반환 함수 (임시 - AI 분석 결과에 따라 변경 필요)
  const getSuitabilityBadge = (suitability: string | undefined) => {
    // TODO: AI 분석 결과나 다른 로직으로 대체 필요
    switch (suitability) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 border-green-300">높은 적합성</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">중간 적합성</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">낮은 적합성</Badge>;
      default:
        return null;
    }
  };

  // 기능 제한 정도 (1-5)에 따른 너비 및 색상 반환 함수
  const getLimitationStyle = (limitation: number | undefined | null) => {
    if (limitation === null || limitation === undefined) return { width: "0%", color: "bg-gray-200", text: "응답 없음" };
    switch (limitation) {
      case 1: // 어려움 없음 (Calculation.md 기준 0점이지만, 설문은 1부터 시작 가정)
        return { width: "0%", color: "bg-gray-200", text: "어려움 없음" };
      case 2: // 약간 어려움
        return { width: "25%", color: "bg-green-500", text: "약간 어려움" };
      case 3: // 상당히 어려움
        return { width: "50%", color: "bg-yellow-500", text: "상당히 어려움" };
      case 4: // 매우 심한 어려움
        return { width: "75%", color: "bg-orange-500", text: "매우 심한 어려움" };
      case 5: // 도움 없이는 불가능
        return { width: "100%", color: "bg-red-500", text: "거의 불가능" };
      default:
        return { width: "0%", color: "bg-gray-200", text: "알 수 없음" };
    }
  };

  // 통증 양상 (b7_pain_pattern) 한글 변환 함수
  const getPainPatternText = (pattern: string) => {
    // Calculation.md 또는 Survey.md 참고하여 매핑 필요
    const mapping: Record<string, string> = {
      "dull_ache": "둔하고 쑤시는 통증",
      "sharp_stabbing": "날카롭고 찌르는 통증",
      "throbbing_pulsating": "욱신거리고 박동치는 통증",
      "burning_sensation": "화끈거리는 느낌",
      "tingling_pins_needles": "저리거나 따끔거림",
      "numbness": "감각 없음/둔함",
      "stiffness_tightness": "뻣뻣함/경직",
      "electric_shock": "전기 충격 같은 느낌",
      // ... 기타 설문 옵션들
      "other": "기타",
    };
    return mapping[pattern] || pattern;
  };

  // 통증 악화/완화 요인 (c13, c14) 한글 변환 함수
  const getPainFactorText = (factor: string) => {
    // Calculation.md 또는 Survey.md 참고하여 매핑 필요
    const mapping: Record<string, string> = {
      "rest": "휴식",
      "movement": "움직임",
      "specific_posture": "특정 자세",
      "sitting": "앉아있기",
      "standing": "서있기",
      "walking": "걷기",
      "bending": "구부리기",
      "lifting": "물건 들기",
      "medication": "약물 복용",
      "heat_cold_therapy": "온찜질/냉찜질",
      "stretching_exercise": "스트레칭/운동",
      "stress": "스트레스",
      "weather_change": "날씨 변화",
      // ... 기타 설문 옵션들
      "other": "기타",
    };
    return mapping[factor] || factor;
  };

  // 성별 변환
  const getGenderText = (gender: string | undefined) => {
    if (!gender) return "정보 없음";
    
    // 소문자로 변환하여 비교
    const normalizedGender = gender.toLowerCase().trim();
    
    if (normalizedGender === "male" || normalizedGender === "m" || normalizedGender === "남성" || normalizedGender === "남자") {
      return "남성";
    } else if (normalizedGender === "female" || normalizedGender === "f" || normalizedGender === "여성" || normalizedGender === "여자") {
      return "여성";
    } else {
      return "기타";
    }
  };

  // 직업/활동 변환
  const getActivityLevelText = (activity: string | undefined) => {
    // 설문 옵션에 맞춰 수정 필요
    if (!activity) return "정보 없음";
    const mapping: Record<string, string> = {
      "sedentary": "주로 앉아서 생활",
      "light_activity": "가벼운 활동 위주",
      "moderate_activity": "중등도 활동",
      "heavy_activity": "육체 노동/격렬한 활동",
      "student": "학생",
      "housewife": "주부",
      "office_worker": "사무직",
      // ... 기타 설문 옵션들
      "other": "기타",
    };
    return mapping[activity] || activity;
  };

  // 통증 시작 시기 변환
  const getPainOnsetText = (onset: string | undefined) => {
    if (!onset) return "정보 없음";
    const mapping: Record<string, string> = {
      "less_than_1w": "1주일 미만",
      "1w_to_1m": "1주 ~ 1개월",
      "1m_to_3m": "1개월 ~ 3개월",
      "3m_to_6m": "3개월 ~ 6개월",
      "6m_to_1y": "6개월 ~ 1년",
      "more_than_1y": "1년 이상",
      // ... 기타 설문 옵션들
    };
    return mapping[onset] || onset;
  };

  // --- JSX Rendering ---
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* 상단 고정 헤더 */}
      <div className="bg-primary text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">온누리마취통증의학과</h1>
              <p className="text-sm opacity-90">통증 자가 점검 분석 리포트</p>
            </div>
            <div className="text-sm">생성일: {reportData && new Date(reportData.surveyData.created_at).toLocaleDateString("ko-KR")}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* 상단 버튼 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setSurveyModalOpen(true)}>
              <FileText className="h-4 w-4" />
              설문지
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              인쇄
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              PDF 저장
            </Button>
            <Button className="gap-2" onClick={() => setChatbotOpen(true)}>
              <MessageSquare className="h-4 w-4" />
              챗봇 문의하기
            </Button>
          </div>
        </div>

        {/* 리포트 제목 */}
        <h1 className="text-3xl font-bold text-center mb-8">통증 자가 점검 분석 리포트</h1>

        {/* 주의사항 알림 */}
        <Alert className="mb-8 border-yellow-300 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">주의사항</AlertTitle>
          <AlertDescription className="text-yellow-700">
            본 리포트는 의학적 진단을 대체하지 않습니다. 정확한 진단과 치료를 위해서는 반드시 전문의 상담이 필요합니다.
          </AlertDescription>
        </Alert>

        {/* 요약 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            분석 요약 (AI 기반)
          </h2>

          {/* AI 분석 결과 표시 */}
          {aiAnalysis && !aiAnalysis.error ? (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md space-y-3">
              <h3 className="font-semibold text-blue-800 mb-2">AI 분석 결과</h3>
              <p><strong>통증 심각도:</strong> {aiAnalysis.painSeverity || "분석 중..."}</p>
              <p><strong>잠재적 원인:</strong> {aiAnalysis.potentialCauses?.join(", ") || "분석 중..."}</p>
              <p><strong>기능적 영향:</strong> {aiAnalysis.functionalImpact || "분석 중..."}</p>
              <p><strong>만성화 위험:</strong> {aiAnalysis.chronicityRisk || "분석 중..."}</p>
              {aiAnalysis.redFlagSummary && (
                <p className="text-red-600 font-semibold"><strong>위험 신호:</strong> {aiAnalysis.redFlagSummary}</p>
              )}
              <div>
                <strong>생활 습관 권장:</strong>
                <ul className="list-disc list-inside ml-4">
                  {aiAnalysis.lifestyleRecommendations?.map((rec, i) => <li key={i}>{rec}</li>) ?? <li>분석 중...</li>}
                </ul>
              </div>
              <div>
                <strong>다음 단계 권장:</strong>
                <ul className="list-disc list-inside ml-4">
                  {/* 타입 오류 해결 및 fallback 메시지 개선 */}
                  {aiAnalysis.nextStepGeneral && aiAnalysis.nextStepGeneral.length > 0
                    ? aiAnalysis.nextStepGeneral.map((rec: string, i: number) => <li key={i}>{rec}</li>) // 타입 명시
                    : <li>다음 단계 권장 사항을 생성하지 못했습니다.</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="font-semibold text-yellow-800 mb-2">AI 분석 정보</h3>
              <p className="text-yellow-700">
                {aiAnalysis?.error ? `AI 분석 중 오류 발생: ${aiAnalysis.error}` : "AI 분석 결과를 불러오는 중입니다..."}
                {aiAnalysis?.rawResponse && <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{aiAnalysis.rawResponse}</pre>}
              </p>
            </div>
          )}

          {/* 환자 정보 및 통증 요약 (기존 데이터 활용) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold mb-2">환자 정보 (설문 기반)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">연령대</p>
                  <p className="font-medium">{surveyData.a1_age || "정보 없음"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">성별</p>
                  <p className="font-medium">{getGenderText(surveyData.a2_gender)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">직업/활동</p>
                  <p className="font-medium">{getActivityLevelText(surveyData.a3_job)}</p>
                </div>
                {/* 필요시 다른 기본 정보 추가 */}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">통증 요약 (설문 기반)</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">주요 통증 부위:</span>
                  <span className="font-medium">{surveyData.b4_main_pain_area || "정보 없음"}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">통증 지속 기간:</span>
                  <span className="font-medium">{getPainOnsetText(surveyData.b6_pain_onset)}</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">평균 통증 강도:</span>
                  <span className="font-medium">{surveyData.c12_avg_pain_vas ?? "정보 없음"}/10</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">최대 통증 강도:</span>
                  <span className="font-medium">{surveyData.c11_max_pain_vas ?? "정보 없음"}/10</span>
                </li>
                 <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">위험 신호(자가):</span>
                  <span className={`font-medium ${surveyData.f33_red_flags && surveyData.f33_red_flags.length > 0 ? 'text-red-600' : ''}`}>
                    {surveyData.f33_red_flags && surveyData.f33_red_flags.length > 0 ? surveyData.f33_red_flags.join(', ') : "없음"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
       </div>

        {/* 통증 분석 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            통증 분석
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">통증 부위</h3>
              <div className="relative w-full h-64 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>통증 부위 시각화</p>
                  <p className="text-sm">(실제 구현 시 인체 이미지에 통증 부위 표시)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">통증 특성</h3>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">통증 양상</p>
                <div className="flex flex-wrap gap-2">
                  {surveyData.b7_pain_pattern?.map((pattern: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {getPainPatternText(pattern)}
                    </Badge>
                  )) ?? <span className="text-sm text-gray-500">정보 없음</span>}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">평균 통증 강도</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className={`h-2.5 rounded-full ${getPainColorClass(surveyData.c12_avg_pain_vas)}`}
                    style={{ width: `${(surveyData.c12_avg_pain_vas ?? 0) * 10}%` }}
                  ></div>
                </div>
                 <p className="text-xs text-gray-500 text-right">{surveyData.c12_avg_pain_vas ?? "N/A"}/10</p>
              </div>
               <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">최대 통증 강도</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className={`h-2.5 rounded-full ${getPainColorClass(surveyData.c11_max_pain_vas)}`}
                    style={{ width: `${(surveyData.c11_max_pain_vas ?? 0) * 10}%` }}
                  ></div>
                </div>
                 <p className="text-xs text-gray-500 text-right">{surveyData.c11_max_pain_vas ?? "N/A"}/10</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">통증 악화 요인</p>
                <ul className="list-disc list-inside space-y-1">
                  {surveyData.c13_aggravating_factors?.map((factor: string, index: number) => (
                    <li key={index}>{getPainFactorText(factor)}</li>
                  )) ?? <li className="text-sm text-gray-500">정보 없음</li>}
                </ul>
              </div>
               <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">통증 완화 요인</p>
                <ul className="list-disc list-inside space-y-1">
                  {surveyData.c14_relieving_factors?.map((factor: string, index: number) => (
                    <li key={index}>{getPainFactorText(factor)}</li>
                  )) ?? <li className="text-sm text-gray-500">정보 없음</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* AI 분석 결과의 상세 내용 (예: 잠재 원인, 권장 사항)을 여기에 추가할 수 있음 */}
          {/* 예시:
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
             <h3 className="font-semibold mb-2">AI 기반 통증 패턴 분석</h3>
             <p>{aiAnalysis?.potentialCauses?.join(', ') ?? "분석 중..."}</p>
           </div>
           */}
        </div>

        {/* 기능 제한 분석 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              />
            </svg>
            기능 제한 분석
          </h2>

          <h3 className="font-semibold mb-4">일상생활 기능 제한 평가 (설문 기반)</h3>
          <div className="space-y-4 mb-6">
            {[
              { key: 'd15_personal_hygiene', label: '개인 위생' },
              { key: 'd16_dressing', label: '옷 입기' },
              { key: 'd17_lifting', label: '물건 들기' },
              { key: 'd18_walking', label: '걷기' },
              { key: 'd19_sitting', label: '앉아있기' },
              { key: 'd20_standing', label: '서있기' },
              { key: 'd21_sleep', label: '수면' },
              { key: 'd22_concentration', label: '집중력' },
              { key: 'd23_work_study', label: '업무/학업' },
              { key: 'd24_driving_transport', label: '운전/이동' },
              { key: 'd25_leisure', label: '여가 활동' },
              // d26_mood는 별도 처리
            ].map(({ key, label }) => {
              // surveyData에서 해당 키의 값을 가져옴 (타입 단언 사용)
              const limitationValue = surveyData[key as keyof SurveyData] as number | undefined | null;
              const style = getLimitationStyle(limitationValue);
              return (
                <div key={key} className="flex items-center">
                  <span className="w-24 text-sm">{label}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${style.color}`} style={{ width: style.width }}></div>
                    </div>
                  </div>
                  <span className="w-24 text-sm text-right">{style.text}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div>
              <h3 className="font-semibold mb-2">정서적 영향 (설문 기반)</h3>
              {/* d26_mood 값에 따라 Badge 또는 텍스트 표시 */}
              <Badge variant="outline" className="mb-2">
                { surveyData.d26_mood === 1 ? "영향 없음" :
                  surveyData.d26_mood === 2 ? "약간 영향 있음" :
                  surveyData.d26_mood === 3 ? "중간 정도 영향 있음" :
                  surveyData.d26_mood === 4 ? "심각하게 영향 있음" : "정보 없음" }
              </Badge>
              {/* AI 분석 결과의 정서적 영향 코멘트 추가 가능 */}
              {/* <p className="text-sm">{aiAnalysis?.functionalImpact}</p> */}
            </div>
            {/* 수면 영향은 d21_sleep으로 이미 표시됨. 필요시 별도 코멘트 추가 */}
             <div>
              <h3 className="font-semibold mb-2">생활 습관 (설문 기반)</h3>
               <ul className="list-disc list-inside space-y-1 text-sm">
                 <li>규칙적 운동: {surveyData.e27_exercise ? '예' : '아니오'}</li>
                 <li>앉아있는 시간: {surveyData.e28_sitting_hours || '정보 없음'}</li>
                 <li>자세 인지: {surveyData.e29_posture_awareness || '정보 없음'}</li>
                 <li>최근 스트레스: {surveyData.e30_recent_stress || '정보 없음'}</li>
               </ul>
            </div>
          </div>

          {/* AI 분석 결과의 생활 습관 및 환경 요인 분석 결과 표시 */}
          {aiAnalysis?.lifestyleRecommendations && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-semibold mb-2">AI 기반 생활 습관 권장 사항</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {aiAnalysis.lifestyleRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* 맞춤 치료 추천 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            AI 기반 맞춤형 추천
          </h2>

          {/* AI가 생성한 일반적인 다음 단계 추천 카드 제거 (중복 표시 방지) */}

          {/* 상세 치료법 제안 */}
          <h3 className="text-lg font-semibold mb-4">구체적인 치료법 제안 (분석 기반)</h3>
          {/* 위험 신호가 있을 경우 경고 메시지 추가 */}
          {hasRedFlags && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>주의: 위험 신호 발견됨</AlertTitle>
              <AlertDescription>
                자가 점검 결과 위험 신호(Red Flags: {surveyData.f33_red_flags?.join(', ') || '내용 확인 필요'})가 발견되었습니다. 아래 추천되는 치료법은 일반적인 정보이며 참고용으로만 활용하시고, 반드시 전문의와 상담하여 정확한 진단과 치료 계획을 세우시기 바랍니다. {redFlagSummary?.includes('즉시') ? '즉시 병원 방문이 필요할 수 있습니다.' : ''}
              </AlertDescription>
            </Alert>
          )}
          {detailedSuggestions.length > 0 ? (
            <div className="space-y-4">
              {detailedSuggestions.map((suggestion, index) => (
                <Card key={index} className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-md font-semibold text-primary">{suggestion.treatment}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{suggestion.justification}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">환자분의 상태에 맞는 구체적인 치료법을 추천하기 위해 추가 정보가 필요하거나, 현재 정보로는 명확한 추천이 어렵습니다. 전문의와 상담하여 정확한 진단 및 치료 계획을 세우시는 것이 중요합니다.</p>
          )}


          {/* 기존의 정적 추천 내용은 제거하거나 AI 결과로 대체 */}
          {/*
          <div className="space-y-4 mb-6">
             ... 기존 치료 추천 내용 ...
           </div>
           <h3 className="font-semibold mb-4">추가 검사 및 평가 추천</h3>
           <ul className="list-disc list-inside space-y-2 mb-6">
             ... 기존 검사 추천 내용 ...
           </ul>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             ... 기존 관리/운동 권장 사항 ...
           </div>
           */}

           {/* 필요시 AI가 생성한 특정 치료법이나 검사 추천을 여기에 표시할 수 있음 */}

        </div>

        {/* 병원 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary">온누리마취통증의학과: 통증 없는 건강한 삶을 위한 선택</h2>

          <p className="mb-6">
            온누리마취통증의학과는 <span className="font-bold">마취통증의학과 전문의 김영환 원장</span>(부산 백병원
            외래교수)이 환자 개개인의 통증 원인을 정확히 진단하고, <span className="font-bold">비수술적 치료</span>를
            통해 근본적인 해결을 돕는 병원입니다.
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-primary-dark">핵심 비수술 치료법</h3>
            <p className="mb-3 text-sm">
              저희는 스테로이드 사용을 최소화하고 인체 본연의 치유 능력을 활성화하는 치료에 집중합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <span className="font-medium">프롤로테라피 (인대강화주사):</span> 손상된 인대나 힘줄을 강화하여 만성
                통증의 근본 원인을 해결합니다. (스테로이드 주사와 다릅니다)
              </li>
              <li>
                <span className="font-medium">도수치료 (카이로프랙틱, 롤핑):</span> 전문 치료사가 손을 이용해 척추 및
                관절의 정렬을 바로잡고, 근막을 이완시켜 통증을 완화하고 자세를 교정합니다.
              </li>
              <li>
                <span className="font-medium">특화 운동 치료 (슈로스, 슬링):</span> 척추측만증 교정(슈로스), 코어 근육
                강화 및 기능적 움직임 개선(슬링)을 위한 맞춤 운동을 제공합니다.
              </li>
              <li>
                <span className="font-medium">첨단 장비 치료:</span> 고강도 레이저(HILT), 체외충격파(ESWT), 자기장
                치료기 등 최신 장비를 이용해 통증 감소와 조직 재생을 촉진합니다.
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button asChild>
              <Link href="/about">더 자세한 병원 정보 보기</Link>
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} 온누리마취통증의학과. All rights reserved.</p>
          <p className="mt-2 italic">
            본 리포트는 의학적 진단을 대체하지 않으며, 정확한 진단과 치료를 위해서는 전문의 상담이 필요합니다.
          </p>
        </div>
      </div>

      {/* ChatbotDialog에 reportData 전달 */}
      <ChatbotDialog open={chatbotOpen} onOpenChange={setChatbotOpen} reportData={reportData} />
      {reportData && (
        <SurveyModal 
          open={surveyModalOpen} 
          onOpenChange={setSurveyModalOpen} 
          surveyData={reportData.surveyData} 
        />
      )}
    </div>
  );
}
