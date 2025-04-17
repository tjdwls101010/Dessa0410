"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { 
  addMonths, format, startOfMonth, endOfMonth, getDay, 
  isToday, isSameDay, subMonths, addDays, isSameMonth 
} from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface MonthCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  className?: string
}

export function MonthCalendar({
  selectedDate,
  onDateSelect,
  className
}: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate)) // 초기값을 selectedDate의 월로 설정

  // selectedDate prop이 변경될 때 currentMonth를 업데이트하는 useEffect 추가
  React.useEffect(() => {
    const newMonthStart = startOfMonth(selectedDate);
    if (!isSameMonth(newMonthStart, currentMonth)) {
      setCurrentMonth(newMonthStart);
    }
  }, [selectedDate, currentMonth]); // selectedDate와 currentMonth를 의존성 배열에 추가

  const changeMonth = (amount: number) => {
    if (amount > 0) {
      setCurrentMonth(addMonths(currentMonth, 1))
    } else {
      setCurrentMonth(subMonths(currentMonth, 1))
    }
  }
  
  const renderCalendarHeader = () => {
    return (
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => changeMonth(-1)}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-medium">
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => changeMonth(1)}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }
  
  const renderWeekdays = () => {
    const weekdays = ["월", "화", "수", "목", "금", "토", "일"]
    return (
      <div className="grid grid-cols-7 border-b border-t py-2">
        {weekdays.map((day, i) => (
          <div 
            key={i} 
            className={cn(
              "text-center text-sm font-medium", 
              i === 5 ? "text-blue-500" : i === 6 ? "text-red-500" : "text-gray-600"
            )}
          >
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = monthStart
    
    // 한 주의 시작은 월요일(1)이므로, 이전 주의 날짜부터 시작
    // getDay는 0(일)~6(토)를 반환하므로 월요일을 시작으로 조정
    let startDay = getDay(startDate)
    startDay = startDay === 0 ? 6 : startDay - 1 // 월요일이 0이 되도록 변환
    
    const days = []
    
    // 이전 달의 날짜들로 첫 주 채우기
    for (let i = 0; i < startDay; i++) {
      const prevDate = addDays(startDate, -startDay + i)
      days.push(
        <div 
          key={`prev-${i}`} 
          className="p-0 text-center"
        >
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 text-gray-300"
            disabled
          >
            {format(prevDate, "d")}
          </Button>
        </div>
      )
    }
    
    // 현재 달의 날짜들 채우기
    let day = startDate
    while (day <= monthEnd) {
      const dayObj = day
      const isSelected = isSameDay(day, selectedDate)
      const isCurrentMonth = isSameMonth(day, currentMonth)
      const dayOfWeek = getDay(day)
      
      days.push(
        <div 
          key={day.toString()} 
          className="p-0 text-center"
        >
          <Button
            variant="ghost"
            className={cn(
              "h-10 w-10 p-0 rounded-full",
              isToday(day) && "bg-gray-100",
              isSelected && "bg-blue-500 text-white hover:bg-blue-600 hover:text-white",
              !isSelected && dayOfWeek === 0 && "text-red-500",
              !isSelected && dayOfWeek === 6 && "text-blue-500"
            )}
            onClick={() => onDateSelect(dayObj)}
          >
            {format(day, "d")}
          </Button>
        </div>
      )
      day = addDays(day, 1)
    }
    
    // 다음 달의 날짜로 마지막 주 채우기
    const daysInGrid = Math.ceil((startDay + endOfMonth(monthStart).getDate()) / 7) * 7
    const remainingDays = daysInGrid - days.length
    
    for (let i = 0; i < remainingDays; i++) {
      const nextDate = addDays(monthEnd, i + 1)
      days.push(
        <div 
          key={`next-${i}`} 
          className="p-0 text-center"
        >
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 text-gray-300"
            disabled
          >
            {format(nextDate, "d")}
          </Button>
        </div>
      )
    }
    
    return <div className="grid grid-cols-7 gap-1 p-2">{days}</div>
  }
  
  return (
    <div className={cn("", className)}>
      {renderCalendarHeader()}
      {renderWeekdays()}
      {renderDays()}
    </div>
  )
} 