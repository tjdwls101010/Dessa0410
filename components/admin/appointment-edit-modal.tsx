"use client"

import * as React from "react"
import { format, isValid } from "date-fns"
import { ko } from "date-fns/locale"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// TimeSlot 타입을 직접 정의
interface TimeSlot {
  time: string;
  displayTime: string;
  date: Date;
  isBooked: boolean;
  appointmentId?: string;
  patientName?: string;
  appointmentType?: string;
}

interface AppointmentEditModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: TimeSlot
  appointmentData: {
    patientName: string
    patientPhone: string
    appointmentType: string
    memo: string
    dateStr: string
    timeStr: string
  }
  availableTimes: string[]
  onAppointmentDataChange: (data: Partial<AppointmentEditModalProps['appointmentData']>) => void
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onSave: () => void
  onDelete: () => void
}

export function AppointmentEditModal({
  isOpen,
  onClose,
  selectedSlot,
  appointmentData,
  availableTimes,
  onAppointmentDataChange,
  onDateChange,
  onTimeChange,
  onSave,
  onDelete
}: AppointmentEditModalProps) {
  // 날짜 포맷팅 함수 - 오류 처리 추가
  const formatDate = (date: Date) => {
    try {
      // date가 유효한 Date 객체인지 확인
      if (!date || !isValid(date)) {
        return "날짜 정보 없음";
      }
      return format(date, "yyyy년 MM월 dd일 (E) HH:mm", { locale: ko });
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return "날짜 정보 오류";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>예약 정보</DialogTitle>
          <DialogDescription>
            {formatDate(selectedSlot.date)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patientName" className="text-right">환자명</Label>
            <Input
              id="patientName"
              value={appointmentData.patientName}
              onChange={(e) => onAppointmentDataChange({ patientName: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patientPhone" className="text-right">연락처</Label>
            <Input
              id="patientPhone"
              value={appointmentData.patientPhone}
              onChange={(e) => onAppointmentDataChange({ patientPhone: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointmentType" className="text-right">예약 유형</Label>
            <select
              id="appointmentType"
              value={appointmentData.appointmentType}
              onChange={(e) => onAppointmentDataChange({ appointmentType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
            >
              <option value="일반예약">일반예약</option>
              <option value="응급">응급</option>
              <option value="상담">상담</option>
              <option value="수술">수술</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memo" className="text-right">메모</Label>
            <Input
              id="memo"
              value={appointmentData.memo}
              onChange={(e) => onAppointmentDataChange({ memo: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateStr" className="text-right">날짜 변경</Label>
            <Input
              id="dateStr"
              type="date"
              value={appointmentData.dateStr}
              onChange={onDateChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeStr" className="text-right">시간 변경</Label>
            <select
              id="timeStr"
              value={appointmentData.timeStr}
              onChange={onTimeChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
            >
              <option value="">시간을 선택해주세요</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
              {availableTimes.length === 0 && appointmentData.timeStr && (
                <option value={appointmentData.timeStr}>
                  {appointmentData.timeStr} (현재 시간)
                </option>
              )}
            </select>
            {availableTimes.length === 0 ? (
              <div className="col-span-3 col-start-2 text-xs text-red-500 mt-1">
                선택한 날짜에 예약 가능한 시간대가 없습니다. 다른 날짜를 선택해보세요.
              </div>
            ) : (
              <div className="col-span-3 col-start-2 text-xs text-green-600 mt-1">
                {availableTimes.length}개의 예약 가능한 시간대가 있습니다.
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete}>
            삭제
          </Button>
          <Button type="button" onClick={onSave}>
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 