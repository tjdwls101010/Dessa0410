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
import { supabase } from "@/lib/supabaseClient"
import { usePathname } from "next/navigation"

interface ReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationModal({
  open,
  onOpenChange
}: ReservationModalProps) {
  const pathname = usePathname() // 현재 URL 경로 가져오기
  const reportId = pathname?.split('/').pop() || '' // URL에서 UUID 추출
  
  // 시간 옵션 생성 - 코드 상단으로 이동
  const timeOptions = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", 
    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
    "20:30", "21:00"
  ]

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date()) // 오른쪽 달력용 선택 날짜
  const [name, setName] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [birthDate, setBirthDate] = React.useState("") // 생년월일 (기존 Input type="date" 유지)
  const [memo, setMemo] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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

  // 날짜별 예약된 시간 목록 상태 추가
  const [bookedTimesByDate, setBookedTimesByDate] = React.useState<Map<string, string[]>>(new Map())

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

  // 특정 날짜의 예약된 시간을 직접 확인하는 함수 추가
  const getBookedTimesForDate = React.useCallback((date: Date | undefined): string[] => {
    if (!date) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookedTimesByDate.get(dateStr) || [];
  }, [bookedTimesByDate]);

  // 각 순위별 날짜 선택 핸들러
  const handlePrefDateSelect = (priority: 1 | 2 | 3, date: Date | undefined) => {
    if (priority === 1) setPref1Date(date)
    else if (priority === 2) setPref2Date(date)
    else if (priority === 3) setPref3Date(date)
    
    // 날짜가 변경되면 시간 선택 초기화
    if (priority === 1) setPrefTimes(prev => ({ ...prev, time1: null }))
    else if (priority === 2) setPrefTimes(prev => ({ ...prev, time2: null }))
    else if (priority === 3) setPrefTimes(prev => ({ ...prev, time3: null }))

    // 선택한 날짜의 예약된 시간 정보를 직접 확인
    if (date) {
      // 해당 날짜의 예약된 시간이 아직 불러와지지 않았다면 WeekCalendar에 요청
      const dateStr = format(date, 'yyyy-MM-dd');
      if (!bookedTimesByDate.has(dateStr)) {
        // 선택된 날짜로 WeekCalendar를 업데이트하여 해당 날짜의 예약 정보를 가져옴
        setSelectedDate(date);
      }
    }
  }

  // 예약된 시간 정보 처리 핸들러를 useCallback으로 감싸기
  const handleBookedTimesChange = React.useCallback((date: Date, bookedTimes: string[]) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setBookedTimesByDate(prev => {
      const prevBookedTimes = prev.get(dateStr);
      // 이전 값과 동일한지 비교하여 불필요한 상태 업데이트 방지
      if (prevBookedTimes && 
          prevBookedTimes.length === bookedTimes.length && 
          prevBookedTimes.every((time, i) => time === bookedTimes[i])) {
        return prev;
      }
      const newMap = new Map(prev);
      newMap.set(dateStr, bookedTimes);
      return newMap;
    });
  }, []);

  // 특정 날짜에 대해 예약 가능한 시간 옵션 필터링
  const getAvailableTimeOptions = React.useCallback((date: Date | undefined) => {
    if (!date) return timeOptions;
    
    const bookedTimes = getBookedTimesForDate(date);
    
    return timeOptions.filter(time => !bookedTimes.includes(time));
  }, [getBookedTimesForDate, timeOptions]);

  // 기본 정보가 모두 입력되었는지 확인
  const isBasicInfoComplete = name !== "" && phoneNumber !== "" && birthDate !== ""

  // 적어도 하나의 예약 선호 시간이 선택되었는지 확인
  const hasAtLeastOnePreference = 
    (pref1Date && prefTimes.time1) ||
    (pref2Date && prefTimes.time2) ||
    (pref3Date && prefTimes.time3)

  // 순위별 선택이 올바른지 확인 (순서대로 선택되었는지)
  const isPriority2Available = pref1Date && prefTimes.time1
  const isPriority3Available = pref2Date && prefTimes.time2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      if (!reportId) {
        throw new Error("리포트 ID를 찾을 수 없습니다. 페이지를 새로고침한 후 다시 시도해 주세요.")
      }
      
      // 예약 정보 로깅
      console.log({
        reportId,
        name,
        phoneNumber,
        birthDate,
        preference1: { date: pref1Date ? format(pref1Date, "yyyy-MM-dd") : undefined, time: prefTimes.time1 },
        preference2: { date: pref2Date ? format(pref2Date, "yyyy-MM-dd") : undefined, time: prefTimes.time2 },
        preference3: { date: pref3Date ? format(pref3Date, "yyyy-MM-dd") : undefined, time: prefTimes.time3 },
        memo
      })
      
      // Supabase 테이블 업데이트 (기존 reportId를 가진 row를 업데이트)
      const { data, error: updateError } = await supabase
        .from('surveys')
        .update({
          reservation_name: name,
          reservation_phone: phoneNumber,
          reservation_birth: birthDate,
          reservation_memo: memo,
          reservation_day1: pref1Date ? format(pref1Date, "yyyy-MM-dd") : null,
          reservation_time1: prefTimes.time1,
          reservation_day2: pref2Date ? format(pref2Date, "yyyy-MM-dd") : null,
          reservation_time2: prefTimes.time2,
          reservation_day3: pref3Date ? format(pref3Date, "yyyy-MM-dd") : null,
          reservation_time3: prefTimes.time3,
        })
        .eq('id', reportId)

      if (updateError) throw updateError;
      
      console.log("예약 정보 업데이트 성공:", data)

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
      
    } catch (err) {
      console.error("예약 정보 저장 실패:", err)
      setError(err instanceof Error ? err.message : "예약 저장 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

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
                  
                  // 우선순위 선택 가능 여부 (순서대로만 입력 가능)
                  const isDisabled = 
                    (priority === 2 && !isPriority2Available) || 
                    (priority === 3 && !isPriority3Available);

                  return (
                    <div key={priority} className="space-y-2">
                      <Label>
                        {priority}순위
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* 날짜 선택 */}
                        <Popover
                          open={popoverOpenStates[priorityIndex]}
                          onOpenChange={(isOpen) => {
                            // disabled 상태일 때는 팝오버가 열리지 않게 함
                            if (isDisabled && isOpen) return;
                            
                            setPopoverOpenStates(prev => {
                              const newState = [...prev];
                              newState[priorityIndex] = isOpen;
                              return newState;
                            })
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !currentPrefDate && "text-muted-foreground",
                                isDisabled && "opacity-50 cursor-not-allowed"
                              )}
                              disabled={isDisabled}
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
                        <Select 
                          value={currentPrefTime || ""} 
                          onValueChange={setTimeFunc}
                          disabled={isDisabled || !currentPrefDate} // 날짜 선택 전에는 시간 선택 불가
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="시간 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* 선택된 날짜의 예약 가능한 시간만 표시 */}
                            {getAvailableTimeOptions(currentPrefDate).map((time) => (
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
                  onDateSelect={handleDateSelect}
                  onBookedTimesChange={handleBookedTimesChange}
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
              disabled={!isBasicInfoComplete || !hasAtLeastOnePreference || isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? "처리 중..." : "확인"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}