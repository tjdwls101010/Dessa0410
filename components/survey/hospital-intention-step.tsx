"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface HospitalIntentionStepProps {
  data: any
  onComplete: (data: any) => void
}

export function HospitalIntentionStep({ data, onComplete }: HospitalIntentionStepProps) {
  const [formData, setFormData] = useState({
    consultationNeed: data.consultationNeed || "",
    treatmentInterests: data.treatmentInterests || [],
    otherTreatmentInterest: data.otherTreatmentInterest || "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleTreatmentInterestChange = (treatmentId: string, checked: boolean) => {
    if (treatmentId === "unknown" && checked) {
      // If "unknown" is selected, deselect all other options
      setFormData({
        ...formData,
        treatmentInterests: ["unknown"],
      })
    } else {
      setFormData({
        ...formData,
        treatmentInterests: checked
          ? [...formData.treatmentInterests.filter((id) => id !== "unknown"), treatmentId]
          : formData.treatmentInterests.filter((id) => id !== treatmentId),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base">34. 위 설문에 응답하면서, 전문적인 진료나 상담의 필요성을 느끼셨습니까?</Label>
        <RadioGroup
          value={formData.consultationNeed}
          onValueChange={(value) => handleChange("consultationNeed", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="veryMuch" id="need-veryMuch" />
            <Label htmlFor="need-veryMuch">매우 그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="somewhat" id="need-somewhat" />
            <Label htmlFor="need-somewhat">그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="neutral" id="need-neutral" />
            <Label htmlFor="need-neutral">보통이다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notReally" id="need-notReally" />
            <Label htmlFor="need-notReally">그렇지 않다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notAtAll" id="need-notAtAll" />
            <Label htmlFor="need-notAtAll">전혀 그렇지 않다</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          35. (선택) 통증 개선을 위해 어떤 종류의 치료에 관심이 있으십니까? (중복 선택 가능)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {treatmentOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`treatment-${option.id}`}
                checked={formData.treatmentInterests.includes(option.id)}
                onCheckedChange={(checked) => handleTreatmentInterestChange(option.id, checked === true)}
              />
              <Label htmlFor={`treatment-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>

        {formData.treatmentInterests.includes("other") && (
          <div className="space-y-2">
            <Label htmlFor="otherTreatmentInterest">기타 관심 있는 치료를 입력해주세요</Label>
            <Input
              id="otherTreatmentInterest"
              value={formData.otherTreatmentInterest}
              onChange={(e) => handleChange("otherTreatmentInterest", e.target.value)}
              placeholder="기타 치료 입력"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        설문 완료 및 분석 시작
      </Button>
    </form>
  )
}

