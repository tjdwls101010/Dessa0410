"use client"

import * as React from "react"
import { X, ChevronDown, Calendar as CalendarIcon } from "lucide-react"
import { ko } from "date-fns/locale"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { MonthCalendar } from "./month-calendar"
import { WeekCalendar } from "./week-calendar"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { cn } from "@/lib/utils"

interface ReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationModal({
  open,
  onOpenChange
}: ReservationModalProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date()) // 오른쪽 달력용 선택 날짜
  const [name, setName] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [birthDate, setBirthDate] = React.useState("") // 생년월일 (기존 Input type="date" 유지)
  const [memo, setMemo] = React.useState("")

  // 각 순위별 날짜 상태 추가
  const [pref1Date, setPref1Date] = React.useState<Date | undefined>(undefined)
  const [pref2Date, setPref2Date] = React.useState<Date | undefined>(undefined)
  const [pref3Date, setPref3Date] = React.useState<Date | undefined>(undefined)

  // 각 순위별 시간 상태 (기존 reservationTimes -> prefTimes 로 변경)
  const [prefTimes, setPrefTimes] = React.useState<{
    time1: string | null;
    time2: string | null;
    time3: string | null;
  }>({
    time1: null,
    time2: null,
    time3: null
  })

  // 각 순위별 Popover 열림 상태
  const [popoverOpenStates, setPopoverOpenStates] = React.useState<boolean[]>([false, false, false]);

  // 오른쪽 달력 선택 핸들러 (선택된 날짜만 업데이트)
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  // 시간 선택 핸들러 (순위와 시간 업데이트)
  const handleTimeSelect = (timeRank: 'time1' | 'time2' | 'time3', time: string) => {
    setPrefTimes(prev => ({
      ...prev,
      [timeRank]: time
    }))
  }

  // 각 순위별 날짜 선택 핸들러
  const handlePrefDateSelect = (priority: 1 | 2 | 3, date: Date | undefined) => {
    if (priority === 1) setPref1Date(date)
    else if (priority === 2) setPref2Date(date)
    else if (priority === 3) setPref3Date(date)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 예약 정보 제출 로직
    console.log({
      name,
      phoneNumber,
      birthDate, // 생년월일
      preference1: { date: pref1Date ? format(pref1Date, "yyyy-MM-dd") : undefined, time: prefTimes.time1 },
      preference2: { date: pref2Date ? format(pref2Date, "yyyy-MM-dd") : undefined, time: prefTimes.time2 },
      preference3: { date: pref3Date ? format(pref3Date, "yyyy-MM-dd") : undefined, time: prefTimes.time3 },
      memo
    })

    // 폼 초기화 및 모달 닫기
    setName("")
    setPhoneNumber("")
    setBirthDate("")
    setMemo("")
    setPref1Date(undefined)
    setPref2Date(undefined)
    setPref3Date(undefined)
    setPrefTimes({ time1: null, time2: null, time3: null })
    onOpenChange(false)
  }

  // 시간 옵션 생성
  const timeOptions = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00", "18:30"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        {/* DialogTitle 추가 */}
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-xl font-semibold">진료 예약</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-sm mb-4">
            아래 정보를 입력하고, 선호하는 예약 시간을 선택해주세요.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽: 예약 정보 입력 폼 */}
            <div className="space-y-4">
              {/* 이름, 연락처, 생년월일, 메모 필드 (기존과 동일) */}
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="010-1234-5678" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">생년월일</Label>
                <Input id="birthDate" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="날짜 선택" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo">메모 (선택 사항)</Label>
                <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="의사 선생님께 전달할 내용을 입력해주세요." className="min-h-[80px]" />
              </div>

              {/* 예약 선호 시간 */}
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium">예약 선호 시간</h3>
                {[1, 2, 3].map((priority) => {
                  const currentPrefDate = priority === 1 ? pref1Date : priority === 2 ? pref2Date : pref3Date;
                  const currentPrefTime = priority === 1 ? prefTimes.time1 : priority === 2 ? prefTimes.time2 : prefTimes.time3;
                  const setDateFunc = (date: Date | undefined) => handlePrefDateSelect(priority as 1 | 2 | 3, date);
                  const setTimeFunc = (time: string) => handleTimeSelect(`time${priority}` as 'time1' | 'time2' | 'time3', time);
                  const priorityIndex = priority - 1; // 배열 인덱스 계산

                  return (
                    <div key={priority} className="space-y-2">
                      <Label>
                        {priority}순위
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* 날짜 선택 */}
                        <Popover
                          open={popoverOpenStates[priorityIndex]}
                          onOpenChange={(isOpen) =>
                            setPopoverOpenStates(prev => {
                              const newState = [...prev];
                              newState[priorityIndex] = isOpen;
                              return newState;
                            })
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !currentPrefDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentPrefDate ? format(currentPrefDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentPrefDate}
                              onSelect={(date) => {
                                setDateFunc(date); // 기존 날짜 설정 함수 호출
                                setPopoverOpenStates(prev => { // Popover 닫기
                                  const newState = [...prev];
                                  newState[priorityIndex] = false;
                                  return newState;
                                });
                              }}
                              initialFocus
                              locale={ko}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // 오늘 이전 날짜 비활성화
                            />
                          </PopoverContent>
                        </Popover>
                        {/* 시간 선택 */}
                        <Select value={currentPrefTime || ""} onValueChange={setTimeFunc}>
                          <SelectTrigger>
                            <SelectValue placeholder="시간 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* <SelectItem value="" disabled>시간 선택</SelectItem>  <-- 이 부분 삭제 */}
                            {timeOptions.map((time) => (
                              <SelectItem key={`time${priority}-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽: 월달력과 주달력 */}
            <div className="space-y-4">
              {/* 월달력 */}
              <div className="border rounded-lg shadow-sm">
                <MonthCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect} // 오른쪽 달력 선택 시 selectedDate만 변경
                />
              </div>
              {/* 주달력 (예약 현황) */}
              <div>
                <WeekCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect} // onDateSelect prop 추가 및 핸들러 연결
                />
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!pref1Date || !prefTimes.time1} // 1순위 날짜와 시간 필수
              className="bg-blue-500 hover:bg-blue-600"
            >
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}