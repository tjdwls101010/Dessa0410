import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{
    subject: string;
    value: number;
    fullMark: number;
  }>;
  colors?: {
    fill?: string;
    stroke?: string;
  };
  showTooltip?: boolean;
  showLegend?: boolean;
}

const RadarChartComponent = ({
  data,
  colors = {
    fill: "rgba(234, 88, 12, 0.6)",
    stroke: "rgb(234, 88, 12)",
  },
  showTooltip = true,
  showLegend = false,
  className,
  ...props
}: RadarChartProps) => {
  // 1-5 점수를 한글 레이블로 변환
  const getLimitationText = (value: number) => {
    if (!value) return "없음";
    const labels = ["없음", "약간", "보통", "심함", "매우 심함"];
    return labels[Math.min(value, 5) - 1] || "없음";
  };

  return (
    <div className={cn("w-full h-80", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid gridType="circle" stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#d1d5db"
          />
          <PolarRadiusAxis 
            domain={[0, 5]} 
            tickCount={6} 
            axisLine={false}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          
          {/* 배경 레이더 그리드 (최대값) */}
          <Radar
            name="최대"
            dataKey="fullMark"
            stroke="#e5e7eb"
            fill="#f3f4f6"
            fillOpacity={0.3}
          />
          
          {/* 실제 데이터 */}
          <Radar
            name="어려움 정도"
            dataKey="value"
            stroke={colors.stroke}
            fill={colors.fill}
            fillOpacity={0.6}
          />
          
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
                padding: "0.5rem",
                fontSize: "0.875rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              formatter={(value: number) => [`${value} (${getLimitationText(value)})`]}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { RadarChartComponent }; 