"use client"

interface FunctionalLimitationsChartProps {
  data: Record<string, string>
}

export default function FunctionalLimitationsChart({ data }: FunctionalLimitationsChartProps) {
  // Map activity IDs to display names
  const activityNames: Record<string, string> = {
    walking: "걷기",
    standing: "서있기",
    sitting: "앉아있기",
    climbing: "계단 오르기",
    bending: "몸 구부리기",
    lifting: "물건 들기",
    dressing: "옷 입기",
    bathing: "목욕하기",
    sleeping: "수면",
    working: "일하기",
  }

  // Map difficulty levels to numeric values and colors
  const difficultyValues: Record<string, number> = {
    none: 0,
    mild: 1,
    moderate: 2,
    severe: 3,
    unable: 4,
  }

  const difficultyColors: Record<string, string> = {
    none: "bg-green-500",
    mild: "bg-green-300",
    moderate: "bg-yellow-400",
    severe: "bg-orange-500",
    unable: "bg-red-500",
  }

  const difficultyLabels: Record<string, string> = {
    none: "어려움 없음",
    mild: "약간 어려움",
    moderate: "중간 어려움",
    severe: "심한 어려움",
    unable: "불가능",
  }

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([activity, difficulty]) => (
        <div key={activity} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{activityNames[activity] || activity}</span>
            <span className="text-muted-foreground">{difficultyLabels[difficulty] || difficulty}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`h-3 rounded-full ${difficultyColors[difficulty] || "bg-gray-400"}`}
              style={{ width: `${(difficultyValues[difficulty] / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>어려움 없음</span>
        <span>약간</span>
        <span>중간</span>
        <span>심함</span>
        <span>불가능</span>
      </div>
    </div>
  )
}

