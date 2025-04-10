"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface StepStatus {
  total: number
  answered: number
}

interface FunctionalLimitationsStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number
}

// All fields in this step are required
const requiredFields = [
  "personalHygiene",
  "dressing",
  "lifting",
  "walking",
  "sitting",
  "standing",
  "sleeping",
  "concentration",
  "workStudy",
  "transportation",
  "leisure",
  "emotionalState",
]
const totalQuestions = requiredFields.length

// Define numeric values for options
const generalScale = [
  { value: 1, label: "어려움 없음" },
  { value: 2, label: "약간 어려움" },
  { value: 3, label: "상당히 어려움" },
  { value: 4, label: "매우 심한 어려움" },
  { value: 5, label: "도움 없이는 불가능" },
]

const walkingScale = [
  { value: 1, label: "1km 이상 문제 없음" },
  { value: 2, label: "500m~1km 정도 걸으면 불편" },
  { value: 3, label: "100m~500m 정도 걸으면 불편" },
  { value: 4, label: "100m 이내만 가능" },
  { value: 5, label: "걷기 매우 힘듦 또는 불가능" },
]

const sittingStandingScale = [
  { value: 1, label: "1시간 이상 문제 없음" },
  { value: 2, label: "30분~1시간 정도 앉으면/서 있으면 불편" }, // Adjusted label slightly for reuse
  { value: 3, label: "10분~30분 정도 앉으면/서 있으면 불편" }, // Adjusted label slightly for reuse
  { value: 4, label: "10분 미만만 가능" },
  { value: 5, label: "앉기/서 있기 매우 힘듦 또는 불가능" }, // Adjusted label slightly for reuse
]

const sleepingScale = [
    { value: 1, label: "전혀 방해받지 않음" },
    { value: 2, label: "약간 방해받음" },
    { value: 3, label: "상당히 방해받음" },
    { value: 4, label: "매우 심하게 방해받음" },
    { value: 5, label: "거의 잠을 못 잠" },
]

const concentrationScale = [
    { value: 1, label: "전혀 어려움 없음" },
    { value: 2, label: "약간 어려움" },
    { value: 3, label: "상당히 어려움" },
    { value: 4, label: "매우 심한 어려움" },
    { value: 5, label: "집중 거의 불가능" },
]

const workStudyScale = [
    { value: 1, label: "전혀 지장 없음" },
    { value: 2, label: "약간 지장 있음" },
    { value: 3, label: "상당히 지장 있음" },
    { value: 4, label: "매우 심한 지장 있음" },
    { value: 5, label: "업무/학업 불가능" },
]

const transportationScale = [
    { value: 1, label: "전혀 어려움 없음" },
    { value: 2, label: "약간 어려움 (짧은 거리만 가능)" },
    { value: 3, label: "상당히 어려움 (필수적인 경우만 가능)" },
    { value: 4, label: "매우 심한 어려움" },
    { value: 5, label: "운전/이동 불가능" },
]


const leisureScale = [
  { value: 1, label: "전혀 지장 없음" },
  { value: 2, label: "약간 지장 있음 (활동량/시간 줄임)" },
  { value: 3, label: "상당히 지장 있음 (거의 못함)" },
  { value: 4, label: "매우 심한 지장 있음 (전혀 못함)" },
]

const emotionalStateScale = [
  { value: 1, label: "거의 영향 없음" },
  { value: 2, label: "가끔 영향 있음" },
  { value: 3, label: "자주 영향 있음" },
  { value: 4, label: "거의 항상 영향 있음" },
]


