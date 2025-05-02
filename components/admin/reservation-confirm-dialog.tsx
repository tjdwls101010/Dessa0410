"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type ReservationOption = {
  day: string
  time: string
  label: string
}

export function ReservationConfirmDialog({
  reservationId,
  options,
}: {
  reservationId: string
  options: {
    day1?: string
    time1?: string
    day2?: string
    time2?: string
    day3?: string
    time3?: string
  }
}) {
  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>("")

  // 예약 옵션 생성
  const reservationOptions: ReservationOption[] = []

  if (options.day1 && options.time1) {
    reservationOptions.push({
      day: options.day1,
      time: options.time1,
      label: `희망일1: ${options.day1} ${options.time1}`
    })
  }

  if (options.day2 && options.time2) {
    reservationOptions.push({
      day: options.day2,
      time: options.time2,
      label: `희망일2: ${options.day2} ${options.time2}`
    })
  }

  if (options.day3 && options.time3) {
    reservationOptions.push({
      day: options.day3,
      time: options.time3,
      label: `희망일3: ${options.day3} ${options.time3}`
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-green-600 border-green-600 hover:bg-green-50"
        >
          확정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>예약 시간 선택</DialogTitle>
          <DialogDescription>
            환자가 요청한 시간 중 확정할 시간을 선택해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
            {reservationOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={`${option.day}_${option.time}`} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <form action="/api/admin/reservation/confirm" method="POST">
            <input type="hidden" name="id" value={reservationId} />
            {selectedOption && (
              <>
                <input 
                  type="hidden" 
                  name="day" 
                  value={selectedOption.split('_')[0]} 
                />
                <input 
                  type="hidden" 
                  name="time" 
                  value={selectedOption.split('_')[1]} 
                />
              </>
            )}
            <Button 
              type="submit" 
              disabled={!selectedOption}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              예약 확정하기
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 