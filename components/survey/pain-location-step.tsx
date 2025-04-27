"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { SurveyTooltip } from "./survey-tooltip" // SurveyTooltip 컴포넌트 import 추가

interface PainLocationStepProps {
  data: any
  onComplete: (data: any) => void
}

export function PainLocationStep({ data, onComplete }: PainLocationStepProps) {
  const [formData, setFormData] = useState({
    locations: data.locations || [],
    primaryLocation: data.primaryLocation || "",
    additionalInfo: data.additionalInfo || "",
  })

  const painLocations = [
    { id: "neck", label: "목" },
    { id: "shoulder", label: "어깨" },
    { id: "upperBack", label: "등 상부" },
    { id: "lowerBack", label: "허리" },
    { id: "elbow", label: "팔꿈치" },
    { id: "wrist", label: "손목" },
    { id: "hip", label: "고관절" },
    { id: "knee", label: "무릎" },
    { id: "ankle", label: "발목" },
    { id: "other", label: "기타" },
  ]

  const handleLocationChange = (locationId: string, checked: boolean) => {
    setFormData({
      ...formData,
      locations: checked ? [...formData.locations, locationId] : formData.locations.filter((id: string) => id !== locationId), // id 타입 명시
    })
  }

  const handlePrimaryLocationChange = (locationId: string) => {
    setFormData({
      ...formData,
      primaryLocation: locationId,
    })
  }

  const handleAdditionalInfoChange = (value: string) => {
    setFormData({
      ...formData,
      additionalInfo: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center mb-4"> {/* Flex container 추가 */}
            <h3 className="text-lg font-medium">통증을 느끼는 부위를 모두 선택해주세요</h3>
            <SurveyTooltip questionId="5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {painLocations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={location.id}
                  checked={formData.locations.includes(location.id)}
                  onCheckedChange={(checked) => handleLocationChange(location.id, checked === true)}
                />
                <Label htmlFor={location.id}>{location.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 mb-4">
            <Image src="/placeholder.svg?height=256&width=256" alt="인체 도식도" fill className="object-contain" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            인체 도식도 (실제 구현 시 클릭 가능한 인체 이미지로 대체)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center"> {/* Flex container 추가 */}
          <h3 className="text-lg font-medium">가장 심한 통증을 느끼는 부위는 어디인가요?</h3>
          <SurveyTooltip questionId="4" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4"> {/* 제목과 옵션 간격 추가 */}
          {painLocations.map((location) => (
            <div key={`primary-${location.id}`} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`primary-${location.id}`}
                name="primaryLocation"
                value={location.id}
                checked={formData.primaryLocation === location.id}
                onChange={() => handlePrimaryLocationChange(location.id)}
                className="rounded-full"
              />
              <Label htmlFor={`primary-${location.id}`}>{location.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">추가 정보 (통증 부위에 대한 상세 설명)</Label>
        <Textarea
          id="additionalInfo"
          placeholder="통증 부위에 대해 더 자세히 설명해주세요. (예: 오른쪽 어깨, 왼쪽 무릎 등)"
          value={formData.additionalInfo}
          onChange={(e) => handleAdditionalInfoChange(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}

