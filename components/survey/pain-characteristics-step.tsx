"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface PainCharacteristicsStepProps {
  data: any
  onComplete: (data: any) => void
}

export function PainCharacteristicsStep({ data, onComplete }: PainCharacteristicsStepProps) {
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
    setFormData({
      ...formData,
      primaryPainLocation: value,
    })
  }

  const handleSecondaryLocationChange = (locationId: string, checked: boolean) => {
    setFormData({
      ...formData,
      secondaryPainLocations: checked
        ? [...formData.secondaryPainLocations, locationId]
        : formData.secondaryPainLocations.filter((id) => id !== locationId),
    })
  }

  const handlePainTypeChange = (typeId: string, checked: boolean) => {
    setFormData({
      ...formData,
      painTypes: checked ? [...formData.painTypes, typeId] : formData.painTypes.filter((id) => id !== typeId),
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base">4. 현재 가장 불편하거나 통증을 느끼는 주된 부위는 어디입니까?</Label>
        <RadioGroup
          value={formData.primaryPainLocation}
          onValueChange={handlePrimaryLocationChange}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {painLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <RadioGroupItem value={location.id} id={`primary-${location.id}`} />
              <Label htmlFor={`primary-${location.id}`}>{location.label}</Label>
            </div>
          ))}
        </RadioGroup>

        {formData.primaryPainLocation === "other" && (
          <div className="space-y-2">
            <Label htmlFor="otherPrimaryLocation">기타 통증 부위를 입력해주세요</Label>
            <Input
              id="otherPrimaryLocation"
              value={formData.otherPrimaryLocation}
              onChange={(e) => handleChange("otherPrimaryLocation", e.target.value)}
              placeholder="기타 통증 부위 입력"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base">5. 다른 불편한 부위가 있다면 모두 선택해 주십시오.</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {painLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <Checkbox
                id={`secondary-${location.id}`}
                checked={formData.secondaryPainLocations.includes(location.id)}
                onCheckedChange={(checked) => handleSecondaryLocationChange(location.id, checked === true)}
                disabled={formData.primaryPainLocation === location.id}
              />
              <Label htmlFor={`secondary-${location.id}`}>{location.label}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="secondary-none"
              checked={formData.secondaryPainLocations.includes("none")}
              onCheckedChange={(checked) => handleSecondaryLocationChange("none", checked === true)}
            />
            <Label htmlFor="secondary-none">없음</Label>
          </div>
        </div>

        {formData.secondaryPainLocations.includes("other") && (
          <div className="space-y-2">
            <Label htmlFor="otherSecondaryLocation">기타 통증 부위를 입력해주세요</Label>
            <Input
              id="otherSecondaryLocation"
              value={formData.otherSecondaryLocation}
              onChange={(e) => handleChange("otherSecondaryLocation", e.target.value)}
              placeholder="기타 통증 부위 입력"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base">6. 통증은 언제부터 시작되었습니까?</Label>
        <RadioGroup
          value={formData.painDuration}
          onValueChange={(value) => handleChange("painDuration", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lessThan1Week" id="duration-lessThan1Week" />
            <Label htmlFor="duration-lessThan1Week">최근 1주 이내</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1WeekTo1Month" id="duration-1WeekTo1Month" />
            <Label htmlFor="duration-1WeekTo1Month">1주~1개월</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1MonthTo3Months" id="duration-1MonthTo3Months" />
            <Label htmlFor="duration-1MonthTo3Months">1개월~3개월</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3MonthsTo6Months" id="duration-3MonthsTo6Months" />
            <Label htmlFor="duration-3MonthsTo6Months">3개월~6개월</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moreThan6Months" id="duration-moreThan6Months" />
            <Label htmlFor="duration-moreThan6Months">6개월 이상</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">7. 통증의 양상은 어떻습니까? (중복 선택 가능)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {painTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`painType-${type.id}`}
                checked={formData.painTypes.includes(type.id)}
                onCheckedChange={(checked) => handlePainTypeChange(type.id, checked === true)}
              />
              <Label htmlFor={`painType-${type.id}`}>{type.label}</Label>
            </div>
          ))}
        </div>

        {formData.painTypes.includes("other") && (
          <div className="space-y-2">
            <Label htmlFor="otherPainType">기타 통증 양상을 입력해주세요</Label>
            <Input
              id="otherPainType"
              value={formData.otherPainType}
              onChange={(e) => handleChange("otherPainType", e.target.value)}
              placeholder="기타 통증 양상 입력"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base">8. 통증이 팔이나 다리로 뻗치는 느낌(방사통)이 있습니까?</Label>
        <RadioGroup
          value={formData.hasRadiatingPain}
          onValueChange={(value) => handleChange("hasRadiatingPain", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="radiatingPain-yes" />
            <Label htmlFor="radiatingPain-yes">예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="radiatingPain-no" />
            <Label htmlFor="radiatingPain-no">아니오</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">9. 통증 부위를 만지거나 스치기만 해도 불쾌하거나 아픈 느낌이 있습니까?</Label>
        <RadioGroup
          value={formData.hasTouchSensitivity}
          onValueChange={(value) => handleChange("hasTouchSensitivity", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="touchSensitivity-yes" />
            <Label htmlFor="touchSensitivity-yes">예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="touchSensitivity-no" />
            <Label htmlFor="touchSensitivity-no">아니오</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          10. 통증 외에 감각 이상(둔하거나 예민해짐)이나 근력 약화가 느껴지는 부위가 있습니까?
        </Label>
        <RadioGroup
          value={formData.hasSensoryMotorChanges}
          onValueChange={(value) => handleChange("hasSensoryMotorChanges", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="sensoryMotorChanges-yes" />
            <Label htmlFor="sensoryMotorChanges-yes">예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="sensoryMotorChanges-no" />
            <Label htmlFor="sensoryMotorChanges-no">아니오</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}

