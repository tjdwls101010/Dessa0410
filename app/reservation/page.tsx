"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ReservationModal } from "@/components/ui/reservation-modal"

export default function ReservationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">온누리 마취통증의학과의원</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">진료 예약</h2>
          <p className="text-gray-700 mb-6">
            온누리 마취통증의학과의원은 환자분들의 편의를 위해 온라인 예약 시스템을 운영하고 있습니다.
            아래 버튼을 클릭하여 진료 예약을 진행해 주세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => setIsModalOpen(true)}>
              진료 예약하기
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:051-714-1831">전화 예약 (051-714-1831)</a>
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">진료 시간 안내</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">평일</h3>
              <p className="text-gray-700">오전 09:30 ~ 오후 19:00</p>
              <p className="text-gray-500 text-sm">점심시간: 13:00 ~ 14:30</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">수요일</h3>
              <p className="text-gray-700">오후 14:30 ~ 오후 19:00</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">토요일</h3>
              <p className="text-gray-700">오전 09:30 ~ 오후 15:00</p>
              <p className="text-gray-500 text-sm">점심시간 없음</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">일요일/공휴일</h3>
              <p className="text-gray-700">휴진</p>
            </div>
          </div>
        </div>
      </div>
      
      <ReservationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
} 