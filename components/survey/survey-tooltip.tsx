// components/survey/survey-tooltip.tsx
import React from 'react';
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { HelpCircle } from 'lucide-react';

// Suvey_Tooltip.md 에서 파싱한 데이터 (실제로는 별도 파일이나 상위 컴포넌트에서 관리)
const tooltipData: Record<string, { reference: string; significance: string }> = {
  "1": { reference: "표준 인구통계 문항", significance: "통증 유형과 강도는 연령에 따라 다르게 나타날 수 있음" },
  "2": { reference: "표준 인구통계 문항", significance: "통증 인식과 표현에 성별 차이가 있을 수 있음" },
  "3": { reference: "ODI 기능평가 영역 확장", significance: "직업에 따른 통증 위험 요인과 일상생활 영향 평가" },
  "4": { reference: "ODI/KNPQ 신체 부위 평가", significance: "주요 통증 부위 파악으로 적절한 평가 도구 선정 기준" },
  "5": { reference: "ODI/KNPQ 신체 부위 평가 확장", significance: "통증의 확산 및 연관 통증 패턴 파악" },
  "6": { reference: "KNPQ 시간적 패턴 평가", significance: "급성/아급성/만성 통증 분류를 위한 핵심 정보" },
  "7": { reference: "DN4 감각 묘사 영역", significance: "신경병증성 통증과 통각성 통증 구별에 중요" },
  "8": { reference: "신경학적 평가 요소", significance: "신경근 압박이나 좌골신경통 가능성 평가" },
  "9": { reference: "DN4 항목 \"촉각 이상\"", significance: "신경병증성 통증의 주요 특징인 이질통 평가" },
  "10": { reference: "DN4 항목 \"감각 이상\"", significance: "신경 손상 관련 증상 평가" },
  "11": { reference: "VAS/NRS", significance: "통증의 최대 강도로 중증도 평가" },
  "12": { reference: "VAS/NRS", significance: "지속적 통증 부담 평가" },
  "13": { reference: "KNPQ/ODI", significance: "통증 관리를 위한 회피할 활동 식별" },
  "14": { reference: "KNPQ/ODI", significance: "통증 관리 전략 개발에 활용" },
  "15": { reference: "ODI \"개인적 돌봄\" 항목", significance: "기본적 자기 관리 능력 평가" },
  "16": { reference: "ODI \"개인적 돌봄\" 확장", significance: "일상생활 기능 평가" },
  "17": { reference: "ODI \"물건 들기\" 항목", significance: "상지 기능과 요통 관련성 평가" },
  "18": { reference: "ODI \"걷기\" 항목", significance: "이동 능력 제한 평가" },
  "19": { reference: "ODI \"앉기\" 항목", significance: "앉은 자세 유지 능력 평가" },
  "20": { reference: "ODI \"서 있기\" 항목", significance: "서 있는 자세 유지 능력 평가" },
  "21": { reference: "ODI \"수면\" 항목", significance: "통증으로 인한 수면 방해 정도 평가" },
  "22": { reference: "SF-36 정신 건강 영역", significance: "통증이 인지 기능에 미치는 영향 평가" },
  "23": { reference: "SF-36 역할 제한 영역", significance: "직업/학업 기능에 미치는 영향 평가" },
  "24": { reference: "ODI \"여행\" 항목", significance: "이동 수단 사용 제한 평가" },
  "25": { reference: "ODI \"사회 생활\" 항목", significance: "삶의 질과 사회 참여 제한 평가" },
  "26": { reference: "SF-36 정신 건강 영역", significance: "통증의 심리적 영향 평가" },
  "27": { reference: "생활습관 평가", significance: "통증 예방/관리 습관 평가" },
  "28": { reference: "생활습관 평가", significance: "앉은 자세 지속 시간과 통증 관련성 평가" },
  "29": { reference: "생활습관 평가", significance: "자세 불량과 통증 관련성 평가" },
  "30": { reference: "SF-36 정신 건강 영역", significance: "심리적 요인과 통증 관련성 평가" },
  "31": { reference: "임상 병력 평가", significance: "이전 치료 반응으로 향후 치료 계획 수립" },
  "32": { reference: "임상 병력 평가", significance: "통증의 원인이나 악화 요인이 될 수 있는 질환 확인" },
  "33": { reference: "Red Flag Signs 임상 지침", significance: "심각한 병리(종양, 감염, 골절 등) 가능성 선별" },
  "34": { reference: "환자 인식 평가", significance: "환자의 통증 심각성 인식 및 치료 필요성 평가" },
  "35": { reference: "환자 선호도 평가", significance: "환자 선호에 맞는 치료 계획 수립을 위한 정보" }
};

interface SurveyTooltipProps {
  questionId: string;
}

export function SurveyTooltip({ questionId }: SurveyTooltipProps) {
  const data = tooltipData[questionId];

  if (!data) {
    return null; // 해당 ID의 데이터가 없으면 툴팁을 표시하지 않음
  }

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button 
            type="button" 
            className="inline-flex items-center justify-center ml-1.5"
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="center"
            sideOffset={5}
            className="max-w-xs p-3 z-[999] bg-popover rounded-md shadow-md border text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            <p className="text-sm font-semibold mb-1 text-primary">참고 지표:</p>
            <p className="text-sm mb-2">{data.reference}</p>
            <p className="text-sm font-semibold mb-1 text-primary">임상적 의의:</p>
            <p className="text-sm">{data.significance}</p>
            <TooltipPrimitive.Arrow className="fill-current text-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}