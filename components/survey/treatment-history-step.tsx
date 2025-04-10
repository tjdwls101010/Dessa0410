"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface TreatmentHistoryStepProps {
  data: any
  onComplete: (data: any) => void
}

export function TreatmentHistoryStep({ data, onComplete }: TreatmentHistoryStepProps) {
  const [formData, setFormData] = useState({
    previousTreatments: data.previousTreatments || [],
    medicationUse: data.medicationUse || "",
    treatmentEffectiveness: data.treatmentEffectiveness || "",
    medicalHistory: data.medicalHistory || [],
    additionalInfo: data.additionalInfo || "",
  })

  const treatments = [
    { id: "medication", label: "약물 치료" },
    { id: "physicalTherapy", label: "물리치료" },
    { id: "exercise", label: "운동 치료" },
    { id: "massage", label: "마사지" },
    { id: "acupuncture", label: "침 치료" },
    { id: "chiropractic", label: "카이로프랙틱" },
    { id: "surgery", label: "수술" },
    { id: "injection", label: "주사 치료" },
    { id: "none", label: "치료 받은 적 없음" },
    { id: "other", label: "기타" },
  ]

  const medicalConditions = [
    { id: "arthritis", label: "관절염" },
    { id: "osteoporosis", label: "골다공증" },
    { id: "diabetes", label: "당뇨병" },
    { id: "hypertension", label: "고혈압" },
    { id: "heartDisease", label: "심장 질환" },
    { id: "stroke", label: "뇌졸중" },
    { id: "cancer", label: "암" },
    { id: "depression", label: "우울증" },
    { id: "anxiety", label: "불안 장애" },
    { id: "other", label: "기타" },
    { id: "none", label: "해당 사항 없음" },
  ]

  const handleTreatmentChange = (treatmentId: string, checked: boolean) => {
    if (treatmentId === "none" && checked) {
      // If "none" is selected, deselect all other options
      setFormData({
        ...formData,
        previousTreatments: ["none"],
      })
    } else {
      setFormData({
        ...formData,
        previousTreatments: checked
          ? [...formData.previousTreatments.filter((id) => id !== "none"), treatmentId]
          : formData.previousTreatments.filter((id) => id !== treatmentId),
      })
    }
  }

  const handleMedicalHistoryChange = (conditionId: string, checked: boolean) => {
    if (conditionId === "none" && checked) {
      // If "none" is selected, deselect all other options
      setFormData({
        ...formData,
        medicalHistory: ["none"],
      })
    } else {
      setFormData({
        ...formData,
        medicalHistory: checked
          ? [...formData.medicalHistory.filter((id) => id !== "none"), conditionId]
          : formData.medicalHistory.filter((id) => id !== conditionId),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label>이전에 받아본 치료가 있나요? (해당하는 항목 모두 선택)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {treatments.map((treatment) => (
            <div key={treatment.id} className="flex items-center space-x-2">
              <Checkbox
                id={treatment.id}
                checked={formData.previousTreatments.includes(treatment.id)}
                onCheckedChange={(checked) => handleTreatmentChange(treatment.id, checked === true)}
              />
              <Label htmlFor={treatment.id}>{treatment.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>현재 통증 관련 약물을 복용하고 계신가요?</Label>
        <RadioGroup
          value={formData.medicationUse}
          onValueChange={(value) => setFormData({ ...formData, medicationUse: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="med-none" />
            <Label htmlFor="med-none">복용하지 않음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasionally" id="med-occasionally" />
            <Label htmlFor="med-occasionally">가끔 복용</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regularly" id="med-regularly" />
            <Label htmlFor="med-regularly">정기적으로 복용</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id="med-multiple" />
            <Label htmlFor="med-multiple">여러 약물 복용</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>이전 치료의 효과는 어땠나요?</Label>
        <RadioGroup
          value={formData.treatmentEffectiveness}
          onValueChange={(value) => setFormData({ ...formData, treatmentEffectiveness: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="noTreatment" id="effect-noTreatment" />
            <Label htmlFor="effect-noTreatment">치료 받은 적 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="noEffect" id="effect-noEffect" />
            <Label htmlFor="effect-noEffect">효과 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slightEffect" id="effect-slightEffect" />
            <Label htmlFor="effect-slightEffect">약간 효과 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderateEffect" id="effect-moderateEffect" />
            <Label htmlFor="effect-moderateEffect">중간 정도 효과 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="significantEffect" id="effect-significantEffect" />
            <Label htmlFor="effect-significantEffect">상당한 효과 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="temporaryEffect" id="effect-temporaryEffect" />
            <Label htmlFor="effect-temporaryEffect">일시적 효과만 있음</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>관련 있을 수 있는 기존 질환이 있나요? (해당하는 항목 모두 선택)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {medicalConditions.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={condition.id}
                checked={formData.medicalHistory.includes(condition.id)}
                onCheckedChange={(checked) => handleMedicalHistoryChange(condition.id, checked === true)}
              />
              <Label htmlFor={condition.id}>{condition.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">추가 정보 (치료 이력에 대한 상세 설명)</Label>
        <Textarea
          id="additionalInfo"
          placeholder="이전 치료 경험이나 의료 이력에 대해 더 자세히 설명해주세요."
          value={formData.additionalInfo}
          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        제출 및 분석 시작
      </Button>
    </form>
  )
}

