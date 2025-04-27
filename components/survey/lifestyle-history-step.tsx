"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SurveyTooltip } from "./survey-tooltip" // SurveyTooltip 컴포넌트 import 추가

interface StepStatus {
  total: number
  answered: number
}

interface LifestyleHistoryStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number
}

// Define which fields are required for this step (base)
const requiredFields = [
  "regularExercise",
  "sittingHours",
  "posture",
  "stress",
  "previousTreatment",
  "medicalConditions",
]
const baseTotalQuestions = requiredFields.length

export function LifestyleHistoryStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: LifestyleHistoryStepProps) {
  const [formData, setFormData] = useState({
    regularExercise: data.regularExercise || "",
    exerciseType: data.exerciseType || "", // Conditional
    sittingHours: data.sittingHours || "",
    posture: data.posture || "",
    stress: data.stress || "",
    previousTreatment: data.previousTreatment || "",
    treatmentDetails: data.treatmentDetails || "", // Conditional
    medicalConditions: data.medicalConditions || "",
    conditionDetails: data.conditionDetails || "", // Conditional
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Clear conditional fields if the trigger changes to '아니오'
      ...(field === "regularExercise" && value === "아니오" && { exerciseType: "" }),
      ...(field === "previousTreatment" && value === "아니오" && { treatmentDetails: "" }),
      ...(field === "medicalConditions" && value === "아니오" && { conditionDetails: "" }),
    }))
  }

  // Validation logic
  const validateStep = useCallback(() => {
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false
      }
    }
    // Conditional validation - Use Korean "예"
    if (formData.regularExercise === "예" && !formData.exerciseType) return false
    if (formData.previousTreatment === "예" && !formData.treatmentDetails) return false
    if (formData.medicalConditions === "예" && !formData.conditionDetails) return false

    return true
  }, [formData])

  // Report status effect
  useEffect(() => {
    let answeredCount = 0
    let currentTotal = baseTotalQuestions

    requiredFields.forEach((field) => {
      if (formData[field as keyof typeof formData]) {
        answeredCount++
      }
    })

    // Adjust for conditional fields - Use Korean "예"
    if (formData.regularExercise === "예") {
      currentTotal++
      if (formData.exerciseType) answeredCount++
    }
    if (formData.previousTreatment === "예") {
      currentTotal++
      if (formData.treatmentDetails) answeredCount++
    }
    if (formData.medicalConditions === "예") {
      currentTotal++
      if (formData.conditionDetails) answeredCount++
    }

    const finalAnsweredCount = Math.min(answeredCount, currentTotal)
    reportStatus(stepKey, { total: currentTotal, answered: finalAnsweredCount })
  }, [formData, reportStatus, stepKey])

  // Ref to track the previous validation trigger value
  const prevValidationTriggerRef = useRef(validationTrigger);

  // Validation trigger effect
  useEffect(() => {
    // Only run validation if the trigger value actually changed from the previous render
    // and the new value is greater than 0 (to avoid running on initial mount with trigger=0)
    if (validationTrigger > 0 && validationTrigger !== prevValidationTriggerRef.current) {
      if (validateStep()) {
        onValidatedSubmit(stepKey, formData);
      } else {
        onValidationFail();
      }
    }
    // Update the ref to the current trigger value for the next render
    prevValidationTriggerRef.current = validationTrigger;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationTrigger]); // Keep dependencies minimal for this effect logic

  return (
    // Remove form tag
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">27. 평소 규칙적인 운동(주 2회 이상, 1회 30분 이상)을 하십니까?</Label>
          <SurveyTooltip questionId="27" />
        </div>
        <RadioGroup
          value={formData.regularExercise}
          onValueChange={(value) => handleChange("regularExercise", value)}
          className="flex flex-wrap gap-4"
          required
        >
          {/* Use Korean values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="예" id={`${stepKey}-exercise-yes`} />
            <Label htmlFor={`${stepKey}-exercise-yes`}>예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="아니오" id={`${stepKey}-exercise-no`} />
            <Label htmlFor={`${stepKey}-exercise-no`}>아니오</Label>
          </div>
        </RadioGroup>

        {formData.regularExercise === "예" && ( // Check Korean
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-exerciseType`}>주로 어떤 종류의 운동을 하십니까?</Label>
            <Input
              id={`${stepKey}-exerciseType`}
              value={formData.exerciseType}
              onChange={(e) => handleChange("exerciseType", e.target.value)}
              placeholder="운동 종류 입력"
              required={formData.regularExercise === "예"} // Check Korean
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">28. 하루 평균 앉아있는 시간은 어느 정도입니까?</Label>
          <SurveyTooltip questionId="28" />
        </div>
        <RadioGroup
          value={formData.sittingHours}
          onValueChange={(value) => handleChange("sittingHours", value)}
          className="grid grid-cols-2 gap-4"
          required
        >
          {/* Use Korean labels as values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4시간 미만" id={`${stepKey}-sitting-under4hours`} />
            <Label htmlFor={`${stepKey}-sitting-under4hours`}>4시간 미만</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-8시간" id={`${stepKey}-sitting-4to8hours`} />
            <Label htmlFor={`${stepKey}-sitting-4to8hours`}>4-8시간</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="8-12시간" id={`${stepKey}-sitting-8to12hours`} />
            <Label htmlFor={`${stepKey}-sitting-8to12hours`}>8-12시간</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="12시간 이상" id={`${stepKey}-sitting-over12hours`} />
            <Label htmlFor={`${stepKey}-sitting-over12hours`}>12시간 이상</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">29. 평소 자신의 자세(앉거나 서 있을 때)에 대해 어떻게 생각하십니까?</Label>
          <SurveyTooltip questionId="29" />
        </div>
        <RadioGroup
          value={formData.posture}
          onValueChange={(value) => handleChange("posture", value)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          required
        >
          {/* Use Korean labels as values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="매우 바르다" id={`${stepKey}-posture-veryGood`} />
            <Label htmlFor={`${stepKey}-posture-veryGood`}>매우 바르다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="대체로 바르다" id={`${stepKey}-posture-good`} />
            <Label htmlFor={`${stepKey}-posture-good`}>대체로 바르다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="보통이다" id={`${stepKey}-posture-average`} />
            <Label htmlFor={`${stepKey}-posture-average`}>보통이다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="좋지 않다" id={`${stepKey}-posture-bad`} />
            <Label htmlFor={`${stepKey}-posture-bad`}>좋지 않다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="매우 좋지 않다" id={`${stepKey}-posture-veryBad`} />
            <Label htmlFor={`${stepKey}-posture-veryBad`}>매우 좋지 않다</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">30. 최근 3개월 내 스트레스를 많이 받았다고 느끼십니까?</Label>
          <SurveyTooltip questionId="30" />
        </div>
        <RadioGroup
          value={formData.stress}
          onValueChange={(value) => handleChange("stress", value)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          required
        >
          {/* Use Korean labels as values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="매우 그렇다" id={`${stepKey}-stress-veryHigh`} />
            <Label htmlFor={`${stepKey}-stress-veryHigh`}>매우 그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="그렇다" id={`${stepKey}-stress-high`} />
            <Label htmlFor={`${stepKey}-stress-high`}>그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="보통이다" id={`${stepKey}-stress-average`} />
            <Label htmlFor={`${stepKey}-stress-average`}>보통이다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="그렇지 않다" id={`${stepKey}-stress-low`} />
            <Label htmlFor={`${stepKey}-stress-low`}>그렇지 않다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="전혀 그렇지 않다" id={`${stepKey}-stress-veryLow`} />
            <Label htmlFor={`${stepKey}-stress-veryLow`}>전혀 그렇지 않다</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">
            31. 이전에 비슷한 통증으로 진료나 치료(물리치료, 도수치료, 주사치료, 시술, 수술 등)를 받은 경험이 있습니까?
          </Label>
          <SurveyTooltip questionId="31" />
        </div>
        <RadioGroup
          value={formData.previousTreatment}
          onValueChange={(value) => handleChange("previousTreatment", value)}
          className="flex flex-wrap gap-4"
          required
        >
          {/* Use Korean values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="예" id={`${stepKey}-treatment-yes`} />
            <Label htmlFor={`${stepKey}-treatment-yes`}>예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="아니오" id={`${stepKey}-treatment-no`} />
            <Label htmlFor={`${stepKey}-treatment-no`}>아니오</Label>
          </div>
        </RadioGroup>

        {formData.previousTreatment === "예" && ( // Check Korean
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-treatmentDetails`}>어떤 치료였고 효과는 어땠습니까?</Label>
            <Textarea
              id={`${stepKey}-treatmentDetails`}
              value={formData.treatmentDetails}
              onChange={(e) => handleChange("treatmentDetails", e.target.value)}
              placeholder="치료 종류와 효과에 대해 설명해주세요"
              rows={3}
              required={formData.previousTreatment === "예"} // Check Korean
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">
            32. 현재 앓고 있거나 과거에 진단받은 주요 질환이 있습니까? (예: 당뇨, 고혈압, 류마티스 관절염, 골다공증, 암,
            디스크 질환 등)
          </Label>
          <SurveyTooltip questionId="32" />
        </div>
        <RadioGroup
          value={formData.medicalConditions}
          onValueChange={(value) => handleChange("medicalConditions", value)}
          className="flex flex-wrap gap-4"
          required
        >
          {/* Use Korean values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="예" id={`${stepKey}-conditions-yes`} />
            <Label htmlFor={`${stepKey}-conditions-yes`}>예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="아니오" id={`${stepKey}-conditions-no`} />
            <Label htmlFor={`${stepKey}-conditions-no`}>아니오</Label>
          </div>
        </RadioGroup>

        {formData.medicalConditions === "예" && ( // Check Korean
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-conditionDetails`}>어떤 질환입니까?</Label>
            <Textarea
              id={`${stepKey}-conditionDetails`}
              value={formData.conditionDetails}
              onChange={(e) => handleChange("conditionDetails", e.target.value)}
              placeholder="진단받은 질환에 대해 설명해주세요"
              rows={3}
              required={formData.medicalConditions === "예"} // Check Korean
            />
          </div>
        )}
      </div>

      {/* Removed submit button */}
    </div>
  )
}
