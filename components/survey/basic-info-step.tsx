"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

interface BasicInfoStepProps {
  data: any
  onComplete: (data: any) => void
}

export function BasicInfoStep({ data, onComplete }: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    ageGroup: data.ageGroup || "",
    gender: data.gender || "",
    occupation: data.occupation || "",
    otherOccupation: data.otherOccupation || "",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">1. 귀하의 연령대는 어떻게 되십니까?</Label>
        <RadioGroup
          value={formData.ageGroup}
          onValueChange={(value) => handleChange("ageGroup", value)}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10s" id="age-10s" />
            <Label htmlFor="age-10s">10대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="20s" id="age-20s" />
            <Label htmlFor="age-20s">20대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30s" id="age-30s" />
            <Label htmlFor="age-30s">30대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="40s" id="age-40s" />
            <Label htmlFor="age-40s">40대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="50s" id="age-50s" />
            <Label htmlFor="age-50s">50대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="60s" id="age-60s" />
            <Label htmlFor="age-60s">60대</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="70s+" id="age-70s+" />
            <Label htmlFor="age-70s+">70대 이상</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">2. 귀하의 성별은 무엇입니까?</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => handleChange("gender", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="gender-male" />
            <Label htmlFor="gender-male">남성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="gender-female" />
            <Label htmlFor="gender-female">여성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="prefer-not-to-say" id="gender-not-say" />
            <Label htmlFor="gender-not-say">선택 안 함</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">3. 주로 하시는 일(직업)이나 활동은 어떤 종류에 가깝습니까?</Label>
        <RadioGroup
          value={formData.occupation}
          onValueChange={(value) => handleChange("occupation", value)}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="office" id="occupation-office" />
            <Label htmlFor="occupation-office">사무직/학생</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="service" id="occupation-service" />
            <Label htmlFor="occupation-service">서비스직</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical" id="occupation-physical" />
            <Label htmlFor="occupation-physical">육체노동</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="housewife" id="occupation-housewife" />
            <Label htmlFor="occupation-housewife">주부</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="athlete" id="occupation-athlete" />
            <Label htmlFor="occupation-athlete">운동선수</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unemployed" id="occupation-unemployed" />
            <Label htmlFor="occupation-unemployed">무직</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="occupation-other" />
            <Label htmlFor="occupation-other">기타</Label>
          </div>
        </RadioGroup>

        {formData.occupation === "other" && (
          <div className="space-y-2">
            <Label htmlFor="otherOccupation">기타 직업을 입력해주세요</Label>
            <Input
              id="otherOccupation"
              value={formData.otherOccupation}
              onChange={(e) => handleChange("otherOccupation", e.target.value)}
              placeholder="기타 직업 입력"
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

