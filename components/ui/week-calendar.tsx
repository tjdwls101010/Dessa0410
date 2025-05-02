"use client"

import * as React from "react"
import { format, addDays, startOfWeek, isSameDay, isEqual, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

interface WeekCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  className?: string
  onBookedTimesChange?: (date: Date, bookedTimes: string[]) => void
}

// 예약 데이터 타입
interface Appointment {
  id: string
  date: Date
  startTime: string
  endTime?: string
  title: string
}

export function WeekCalendar({
  selectedDate,
  onDateSelect,
  className,
  onBookedTimesChange
}: WeekCalendarProps) {
  // 실제 예약 데이터를 저장할 상태
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // 이전에 전달한 예약 시간을 기억하기 위한 ref
  const prevBookedTimesRef = React.useRef<string[]>([]);
  const prevSelectedDateRef = React.useRef<Date | null>(null);

  // Supabase에서 예약 데이터 가져오기
  React.useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true)
      try {
        // 선택된 날짜를 기준으로 표시 범위 계산
        const startDate = addDays(selectedDate, -7) // 7일 전부터
        const endDate = addDays(selectedDate, 7) // 7일 후까지
        
        const startDateStr = format(startDate, 'yyyy-MM-dd')
        const endDateStr = format(endDate, 'yyyy-MM-dd')
        
        // surveys 테이블에서 확정된 예약 중 선택된 날짜 주변의 데이터만 가져오기
        const { data, error } = await supabase
          .from('surveys')
          .select('id, reservation_day0, reservation_time0, reservation_name')
          .not('reservation_day0', 'is', null)
          .not('reservation_time0', 'is', null)
          .eq('reservation_status', 'confirmed')
          .gte('reservation_day0', startDateStr)
          .lte('reservation_day0', endDateStr)
        
        if (error) {
          console.error('예약 데이터 조회 오류:', error)
          return
        }
        
        // 데이터 형식 변환
        if (data) {
          const formattedAppointments = data.map(item => ({
            id: item.id,
            date: parseISO(item.reservation_day0),
            startTime: item.reservation_time0,
            title: "예약 완료"
          }))
          
          setAppointments(formattedAppointments)
        }
      } catch (err) {
        console.error('예약 데이터 처리 중 오류:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAppointments()
  }, [selectedDate]) // 선택된 날짜가 변경될 때마다 데이터 다시 가져오기

  // 특정 날짜의 예약된 시간 목록을 반환하는 함수
  const getBookedTimesForDate = React.useCallback((date: Date): string[] => {
    return appointments
      .filter(app => isSameDay(app.date, date))
      .map(app => app.startTime);
  }, [appointments]);

  // 선택된 날짜 변경 시 예약된 시간 정보 전달
  React.useEffect(() => {
    if (onBookedTimesChange) {
      // 날짜가 변경되었거나 처음 렌더링된 경우에만 처리
      if (!prevSelectedDateRef.current || !isSameDay(prevSelectedDateRef.current, selectedDate)) {
        const bookedTimes = getBookedTimesForDate(selectedDate);
        prevSelectedDateRef.current = selectedDate;
        
        // 이전에 전달한 값과 현재 값을 비교하여 변경된 경우에만 콜백 호출
        const prevBookedTimes = prevBookedTimesRef.current;
        const isBookedTimesChanged = 
          prevBookedTimes.length !== bookedTimes.length ||
          !prevBookedTimes.every((time, i) => bookedTimes.includes(time));
        
        if (isBookedTimesChanged) {
          prevBookedTimesRef.current = bookedTimes;
          onBookedTimesChange(selectedDate, bookedTimes);
        }
      }
    }
  }, [selectedDate, appointments, getBookedTimesForDate, onBookedTimesChange]);

  // 직접 특정 날짜의 예약 정보를 조회하는 함수 추가
  const checkBookedTimesForDate = React.useCallback((date: Date) => {
    if (onBookedTimesChange) {
      const bookedTimes = getBookedTimesForDate(date);
      onBookedTimesChange(date, bookedTimes);
    }
  }, [getBookedTimesForDate, onBookedTimesChange]);

  // 사용자가 날짜를 클릭할 때 호출되는 함수
  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    // 선택된 날짜의 예약 정보를 즉시 확인
    checkBookedTimesForDate(date);
  };

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
              onClick={() => handleDateClick(day)} // handleDateClick 사용
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
  
  // 시간 슬롯 계산 (09:00 ~ 21:00, 30분 단위)
  const timeSlots = [
    { label: "오전", slots: [
      "09:00-09:30", "09:30-10:00", 
      "10:00-10:30", "10:30-11:00", 
      "11:00-11:30", "11:30-12:00"
    ]},
    { label: "오후", slots: [
      "13:00-13:30", "13:30-14:00", 
      "14:00-14:30", "14:30-15:00", 
      "15:00-15:30", "15:30-16:00", 
      "16:00-16:30", "16:30-17:00", 
      "17:00-17:30", "17:30-18:00",
      "18:00-18:30", "18:30-19:00",
      "19:00-19:30", "19:30-20:00",
      "20:00-20:30", "20:30-21:00"
    ]}
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
    if (isLoading) {
      return (
        <div className="text-xs">
          {timeSlots.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-2">
              <div className="font-medium py-1 px-2 bg-gray-100">{group.label}</div>
              <div className="grid grid-cols-7 gap-1 p-1">
                {/* 요일별 스켈레톤 로딩 UI */}
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <div
                    key={dayIndex} 
                    className="min-h-[100px] flex flex-col gap-1"
                  >
                    {group.slots.map((_, slotIndex) => (
                      <div 
                        key={`${dayIndex}-${slotIndex}`}
                        className="text-center py-1 rounded text-xs bg-gray-200 animate-pulse h-5"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
    
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