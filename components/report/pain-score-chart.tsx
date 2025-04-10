"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PainScoreChartProps {
  intensity: number
  duration: string
  frequency: string
}

export default function PainScoreChart({ intensity, duration, frequency }: PainScoreChartProps) {
  // Map duration to display text
  const durationText =
    {
      lessThanWeek: "1주일 미만",
      "1-4weeks": "1-4주",
      "1-3months": "1-3개월",
      "3-6months": "3-6개월",
      "6-12months": "6-12개월",
      moreThanYear: "1년 이상",
    }[duration] || duration

  // Map frequency to display text
  const frequencyText =
    {
      constant: "지속적 (항상)",
      daily: "매일",
      severalTimesWeek: "일주일에 여러 번",
      weekly: "일주일에 한 번",
      monthly: "한 달에 한 번",
      rarely: "드물게",
    }[frequency] || frequency

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>통증 강도: {intensity}/10</span>
        </div>
        <div className="w-full bg-muted rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              intensity <= 3 ? "bg-green-500" : intensity <= 6 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${intensity * 10}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>경미함</span>
          <span>중간</span>
          <span>심각함</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm font-medium mb-2">지속 기간</p>
          <Badge variant="secondary">{durationText}</Badge>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium mb-2">발생 빈도</p>
          <Badge variant="secondary">{frequencyText}</Badge>
        </Card>
      </div>
    </div>
  )
}

