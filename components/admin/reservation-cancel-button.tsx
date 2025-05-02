"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ReservationCancelButtonProps {
  reservationId: string
  isDisabled?: boolean
}

export function ReservationCancelButton({ 
  reservationId, 
  isDisabled = false 
}: ReservationCancelButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (isDisabled || isSubmitting) return

    if (!confirm('이 예약을 취소하시겠습니까?')) return

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('id', reservationId)

      const response = await fetch('/api/admin/reservation/cancel', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('예약 취소 중 오류가 발생했습니다')
      }

      // 페이지 새로고침 제거
      // 클라이언트 측에서 데이터 상태만 업데이트하도록 함
      // router.refresh()

    } catch (error) {
      console.error('예약 취소 오류:', error)
      alert('예약 취소 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button 
      onClick={handleCancel}
      variant="outline" 
      size="sm"
      className="text-red-600 border-red-600 hover:bg-red-50"
      disabled={isDisabled || isSubmitting}
    >
      {isSubmitting ? "처리 중..." : "취소"}
    </Button>
  )
} 