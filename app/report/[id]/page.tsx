"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, AlertTriangle, MessageSquare, Printer, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ChatbotDialog from "@/components/chatbot/chatbot-dialog"

export default function ReportPage({ params }: { params: { id: string } }) {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chatbotOpen, setChatbotOpen] = useState(false)

  useEffect(() => {
    // In a real implementation, this would fetch the report data from the backend
    // For demo purposes, we'll use mock data
    const fetchReportData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockReportData = {
          patientInfo: {
            age: 45,
            gender: "female",
            occupation: "사무직",
            activityLevel: "light",
          },
          painAssessment: {
            primaryLocation: "lowerBack",
            locations: ["lowerBack", "hip"],
            intensity: 7,
            duration: "3-6months",
            frequency: "daily",
            characteristics: ["dull", "sharp", "stiffness"],
            triggers: ["sitting", "bending", "standing"],
          },
          functionalLimitations: {
            dailyActivities: {
              walking: "mild",
              standing: "moderate",
              sitting: "severe",
              climbing: "moderate",
              bending: "severe",
              lifting: "severe",
              dressing: "mild",
              bathing: "mild",
              sleeping: "moderate",
              working: "moderate",
            },
            sleepQuality: "moderatelyAffected",
            moodImpact: "moderatelyAffected",
          },
          redFlags: [
            {
              severity: "medium",
              description: "지속적인 통증이 3개월 이상 이어지고 있습니다.",
              recommendation: "전문의 상담을 통한 정확한 진단이 필요합니다.",
            },
          ],
          aiAnalysis: {
            painSeverity: "중증도의 만성 통증",
            potentialCauses: [
              "장시간 앉아있는 자세로 인한 요추 부담",
              "근육 불균형 및 약화",
              "자세 불량",
              "디스크 관련 문제 가능성",
            ],
            functionalImpact: "일상생활에 상당한 영향을 미치는 중등도의 기능 제한",
            chronicity: "만성화 위험이 높음",
          },
          recommendedTreatments: [
            {
              name: "도수치료",
              description: "척추 정렬 및 관절 가동성 개선을 위한 도수치료",
              suitability: "high",
            },
            {
              name: "특화 운동치료 (슬링)",
              description: "코어 근육 강화 및 기능적 움직임 개선을 위한 맞춤 운동",
              suitability: "high",
            },
            {
              name: "프롤로테라피",
              description: "손상된 인대나 힘줄을 강화하여 만성 통증의 근본 원인 해결",
              suitability: "medium",
            },
            {
              name: "첨단 장비 치료",
              description: "고강도 레이저, 체외충격파 등을 이용한 통증 감소와 조직 재생 촉진",
              suitability: "medium",
            },
          ],
          recommendedExaminations: ["요추부 X-ray 검사", "필요시 MRI 검사", "근력 및 유연성 평가"],
        }

        setReportData(mockReportData)
      } catch (error) {
        console.error("Error fetching report data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">리포트를 불러오는 중입니다...</p>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">리포트를 찾을 수 없습니다</h2>
          <p className="mb-6">요청하신 리포트를 찾을 수 없거나 접근 권한이 없습니다.</p>
          <Button asChild>
            <Link href="/survey">새로운 설문 시작하기</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 통증 강도에 따른 색상 클래스 반환 함수
  const getPainColorClass = (intensity: number) => {
    if (intensity <= 3) return "bg-green-500"
    if (intensity <= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  // 적합성에 따른 배지 스타일 반환 함수
  const getSuitabilityBadge = (suitability: string) => {
    switch (suitability) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 border-green-300">높은 적합성</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">중간 적합성</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">낮은 적합성</Badge>
      default:
        return null
    }
  }

  // 기능 제한 정도에 따른 너비 및 색상 반환 함수
  const getLimitationStyle = (limitation: string) => {
    switch (limitation) {
      case "none":
        return { width: "0%", color: "bg-gray-200" }
      case "mild":
        return { width: "25%", color: "bg-green-500" }
      case "moderate":
        return { width: "50%", color: "bg-yellow-500" }
      case "severe":
        return { width: "75%", color: "bg-orange-500" }
      case "impossible":
        return { width: "100%", color: "bg-red-500" }
      default:
        return { width: "0%", color: "bg-gray-200" }
    }
  }

  // 통증 특성 한글 변환 함수
  const getPainCharacteristicText = (char: string) => {
    const mapping: Record<string, string> = {
      dull: "둔한 통증",
      sharp: "날카로운 통증",
      throbbing: "욱신거리는 통증",
      burning: "화끈거리는 통증",
      tingling: "저림/따끔거림",
      stiffness: "뻣뻣함/경직",
      other: "기타",
    }
    return mapping[char] || char
  }

  // 통증 유발 요인 한글 변환 함수
  const getPainTriggerText = (trigger: string) => {
    const mapping: Record<string, string> = {
      movement: "특정 동작",
      sitting: "오래 앉아있을 때",
      standing: "오래 서있을 때",
      walking: "걸을 때",
      bending: "몸 구부릴 때",
      lifting: "물건 들 때",
      sleeping: "잘 때",
      stress: "스트레스 받을 때",
      weather: "날씨 변화",
      other: "기타",
    }
    return mapping[trigger] || trigger
  }

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
            <div className="text-sm">생성일: {new Date().toLocaleDateString("ko-KR")}</div>
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
            분석 요약
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">환자 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">연령대</p>
                  <p className="font-medium">{reportData.patientInfo.age}세</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">성별</p>
                  <p className="font-medium">{reportData.patientInfo.gender === "male" ? "남성" : "여성"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">직업</p>
                  <p className="font-medium">{reportData.patientInfo.occupation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">활동량</p>
                  <p className="font-medium">
                    {reportData.patientInfo.activityLevel === "sedentary" && "거의 활동하지 않음"}
                    {reportData.patientInfo.activityLevel === "light" && "가벼운 활동"}
                    {reportData.patientInfo.activityLevel === "moderate" && "중간 활동"}
                    {reportData.patientInfo.activityLevel === "active" && "활발한 활동"}
                    {reportData.patientInfo.activityLevel === "veryActive" && "매우 활발한 활동"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">통증 요약</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">주요 통증 부위:</span>
                  <span className="font-medium">허리(요추부)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">통증 지속 기간:</span>
                  <span className="font-medium">3개월~6개월</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">통증 강도:</span>
                  <span className="font-medium">7/10 (심한 통증)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">기능 제한:</span>
                  <span className="font-medium">중등도</span>
                </li>
                <li className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">위험 신호:</span>
                  <span className="font-medium">없음</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">AI 분석 결과 요약</h3>
            <p className="text-blue-700">
              장시간 앉아있는 사무직 환경과 불량한 자세로 인한 만성 요통 및 경추통이 의심됩니다. 통증이 3개월 이상
              지속되어 만성화 단계에 접어들었으며, 일상생활에 상당한 지장을 주고 있습니다. 비수술적 통합 치료 접근이
              권장됩니다.
            </p>
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
                  {reportData.painAssessment.characteristics.map((char: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {getPainCharacteristicText(char)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">통증 강도 (최대)</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className={`h-2.5 rounded-full ${getPainColorClass(reportData.painAssessment.intensity)}`}
                    style={{ width: `${reportData.painAssessment.intensity * 10}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>경미함</span>
                  <span>중간</span>
                  <span>심함</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">통증 유발 요인</p>
                <ul className="list-disc list-inside space-y-1">
                  {reportData.painAssessment.triggers.map((trigger: string, index: number) => (
                    <li key={index}>{getPainTriggerText(trigger)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-semibold mb-2">통증 패턴 분석</h3>
            <p className="mb-4">
              귀하의 통증은 주로 허리(요추부)에 집중되어 있으며, 오래 앉아있거나 몸을 구부릴 때 악화되는 양상을
              보입니다. 통증이 다리 쪽으로 뻗치는 방사통이 동반되어 있어 신경 압박 가능성이 있습니다.
            </p>
            <p>
              뻐근함, 결림과 함께 다리로 뻗치는 저림 증상은 요추 디스크 문제나 척추관 협착증과 연관될 수 있습니다. 3개월
              이상 지속된 만성 통증으로, 적절한 치료 없이는 증상이 장기화될 가능성이 있습니다.
            </p>
          </div>
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

          <h3 className="font-semibold mb-4">일상생활 기능 제한 평가</h3>
          <div className="space-y-4 mb-6">
            {Object.entries(reportData.functionalLimitations.dailyActivities).map(
              ([activity, limitation]: [string, any]) => {
                const style = getLimitationStyle(limitation)
                return (
                  <div key={activity} className="flex items-center">
                    <span className="w-24 text-sm">
                      {activity === "walking"
                        ? "걷기"
                        : activity === "standing"
                          ? "서있기"
                          : activity === "sitting"
                            ? "앉아있기"
                            : activity === "climbing"
                              ? "계단 오르기"
                              : activity === "bending"
                                ? "몸 구부리기"
                                : activity === "lifting"
                                  ? "물건 들기"
                                  : activity === "dressing"
                                    ? "옷 입기"
                                    : activity === "bathing"
                                      ? "목욕하기"
                                      : activity === "sleeping"
                                        ? "수면"
                                        : activity === "working"
                                          ? "일하기"
                                          : activity}
                    </span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${style.color}`} style={{ width: style.width }}></div>
                      </div>
                    </div>
                    <span className="w-24 text-sm text-right">
                      {limitation === "none"
                        ? "어려움 없음"
                        : limitation === "mild"
                          ? "약간 어려움"
                          : limitation === "moderate"
                            ? "중간 어려움"
                            : limitation === "severe"
                              ? "심한 어려움"
                              : limitation === "impossible"
                                ? "불가능"
                                : limitation}
                    </span>
                  </div>
                )
              },
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">수면 영향</h3>
              <Badge variant="outline" className="mb-2">
                {reportData.functionalLimitations.sleepQuality === "notAffected" && "영향 없음"}
                {reportData.functionalLimitations.sleepQuality === "slightlyAffected" && "약간 영향 있음"}
                {reportData.functionalLimitations.sleepQuality === "moderatelyAffected" && "중간 정도 영향 있음"}
                {reportData.functionalLimitations.sleepQuality === "severelyAffected" && "심각하게 영향 있음"}
              </Badge>
              <p className="text-sm">
                통증으로 인해 수면의 질이 저하되고 있으며, 이는 전반적인 건강과 회복에 영향을 미칠 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">정서적 영향</h3>
              <Badge variant="outline" className="mb-2">
                {reportData.functionalLimitations.moodImpact === "notAffected" && "영향 없음"}
                {reportData.functionalLimitations.moodImpact === "slightlyAffected" && "약간 영향 있음"}
                {reportData.functionalLimitations.moodImpact === "moderatelyAffected" && "중간 정도 영향 있음"}
                {reportData.functionalLimitations.moodImpact === "severelyAffected" && "심각하게 영향 있음"}
              </Badge>
              <p className="text-sm">
                통증이 기분과 정서 상태에 영향을 미치고 있으며, 이는 일상생활의 질과 대인관계에도 영향을 줄 수 있습니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-semibold mb-2">생활 습관 및 환경 요인 분석</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">위험 요인</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>장시간 앉아있는 업무 환경 (하루 8-12시간)</li>
                  <li>좋지 않은 자세 습관</li>
                  <li>규칙적인 운동 부족</li>
                  <li>높은 스트레스 수준</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">개선 가능 영역</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>인체공학적 작업 환경 조성</li>
                  <li>정기적인 스트레칭 및 자세 교정</li>
                  <li>코어 근육 강화 운동 시작</li>
                  <li>스트레스 관리 기법 도입</li>
                </ul>
              </div>
            </div>
          </div>
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
            맞춤형 치료 추천
          </h2>

          <div className="space-y-4 mb-6">
            {reportData.recommendedTreatments.map((treatment: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{treatment.name}</h3>
                  {getSuitabilityBadge(treatment.suitability)}
                </div>
                <p className="text-sm mb-2">{treatment.description}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">적합 이유: </span>
                  {treatment.suitability === "high"
                    ? "귀하의 증상과 높은 연관성을 보이며, 효과적인 개선이 기대됩니다."
                    : "귀하의 증상과 중간 정도의 연관성을 보이며, 보조적 치료로 권장됩니다."}
                </p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mb-4">추가 검사 및 평가 추천</h3>
          <ul className="list-disc list-inside space-y-2 mb-6">
            {reportData.recommendedExaminations.map((exam: string, index: number) => (
              <li key={index} className="text-sm">
                {exam}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">일상생활 관리 권장사항</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <span className="font-medium">작업 환경 개선:</span> 인체공학적 의자와 책상 높이 조정, 모니터 위치
                  최적화
                </li>
                <li>
                  <span className="font-medium">휴식 습관:</span> 50분 작업 후 10분 휴식, 간단한 스트레칭 실시
                </li>
                <li>
                  <span className="font-medium">수면 자세:</span> 옆으로 누워 무릎 사이에 베개 사용, 바로 누울 때는 무릎
                  아래 베개 사용
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">운동 권장사항</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <span className="font-medium">코어 강화:</span> 플랭크, 브릿지 등 코어 안정화 운동 (주 3-4회, 점진적
                  강도 증가)
                </li>
                <li>
                  <span className="font-medium">유연성 향상:</span> 허리, 엉덩이, 햄스트링 스트레칭 (매일 10-15분)
                </li>
                <li>
                  <span className="font-medium">유산소 운동:</span> 걷기, 수영 등 저충격 유산소 운동 (주 3회, 30분 이상)
                </li>
              </ul>
            </div>
          </div>
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

      <ChatbotDialog open={chatbotOpen} onOpenChange={setChatbotOpen} reportData={reportData} />
    </div>
  )
}

