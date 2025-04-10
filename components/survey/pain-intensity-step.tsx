"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface PainIntensityStepProps {
  data: any
  onComplete: (data: any) => void
}

export function PainIntensityStep({ data, onComplete }: PainIntensityStepProps) {
  const [formData, setFormData] = useState({
    maxPainIntensity: data.maxPainIntensity || 5,
    avgPainIntensity: data.avgPainIntensity || 3,
    painTriggers: data.painTriggers || [],
    otherPainTrigger: data.otherPainTrigger || "",
    painRelievers: data.painRelievers || [],
    otherPainReliever: data.otherPainReliever || "",
  })

  const handlePainTriggerChange = (triggerId: string, checked: boolean) => {
    setFormData({
      ...formData,
      painTriggers: checked
        ? [...formData.painTriggers, triggerId]
        : formData.painTriggers.filter((id) => id !== triggerId),
    })
  }

  const handlePainRelieverChange = (relieverId: string, checked: boolean) => {
    setFormData({
      ...formData,
      painRelievers: checked
        ? [...formData.painRelievers, relieverId]
        : formData.painRelievers.filter((id) => id !== relieverId),
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base">
          11. 지난 일주일간 느낀 통증 중 가장 심했을 때의 통증 강도는 어느 정도였습니까?
        </Label>
        <div className="space-y-3">
          <Slider
            value={[formData.maxPainIntensity]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => handleChange("maxPainIntensity", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>통증 없음</span>
            <span className="text-center">중간 통증</span>
            <span>극심한 통증</span>
          </div>
          <div className="text-center font-medium mt-2">선택한 통증 강도: {formData.maxPainIntensity}</div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">12. 지난 일주일간 평균적인 통증 강도는 어느 정도였습니까?</Label>
        <div className="space-y-3">
          <Slider
            value={[formData.avgPainIntensity]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => handleChange("avgPainIntensity", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>통증 없음</span>
            <span className="text-center">중간 통증</span>
            <span>극심한 통증</span>
          </div>
          <div className="text-center font-medium mt-2">선택한 통증 강도: {formData.avgPainIntensity}</div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">13. 통증을 더 심하게 만드는 활동이나 자세는 무엇입니까? (중복 선택 가능)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {painTriggers.map((trigger) => (
            <div key={trigger.id} className="flex items-center space-x-2">
              <Checkbox
                id={`trigger-${trigger.id}`}
                checked={formData.painTriggers.includes(trigger.id)}
                onCheckedChange={(checked) => handlePainTriggerChange(trigger.id, checked === true)}
              />
              <Label htmlFor={`trigger-${trigger.id}`}>{trigger.label}</Label>
            </div>
          ))}
        </div>

        {formData.painTriggers.includes("other") && (
          <div className="space-y-2">
            <Label htmlFor="otherPainTrigger">기타 통증 유발 요인을 입력해주세요</Label>
            <Input
              id="otherPainTrigger"
              value={formData.otherPainTrigger}
              onChange={(e) => handleChange("otherPainTrigger", e.target.value)}
              placeholder="기타 통증 유발 요인 입력"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base">14. 통증을 완화시키는 활동이나 자세는 무엇입니까? (중복 선택 가능)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {painRelievers.map((reliever) => (
            <div key={reliever.id} className="flex items-center space-x-2">
              <Checkbox
                id={`reliever-${reliever.id}`}
                checked={formData.painRelievers.includes(reliever.id)}
                onCheckedChange={(checked) => handlePainRelieverChange(reliever.id, checked === true)}
              />
              <Label htmlFor={`reliever-${reliever.id}`}>{reliever.label}</Label>
            </div>
          ))}
        </div>

        {formData.painRelievers.includes("other") && (
          <div className="space-y-2">
            <Label htmlFor="otherPainReliever">기타 통증 완화 방법을 입력해주세요</Label>
            <Input
              id="otherPainReliever"
              value={formData.otherPainReliever}
              onChange={(e) => handleChange("otherPainReliever", e.target.value)}
              placeholder="기타 통증 완화 방법 입력"
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

