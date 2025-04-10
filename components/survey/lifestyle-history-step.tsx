"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface LifestyleHistoryStepProps {
  data: any
  onComplete: (data: any) => void
}

export function LifestyleHistoryStep({ data, onComplete }: LifestyleHistoryStepProps) {
  const [formData, setFormData] = useState({
    regularExercise: data.regularExercise || "",
    exerciseType: data.exerciseType || "",
    sittingHours: data.sittingHours || "",
    posture: data.posture || "",
    stress: data.stress || "",
    previousTreatment: data.previousTreatment || "",
    treatmentDetails: data.treatmentDetails || "",
    medicalConditions: data.medicalConditions || "",
    conditionDetails: data.conditionDetails || "",
  })

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base">27. 평소 규칙적인 운동(주 2회 이상, 1회 30분 이상)을 하십니까?</Label>
        <RadioGroup
          value={formData.regularExercise}
          onValueChange={(value) => handleChange("regularExercise", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="exercise-yes" />
            <Label htmlFor="exercise-yes">예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="exercise-no" />
            <Label htmlFor="exercise-no">아니오</Label>
          </div>
        </RadioGroup>

        {formData.regularExercise === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="exerciseType">주로 어떤 종류의 운동을 하십니까?</Label>
            <Input
              id="exerciseType"
              value={formData.exerciseType}
              onChange={(e) => handleChange("exerciseType", e.target.value)}
              placeholder="운동 종류 입력"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base">28. 하루 평균 앉아있는 시간은 어느 정도입니까?</Label>
        <RadioGroup
          value={formData.sittingHours}
          onValueChange={(value) => handleChange("sittingHours", value)}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under4hours" id="sitting-under4hours" />
            <Label htmlFor="sitting-under4hours">4시간 미만</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4to8hours" id="sitting-4to8hours" />
            <Label htmlFor="sitting-4to8hours">4-8시간</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="8to12hours" id="sitting-8to12hours" />
            <Label htmlFor="sitting-8to12hours">8-12시간</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="over12hours" id="sitting-over12hours" />
            <Label htmlFor="sitting-over12hours">12시간 이상</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">29. 평소 자신의 자세(앉거나 서 있을 때)에 대해 어떻게 생각하십니까?</Label>
        <RadioGroup
          value={formData.posture}
          onValueChange={(value) => handleChange("posture", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="veryGood" id="posture-veryGood" />
            <Label htmlFor="posture-veryGood">매우 바르다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="posture-good" />
            <Label htmlFor="posture-good">대체로 바르다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="average" id="posture-average" />
            <Label htmlFor="posture-average">보통이다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bad" id="posture-bad" />
            <Label htmlFor="posture-bad">좋지 않다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="veryBad" id="posture-veryBad" />
            <Label htmlFor="posture-veryBad">매우 좋지 않다</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">30. 최근 3개월 내 스트레스를 많이 받았다고 느끼십니까?</Label>
        <RadioGroup
          value={formData.stress}
          onValueChange={(value) => handleChange("stress", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="veryHigh" id="stress-veryHigh" />
            <Label htmlFor="stress-veryHigh">매우 그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="stress-high" />
            <Label htmlFor="stress-high">그렇다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="average" id="stress-average" />
            <Label htmlFor="stress-average">보통이다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="stress-low" />
            <Label htmlFor="stress-low">그렇지 않다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="veryLow" id="stress-veryLow" />
            <Label htmlFor="stress-veryLow">전혀 그렇지 않다</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          31. 이전에 비슷한 통증으로 진료나 치료(물리치료, 도수치료, 주사치료, 시술, 수술 등)를 받은 경험이 있습니까?
        </Label>
        <RadioGroup
          value={formData.previousTreatment}
          onValueChange={(value) => handleChange("previousTreatment", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="treatment-yes" />
            <Label htmlFor="treatment-yes">예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="treatment-no" />
            <Label htmlFor="treatment-no">아니오</Label>
          </div>
        </RadioGroup>

        {formData.previousTreatment === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="treatmentDetails">어떤 치료였고 효과는 어땠습니까?</Label>
            <Textarea
              id="treatmentDetails"
              value={formData.treatmentDetails}
              onChange={(e) => handleChange("treatmentDetails", e.target.value)}
              placeholder="치료 종류와 효과에 대해 설명해주세요"
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          32. 현재 앓고 있거나 과거에 진단받은 주요 질환이 있습니까? (예: 당뇨, 고혈압, 류마티스 관절염, 골다공증, 암,
          디스크 질환 등)
        </Label>
        <RadioGroup
          value={formData.medicalConditions}
          onValueChange={(value) => handleChange("medicalConditions", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="conditions-yes" />
            <Label htmlFor="conditions-yes">예</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="conditions-no" />
            <Label htmlFor="conditions-no">아니오</Label>
          </div>
        </RadioGroup>

        {formData.medicalConditions === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="conditionDetails">어떤 질환입니까?</Label>
            <Textarea
              id="conditionDetails"
              value={formData.conditionDetails}
              onChange={(e) => handleChange("conditionDetails", e.target.value)}
              placeholder="진단받은 질환에 대해 설명해주세요"
              rows={3}
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}

