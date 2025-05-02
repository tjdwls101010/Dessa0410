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
import { useRouter } from "next/navigation"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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

  // 예약 확정 핸들러
  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedOption) return;
    
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('id', reservationId);
      formData.append('day', selectedOption.split('_')[0]);
      formData.append('time', selectedOption.split('_')[1]);
      
      const response = await fetch('/api/admin/reservation/confirm', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('예약 확정 중 오류가 발생했습니다');
      }
      
      // 다이얼로그 닫기
      setOpen(false);
      
      // 페이지 새로고침 제거
      // 클라이언트 측에서 데이터 상태만 업데이트하도록 함
      // router.refresh();
      
    } catch (error) {
      console.error('예약 확정 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form onSubmit={handleConfirm}>
            <Button 
              type="submit" 
              disabled={!selectedOption || isSubmitting}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              {isSubmitting ? "처리 중..." : "예약 확정하기"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 