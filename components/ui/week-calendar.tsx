"use client"

import * as React from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface WeekCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void // 날짜 선택 콜백 함수 추가
  className?: string
}

// 가상의 예약 데이터 타입
interface Appointment {
  id: string
  date: Date
  startTime: string
  endTime: string
  title: string
}

export function WeekCalendar({
  selectedDate,
  onDateSelect, // 콜백 함수 받기
  className
}: WeekCalendarProps) {
  // 가상의 예약 데이터 (실제로는 API에서 가져와야 함) - 데이터 양 증가
  const [appointments, setAppointments] = React.useState<Appointment[]>([
    // 4월
    { id: "1", date: new Date(2025, 3, 15), startTime: "07:00", endTime: "08:00", title: "예약 완료" },
    { id: "2", date: new Date(2025, 3, 16), startTime: "08:00", endTime: "09:00", title: "예약 완료" },
    { id: "3", date: new Date(2025, 3, 17), startTime: "19:00", endTime: "20:00", title: "예약 완료" },
    { id: "4", date: new Date(2025, 3, 18), startTime: "10:00", endTime: "11:00", title: "예약 완료" },
    { id: "5", date: new Date(2025, 3, 18), startTime: "14:00", endTime: "15:00", title: "예약 완료" },
    { id: "6", date: new Date(2025, 3, 21), startTime: "09:00", endTime: "10:00", title: "예약 완료" },
    { id: "7", date: new Date(2025, 3, 22), startTime: "11:00", endTime: "12:00", title: "예약 완료" },
    { id: "8", date: new Date(2025, 3, 23), startTime: "15:00", endTime: "16:00", title: "예약 완료" },
    { id: "9", date: new Date(2025, 3, 24), startTime: "17:00", endTime: "18:00", title: "예약 완료" },
    { id: "10", date: new Date(2025, 3, 25), startTime: "07:00", endTime: "08:00", title: "예약 완료" },
    { id: "11", date: new Date(2025, 3, 28), startTime: "16:00", endTime: "17:00", title: "예약 완료" },
    { id: "12", date: new Date(2025, 3, 29), startTime: "18:00", endTime: "19:00", title: "예약 완료" },
    { id: "13", date: new Date(2025, 3, 30), startTime: "08:00", endTime: "09:00", title: "예약 완료" },
    // 5월
    { id: "14", date: new Date(2025, 4, 1), startTime: "10:00", endTime: "11:00", title: "예약 완료" },
    { id: "15", date: new Date(2025, 4, 2), startTime: "13:00", endTime: "14:00", title: "예약 완료" },
    { id: "16", date: new Date(2025, 4, 5), startTime: "09:00", endTime: "10:00", title: "예약 완료" },
    { id: "17", date: new Date(2025, 4, 6), startTime: "11:00", endTime: "12:00", title: "예약 완료" },
    { id: "18", date: new Date(2025, 4, 7), startTime: "15:00", endTime: "16:00", title: "예약 완료" },
    { id: "19", date: new Date(2025, 4, 8), startTime: "17:00", endTime: "18:00", title: "예약 완료" },
    { id: "20", date: new Date(2025, 4, 9), startTime: "07:00", endTime: "08:00", title: "예약 완료" },
  ])

  // 선택된 날짜를 기준으로 7일 표시 (선택된 날짜 - 3일 부터 시작)
  const displayStartDate = addDays(selectedDate, -3)

  // 요일별 header 렌더링
  const renderWeekHeader = () => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(displayStartDate, i)) // displayStartDate 기준으로 7일 생성

    return (
      <div className="grid grid-cols-7 border-b">
        {days.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate)
          const dayName = format(day, "E", { locale: ko })
          const isWeekend = dayName === "토" || dayName === "일"
          
          return (
            <div
              key={index}
              onClick={() => onDateSelect(day)} // 클릭 시 콜백 함수 호출
              className={cn(
                "text-center py-2 text-sm cursor-pointer", // cursor-pointer 추가
                isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-100", // 호버 효과 추가
                !isSelected && isWeekend ? (dayName === "일" ? "text-red-500" : "text-blue-500") : "text-gray-700"
              )}
            >
              <div className="font-medium">{dayName}</div>
              <div className="text-lg">{format(day, "d")}</div>
            </div>
          )
        })}
      </div>
    )
  }
  
  // 시간 슬롯 계산 (09:00 ~ 18:00)
  const timeSlots = [
    { label: "오전", slots: ["09:00-10:00", "10:00-11:00", "11:00-12:00"] },
    { label: "오후", slots: ["13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"] }
  ]

  // 특정 날짜와 시간 슬롯에 예약이 있는지 확인
  const hasAppointment = (date: Date, timeSlot: string) => {
    const [start] = timeSlot.split("-")
    return appointments.some(app => 
      isSameDay(app.date, date) && app.startTime === start
    )
  }
  
  // 시간 슬롯 렌더링
  const renderTimeSlots = () => {
    return (
      <div className="text-xs">
        {timeSlots.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2">
            <div className="font-medium py-1 px-2 bg-gray-100">{group.label}</div>
            <div className="grid grid-cols-7 gap-1 p-1">
              {/* 요일별 시간 슬롯 */}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const currentDate = addDays(displayStartDate, dayIndex) // displayStartDate 기준으로 날짜 계산
                const isSelectedDay = isSameDay(currentDate, selectedDate)

                return (
                  <div
                    key={dayIndex} 
                    className={cn(
                      "min-h-[100px] flex flex-col gap-1",
                      isSelectedDay ? "bg-blue-50" : ""
                    )}
                  >
                    {group.slots.map((slot, slotIndex) => {
                      const hasBooked = hasAppointment(currentDate, slot)
                      return (
                        <div 
                          key={`${dayIndex}-${slotIndex}`}
                          className={cn(
                            "text-center py-1 rounded text-xs",
                            hasBooked ? "bg-blue-100 text-blue-700" : "bg-gray-50 text-gray-400"
                          )}
                        >
                          {hasBooked ? "예약 완료" : slot.split("-")[0]}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {renderWeekHeader()}
      <div className="max-h-[300px] overflow-y-auto p-1">
        {renderTimeSlots()}
      </div>
    </div>
  )
} 