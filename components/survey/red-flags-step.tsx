"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { SurveyTooltip } from "./survey-tooltip" // SurveyTooltip 컴포넌트 import 추가

interface StepStatus {
  total: number
  answered: number
}

interface RedFlagsStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number
}

// Define which fields are required for this step
const requiredFields = ["redFlags"] // The checkbox group itself is the required field
const totalQuestions = 1 // Only one question group in this step

export function RedFlagsStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: RedFlagsStepProps) {
  const [formData, setFormData] = useState({
    redFlags: data.redFlags || [],
  })

  const handleRedFlagChange = (flagLabel: string, checked: boolean) => { // Use label
    setFormData((prev) => {
      let newFlags: string[]
      // Use Korean labels for checks
      const noneLabel = "해당 사항 없음";
      if (flagLabel === noneLabel) {
         newFlags = checked ? [noneLabel] : []
       } else {
         const currentFlags = prev.redFlags.filter((label: string) => label !== noneLabel)
         newFlags = checked ? [...currentFlags, flagLabel] : currentFlags.filter((label: string) => label !== flagLabel)
       }
       return { ...prev, redFlags: newFlags }
    })
  }

  // Validation logic
  const validateStep = useCallback(() => {
    // Step is valid if at least one checkbox is checked
    return formData.redFlags.length > 0
  }, [formData])

  // Report status effect
  useEffect(() => {
    const answeredCount = formData.redFlags.length > 0 ? 1 : 0
    reportStatus(stepKey, { total: totalQuestions, answered: answeredCount })
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

  const redFlagItems = [
    { id: "weightLoss", label: "최근 설명할 수 없는 급격한 체중 감소" },
    { id: "nightPain", label: "밤에 통증이 너무 심해 잠을 깨고, 자세를 바꿔도 호전되지 않음" },
    { id: "bladderBowelIssues", label: "대변이나 소변을 가리는 데 문제가 생김 (예: 변실금, 요실금, 배뇨 곤란)" },
    { id: "weakness", label: "다리나 팔의 힘이 갑자기 빠지거나 마비되는 느낌" },
    { id: "fever", label: "열이 나거나 오한이 드는 증상이 통증과 함께 나타남" },
    { id: "recentInjury", label: "최근 심하게 다치거나 넘어진 적이 있음" },
    { id: "cancerHistory", label: "암 병력이 있음" },
    { id: "none", label: "해당 사항 없음" },
   ]

   // Check if any red flags are selected (except "해당 사항 없음")
   const hasSeriousRedFlags = formData.redFlags.some((flag: string) => flag !== "해당 사항 없음")

   return (
    // Remove form tag
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center"> {/* Flex container 추가 */}
          <Label className="text-base font-semibold">33. 다음 중 하나 이상 해당 사항이 있습니까? (중복 선택 가능)</Label>
          <SurveyTooltip questionId="33" />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4"> {/* 제목과 옵션 간격 추가 */}
          {redFlagItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepKey}-redFlag-${item.id}`}
                // Check against item.label
                checked={formData.redFlags.includes(item.label)}
                // Pass item.label to handler
                onCheckedChange={(checked) => handleRedFlagChange(item.label, checked === true)}
                // Disable based on Korean label
                disabled={item.label !== "해당 사항 없음" && formData.redFlags.includes("해당 사항 없음")}
              />
              <Label
                htmlFor={`${stepKey}-redFlag-${item.id}`}
                // Style based on Korean label
                className={item.label !== "해당 사항 없음" && formData.redFlags.includes("해당 사항 없음") ? "text-muted-foreground" : ""}
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Show warning only if a serious flag (not 'none') is selected */}
      {hasSeriousRedFlags && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>주의가 필요합니다</AlertTitle>
          <AlertDescription>
            선택하신 항목 중 즉시 의료 상담이 필요할 수 있는 증상이 포함되어 있을 수 있습니다. 결과 페이지에서 자세한
            내용을 확인하고, 필요한 경우 의료 전문가와 상담하시기 바랍니다.
          </AlertDescription>
        </Alert>
      )}

      {/* Removed submit button */}
    </div>
  )
}
