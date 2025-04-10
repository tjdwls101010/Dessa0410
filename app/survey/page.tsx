"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { BasicInfoStep } from "@/components/survey/basic-info-step"
import { PainCharacteristicsStep } from "@/components/survey/pain-characteristics-step"
import { PainIntensityStep } from "@/components/survey/pain-intensity-step"
import { FunctionalLimitationsStep } from "@/components/survey/functional-limitations-step"
import { LifestyleHistoryStep } from "@/components/survey/lifestyle-history-step"
import { RedFlagsStep } from "@/components/survey/red-flags-step"
import { HospitalIntentionStep } from "@/components/survey/hospital-intention-step"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [surveyData, setSurveyData] = useState({
    basicInfo: {},
    painCharacteristics: {},
    painIntensity: {},
    functionalLimitations: {},
    lifestyleHistory: {},
    redFlags: {},
    hospitalIntention: {},
  })

  const steps = [
    { title: "기본 정보", component: BasicInfoStep },
    { title: "통증의 기본 특징", component: PainCharacteristicsStep },
    { title: "통증의 강도 및 양상", component: PainIntensityStep },
    { title: "기능 제한 및 삶의 질", component: FunctionalLimitationsStep },
    { title: "생활 습관 및 과거력", component: LifestyleHistoryStep },
    { title: "위험 신호", component: RedFlagsStep },
    { title: "병원 방문 의향", component: HospitalIntentionStep },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = (data: any) => {
    // Update survey data with current step data
    setSurveyData({
      ...surveyData,
      [Object.keys(surveyData)[currentStep]]: data,
    })

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // In a real implementation, this would send data to the backend
      // const response = await fetch('/api/submit-survey', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(surveyData),
      // });

      // if (!response.ok) throw new Error('Failed to submit survey');
      // const result = await response.json();

      // For demo purposes, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to results page with a mock report ID
      router.push("/report/demo-report-id")
    } catch (error) {
      console.error("Error submitting survey:", error)
      // Handle error (show error message, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>통증 자가 점검 설문</CardTitle>
            <CardDescription>
              정확한 정보 제공을 위해 모든 질문에 솔직하게 답변해 주세요. 본 설문은 의학적 진단을 대체하지 않습니다.
            </CardDescription>

            <Alert className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>설문 안내</AlertTitle>
              <AlertDescription>
                본 설문은 귀하의 현재 통증 상태와 그로 인한 불편함을 스스로 점검하고, 전문적인 상담이 필요한지 판단하는
                데 도움을 드리기 위해 마련되었습니다. 이 결과는 의학적 진단이 아니며, 참고 자료로만 활용해 주십시오.
                정확한 진단과 치료는 반드시 의사와의 상담을 통해 이루어져야 합니다.
              </AlertDescription>
            </Alert>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>진행률: {Math.round(progress)}%</span>
                <span>
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h2>
            <CurrentStepComponent
              data={surveyData[Object.keys(surveyData)[currentStep] as keyof typeof surveyData]}
              onComplete={handleNext}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 이전
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => {
                  // This is just for demo purposes
                  // In a real implementation, the form in each step would handle validation
                  handleNext({})
                }}
              >
                다음 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 분석 중...
                  </>
                ) : (
                  <>제출 및 분석 시작</>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

