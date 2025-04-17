"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveyData: any;
}

const SurveyModal: React.FC<SurveyModalProps> = ({
  open,
  onOpenChange,
  surveyData,
}) => {
  if (!surveyData) return null;

  // 설문 데이터 그룹 정의
  const surveyGroups = [
    {
      title: "기본 정보",
      items: [
        { key: "a1_age", label: "연령대" },
        { key: "a2_gender", label: "성별" },
        { key: "a3_job", label: "직업" },
      ],
    },
    {
      title: "통증의 기본 특징",
      items: [
        { key: "b4_main_pain_area", label: "주요 통증 부위" },
        { key: "b5_other_pain_areas", label: "기타 통증 부위", isArray: true },
        { key: "b6_pain_onset", label: "통증 시작 시기" },
        { key: "b7_pain_pattern", label: "통증 양상", isArray: true },
        { key: "b8_radiating_pain", label: "방사통 여부", isBoolean: true },
        { key: "b9_allodynia", label: "접촉 민감성 여부", isBoolean: true },
        { key: "b10_sensory_motor_deficit", label: "감각/운동 결손 여부", isBoolean: true },
      ],
    },
    {
      title: "통증의 강도 및 양상",
      items: [
        { key: "c11_max_pain_vas", label: "최대 통증 강도" },
        { key: "c12_avg_pain_vas", label: "평균 통증 강도" },
        { key: "c13_aggravating_factors", label: "통증 악화 요인", isArray: true },
        { key: "c14_relieving_factors", label: "통증 완화 요인", isArray: true },
      ],
    },
    {
      title: "기능 제한 및 삶의 질",
      items: [
        { key: "d15_personal_hygiene", label: "개인 위생", isScale: true },
        { key: "d16_dressing", label: "옷 입기", isScale: true },
        { key: "d17_lifting", label: "물건 들기", isScale: true },
        { key: "d18_walking", label: "걷기", isScale: true },
        { key: "d19_sitting", label: "앉기", isScale: true },
        { key: "d20_standing", label: "서기", isScale: true },
        { key: "d21_sleep", label: "수면", isScale: true },
        { key: "d22_concentration", label: "집중력", isScale: true },
        { key: "d23_work_study", label: "일/공부", isScale: true },
        { key: "d24_driving_transport", label: "운전/이동", isScale: true },
        { key: "d25_leisure", label: "여가 활동", isScale: true },
        { key: "d26_mood", label: "정서 상태", isScale: true },
      ],
    },
    {
      title: "생활 습관 및 과거력",
      items: [
        { key: "e27_exercise", label: "정기적 운동 여부", isBoolean: true },
        { key: "e27_exercise_type", label: "운동 종류" },
        { key: "e28_sitting_hours", label: "앉아있는 시간" },
        { key: "e29_posture_awareness", label: "자세 인지" },
        { key: "e30_recent_stress", label: "최근 스트레스" },
        { key: "e31_previous_treatment", label: "이전 치료 여부", isBoolean: true },
        { key: "e31_previous_treatment_details", label: "이전 치료 내용" },
        { key: "e32_medical_history", label: "의학적 상태 여부", isBoolean: true },
        { key: "e32_medical_history_details", label: "의학적 상태 내용" },
      ],
    },
    {
      title: "위험 신호",
      items: [
        { key: "f33_red_flags", label: "위험 신호", isArray: true },
      ],
    },
    {
      title: "병원 방문 의향",
      items: [
        { key: "g34_need_consultation", label: "상담 필요 여부" },
        { key: "g35_interested_treatments", label: "관심 치료법", isArray: true },
        { key: "g35_interested_treatments_other", label: "기타 관심 치료법" },
      ],
    },
  ];

  // 값 포맷팅 함수
  const formatValue = (value: any, item: any) => {
    if (value === undefined || value === null) {
      return "정보 없음";
    }
    
    // 불리언 값 처리
    if (item.isBoolean) {
      return value === true ? "예" : "아니오";
    }
    
    // 배열 값 처리
    if (item.isArray && Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "없음";
    }
    
    // 척도 값 처리 (1-5 또는 1-4 범위)
    if (item.isScale) {
      // d15_personal_hygiene ~ d25_leisure: 1-5 척도
      if (item.key.startsWith("d") && item.key !== "d26_mood") {
        const scaleMap = ["없음", "약간", "중간", "심함", "극심함"];
        return typeof value === "number" && value >= 1 && value <= 5 
          ? `${value}/5 (${scaleMap[value-1]})` 
          : `${value}/5`;
      }
      // d26_mood: 1-4 척도
      else if (item.key === "d26_mood") {
        const moodMap = ["영향 없음", "약간 영향", "중간 영향", "심각한 영향"];
        return typeof value === "number" && value >= 1 && value <= 4
          ? `${value}/4 (${moodMap[value-1]})`
          : `${value}/4`;
      }
    }
    
    // 기본 값 처리
    return value.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] h-[70vh] max-w-none max-h-none overflow-y-auto p-6 my-4 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            설문지 결과
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {surveyGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-primary">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col sm:flex-row items-start py-1 border-b border-gray-100 last:border-0">
                    <div className="w-full sm:w-1/3 text-sm text-gray-600 font-medium mb-1 sm:mb-0">
                      {item.label}:
                    </div>
                    <div className="w-full sm:w-2/3 text-sm">
                      {formatValue(surveyData[item.key], item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyModal; 