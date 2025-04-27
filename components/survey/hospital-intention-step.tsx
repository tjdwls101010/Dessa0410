"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SurveyTooltip } from "./survey-tooltip" // SurveyTooltip 컴포넌트 import 추가

interface StepStatus {
  total: number
  answered: number
}

interface HospitalIntentionStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number
}

// Define which fields are required for this step
const requiredFields = ["consultationNeed"] // Only the first question is mandatory
const baseTotalQuestions = requiredFields.length

export function HospitalIntentionStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: HospitalIntentionStepProps) {
  const [formData, setFormData] = useState({
    consultationNeed: data.consultationNeed || "",
    treatmentInterests: data.treatmentInterests || [], // Optional field
    otherTreatmentInterest: data.otherTreatmentInterest || "", // Conditional
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTreatmentInterestChange = (treatmentLabel: string, checked: boolean) => { // Use label
    setFormData((prev) => {
      let newInterests: string[]
      // Use Korean labels for checks
      const unknownLabel = "잘 모르겠음";
      const otherLabel = "기타";
      if (treatmentLabel === unknownLabel) {
         newInterests = checked ? [unknownLabel] : []
       } else {
         const currentInterests = prev.treatmentInterests.filter((label: string) => label !== unknownLabel)
         newInterests = checked ? [...currentInterests, treatmentLabel] : currentInterests.filter((label: string) => label !== treatmentLabel)
       }
       return {
        ...prev,
        treatmentInterests: newInterests,
        // Use Korean labels for checks
        ...(((treatmentLabel === otherLabel && !checked) || (treatmentLabel === unknownLabel && checked)) && {
          otherTreatmentInterest: "",
        }),
      }
    })
  }

  // Validation logic
  const validateStep = useCallback(() => {
    // Check mandatory field
    if (!formData.consultationNeed) return false
    // Check conditional field - Use Korean "기타"
    if (formData.treatmentInterests.includes("기타") && !formData.otherTreatmentInterest) return false
    // The second question (treatmentInterests) is optional, so no need to check if it's empty unless 'other' is selected without text.
    return true
  }, [formData])

  // Report status effect
  useEffect(() => {
    let answeredCount = 0
    let currentTotal = baseTotalQuestions // Start with mandatory questions

    // Check mandatory field
    if (formData.consultationNeed) answeredCount++

    // Add optional question to total count
    currentTotal++ // For treatmentInterests group
    // Check if optional question is answered (any selection counts)
    if (formData.treatmentInterests.length > 0) {
      answeredCount++
    }

    // Adjust for conditional 'other' field within the optional question - Use Korean "기타"
    if (formData.treatmentInterests.includes("기타")) {
      currentTotal++ // Add the 'other' text input to total
      if (formData.otherTreatmentInterest) answeredCount++ // Count if filled
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

  const treatmentOptions = [
    { id: "exercise", label: "운동 치료(슈로스 등)" },
    { id: "manual", label: "도수 치료" },
    { id: "chiropractic", label: "카이로프랙틱" },
    { id: "injection", label: "주사 치료" },
    { id: "medication", label: "약물 치료" },
    { id: "examination", label: "검사(엑스레이, 인바디, 보행분석 등)" },
    { id: "other", label: "기타" },
    { id: "unknown", label: "잘 모르겠음" },
  ]

  return (
    // Remove form tag
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">34. 위 설문에 응답하면서, 전문적인 진료나 상담의 필요성을 느끼셨습니까?</Label>
          <SurveyTooltip questionId="34" />
        </div>
        <RadioGroup
          value={formData.consultationNeed}
          onValueChange={(value) => handleChange("consultationNeed", value)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          required
        >
          {/* Use Korean labels as values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="매우 그렇다" id={`${stepKey}-need-veryMuch`} />
            <Label htmlFor={`${stepKey}-need-veryMuch`}>매우 그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="그렇다" id={`${stepKey}-need-somewhat`} />
            <Label htmlFor={`${stepKey}-need-somewhat`}>그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="보통이다" id={`${stepKey}-need-neutral`} />
            <Label htmlFor={`${stepKey}-need-neutral`}>보통이다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="그렇지 않다" id={`${stepKey}-need-notReally`} />
            <Label htmlFor={`${stepKey}-need-notReally`}>그렇지 않다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="전혀 그렇지 않다" id={`${stepKey}-need-notAtAll`} />
            <Label htmlFor={`${stepKey}-need-notAtAll`}>전혀 그렇지 않다</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="text-base font-semibold">
            35. (선택) 통증 개선을 위해 어떤 종류의 치료에 관심이 있으십니까? (중복 선택 가능)
          </Label>
          <SurveyTooltip questionId="35" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {treatmentOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepKey}-treatment-${option.id}`}
                // Check against option.label
                checked={formData.treatmentInterests.includes(option.label)}
                // Pass option.label to handler
                onCheckedChange={(checked) => handleTreatmentInterestChange(option.label, checked === true)}
                // Disable based on Korean labels
                disabled={option.label !== "잘 모르겠음" && formData.treatmentInterests.includes("잘 모르겠음")}
              />
              <Label
                htmlFor={`${stepKey}-treatment-${option.id}`}
                // Style based on Korean labels
                className={option.label !== "잘 모르겠음" && formData.treatmentInterests.includes("잘 모르겠음") ? "text-muted-foreground" : ""}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Check against Korean labels */}
        {formData.treatmentInterests.includes("기타") && !formData.treatmentInterests.includes("잘 모르겠음") && (
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherTreatmentInterest`}>기타 관심 있는 치료를 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherTreatmentInterest`}
              value={formData.otherTreatmentInterest}
              onChange={(e) => handleChange("otherTreatmentInterest", e.target.value)}
              placeholder="기타 치료 입력"
              required={formData.treatmentInterests.includes("기타")} // Check Korean
            />
          </div>
        )}
      </div>

      {/* Removed submit button - Parent handles final submission */}
    </div>
  )
}
