"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

interface StepStatus {
  total: number
  answered: number
}

interface BasicInfoStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number // Counter from parent to trigger validation
}

// Define which fields are required for this step
const requiredFields = ["ageGroup", "gender", "occupation"]
const totalQuestions = requiredFields.length // Simple count for this step

export function BasicInfoStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    ageGroup: data.ageGroup || "",
    gender: data.gender || "",
    occupation: data.occupation || "",
    otherOccupation: data.otherOccupation || "", // Only required if occupation is 'other'
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Clear otherOccupation if occupation changes from 'other'
      ...(field === "occupation" && value !== "기타" && { otherOccupation: "" }), // Check against Korean value
    }))
  }

  // Function to check if all required fields are filled
  const validateStep = useCallback(() => {
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false // Validation fails if any required field is empty
      }
    }
    // Special case for 'other' occupation
    if (formData.occupation === "기타" && !formData.otherOccupation) { // Check against Korean value
      return false // Validation fails if 'other' is selected but text is empty
    }
    return true // Validation passes
  }, [formData])

  // Effect to report status whenever formData changes
  useEffect(() => {
    let answeredCount = 0
    requiredFields.forEach((field) => {
      if (formData[field as keyof typeof formData]) {
        answeredCount++
      }
    })
    // Adjust count for the conditional 'otherOccupation' field
    let currentTotal = totalQuestions
    if (formData.occupation === "기타") { // Check against Korean value
      currentTotal++ // Add 'otherOccupation' to the total count
      if (formData.otherOccupation) {
        answeredCount++ // Count it as answered if filled
      }
    }

    reportStatus(stepKey, { total: currentTotal, answered: answeredCount })
  }, [formData, reportStatus, stepKey])

  // Ref to track the previous validation trigger value
  const prevValidationTriggerRef = useRef(validationTrigger);

  // Effect to handle validation trigger from parent
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
    // Remove the form tag as submission is handled by the parent's button
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-semibold">1. 귀하의 연령대는 어떻게 되십니까?</Label>
        <RadioGroup
          value={formData.ageGroup}
          onValueChange={(value) => handleChange("ageGroup", value)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          required // Add required attribute for basic HTML5 validation indication
        >
          {/* Age group options remain unchanged */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10대" id={`${stepKey}-age-10s`} />
            <Label htmlFor={`${stepKey}-age-10s`}>10대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="20대" id={`${stepKey}-age-20s`} />
            <Label htmlFor={`${stepKey}-age-20s`}>20대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30대" id={`${stepKey}-age-30s`} />
            <Label htmlFor={`${stepKey}-age-30s`}>30대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="40대" id={`${stepKey}-age-40s`} />
            <Label htmlFor={`${stepKey}-age-40s`}>40대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="50대" id={`${stepKey}-age-50s`} />
            <Label htmlFor={`${stepKey}-age-50s`}>50대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="60대" id={`${stepKey}-age-60s`} />
            <Label htmlFor={`${stepKey}-age-60s`}>60대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="70대 이상" id={`${stepKey}-age-70s+`} />
            <Label htmlFor={`${stepKey}-age-70s+`}>70대 이상</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">2. 귀하의 성별은 무엇입니까?</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => handleChange("gender", value)}
          className="flex flex-wrap gap-4"
          required
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="남성" id={`${stepKey}-gender-male`} />
            <Label htmlFor={`${stepKey}-gender-male`}>남성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="여성" id={`${stepKey}-gender-female`} />
            <Label htmlFor={`${stepKey}-gender-female`}>여성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="선택 안 함" id={`${stepKey}-gender-not-say`} />
            <Label htmlFor={`${stepKey}-gender-not-say`}>선택 안 함</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">3. 주로 하시는 일(직업)이나 활동은 어떤 종류에 가깝습니까?</Label>
        <RadioGroup
          value={formData.occupation}
          onValueChange={(value) => handleChange("occupation", value)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          required
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="사무직/학생" id={`${stepKey}-occupation-office`} />
            <Label htmlFor={`${stepKey}-occupation-office`}>사무직/학생</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="서비스직" id={`${stepKey}-occupation-service`} />
            <Label htmlFor={`${stepKey}-occupation-service`}>서비스직</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="육체노동" id={`${stepKey}-occupation-physical`} />
            <Label htmlFor={`${stepKey}-occupation-physical`}>육체노동</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="주부" id={`${stepKey}-occupation-housewife`} />
            <Label htmlFor={`${stepKey}-occupation-housewife`}>주부</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="운동선수" id={`${stepKey}-occupation-athlete`} />
            <Label htmlFor={`${stepKey}-occupation-athlete`}>운동선수</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="무직" id={`${stepKey}-occupation-unemployed`} />
            <Label htmlFor={`${stepKey}-occupation-unemployed`}>무직</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="기타" id={`${stepKey}-occupation-other`} />
            <Label htmlFor={`${stepKey}-occupation-other`}>기타</Label>
          </div>
        </RadioGroup>

        {formData.occupation === "기타" && ( // Check against Korean value
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherOccupation`}>기타 직업을 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherOccupation`}
              value={formData.otherOccupation}
              onChange={(e) => handleChange("otherOccupation", e.target.value)}
              placeholder="기타 직업 입력"
              required={formData.occupation === "기타"} // Make required only if 'other' is selected
            />
          </div>
        )}
      </div>

      {/* Removed the submit button, parent handles navigation */}
    </div>
  )
}
