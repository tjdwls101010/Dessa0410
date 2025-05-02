"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AppointmentEditModal } from "./appointment-edit-modal"
import { format } from "date-fns"

interface ReservationEditButtonProps {
  reservationId: string
  reservationDate: string
  reservationTime: string
  reservationName: string
  reservationPhone: string
  isDisabled?: boolean
}

export function ReservationEditButton({ 
  reservationId, 
  reservationDate,
  reservationTime,
  reservationName,
  reservationPhone,
  isDisabled = false 
}: ReservationEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // 수정할 예약 정보를 담을 상태
  const [appointmentData, setAppointmentData] = useState({
    patientName: reservationName,
    patientPhone: reservationPhone || "",
    appointmentType: "일반예약", // 기본값
    memo: "",
    dateStr: reservationDate,
    timeStr: reservationTime
  });
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // 슬롯 정보 생성 (AppointmentEditModal에 필요)
  const selectedSlot = {
    time: reservationTime || "00:00",
    displayTime: reservationTime || "00:00",
    date: (() => {
      // 날짜와 시간이 유효한지 확인
      if (!reservationDate || !reservationTime) {
        return new Date(); // 유효하지 않은 경우 현재 날짜 사용
      }
      
      try {
        const dateObj = new Date(`${reservationDate}T${reservationTime}`);
        // 유효한 날짜인지 확인
        return isNaN(dateObj.getTime()) ? new Date() : dateObj;
      } catch (error) {
        console.error("날짜 변환 오류:", error);
        return new Date(); // 오류 발생 시 현재 날짜 사용
      }
    })(),
    isBooked: true,
    appointmentId: reservationId,
    patientName: reservationName,
    appointmentType: "일반예약"
  };

  // 모달 열기
  const handleOpenModal = async () => {
    if (isDisabled || isSubmitting) return
    
    // 모달을 열기 전에 사용 가능한 시간대 업데이트
    if (reservationDate) {
      try {
        await updateAvailableTimes(reservationDate);
      } catch (error) {
        console.error("시간대 업데이트 오류:", error);
      }
    }
    
    setIsModalOpen(true)
  }

  // appointmentData 부분 업데이트 핸들러
  const handleAppointmentDataChange = (data: Partial<typeof appointmentData>) => {
    setAppointmentData(prev => ({...prev, ...data}));
  };

  // 날짜 변경 처리
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    setAppointmentData({...appointmentData, dateStr: newDateStr});
    
    // 날짜가 유효한지 확인
    if (!newDateStr) return;
    
    try {
      // 선택된 날짜에 대한 사용 가능한 시간대 업데이트
      await updateAvailableTimes(newDateStr);
    } catch (error) {
      console.error("시간대 업데이트 오류:", error);
    }
  };
  
  // 시간 선택 처리
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppointmentData({...appointmentData, timeStr: e.target.value});
  };

  // 사용 가능한 시간대 업데이트 함수
  const updateAvailableTimes = async (dateStr: string) => {
    try {
      // 서버에서 확정된 예약 목록 가져오기
      const response = await fetch('/api/admin/get-appointments-by-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateStr }),
      });
      
      if (!response.ok) {
        throw new Error('예약 정보를 가져오는 중 오류가 발생했습니다');
      }
      
      const data = await response.json();
      const bookedAppointments = data.appointments || [];
      
      // 전체 시간대 (9:00 ~ 20:30, 30분 간격)
      const allTimes: string[] = [];
      for (let hour = 9; hour < 21; hour++) {
        for (let minute of [0, 30]) {
          const hourStr = hour.toString().padStart(2, '0');
          const minuteStr = minute.toString().padStart(2, '0');
          allTimes.push(`${hourStr}:${minuteStr}`);
        }
      }
      
      // 해당 날짜에 이미 예약된 시간대 찾기 (현재 수정 중인 예약은 제외)
      const bookedTimes = bookedAppointments
        .filter((app: any) => app.id !== reservationId)
        .map((app: any) => app.reservation_time0)
        .filter(Boolean);
      
      // 예약된 시간대를 제외한 사용 가능한 시간대
      const available = allTimes.filter(time => !bookedTimes.includes(time));
      
      // 현재 선택된 시간이 없거나 예약 가능한 시간이 아니면, 첫 번째 가능한 시간으로 설정
      if (!appointmentData.timeStr || !available.includes(appointmentData.timeStr)) {
        if (available.length > 0) {
          setAppointmentData(prev => ({...prev, timeStr: available[0]}));
        }
      }
      
      setAvailableTimes(available);
    } catch (error) {
      console.error('가능한 시간대 업데이트 오류:', error);
      setAvailableTimes([]);
    }
  };

  // 예약 수정 저장 처리
  const handleSaveAppointment = async () => {
    try {
      setIsSubmitting(true)

      // 입력값 검증
      if (!appointmentData.patientName.trim()) {
        alert("환자명을 입력해주세요.");
        setIsSubmitting(false);
        return;
      }

      if (!appointmentData.dateStr || !appointmentData.timeStr) {
        alert("날짜와 시간을 선택해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 예약 수정 API 호출
      const response = await fetch('/api/admin/update-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: reservationId,
          patientName: appointmentData.patientName,
          patientPhone: appointmentData.patientPhone,
          dateStr: appointmentData.dateStr,
          timeStr: appointmentData.timeStr,
          memo: appointmentData.memo,
          appointmentType: appointmentData.appointmentType
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '예약 수정 중 오류가 발생했습니다');
      }

      // 모달 닫기
      setIsModalOpen(false)
      
      // 성공 메시지 표시
      alert(`예약이 성공적으로 수정되었습니다.`);
      
      // 페이지 새로고침 제거 
      // 클라이언트 측에서 데이터 상태만 업데이트하도록 함
      // router.refresh();

    } catch (error) {
      console.error('예약 수정 오류:', error)
      alert('예약 수정 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 예약 삭제 처리
  const handleDeleteAppointment = async () => {
    if (!confirm('정말로 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    
    try {
      setIsSubmitting(true)
      
      // 예약 삭제 API 호출
      const response = await fetch('/api/admin/delete-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: reservationId
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '예약 삭제 중 오류가 발생했습니다');
      }
      
      // 모달 닫기
      setIsModalOpen(false)
      
      // 성공 메시지 표시
      alert(`예약이 성공적으로 삭제되었습니다.`);
      
      // 페이지 새로고침 제거
      // 클라이언트 측에서 데이터 상태만 업데이트하도록 함
      // router.refresh();
    } catch (error) {
      console.error('예약 삭제 오류:', error)
      alert('예약 삭제 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button 
        onClick={handleOpenModal}
        variant="outline" 
        size="sm"
        className="text-blue-600 border-blue-600 hover:bg-blue-50"
        disabled={isDisabled || isSubmitting}
      >
        {isSubmitting ? "처리 중..." : "수정"}
      </Button>

      {isModalOpen && (
        <AppointmentEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedSlot={selectedSlot}
          appointmentData={appointmentData}
          availableTimes={availableTimes}
          onAppointmentDataChange={handleAppointmentDataChange}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </>
  )
} 