export function FunctionalLimitationsStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: FunctionalLimitationsStepProps) {
  // Initialize state with numeric values if available, otherwise empty string
  const [formData, setFormData] = useState({
    personalHygiene: data.personalHygiene ?? "",
    dressing: data.dressing ?? "",
    lifting: data.lifting ?? "",
    walking: data.walking ?? "",
    sitting: data.sitting ?? "",
    standing: data.standing ?? "",
    sleeping: data.sleeping ?? "",
    concentration: data.concentration ?? "",
    workStudy: data.workStudy ?? "",
    transportation: data.transportation ?? "",
    leisure: data.leisure ?? "",
    emotionalState: data.emotionalState ?? "",
  })

  // Handle change, ensuring value is stored as number
  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      // Convert string value from RadioGroupItem back to number before setting state
      [field]: typeof value === 'string' ? parseInt(value, 10) : value,
    }))
  }

  // Validation logic - checks if all required fields have a numeric value
  const validateStep = useCallback(() => {
    const isValid = requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      // Check if value is a number and not empty/null/undefined
      return typeof value === 'number' && !isNaN(value);
    });
    return isValid;
  }, [formData]);

  // Report status effect
  useEffect(() => {
    const answeredCount = requiredFields.filter((field) => {
        const value = formData[field as keyof typeof formData];
        return typeof value === 'number' && !isNaN(value); // Count only if it's a valid number
    }).length;
    reportStatus(stepKey, { total: totalQuestions, answered: answeredCount })
  }, [formData, reportStatus, stepKey])

  // Ref to track the previous validation trigger value
  const prevValidationTriggerRef = useRef(validationTrigger);

  // Validation trigger effect
  useEffect(() => {
    if (validationTrigger > 0 && validationTrigger !== prevValidationTriggerRef.current) {
      if (validateStep()) {
        onValidatedSubmit(stepKey, formData);
      } else {
        onValidationFail();
      }
    }
    prevValidationTriggerRef.current = validationTrigger;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationTrigger]);

  // Helper function to render RadioGroup options
  const renderOptions = (fieldName: keyof typeof formData, scale: { value: number; label: string }[]) => (
    <RadioGroup
      // Use toString() because RadioGroup value prop expects string
      value={formData[fieldName]?.toString() ?? ""}
      // Pass numeric value directly to handleChange
      onValueChange={(value) => handleChange(fieldName, parseInt(value, 10))}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      required
    >
      {scale.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          {/* Pass numeric value as string to RadioGroupItem */}
          <RadioGroupItem value={option.value.toString()} id={`${stepKey}-${fieldName}-${option.value}`} />
          <Label htmlFor={`${stepKey}-${fieldName}-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">
        지난 일주일 동안 통증 때문에 다음 활동들에 어느 정도 어려움이 있었는지 가장 적절한 항목을 선택해 주십시오.
      </p>

      <div className="space-y-4">
        <Label className="text-base font-semibold">15. 개인 위생: (예: 세수, 양치질, 머리 감기, 샤워 등)</Label>
        {renderOptions("personalHygiene", generalScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">16. 옷 입기: (예: 상의, 하의, 양말, 신발 신기 등)</Label>
        {renderOptions("dressing", generalScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">17. 물건 들기/옮기기: (예: 가벼운 장바구니, 서류 가방 등 2-5kg 정도)</Label>
        {renderOptions("lifting", generalScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">18. 걷기:</Label>
         <RadioGroup
            value={formData.walking?.toString() ?? ""}
            onValueChange={(value) => handleChange("walking", parseInt(value, 10))}
            className="grid grid-cols-1 gap-4" // Adjusted grid layout for walking
            required
          >
            {walkingScale.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${stepKey}-walking-${option.value}`} />
                <Label htmlFor={`${stepKey}-walking-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">19. 앉아 있기:</Label>
         <RadioGroup
            value={formData.sitting?.toString() ?? ""}
            onValueChange={(value) => handleChange("sitting", parseInt(value, 10))}
            className="grid grid-cols-1 gap-4" // Adjusted grid layout
            required
          >
            {sittingStandingScale.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${stepKey}-sitting-${option.value}`} />
                {/* Adjust label slightly for sitting context */}
                <Label htmlFor={`${stepKey}-sitting-${option.value}`}>{option.label.replace('앉으면/서 있으면', '앉으면')}</Label>
              </div>
            ))}
          </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">20. 서 있기:</Label>
         <RadioGroup
            value={formData.standing?.toString() ?? ""}
            onValueChange={(value) => handleChange("standing", parseInt(value, 10))}
            className="grid grid-cols-1 gap-4" // Adjusted grid layout
            required
          >
            {sittingStandingScale.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${stepKey}-standing-${option.value}`} />
                 {/* Adjust label slightly for standing context */}
                <Label htmlFor={`${stepKey}-standing-${option.value}`}>{option.label.replace('앉으면/서 있으면', '서 있으면')}</Label>
              </div>
            ))}
          </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          21. 수면: (통증 때문에 잠들기 어렵거나, 자다가 깨거나, 숙면을 취하지 못하는 정도)
        </Label>
        {renderOptions("sleeping", sleepingScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">22. 집중력: (통증 때문에 책 읽기, 업무, 대화 등에 집중하기 어려운 정도)</Label>
        {renderOptions("concentration", concentrationScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          23. 업무 또는 학업: (통증 때문에 평소 하던 업무/학업 수행에 지장을 받는 정도)
        </Label>
        {renderOptions("workStudy", workStudyScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">24. 운전 또는 대중교통 이용:</Label>
        {renderOptions("transportation", transportationScale)}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">25. 여가 활동: (예: 가벼운 운동, 취미 활동, 친구 만나기 등)</Label>
         <RadioGroup
            value={formData.leisure?.toString() ?? ""}
            onValueChange={(value) => handleChange("leisure", parseInt(value, 10))}
            className="grid grid-cols-1 gap-4" // Adjusted grid layout
            required
          >
            {leisureScale.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${stepKey}-leisure-${option.value}`} />
                <Label htmlFor={`${stepKey}-leisure-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          26. 정서 상태: (통증 때문에 기분이 가라앉거나, 예민해지거나, 불안감을 느끼는 정도)
        </Label>
         <RadioGroup
            value={formData.emotionalState?.toString() ?? ""}
            onValueChange={(value) => handleChange("emotionalState", parseInt(value, 10))}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4" // Adjusted grid layout
            required
          >
            {emotionalStateScale.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${stepKey}-emotionalState-${option.value}`} />
                <Label htmlFor={`${stepKey}-emotionalState-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
      </div>

    </div>
  )
}
