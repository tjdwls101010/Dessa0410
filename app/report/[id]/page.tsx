"use client"

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, AlertTriangle, MessageSquare, Printer, ArrowLeft, Info, FileText, CalendarCheck } from "lucide-react"; // CalendarIcon 제거 (ReservationModal에서 사용)
import Link from "next/link";
import ChatbotDialog from "@/components/chatbot/chatbot-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SurveyModal from "@/components/survey/survey-modal";
import { ReservationModal } from "@/components/ui/reservation-modal"; // 변경된 ReservationModal 컴포넌트 경로
import { RadarChartComponent } from "@/components/ui/radar-chart";
// Dialog 관련 import는 ReservationModal에서 처리하므로 제거
// AlertDialog 관련 import도 ReservationModal에서 처리하므로 제거
// Input, Label 등 폼 관련 요소 import 제거 (ReservationModal에서 사용)
// Popover, Calendar, Select 등 UI 컴포넌트 import 제거 (ReservationModal에서 사용)
// cn, format, ko 유틸리티/라이브러리 import 제거 (ReservationModal에서 사용)

// API 응답 타입 정의
interface SurveyData {
  id: string;
  created_at: string;
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
}

interface AiAnalysis {
  painSeverity?: string;
  potentialCauses?: string[];
  functionalImpact?: string;
  chronicityRisk?: string;
  redFlagSummary?: string;
  lifestyleRecommendations?: string[];
  suggestedTreatments?: { treatment: string; justification: string }[];
  nextStepGeneral?: string[];
  error?: string;
  rawResponse?: string;
}

interface ReportApiResponse {
  surveyData: SurveyData;
  aiAnalysis: AiAnalysis;
}

// 온누리마취통증의학과 치료법 정보
const treatmentInfo = {
  prolotherapy: { name: "프롤로테라피 (인대강화주사)", description: "...", keywords: ["만성", "인대", "힘줄", "관절염", "재생", "어깨", "무릎", "팔꿈치", "발목"] },
  manualTherapy: { name: "도수치료 (카이로프랙틱, 롤핑)", description: "...", keywords: ["척추", "관절", "정렬", "자세", "근막", "가동성", "목", "허리", "골반"] },
  schroth: { name: "슈로스 운동", description: "...", keywords: ["척추측만증", "청소년", "교정운동", "호흡"] },
  sling: { name: "슬링 운동", description: "...", keywords: ["코어", "근력", "재활", "기능개선", "허리통증"] },
  hilt: { name: "HILT (고강도 레이저)", description: "...", keywords: ["레이저", "염증", "통증완화", "조직재생", "관절염", "힘줄염", "급성"] },
  eswt: { name: "ESWT (체외충격파)", description: "...", keywords: ["충격파", "석회", "힘줄", "건염", "족저근막염", "오십견", "테니스엘보"] },
};

