"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SurveyTooltip } from "./survey-tooltip" // SurveyTooltip 컴포넌트 import 추가

interface StepStatus {
  total: number
  answered: number
}

interface PainIntensityStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number
}

// Define which fields are required for this step
const requiredFields = ["maxPainIntensity", "avgPainIntensity", "painTriggers", "painRelievers"]
const baseTotalQuestions = requiredFields.length // Base count

export function PainIntensityStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: PainIntensityStepProps) {
  const [formData, setFormData] = useState({
    maxPainIntensity: data.maxPainIntensity ?? 5, // Use nullish coalescing for default
    avgPainIntensity: data.avgPainIntensity ?? 5, // 기본값을 5로 수정
    painTriggers: data.painTriggers || [],
    otherPainTrigger: data.otherPainTrigger || "", // Conditional
    painRelievers: data.painRelievers || [],
    otherPainReliever: data.otherPainReliever || "", // Conditional
  })

  const handlePainTriggerChange = (triggerLabel: string, checked: boolean) => { // Use label
    setFormData((prev) => {
      let newTriggers: string[]
      // Use Korean labels for checks
      const noneLabel = "특정 활동 없음";
      const otherLabel = "기타";
      if (triggerLabel === noneLabel) {
         newTriggers = checked ? [noneLabel] : []
       } else {
         const currentTriggers = prev.painTriggers.filter((label: string) => label !== noneLabel)
         newTriggers = checked ? [...currentTriggers, triggerLabel] : currentTriggers.filter((label: string) => label !== triggerLabel)
       }
       return {
        ...prev,
        painTriggers: newTriggers,
        // Use Korean labels for checks
        ...(((triggerLabel === otherLabel && !checked) || (triggerLabel === noneLabel && checked)) && { otherPainTrigger: "" }),
      }
    })
  }

  const handlePainRelieverChange = (relieverLabel: string, checked: boolean) => { // Use label
    setFormData((prev) => {
      let newRelievers: string[]
      // Use Korean labels for checks
      const noneLabel = "완화 방법 없음";
      const otherLabel = "기타";
      if (relieverLabel === noneLabel) {
         newRelievers = checked ? [noneLabel] : []
       } else {
         const currentRelievers = prev.painRelievers.filter((label: string) => label !== noneLabel)
         newRelievers = checked ? [...currentRelievers, relieverLabel] : currentRelievers.filter((label: string) => label !== relieverLabel)
       }
       return {
        ...prev,
        painRelievers: newRelievers,
        // Use Korean labels for checks
        ...(((relieverLabel === otherLabel && !checked) || (relieverLabel === noneLabel && checked)) && { otherPainReliever: "" }),
      }
    })
  }

  const handleChange = (field: string, value: any) => {
    // Ensure slider values are numbers
    const processedValue = (field === "maxPainIntensity" || field === "avgPainIntensity") && Array.isArray(value) ? value[0] : value
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }))
  }

  // Validation logic
  const validateStep = useCallback(() => {
    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData]
      if (field === "maxPainIntensity" || field === "avgPainIntensity") {
        if (value === undefined || value === null) return false // Sliders must have a value
      } else if (Array.isArray(value)) {
        if (value.length === 0) return false // Checkbox groups must have at least one selection
      } else if (!value) {
        // This case might not be needed if all required fields are arrays or numbers
        return false
      }
    }
    // Conditional validation - Use Korean "기타"
    if (formData.painTriggers.includes("기타") && !formData.otherPainTrigger) return false
    if (formData.painRelievers.includes("기타") && !formData.otherPainReliever) return false

    return true
  }, [formData])

  // Report status effect
  useEffect(() => {
    let answeredCount = 0
    let currentTotal = baseTotalQuestions

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (field === "maxPainIntensity" || field === "avgPainIntensity") {
        // Consider sliders answered if they have a non-default value or any value if default is 0
        if (value !== undefined && value !== null) answeredCount++
      } else if (Array.isArray(value)) {
        if (value.length > 0) answeredCount++
      }
    })


    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (field === "maxPainIntensity" || field === "avgPainIntensity") {
        // Consider sliders answered if they have a non-default value or any value if default is 0
        if (value !== undefined && value !== null) answeredCount++
      } else if (Array.isArray(value)) {
        if (value.length > 0) answeredCount++
      }
    })

    // Adjust for conditional fields - Use Korean "기타"
    if (formData.painTriggers.includes("기타")) {
      currentTotal++
      if (formData.otherPainTrigger) answeredCount++
    }
    if (formData.painRelievers.includes("기타")) {
      currentTotal++
      if (formData.otherPainReliever) answeredCount++
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

  const painTriggers = [
    { id: "sitting", label: "오래 앉아있기" },
    { id: "standing", label: "오래 서 있기" },
    { id: "walking", label: "걷기" },
    { id: "movement", label: "특정 움직임(숙이거나 돌리기 등)" },
    { id: "lifting", label: "물건 들기" },
    { id: "weather", label: "날씨 변화" },
    { id: "stress", label: "스트레스" },
    { id: "none", label: "특정 활동 없음" },
    { id: "other", label: "기타" },
  ]

  const painRelievers = [
    { id: "rest", label: "휴식" },
    { id: "position", label: "특정 자세" },
    { id: "stretching", label: "스트레칭" },
    { id: "cold", label: "냉찜질" },
    { id: "heat", label: "온찜질" },
    { id: "medication", label: "약 복용" },
    { id: "none", label: "완화 방법 없음" },
    { id: "other", label: "기타" },
  ]

  return (
    // Remove form tag
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center"> {/* Flex container 추가 */}
          <Label className="text-base font-semibold">
            11. 지난 일주일간 느낀 통증 중 가장 심했을 때의 통증 강도는 어느 정도였습니까? (0=통증 없음, 10=극심한 통증)
          </Label>
          <SurveyTooltip questionId="11" />
        </div>
        <div className="space-y-3">
          <Slider
            value={[formData.maxPainIntensity]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => handleChange("maxPainIntensity", value)} // Pass array directly
            aria-label="최대 통증 강도"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
          <div className="flex justify-between text-sm px-1">
            <span>통증 없음</span>
            {/* <span className="text-center">중간 통증</span> */}
            <span>극심한 통증</span>
          </div>
          <div className="text-center font-medium text-lg mt-2">{formData.maxPainIntensity}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center"> {/* Flex container 추가 */}
          <Label className="text-base font-semibold">
            12. 지난 일주일간 평균적인 통증 강도는 어느 정도였습니까? (0=통증 없음, 10=극심한 통증)
          </Label>
          <SurveyTooltip questionId="12" />
        </div>
        <div className="space-y-3">
          <Slider
            value={[formData.avgPainIntensity]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => handleChange("avgPainIntensity", value)} // Pass array directly
            aria-label="평균 통증 강도"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
          <div className="flex justify-between text-sm px-1">
            <span>통증 없음</span>
            {/* <span className="text-center">중간 통증</span> */}
            <span>극심한 통증</span>
          </div>
          <div className="text-center font-medium text-lg mt-2">{formData.avgPainIntensity}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center"> {/* Flex container 추가 */}
          <Label className="text-base font-semibold">
            13. 통증을 더 심하게 만드는 활동이나 자세는 무엇입니까? (중복 선택 가능, 없으면 '없음' 선택)
          </Label>
          <SurveyTooltip questionId="13" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {painTriggers.map((trigger) => (
            <div key={trigger.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepKey}-trigger-${trigger.id}`}
                // Check against trigger.label
                checked={formData.painTriggers.includes(trigger.label)}
                // Pass trigger.label to handler
                onCheckedChange={(checked) => handlePainTriggerChange(trigger.label, checked === true)}
                // Disable based on Korean labels
                disabled={trigger.label !== "특정 활동 없음" && formData.painTriggers.includes("특정 활동 없음")}
              />
              <Label
                htmlFor={`${stepKey}-trigger-${trigger.id}`}
                // Style based on Korean labels
                className={trigger.label !== "특정 활동 없음" && formData.painTriggers.includes("특정 활동 없음") ? "text-muted-foreground" : ""}
              >
                {trigger.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Check against Korean labels */}
        {formData.painTriggers.includes("기타") && !formData.painTriggers.includes("특정 활동 없음") && (
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherPainTrigger`}>기타 통증 유발 요인을 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherPainTrigger`}
              value={formData.otherPainTrigger}
              onChange={(e) => handleChange("otherPainTrigger", e.target.value)}
              placeholder="기타 통증 유발 요인 입력"
              required={formData.painTriggers.includes("기타")} // Check Korean
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center"> {/* Flex container 추가 */}
          <Label className="text-base font-semibold">
            14. 통증을 완화시키는 활동이나 자세는 무엇입니까? (중복 선택 가능, 없으면 '없음' 선택)
          </Label>
          <SurveyTooltip questionId="14" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {painRelievers.map((reliever) => (
            <div key={reliever.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepKey}-reliever-${reliever.id}`}
                // Check against reliever.label
                checked={formData.painRelievers.includes(reliever.label)}
                // Pass reliever.label to handler
                onCheckedChange={(checked) => handlePainRelieverChange(reliever.label, checked === true)}
                // Disable based on Korean labels
                disabled={reliever.label !== "완화 방법 없음" && formData.painRelievers.includes("완화 방법 없음")}
              />
              <Label
                htmlFor={`${stepKey}-reliever-${reliever.id}`}
                // Style based on Korean labels
                className={reliever.label !== "완화 방법 없음" && formData.painRelievers.includes("완화 방법 없음") ? "text-muted-foreground" : ""}
              >
                {reliever.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Check against Korean labels */}
        {formData.painRelievers.includes("기타") && !formData.painRelievers.includes("완화 방법 없음") && (
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherPainReliever`}>기타 통증 완화 방법을 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherPainReliever`}
              value={formData.otherPainReliever}
              onChange={(e) => handleChange("otherPainReliever", e.target.value)}
              placeholder="기타 통증 완화 방법 입력"
              required={formData.painRelievers.includes("기타")} // Check Korean
            />
          </div>
        )}
      </div>

      {/* Removed submit button */}
    </div>
  )
}
