"use client"

import * as React from "react"
import { format } from "date-fns"
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
import { TimeSlot } from "./admin-calendar-types"

interface AppointmentCreateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: TimeSlot
  appointmentData: {
    patientName: string
    patientPhone: string
    appointmentType: string
    memo: string
  }
  onAppointmentDataChange: (data: Partial<AppointmentCreateModalProps['appointmentData']>) => void
  onSave: () => void
}

export function AppointmentCreateModal({
  isOpen,
  onClose,
  selectedSlot,
  appointmentData,
  onAppointmentDataChange,
  onSave
}: AppointmentCreateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 예약 추가</DialogTitle>
          <DialogDescription>
            {format(selectedSlot.date, "yyyy년 MM월 dd일 (E) HH:mm", { locale: ko })}
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
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button type="button" onClick={onSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 