// 구체적인 치료 추천 생성 로직 (변경 없음)
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
    d19_sitting,
    e27_exercise,
    e29_posture_awareness,
  } = surveyData;
  const { potentialCauses, chronicityRisk, redFlagSummary } = aiAnalysis;

  const painArea = b4_main_pain_area || "";
  const isChronic = b6_pain_onset?.includes('개월') || b6_pain_onset?.includes('년') || chronicityRisk === '높음';
  const hasPostureIssue = e29_posture_awareness === '나쁨' || potentialCauses?.some(cause => cause.includes('자세'));
  const needsCoreStrength = potentialCauses?.some(cause => cause.includes('근력 부족') || cause.includes('코어'));
  const hasInflammationSigns = b7_pain_pattern?.some(p => p.includes('burning') || p.includes('throbbing'));
  const highPainIntensity = c12_avg_pain_vas && c12_avg_pain_vas >= 6;
  const isAdolescent = surveyData.a1_age?.includes('10대');
  const hasRedFlags = surveyData.f33_red_flags && surveyData.f33_red_flags.length > 0;

  if (isChronic && treatmentInfo.prolotherapy.keywords.some(k => painArea.includes(k))) {
     suggestions.push({
       treatment: treatmentInfo.prolotherapy.name,
       justification: `만성적인 ${painArea} 통증은 인대/힘줄 약화와 관련될 수 있습니다. ${treatmentInfo.prolotherapy.name}는 조직 재생을 유도하여 근본적인 회복을 도울 수 있습니다.`
     });
  }
  if (!hasRedFlags && hasPostureIssue && treatmentInfo.manualTherapy.keywords.some(k => painArea.includes(k) || k === '자세')) {
     suggestions.push({
       treatment: treatmentInfo.manualTherapy.name,
       justification: `${painArea} 통증과 함께 자세 불균형이 관찰됩니다. ${treatmentInfo.manualTherapy.name}를 통해 척추/관절 정렬을 바로잡고 근막 긴장을 완화하는 것이 도움될 수 있습니다.`
     });
  }
  if (needsCoreStrength || (painArea.includes('허리') && !e27_exercise)) {
     suggestions.push({
       treatment: treatmentInfo.sling.name,
       justification: `코어 근력 약화는 ${painArea || '만성'} 통증의 주요 원인 중 하나입니다. ${treatmentInfo.sling.name} 운동으로 심부 근육을 강화하고 척추 안정성을 높이는 것이 중요합니다.`
     });
   }
  if (highPainIntensity && (hasInflammationSigns || treatmentInfo.hilt.keywords.some(k => painArea.includes(k)))) {
      suggestions.push({
        treatment: treatmentInfo.hilt.name,
        justification: `통증 강도가 높고 염증 소견이 의심되는 ${painArea} 부위에 ${treatmentInfo.hilt.name} 치료는 심부 조직까지 에너지를 전달하여 빠른 통증 감소 및 염증 완화 효과를 기대할 수 있습니다.`
      });
   }
  if (isChronic && treatmentInfo.eswt.keywords.some(k => painArea.includes(k) || potentialCauses?.some(cause => cause.includes(k)))) {
     suggestions.push({
       treatment: treatmentInfo.eswt.name,
       justification: `만성적인 ${painArea} 통증, 특히 힘줄 문제(건염 등)나 석회화가 의심될 경우 ${treatmentInfo.eswt.name} 치료가 효과적일 수 있습니다. 충격파가 조직 재생과 혈류 개선을 촉진합니다.`
     });
  }
  if (isAdolescent && potentialCauses?.some(cause => cause.includes('척추측만증'))) {
     suggestions.push({
       treatment: treatmentInfo.schroth.name,
       justification: `청소년기의 척추측만증이 의심되는 경우, 3차원 교정 운동인 ${treatmentInfo.schroth.name}이 척추 만곡 진행을 막고 자세 개선에 도움이 될 수 있습니다. 정확한 진단이 우선 필요합니다.`
     });
   }

  const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
    index === self.findIndex((s) => s.treatment === suggestion.treatment)
  );

  const fallbackTreatments = [
    { treatment: treatmentInfo.manualTherapy.name, justification: "..." },
    { treatment: treatmentInfo.sling.name, justification: "..." },
    { treatment: treatmentInfo.hilt.name, justification: "..." },
    { treatment: treatmentInfo.prolotherapy.name, justification: "..." },
    { treatment: treatmentInfo.eswt.name, justification: "..." },
  ];

  let finalSuggestions = [...uniqueSuggestions];
  const existingTreatmentNames = new Set(finalSuggestions.map(s => s.treatment));

  for (const fallback of fallbackTreatments) {
    if (finalSuggestions.length >= 3) break;
    if (!existingTreatmentNames.has(fallback.treatment)) {
      finalSuggestions.push(fallback);
      existingTreatmentNames.add(fallback.treatment);
    }
  }
  return finalSuggestions;
}


