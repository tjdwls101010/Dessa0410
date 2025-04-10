"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface RedFlagsStepProps {
  data: any
  onComplete: (data: any) => void
}

export function RedFlagsStep({ data, onComplete }: RedFlagsStepProps) {
  const [formData, setFormData] = useState({
    redFlags: data.redFlags || [],
  })

  const handleRedFlagChange = (flagId: string, checked: boolean) => {
    if (flagId === "none" && checked) {
      // If "none" is selected, deselect all other options
      setFormData({
        ...formData,
        redFlags: ["none"],
      })
    } else {
      setFormData({
        ...formData,
        redFlags: checked
          ? [...formData.redFlags.filter((id) => id !== "none"), flagId]
          : formData.redFlags.filter((id) => id !== flagId),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const redFlagItems = [
    { id: "weightLoss", label: "최근 설명할 수 없는 급격한 체중 감소" },
    { id: "nightPain", label: "밤에 통증이 너무 심해 잠을 깨고, 자세를 바꿔도 호전되지 않음" },
    { id: "bladderBowelIssues", label: "대변이나 소변을 가리는 데 문제가 생김 (예: 변실금, 요실금, 배뇨 곤란)" },
    { id: "weakness", label: "다리나 팔의 힘이 갑자기 빠지거나 마비되는 느낌" },
    { id: "fever", label: "열이 나거나 오한이 드는 증상이 통증과 함께 나타남" },
    { id: "recentInjury", label: "최근 심하게 다치거나 넘어진 적이 있음" },
    { id: "cancerHistory", label: "암 병력이 있음" },
    { id: "none", label: "해당 사항 없음" },
  ]

  // Check if any red flags are selected (except "none")
  const hasRedFlags = formData.redFlags.some((flag) => flag !== "none") || formData.redFlags.length === 0

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base">33. 다음 중 하나 이상 해당 사항이 있습니까? (중복 선택 가능)</Label>
        <div className="grid grid-cols-1 gap-3">
          {redFlagItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`redFlag-${item.id}`}
                checked={formData.redFlags.includes(item.id)}
                onCheckedChange={(checked) => handleRedFlagChange(item.id, checked === true)}
              />
              <Label htmlFor={`redFlag-${item.id}`}>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {hasRedFlags && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>주의 필요</AlertTitle>
          <AlertDescription>
            선택하신 항목 중 즉시 의료 상담이 필요할 수 있는 증상이 포함되어 있습니다. 가능한 빨리 의료 전문가와
            상담하시기 바랍니다.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}

