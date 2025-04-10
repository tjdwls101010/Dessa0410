"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react" // Added useRef
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface StepStatus {
  total: number
  answered: number
}

interface PainCharacteristicsStepProps {
  stepKey: string
  data: any
  onValidatedSubmit: (stepKey: string, data: any) => void
  onValidationFail: () => void
  reportStatus: (stepKey: string, status: StepStatus) => void
  validationTrigger: number
}

// Define which fields are required for this step
const requiredFields = [
  "primaryPainLocation",
  "secondaryPainLocations", // Array, check length > 0 or includes 'none'
  "painDuration",
  "painTypes", // Array, check length > 0
  "hasRadiatingPain",
  "hasTouchSensitivity",
  "hasSensoryMotorChanges",
]
const baseTotalQuestions = requiredFields.length // Base count

export function PainCharacteristicsStep({
  stepKey,
  data,
  onValidatedSubmit,
  onValidationFail,
  reportStatus,
  validationTrigger,
}: PainCharacteristicsStepProps) {
  const [formData, setFormData] = useState({
    primaryPainLocation: data.primaryPainLocation || "",
    otherPrimaryLocation: data.otherPrimaryLocation || "",
    secondaryPainLocations: data.secondaryPainLocations || [],
    otherSecondaryLocation: data.otherSecondaryLocation || "",
    painDuration: data.painDuration || "",
    painTypes: data.painTypes || [],
    otherPainType: data.otherPainType || "",
    hasRadiatingPain: data.hasRadiatingPain || "",
    hasTouchSensitivity: data.hasTouchSensitivity || "",
    hasSensoryMotorChanges: data.hasSensoryMotorChanges || "",
  })

  const handlePrimaryLocationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryPainLocation: value,
      // Clear otherPrimaryLocation if primary location changes from '기타'
      ...(value !== "기타" && { otherPrimaryLocation: "" }),
      // Ensure primary location is not in secondary locations if selected
      secondaryPainLocations: value ? prev.secondaryPainLocations.filter((loc: string) => loc !== value) : prev.secondaryPainLocations,
    }))
  }

  const handleSecondaryLocationChange = (locationLabel: string, checked: boolean) => { // Use label
    setFormData((prev) => {
      let newSecondaryLocations: string[]

      if (locationLabel === "없음") { // Check against Korean label
        // If '없음' is checked, clear all others and set to ['없음']
        // If '없음' is unchecked, clear '없음'
        newSecondaryLocations = checked ? ["없음"] : []
      } else {
        // Filter out '없음' if any other location is checked
        const currentLocations = prev.secondaryPainLocations.filter((loc: string) => loc !== "없음")
        newSecondaryLocations = checked
          ? [...currentLocations, locationLabel]
          : currentLocations.filter((label: string) => label !== locationLabel) // Use label
      }

      return {
        ...prev,
        secondaryPainLocations: newSecondaryLocations,
        // Clear otherSecondaryLocation if '기타' is unchecked or '없음' is checked
        ...(((locationLabel === "기타" && !checked) || (locationLabel === "없음" && checked)) && {
          otherSecondaryLocation: "",
        }),
      }
    })
  }

  const handlePainTypeChange = (typeLabel: string, checked: boolean) => { // Use label
    setFormData((prev) => {
      const currentTypes = prev.painTypes
      const newPainTypes = checked ? [...currentTypes, typeLabel] : currentTypes.filter((label: string) => label !== typeLabel) // Use label

      return {
        ...prev,
        painTypes: newPainTypes,
        // Clear otherPainType if '기타' is unchecked
        ...(typeLabel === "기타" && !checked && { otherPainType: "" }),
      }
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validation logic
  const validateStep = useCallback(() => {
    // Removed console logs
    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData];
      let fieldIsValid = true;
      if (Array.isArray(value)) {
        if (value.length === 0) {
          fieldIsValid = false;
        }
      } else if (!value) {
        fieldIsValid = false;
      }
      if (!fieldIsValid) return false;
    }
    // Conditional validation
    if (formData.primaryPainLocation === "기타" && !formData.otherPrimaryLocation) return false; // Check Korean
    if (formData.secondaryPainLocations.includes("기타") && !formData.otherSecondaryLocation) return false; // Check Korean
    if (formData.painTypes.includes("기타") && !formData.otherPainType) return false; // Check Korean
    // Removed console logs
    return true;
  }, [formData]);

  // Report status effect
  useEffect(() => {
    let answeredCount = 0
    let currentTotal = baseTotalQuestions

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (Array.isArray(value)) {
        if (value.length > 0) answeredCount++
      } else if (value) {
        answeredCount++
      }
    })


    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]
      if (Array.isArray(value)) {
        if (value.length > 0) answeredCount++
      } else if (value) {
        answeredCount++
      }
    })

    // Adjust total and answered count for conditional 'other' fields
    if (formData.primaryPainLocation === "기타") { // Check Korean
      currentTotal++
      if (formData.otherPrimaryLocation) answeredCount++
    }
    if (formData.secondaryPainLocations.includes("기타")) { // Check Korean
      currentTotal++
      if (formData.otherSecondaryLocation) answeredCount++
    }
    if (formData.painTypes.includes("기타")) { // Check Korean
      currentTotal++
      if (formData.otherPainType) answeredCount++
    }

    // Ensure answered count doesn't exceed total due to conditional logic overlap
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

  const painLocations = [
    { id: "neck", label: "목" },
    { id: "shoulder", label: "어깨" },
    { id: "upperBack", label: "등(날개뼈 주변)" },
    { id: "lowerBack", label: "허리" },
    { id: "pelvis", label: "골반/엉덩이" },
    { id: "knee", label: "무릎" },
    { id: "ankle", label: "발목/발" },
    { id: "elbow", label: "팔꿈치" },
    { id: "wrist", label: "손목/손" },
    { id: "other", label: "기타" },
  ]

  const painTypes = [
    { id: "throbbing", label: "욱신거림 / 쑤심" },
    { id: "stiffness", label: "뻐근함 / 결림 / 뻣뻣함" },
    { id: "burning", label: "타는 듯한 느낌 / 화끈거림" },
    { id: "cold", label: "차갑거나 시린 느낌" },
    { id: "electric", label: "전기가 오듯 찌릿함 / 깜짝 놀람" },
    { id: "numbness", label: "저림 / 먹먹함 / 감각이 둔함" },
    { id: "tingling", label: "개미가 기어가는 듯한 느낌 / 간질거림" },
    { id: "cutting", label: "칼로 베는 듯함 / 끊어질 듯함" },
    { id: "other", label: "기타" },
  ]

  return (
    // Remove form tag, use div instead
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold">4. 현재 가장 불편하거나 통증을 느끼는 주된 부위는 어디입니까?</Label>
        <RadioGroup
          value={formData.primaryPainLocation}
          onValueChange={handlePrimaryLocationChange}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          required
        >
          {painLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              {/* Use location.label as value */}
              <RadioGroupItem value={location.label} id={`${stepKey}-primary-${location.id}`} />
              <Label htmlFor={`${stepKey}-primary-${location.id}`}>{location.label}</Label>
            </div>
          ))}
        </RadioGroup>

        {formData.primaryPainLocation === "기타" && ( // Check Korean
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherPrimaryLocation`}>기타 통증 부위를 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherPrimaryLocation`}
              value={formData.otherPrimaryLocation}
              onChange={(e) => handleChange("otherPrimaryLocation", e.target.value)}
              placeholder="기타 통증 부위 입력"
              required={formData.primaryPainLocation === "기타"} // Check Korean
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">5. 다른 불편한 부위가 있다면 모두 선택해 주십시오. (없으면 '없음' 선택)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {painLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepKey}-secondary-${location.id}`}
                // Check against location.label
                checked={formData.secondaryPainLocations.includes(location.label)}
                // Pass location.label to handler
                onCheckedChange={(checked) => handleSecondaryLocationChange(location.label, checked === true)}
                // Disable based on location.label and Korean "없음"
                disabled={formData.primaryPainLocation === location.label || formData.secondaryPainLocations.includes("없음")}
              />
              <Label
                htmlFor={`${stepKey}-secondary-${location.id}`}
                className={
                  // Check based on location.label and Korean "없음"
                  formData.primaryPainLocation === location.label || formData.secondaryPainLocations.includes("없음")
                    ? "text-muted-foreground"
                    : ""
                }
              >
                {location.label}
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${stepKey}-secondary-none`}
              // Check against Korean "없음"
              checked={formData.secondaryPainLocations.includes("없음")}
              // Pass Korean "없음" to handler
              onCheckedChange={(checked) => handleSecondaryLocationChange("없음", checked === true)}
            />
            <Label htmlFor={`${stepKey}-secondary-none`}>없음</Label>
          </div>
        </div>

        {/* Check against Korean "기타" and "없음" */}
        {formData.secondaryPainLocations.includes("기타") && !formData.secondaryPainLocations.includes("없음") && (
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherSecondaryLocation`}>기타 통증 부위를 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherSecondaryLocation`}
              value={formData.otherSecondaryLocation}
              onChange={(e) => handleChange("otherSecondaryLocation", e.target.value)}
              placeholder="기타 통증 부위 입력"
              required={formData.secondaryPainLocations.includes("기타")} // Check Korean
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">6. 통증은 언제부터 시작되었습니까?</Label>
        <RadioGroup
          value={formData.painDuration}
          onValueChange={(value) => handleChange("painDuration", value)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          required
        >
          {/* Use Korean labels as values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="최근 1주 이내" id={`${stepKey}-duration-lessThan1Week`} />
            <Label htmlFor={`${stepKey}-duration-lessThan1Week`}>최근 1주 이내</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1주~1개월" id={`${stepKey}-duration-1WeekTo1Month`} />
            <Label htmlFor={`${stepKey}-duration-1WeekTo1Month`}>1주~1개월</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1개월~3개월" id={`${stepKey}-duration-1MonthTo3Months`} />
            <Label htmlFor={`${stepKey}-duration-1MonthTo3Months`}>1개월~3개월</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3개월~6개월" id={`${stepKey}-duration-3MonthsTo6Months`} />
            <Label htmlFor={`${stepKey}-duration-3MonthsTo6Months`}>3개월~6개월</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6개월 이상" id={`${stepKey}-duration-moreThan6Months`} />
            <Label htmlFor={`${stepKey}-duration-moreThan6Months`}>6개월 이상</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">7. 통증의 양상은 어떻습니까? (중복 선택 가능)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {painTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepKey}-painType-${type.id}`}
                // Check against type.label
                checked={formData.painTypes.includes(type.label)}
                // Pass type.label to handler
                onCheckedChange={(checked) => handlePainTypeChange(type.label, checked === true)}
              />
              <Label htmlFor={`${stepKey}-painType-${type.id}`}>{type.label}</Label>
            </div>
          ))}
        </div>
        {/* Add required attribute to Checkbox group implicitly via validation logic */}

        {formData.painTypes.includes("기타") && ( // Check Korean
          <div className="mt-3 space-y-2">
            <Label htmlFor={`${stepKey}-otherPainType`}>기타 통증 양상을 입력해주세요</Label>
            <Input
              id={`${stepKey}-otherPainType`}
              value={formData.otherPainType}
              onChange={(e) => handleChange("otherPainType", e.target.value)}
              placeholder="기타 통증 양상 입력"
              required={formData.painTypes.includes("기타")} // Check Korean
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">8. 통증이 팔이나 다리로 뻗치는 느낌(방사통)이 있습니까?</Label>
        <RadioGroup
          value={formData.hasRadiatingPain}
          onValueChange={(value) => handleChange("hasRadiatingPain", value)}
          className="flex flex-wrap gap-4"
          required
        >
          {/* Use Korean values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="예" id={`${stepKey}-radiatingPain-yes`} />
            <Label htmlFor={`${stepKey}-radiatingPain-yes`}>예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="아니오" id={`${stepKey}-radiatingPain-no`} />
            <Label htmlFor={`${stepKey}-radiatingPain-no`}>아니오</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">9. 통증 부위를 만지거나 스치기만 해도 불쾌하거나 아픈 느낌이 있습니까?</Label>
        <RadioGroup
          value={formData.hasTouchSensitivity}
          onValueChange={(value) => handleChange("hasTouchSensitivity", value)}
          className="flex flex-wrap gap-4"
          required
        >
          {/* Use Korean values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="예" id={`${stepKey}-touchSensitivity-yes`} />
            <Label htmlFor={`${stepKey}-touchSensitivity-yes`}>예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="아니오" id={`${stepKey}-touchSensitivity-no`} />
            <Label htmlFor={`${stepKey}-touchSensitivity-no`}>아니오</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          10. 통증 외에 감각 이상(둔하거나 예민해짐)이나 근력 약화가 느껴지는 부위가 있습니까?
        </Label>
        <RadioGroup
          value={formData.hasSensoryMotorChanges}
          onValueChange={(value) => handleChange("hasSensoryMotorChanges", value)}
          className="flex flex-wrap gap-4"
          required
        >
          {/* Use Korean values */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="예" id={`${stepKey}-sensoryMotorChanges-yes`} />
            <Label htmlFor={`${stepKey}-sensoryMotorChanges-yes`}>예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="아니오" id={`${stepKey}-sensoryMotorChanges-no`} />
            <Label htmlFor={`${stepKey}-sensoryMotorChanges-no`}>아니오</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Removed the submit button */}
    </div>
  )
}