export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const [reportData, setReportData] = useState<ReportApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const resolvedParams = use(params) as { id: string };

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
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
  }, [resolvedParams.id]);

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

  const { surveyData, aiAnalysis } = reportData;
  const detailedSuggestions = generateDetailedTreatmentSuggestions(surveyData, aiAnalysis);
  const hasRedFlags = surveyData?.f33_red_flags && surveyData.f33_red_flags.length > 0;
  const redFlagSummary = aiAnalysis?.redFlagSummary;

  // --- Helper Functions (기존과 동일, ReservationModal 관련 함수 제거) ---
  const getPainColorClass = (intensity: number | undefined | null) => {
    if (intensity === null || intensity === undefined) return "bg-gray-300";
    if (intensity <= 3) return "bg-green-500";
    if (intensity <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSuitabilityBadge = (suitability: string | undefined) => {
    switch (suitability) {
      case "high": return <Badge className="bg-green-100 text-green-800 border-green-300">높은 적합성</Badge>;
      case "medium": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">중간 적합성</Badge>;
      case "low": return <Badge className="bg-gray-100 text-gray-800 border-gray-300">낮은 적합성</Badge>;
      default: return null;
    }
  };

  const getLimitationStyle = (limitation: number | undefined | null) => {
    if (limitation === null || limitation === undefined) return { width: "0%", color: "bg-gray-200", text: "응답 없음" };
    switch (limitation) {
      case 1: return { width: "0%", color: "bg-gray-200", text: "어려움 없음" };
      case 2: return { width: "25%", color: "bg-green-500", text: "약간 어려움" };
      case 3: return { width: "50%", color: "bg-yellow-500", text: "상당히 어려움" };
      case 4: return { width: "75%", color: "bg-orange-500", text: "매우 심한 어려움" };
      case 5: return { width: "100%", color: "bg-red-500", text: "거의 불가능" };
      default: return { width: "0%", color: "bg-gray-200", text: "알 수 없음" };
    }
  };

  const getPainPatternText = (pattern: string) => {
    const mapping: Record<string, string> = { "dull_ache": "둔하고 쑤시는 통증", "sharp_stabbing": "날카롭고 찌르는 통증", /* ... */ "other": "기타" };
    return mapping[pattern] || pattern;
  };

  const getPainFactorText = (factor: string) => {
    const mapping: Record<string, string> = { "rest": "휴식", "movement": "움직임", /* ... */ "other": "기타" };
    return mapping[factor] || factor;
  };

  const getGenderText = (gender: string | undefined) => {
    if (!gender) return "정보 없음";
    const normalizedGender = gender.toLowerCase().trim();
    if (normalizedGender === "male" || normalizedGender === "m" || normalizedGender === "남성" || normalizedGender === "남자") return "남성";
    if (normalizedGender === "female" || normalizedGender === "f" || normalizedGender === "여성" || normalizedGender === "여자") return "여성";
    return "기타";
  };

  const getActivityLevelText = (activity: string | undefined) => {
    if (!activity) return "정보 없음";
    const mapping: Record<string, string> = { "sedentary": "주로 앉아서 생활", /* ... */ "other": "기타" };
    return mapping[activity] || activity;
  };

  const getPainOnsetText = (onset: string | undefined) => {
    if (!onset) return "정보 없음";
    const mapping: Record<string, string> = { "less_than_1w": "1주일 미만", /* ... */ };
    return mapping[onset] || onset;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>온누리마취통증의학과</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="sm">로그인</Button> */}
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" /> 인쇄하기
            </Button>
            {/* <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" /> PDF 저장
            </Button> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Report Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 pt-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">통증 자가 점검 분석 리포트</h1>
            <p className="text-sm text-gray-500">
              생성일: {new Date(surveyData.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div className="flex gap-2">
            {/* 상단 예약하기 버튼 */}
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => setReservationModalOpen(true)}
            >
              <CalendarCheck className="h-4 w-4" /> 진료 예약하기
            </Button>
            <Button className="gap-2" onClick={() => setChatbotOpen(true)}>
              <MessageSquare className="h-4 w-4" /> 챗봇 문의하기
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-8 border-yellow-300 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="font-semibold text-yellow-800">주의사항</AlertTitle>
          <AlertDescription className="text-yellow-700">
            본 리포트는 의학적 진단을 대체하지 않습니다. 정확한 진단과 치료를 위해서는 반드시 전문의의 상담이 필요합니다.
          </AlertDescription>
        </Alert>

        {/* Survey Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
            <FileText className="h-5 w-5 mr-2" /> 설문조사 결과
          </h2>

          {/* Basic Info */}
          <Card className="mb-6 border-blue-100">
            <CardHeader className="bg-blue-50 rounded-t-lg py-3 px-4">
              <CardTitle className="text-lg text-blue-800">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><span className="font-semibold">나이:</span> {surveyData.a1_age || '정보 없음'}</div>
              <div><span className="font-semibold">성별:</span> {getGenderText(surveyData.a2_gender)}</div>
              <div><span className="font-semibold">직업/활동 수준:</span> {getActivityLevelText(surveyData.a3_job)}</div>
            </CardContent>
          </Card>

          {/* Pain Characteristics */}
          <Card className="mb-6 border-green-100">
            <CardHeader className="bg-green-50 rounded-t-lg py-3 px-4">
              <CardTitle className="text-lg text-green-800">통증 특성</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-1">주요 통증 부위</p>
                <p>{surveyData.b4_main_pain_area || '정보 없음'}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">기타 통증 부위</p>
                <p>{surveyData.b5_other_pain_areas?.join(', ') || '없음'}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">통증 시작 시기</p>
                <p>{getPainOnsetText(surveyData.b6_pain_onset)}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">통증 양상</p>
                {surveyData.b7_pain_pattern && surveyData.b7_pain_pattern.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {surveyData.b7_pain_pattern.map((pattern, index) => (
                      <li key={index}>{getPainPatternText(pattern)}</li>
                    ))}
                  </ul>
                ) : (
                  <p>정보 없음</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pain Intensity & Factors */}
          <Card className="mb-6 border-yellow-100">
            <CardHeader className="bg-yellow-50 rounded-t-lg py-3 px-4">
              <CardTitle className="text-lg text-yellow-800">통증 강도 및 영향 요인</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2">최대 통증 강도 (0-10)</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${getPainColorClass(surveyData.c11_max_pain_vas)}`}
                    style={{ width: `${(surveyData.c11_max_pain_vas || 0) * 10}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm mt-1">{surveyData.c11_max_pain_vas ?? 'N/A'}/10</p>
              </div>
              <div>
                <p className="font-semibold mb-2">평균 통증 강도 (0-10)</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${getPainColorClass(surveyData.c12_avg_pain_vas)}`}
                    style={{ width: `${(surveyData.c12_avg_pain_vas || 0) * 10}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm mt-1">{surveyData.c12_avg_pain_vas ?? 'N/A'}/10</p>
              </div>
              <div>
                <p className="font-semibold mb-1">통증 악화 요인</p>
                {surveyData.c13_aggravating_factors && surveyData.c13_aggravating_factors.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {surveyData.c13_aggravating_factors.map((factor, index) => (
                      <li key={index}>{getPainFactorText(factor)}</li>
                    ))}
                  </ul>
                ) : (
                  <p>정보 없음</p>
                )}
              </div>
              <div>
                <p className="font-semibold mb-1">통증 완화 요인</p>
                {surveyData.c14_relieving_factors && surveyData.c14_relieving_factors.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {surveyData.c14_relieving_factors.map((factor, index) => (
                      <li key={index}>{getPainFactorText(factor)}</li>
                    ))}
                  </ul>
                ) : (
                  <p>정보 없음</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Functional Limitations - Radar Chart */}
          <Card className="border-orange-100 mb-4">
            <CardHeader className="bg-orange-50 rounded-t-lg py-3 px-4">
              <CardTitle className="text-lg text-orange-800">일상생활 영향도 (레이더 차트)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <RadarChartComponent 
                data={[
                  { 
                    subject: '개인 위생', 
                    value: surveyData.d15_personal_hygiene || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '옷 입기', 
                    value: surveyData.d16_dressing || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '물건 들기', 
                    value: surveyData.d17_lifting || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '걷기', 
                    value: surveyData.d18_walking || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '앉아있기', 
                    value: surveyData.d19_sitting || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '서있기', 
                    value: surveyData.d20_standing || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '수면', 
                    value: surveyData.d21_sleep || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '집중력', 
                    value: surveyData.d22_concentration || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '업무/학업', 
                    value: surveyData.d23_work_study || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '운전/대중교통', 
                    value: surveyData.d24_driving_transport || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '여가 활동', 
                    value: surveyData.d25_leisure || 0, 
                    fullMark: 5 
                  },
                  { 
                    subject: '기분/정서', 
                    value: surveyData.d26_mood || 0, 
                    fullMark: 5 
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Functional Limitations - Progress Bars */}
          <Card className="border-orange-100">
            <CardHeader className="bg-orange-50 rounded-t-lg py-3 px-4">
              <CardTitle className="text-lg text-orange-800">일상생활 영향도 (상세)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                  { key: 'd24_driving_transport', label: '운전/대중교통' },
                  { key: 'd25_leisure', label: '여가 활동' },
                  { key: 'd26_mood', label: '기분/정서' },
                ].map(({ key, label }) => {
                  const limitation = surveyData[key as keyof SurveyData] as number | undefined | null;
                  const { width, color, text } = getLimitationStyle(limitation);
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{label}</span>
                        <span className="text-xs text-gray-500">{text}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${color}`} style={{ width }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            AI 분석 결과
          </h2>
          {aiAnalysis && !aiAnalysis.error ? (
            <div className="space-y-6">
              {/* Pain Severity & Potential Causes */}
              <Card className="border-indigo-100">
                <CardHeader className="bg-indigo-50 rounded-t-lg py-3 px-4">
                  <CardTitle className="text-lg text-indigo-800">통증 심각도 및 예상 원인</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div><span className="font-semibold">통증 심각도:</span> {aiAnalysis.painSeverity || '분석 중...'}</div>
                  <div>
                    <p className="font-semibold mb-1">예상 원인:</p>
                    {aiAnalysis.potentialCauses && aiAnalysis.potentialCauses.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {aiAnalysis.potentialCauses.map((cause, index) => <li key={index}>{cause}</li>)}
                      </ul>
                    ) : (
                      <p>분석 중...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Functional Impact & Chronicity Risk */}
              <Card className="border-purple-100">
                <CardHeader className="bg-purple-50 rounded-t-lg py-3 px-4">
                  <CardTitle className="text-lg text-purple-800">기능적 영향 및 만성화 위험</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div><span className="font-semibold">기능적 영향:</span> {aiAnalysis.functionalImpact || '분석 중...'}</div>
                  <div><span className="font-semibold">만성화 위험도:</span> {aiAnalysis.chronicityRisk || '분석 중...'}</div>
                </CardContent>
              </Card>

              {/* Red Flags */}
              {hasRedFlags && (
                <Card className="border-red-100">
                  <CardHeader className="bg-red-50 rounded-t-lg py-3 px-4">
                    <CardTitle className="text-lg text-red-800 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> 위험 신호 (Red Flags)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-red-700">{redFlagSummary || '위험 신호가 감지되었습니다. 즉시 전문의와 상담하세요.'}</p>
                  </CardContent>
                </Card>
              )}

              {/* Lifestyle Recommendations */}
              <Card className="border-teal-100">
                <CardHeader className="bg-teal-50 rounded-t-lg py-3 px-4">
                  <CardTitle className="text-lg text-teal-800">생활 습관 개선 제안</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {aiAnalysis.lifestyleRecommendations && aiAnalysis.lifestyleRecommendations.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {aiAnalysis.lifestyleRecommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                    </ul>
                  ) : (
                    <p>분석 중...</p>
                  )}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="border-gray-200">
                <CardHeader className="bg-gray-100 rounded-t-lg py-3 px-4">
                  <CardTitle className="text-lg text-gray-800">다음 단계 제안</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {aiAnalysis.nextStepGeneral && aiAnalysis.nextStepGeneral.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {aiAnalysis.nextStepGeneral.map((step, index) => <li key={index}>{step}</li>)}
                    </ul>
                  ) : (
                    <p>분석 중...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>AI 분석 오류</AlertTitle>
              <AlertDescription>
                AI 분석 결과를 불러오는 중 오류가 발생했습니다: {aiAnalysis?.error || '알 수 없는 오류'}
                {aiAnalysis?.rawResponse && (
                  <details className="mt-2 text-xs">
                    <summary>오류 상세 정보</summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-600 overflow-auto">
                      {aiAnalysis.rawResponse}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Recommended Treatments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            추천 치료법 (온누리마취통증의학과 제공)
          </h2>
          {detailedSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {detailedSuggestions.map((suggestion, index) => (
                <Card key={index} className="border-primary/30 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="bg-primary/10 rounded-t-lg py-3 px-4">
                    <CardTitle className="text-lg text-primary">{suggestion.treatment}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 text-sm text-gray-700">
                    {suggestion.justification}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">추천 치료법을 생성 중이거나, 적합한 치료법을 찾지 못했습니다.</p>
          )}
        </div>

        {/* Final Actions */}
        <div className="flex justify-center gap-4">
          <Button className="gap-2" onClick={() => setChatbotOpen(true)}>
            <MessageSquare className="h-4 w-4" /> 챗봇 문의하기
          </Button>
          {/* 예약하기 버튼 */}
          <Button variant="outline" className="gap-2" onClick={() => setReservationModalOpen(true)}>
            <CalendarCheck className="h-4 w-4" /> 진료 예약하기
          </Button>
        </div>
      </div>

      {/* Modals */}
      {reportData && (
        <ChatbotDialog
          open={chatbotOpen}
          onOpenChange={setChatbotOpen}
          reportData={reportData} // reportData 전달
        />
      )}
     {reportData && (
       <SurveyModal
         open={surveyModalOpen}
         onOpenChange={setSurveyModalOpen}
         surveyData={surveyData} // surveyData prop 추가
         reportId={resolvedParams.id}
       />
     )}
      {/* 새로운 ReservationModal 사용 */}
      <ReservationModal 
        open={reservationModalOpen}
        onOpenChange={setReservationModalOpen}
      />
    </div>
  );
}
