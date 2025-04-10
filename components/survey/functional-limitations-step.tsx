"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FunctionalLimitationsStepProps {
  data: any
  onComplete: (data: any) => void
}

export function FunctionalLimitationsStep({ data, onComplete }: FunctionalLimitationsStepProps) {
  const [formData, setFormData] = useState({
    personalHygiene: data.personalHygiene || "",
    dressing: data.dressing || "",
    lifting: data.lifting || "",
    walking: data.walking || "",
    sitting: data.sitting || "",
    standing: data.standing || "",
    sleeping: data.sleeping || "",
    concentration: data.concentration || "",
    workStudy: data.workStudy || "",
    transportation: data.transportation || "",
    leisure: data.leisure || "",
    emotionalState: data.emotionalState || "",
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
      <p className="text-sm text-muted-foreground italic">
        지난 일주일 동안 통증 때문에 다음 활동들에 어느 정도 어려움이 있었는지 가장 적절한 항목을 선택해 주십시오.
      </p>

      <div className="space-y-4">
        <Label className="text-base">15. 개인 위생: (예: 세수, 양치질, 머리 감기, 샤워 등)</Label>
        <RadioGroup
          value={formData.personalHygiene}
          onValueChange={(value) => handleChange("personalHygiene", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="hygiene-none" />
            <Label htmlFor="hygiene-none">어려움 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="hygiene-mild" />
            <Label htmlFor="hygiene-mild">약간 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="hygiene-moderate" />
            <Label htmlFor="hygiene-moderate">상당히 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="hygiene-severe" />
            <Label htmlFor="hygiene-severe">매우 심한 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="hygiene-impossible" />
            <Label htmlFor="hygiene-impossible">도움 없이는 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">16. 옷 입기: (예: 상의, 하의, 양말, 신발 신기 등)</Label>
        <RadioGroup
          value={formData.dressing}
          onValueChange={(value) => handleChange("dressing", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="dressing-none" />
            <Label htmlFor="dressing-none">어려움 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="dressing-mild" />
            <Label htmlFor="dressing-mild">약간 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="dressing-moderate" />
            <Label htmlFor="dressing-moderate">상당히 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="dressing-severe" />
            <Label htmlFor="dressing-severe">매우 심한 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="dressing-impossible" />
            <Label htmlFor="dressing-impossible">도움 없이는 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">17. 물건 들기/옮기기: (예: 가벼운 장바구니, 서류 가방 등 2-5kg 정도)</Label>
        <RadioGroup
          value={formData.lifting}
          onValueChange={(value) => handleChange("lifting", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="lifting-none" />
            <Label htmlFor="lifting-none">어려움 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="lifting-mild" />
            <Label htmlFor="lifting-mild">약간 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="lifting-moderate" />
            <Label htmlFor="lifting-moderate">상당히 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="lifting-severe" />
            <Label htmlFor="lifting-severe">매우 심한 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="lifting-impossible" />
            <Label htmlFor="lifting-impossible">도움 없이는 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">18. 걷기:</Label>
        <RadioGroup
          value={formData.walking}
          onValueChange={(value) => handleChange("walking", value)}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="over1km" id="walking-over1km" />
            <Label htmlFor="walking-over1km">1km 이상 문제 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="500mTo1km" id="walking-500mTo1km" />
            <Label htmlFor="walking-500mTo1km">500m~1km 정도 걸으면 불편</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="100mTo500m" id="walking-100mTo500m" />
            <Label htmlFor="walking-100mTo500m">100m~500m 정도 걸으면 불편</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under100m" id="walking-under100m" />
            <Label htmlFor="walking-under100m">100m 이내만 가능</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="walking-impossible" />
            <Label htmlFor="walking-impossible">걷기 매우 힘듦 또는 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">19. 앉아 있기:</Label>
        <RadioGroup
          value={formData.sitting}
          onValueChange={(value) => handleChange("sitting", value)}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="over1hour" id="sitting-over1hour" />
            <Label htmlFor="sitting-over1hour">1시간 이상 문제 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30minTo1hour" id="sitting-30minTo1hour" />
            <Label htmlFor="sitting-30minTo1hour">30분~1시간 정도 앉으면 불편</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10minTo30min" id="sitting-10minTo30min" />
            <Label htmlFor="sitting-10minTo30min">10분~30분 정도 앉으면 불편</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under10min" id="sitting-under10min" />
            <Label htmlFor="sitting-under10min">10분 미만만 가능</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="sitting-impossible" />
            <Label htmlFor="sitting-impossible">앉기 매우 힘듦 또는 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">20. 서 있기:</Label>
        <RadioGroup
          value={formData.standing}
          onValueChange={(value) => handleChange("standing", value)}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="over1hour" id="standing-over1hour" />
            <Label htmlFor="standing-over1hour">1시간 이상 문제 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30minTo1hour" id="standing-30minTo1hour" />
            <Label htmlFor="standing-30minTo1hour">30분~1시간 정도 서 있으면 불편</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10minTo30min" id="standing-10minTo30min" />
            <Label htmlFor="standing-10minTo30min">10분~30분 정도 서 있으면 불편</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under10min" id="standing-under10min" />
            <Label htmlFor="standing-under10min">10분 미만만 가능</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="standing-impossible" />
            <Label htmlFor="standing-impossible">서 있기 매우 힘듦 또는 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          21. 수면: (통증 때문에 잠들기 어렵거나, 자다가 깨거나, 숙면을 취하지 못하는 정도)
        </Label>
        <RadioGroup
          value={formData.sleeping}
          onValueChange={(value) => handleChange("sleeping", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="sleeping-none" />
            <Label htmlFor="sleeping-none">전혀 방해받지 않음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="sleeping-mild" />
            <Label htmlFor="sleeping-mild">약간 방해받음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="sleeping-moderate" />
            <Label htmlFor="sleeping-moderate">상당히 방해받음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="sleeping-severe" />
            <Label htmlFor="sleeping-severe">매우 심하게 방해받음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="sleeping-impossible" />
            <Label htmlFor="sleeping-impossible">거의 잠을 못 잠</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">22. 집중력: (통증 때문에 책 읽기, 업무, 대화 등에 집중하기 어려운 정도)</Label>
        <RadioGroup
          value={formData.concentration}
          onValueChange={(value) => handleChange("concentration", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="concentration-none" />
            <Label htmlFor="concentration-none">전혀 어려움 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="concentration-mild" />
            <Label htmlFor="concentration-mild">약간 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="concentration-moderate" />
            <Label htmlFor="concentration-moderate">상당히 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="concentration-severe" />
            <Label htmlFor="concentration-severe">매우 심한 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="concentration-impossible" />
            <Label htmlFor="concentration-impossible">집중 거의 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          23. 업무 또는 학업: (통증 때문에 평소 하던 업무/학업 수행에 지장을 받는 정도)
        </Label>
        <RadioGroup
          value={formData.workStudy}
          onValueChange={(value) => handleChange("workStudy", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="workStudy-none" />
            <Label htmlFor="workStudy-none">전혀 지장 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="workStudy-mild" />
            <Label htmlFor="workStudy-mild">약간 지장 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="workStudy-moderate" />
            <Label htmlFor="workStudy-moderate">상당히 지장 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="workStudy-severe" />
            <Label htmlFor="workStudy-severe">매우 심한 지장 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="workStudy-impossible" />
            <Label htmlFor="workStudy-impossible">업무/학업 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">24. 운전 또는 대중교통 이용:</Label>
        <RadioGroup
          value={formData.transportation}
          onValueChange={(value) => handleChange("transportation", value)}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="transportation-none" />
            <Label htmlFor="transportation-none">전혀 어려움 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="transportation-mild" />
            <Label htmlFor="transportation-mild">약간 어려움 (짧은 거리만 가능)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="transportation-moderate" />
            <Label htmlFor="transportation-moderate">상당히 어려움 (필수적인 경우만 가능)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="transportation-severe" />
            <Label htmlFor="transportation-severe">매우 심한 어려움</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="impossible" id="transportation-impossible" />
            <Label htmlFor="transportation-impossible">운전/이동 불가능</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">25. 여가 활동: (예: 가벼운 운동, 취미 활동, 친구 만나기 등)</Label>
        <RadioGroup
          value={formData.leisure}
          onValueChange={(value) => handleChange("leisure", value)}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="leisure-none" />
            <Label htmlFor="leisure-none">전혀 지장 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="leisure-mild" />
            <Label htmlFor="leisure-mild">약간 지장 있음 (활동량/시간 줄임)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="leisure-moderate" />
            <Label htmlFor="leisure-moderate">상당히 지장 있음 (거의 못함)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="leisure-severe" />
            <Label htmlFor="leisure-severe">매우 심한 지장 있음 (전혀 못함)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">
          26. 정서 상태: (통증 때문에 기분이 가라앉거나, 예민해지거나, 불안감을 느끼는 정도)
        </Label>
        <RadioGroup
          value={formData.emotionalState}
          onValueChange={(value) => handleChange("emotionalState", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="emotionalState-none" />
            <Label htmlFor="emotionalState-none">거의 영향 없음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="emotionalState-mild" />
            <Label htmlFor="emotionalState-mild">가끔 영향 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="emotionalState-moderate" />
            <Label htmlFor="emotionalState-moderate">자주 영향 있음</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="emotionalState-severe" />
            <Label htmlFor="emotionalState-severe">거의 항상 영향 있음</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full">
        다음
      </Button>
    </form>
  )
}

