"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react" // Added useRef
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog" // Added AlertDialog components
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient" // Import Supabase client
import { TooltipProvider } from "@/components/ui/tooltip" // TooltipProvider import 추가
import { BasicInfoStep } from "@/components/survey/basic-info-step"
import { PainCharacteristicsStep } from "@/components/survey/pain-characteristics-step"
import { PainIntensityStep } from "@/components/survey/pain-intensity-step"
import { FunctionalLimitationsStep } from "@/components/survey/functional-limitations-step"
import { LifestyleHistoryStep } from "@/components/survey/lifestyle-history-step"
import { RedFlagsStep } from "@/components/survey/red-flags-step"
import { HospitalIntentionStep } from "@/components/survey/hospital-intention-step"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Keep Alert for the Info one
import { InfoIcon, AlertCircle } from "lucide-react" // Keep AlertCircle for toast icon potentially

interface StepStatus {
  total: number
  answered: number
}

export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationTrigger, setValidationTrigger] = useState(0) // Counter to trigger validation
  const [showValidationAlert, setShowValidationAlert] = useState(false) // State for AlertDialog visibility
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Ref for timeout
  const [surveyData, setSurveyData] = useState<Record<string, any>>({
    basicInfo: {},
    painCharacteristics: {},
    painIntensity: {},
    functionalLimitations: {},
    lifestyleHistory: {},
    redFlags: {},
    hospitalIntention: {},
  })
  // Define steps with unique keys matching surveyData keys and their base question counts
  const steps = useMemo(
    () => [
      { key: "basicInfo", title: "기본 정보", component: BasicInfoStep, baseQuestions: 3 },
      { key: "painCharacteristics", title: "통증의 기본 특징", component: PainCharacteristicsStep, baseQuestions: 7 },
      { key: "painIntensity", title: "통증의 강도 및 양상", component: PainIntensityStep, baseQuestions: 4 },
      { key: "functionalLimitations", title: "기능 제한 및 삶의 질", component: FunctionalLimitationsStep, baseQuestions: 12 },
      { key: "lifestyleHistory", title: "생활 습관 및 과거력", component: LifestyleHistoryStep, baseQuestions: 6 },
      { key: "redFlags", title: "위험 신호", component: RedFlagsStep, baseQuestions: 1 },
      { key: "hospitalIntention", title: "병원 방문 의향", component: HospitalIntentionStep, baseQuestions: 2 }, // 1 required + 1 optional group
    ],
    []
  )

  // Initialize step statuses with base counts
  const initialStepStatuses = useMemo(() => {
    const statuses: Record<string, StepStatus> = {}
    steps.forEach((step) => {
      statuses[step.key] = { total: step.baseQuestions, answered: 0 }
    })
    return statuses
  }, [steps])

  // State to store the status (total questions, answered questions) for each step
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(initialStepStatuses)

  // Calculate overall progress based on reported statuses
  const { totalQuestions, answeredQuestions } = useMemo(() => {
    let total = 0
    let answered = 0
    // Iterate through the defined steps to ensure all are included, using reported status if available
    steps.forEach((step) => {
      const status = stepStatuses[step.key] // Get current status (might be updated from initial)
      total += status.total
      answered += status.answered
    })
    // Ensure total is at least the sum of base questions if statuses haven't updated yet
    const baseTotalSum = steps.reduce((sum, step) => sum + step.baseQuestions, 0)
    total = Math.max(total, baseTotalSum)

    return { totalQuestions: total, answeredQuestions: answered }
  }, [stepStatuses, steps]) // Add steps dependency

  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  // Callback for steps to report their status
  const handleReportStatus = useCallback((stepKey: string, status: StepStatus) => {
    setStepStatuses((prev) => ({
      ...prev,
      [stepKey]: status,
    }))
  }, [])

  // Called by step component upon successful validation
  const handleValidatedSubmit = async (stepKey: string, data: any) => { // Make async
    // No need to hide error here anymore
    setSurveyData((prev) => ({
      ...prev,
      [stepKey]: data,
    }))

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // If it's the last step, proceed to final submission
      // If it's the last step, proceed to final submission and wait for it
      const reportId = await handleSubmit()
      if (reportId) {
        // Navigation is now handled here after handleSubmit completes
        router.push(`/report/${reportId}?new=true`)
      }
      // If handleSubmit fails, the error toast is shown inside handleSubmit
      // and we stay on the survey page.
    }
  }

  // Called by step component upon validation failure
  const handleValidationFail = () => {
    // Clear any existing timeout
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current)
    }
    // Show the AlertDialog
    setShowValidationAlert(true)
    window.scrollTo(0, 0) // Scroll to top to make error visible

    // Removed automatic timeout - alert stays until manually closed
    // alertTimeoutRef.current = setTimeout(() => {
    //   setShowValidationAlert(false)
    // }, 3000)
  }

  // Function to close the alert dialog manually
  const closeValidationAlert = () => {
    // No timeout to clear anymore
    // if (alertTimeoutRef.current) {
    //   clearTimeout(alertTimeoutRef.current)
    //   alertTimeoutRef.current = null
    // }
    setShowValidationAlert(false)
  }

  // Trigger validation in the current step component
  const triggerStepValidation = () => {
    setValidationTrigger((prev) => prev + 1) // Increment counter to trigger effect in child
  }

  const handleBack = () => {
    if (currentStep > 0) {
      // No need to hide error here anymore
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Modified handleSubmit to return reportId on success, null on failure
  const handleSubmit = async (): Promise<string | null> => {
    setIsSubmitting(true)

    // Flatten the survey data from nested structure to a single object
    const flattenedData = Object.values(surveyData).reduce((acc, stepData) => {
      return { ...acc, ...stepData }
    }, {})

    // Map frontend keys to Supabase column names (lowercase) and perform type conversions
    const keyMap: { [key: string]: string } = { // Re-added const keyMap = 
      ageGroup: "a1_age",
      gender: "a2_gender",
      occupation: "a3_job",
      otherOccupation: "a3_job_other",
      primaryPainLocation: "b4_main_pain_area",
      otherPrimaryLocation: "b4_main_pain_area_other",
      secondaryPainLocations: "b5_other_pain_areas",
      otherSecondaryLocation: "b5_other_pain_areas_other",
      painDuration: "b6_pain_onset",
      painTypes: "b7_pain_pattern",
      otherPainType: "b7_pain_pattern_other",
      hasRadiatingPain: "b8_radiating_pain",
      hasTouchSensitivity: "b9_allodynia",
      hasSensoryMotorChanges: "b10_sensory_motor_deficit",
      maxPainIntensity: "c11_max_pain_vas",
      avgPainIntensity: "c12_avg_pain_vas",
      painTriggers: "c13_aggravating_factors",
      otherPainTrigger: "c13_aggravating_factors_other",
      painRelievers: "c14_relieving_factors",
      otherPainReliever: "c14_relieving_factors_other",
      personalHygiene: "d15_personal_hygiene",
      dressing: "d16_dressing",
      lifting: "d17_lifting",
      walking: "d18_walking",
      sitting: "d19_sitting",
      standing: "d20_standing",
      sleeping: "d21_sleep",
      concentration: "d22_concentration",
      workStudy: "d23_work_study",
      transportation: "d24_driving_transport",
      leisure: "d25_leisure",
      emotionalState: "d26_mood",
      regularExercise: "e27_exercise",
      exerciseType: "e27_exercise_type",
      sittingHours: "e28_sitting_hours",
      posture: "e29_posture_awareness",
      stress: "e30_recent_stress",
      previousTreatment: "e31_previous_treatment",
      treatmentDetails: "e31_previous_treatment_details",
      medicalConditions: "e32_medical_history",
      conditionDetails: "e32_medical_history_details",
      redFlags: "f33_red_flags",
      consultationNeed: "g34_need_consultation",
      treatmentInterests: "g35_interested_treatments",
      otherTreatmentInterest: "g35_interested_treatments_other",
    }

    // Removed functionalLimitationScaleMap, leisureScaleMap, emotionalStateScaleMap as conversions are handled differently or not needed

    const dataToInsert: { [key: string]: any } = {}
    for (const key in flattenedData) {
      const dbKey = keyMap[key]
      if (dbKey) {
        let value = flattenedData[key]

        // Convert "예"/"아니오" to boolean for specific columns if needed by Supabase schema
        // Assuming Supabase boolean columns accept true/false directly
        if (["b8_radiating_pain", "b9_allodynia", "b10_sensory_motor_deficit", "e27_exercise", "e31_previous_treatment", "e32_medical_history"].includes(dbKey)) {
          if (value === "예") {
            value = true;
          } else if (value === "아니오") {
            value = false;
          } else {
            value = null; // Handle cases where it might not be 예/아니오
          }
        }
        // Removed scale conversions as functional limitations are now numbers (1-5 or 1-4) directly from the component
        // or other values are now Korean strings
        else if (value === "") {
           value = null // Convert empty strings to null for optional text fields
        }
        // Ensure numeric values from sliders are stored as numbers
        else if (["c11_max_pain_vas", "c12_avg_pain_vas"].includes(dbKey) && typeof value === 'string') {
          value = parseInt(value, 10); // Parse string number from slider state if necessary
          if (isNaN(value)) value = null; // Handle parsing errors
        }
        // Ensure functional limitation scores are numbers
        else if (dbKey.startsWith("d") && typeof value === 'string') {
           // Attempt to parse functional limitation scores if they somehow ended up as strings
           const numValue = parseInt(value, 10);
           value = isNaN(numValue) ? value : numValue; // Keep original string if not a number, otherwise use parsed number
        }


        dataToInsert[dbKey] = value
      }
    }

    try {
      const { data, error } = await supabase
        .from("surveys")
        .insert([dataToInsert]) // insert expects an array of objects
        .select("id") // Select the ID of the newly inserted row
        .single() // Expecting a single row back

      if (error) {
        throw error // Throw error to be caught by the catch block
      }

      if (data && data.id) {
        // Don't navigate here anymore, just show success and return ID
        toast.success("제출 완료", {
          description: "설문이 성공적으로 제출되었습니다. 결과를 분석 중입니다.",
        })
        return data.id // Return the ID on success
      } else {
        // Handle case where insert succeeded but no ID was returned
        throw new Error("제출 후 ID를 받지 못했습니다.")
      }
    } catch (error: any) {
      console.error("Error submitting survey to Supabase:", error)
      toast.error("제출 오류", {
        description: `설문 제출 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}. 잠시 후 다시 시도해주세요.`,
        duration: 5000,
      })
      return null // Return null on failure
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepConfig = steps[currentStep]
  const CurrentStepComponent = currentStepConfig.component
  const currentStepKey = currentStepConfig.key

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
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>
                  진행률: {answeredQuestions} / {totalQuestions} 문항 ({Math.round(progress)}%)
                </span>
                <span>
                  단계: {currentStep + 1} / {steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Removed the static validation error Alert */}
            <h2 className="text-xl font-semibold mb-4">{currentStepConfig.title}</h2>
            <TooltipProvider> {/* TooltipProvider로 감싸기 */}
              <CurrentStepComponent
                // Pass necessary props to the step component
                key={currentStepKey} // Ensure component re-mounts or updates correctly if needed
              stepKey={currentStepKey}
              data={surveyData[currentStepKey]}
              onValidatedSubmit={handleValidatedSubmit}
              onValidationFail={handleValidationFail}
                reportStatus={handleReportStatus}
                validationTrigger={validationTrigger}
              />
            </TooltipProvider> {/* TooltipProvider 닫기 */}
          </CardContent>

          {/* Validation Error Alert Dialog */}
          <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
            <AlertDialogContent className="bg-red-100 border-red-500 text-red-900">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-700" />
                  응답 필요
                </AlertDialogTitle>
                <AlertDialogDescription className="text-red-800">
                  현재 페이지의 모든 필수 질문에 답변해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {/* Add a button to manually close if needed, or rely on timeout */}
                <AlertDialogAction onClick={closeValidationAlert} className="bg-red-600 hover:bg-red-700">
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 이전
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={triggerStepValidation} disabled={isSubmitting}>
                다음 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={triggerStepValidation} disabled={isSubmitting}>
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
