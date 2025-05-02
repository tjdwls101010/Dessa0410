"use client"

import * as React from "react"
import { addDays, format, getDay, setHours, setMinutes, startOfDay, isSameDay, startOfWeek, parseISO, isValid } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TimeSlot, Appointment, AdminCalendarProps } from "./admin-calendar-types"
import { AppointmentCreateModal } from "./appointment-create-modal"
import { AppointmentEditModal } from "./appointment-edit-modal"

export function AdminCalendar({
  initialDate = new Date(),
  confirmedAppointments = [],
  onAppointmentUpdated
}: AdminCalendarProps) {
  // 상태 관리
  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [appointmentData, setAppointmentData] = React.useState({
    patientName: "",
    patientPhone: "",
    appointmentType: "일반예약",
    memo: "",
    dateStr: "",
    timeStr: ""
  });
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
  
  // 현재 날짜가 속한 주의 월요일부터 7일간의 날짜 생성
  const days = React.useMemo(() => {
    // 월요일을 주의 시작일로 설정 (0: 일요일, 1: 월요일, ...)
    const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(monday, i);
      return {
        date,
        dayName: format(date, "E", { locale: ko }),
        dayNumber: format(date, "d"),
        isToday: isSameDay(date, new Date())
      };
    });
  }, [selectedDate]);
  
  // 09:00부터 21:00까지 30분 간격의 시간 슬롯 생성
  const generateTimeSlots = React.useCallback(() => {
    const slots: TimeSlot[] = [];
    
    days.forEach(day => {
      for (let hour = 9; hour < 21; hour++) {
        for (let minute of [0, 30]) {
          const date = setMinutes(setHours(day.date, hour), minute);
          const timeString = format(date, "HH:mm");
          
          // 예약 정보와 매칭
          const appointment = confirmedAppointments.find(app => {
            const appointmentDate = app.reservation_day0 && app.reservation_time0 ? 
              `${app.reservation_day0} ${app.reservation_time0}` : null;
              
            if (!appointmentDate) return false;
            
            const appDate = new Date(appointmentDate);
            return isSameDay(appDate, day.date) && 
                  format(appDate, "HH:mm") === timeString;
          });
          
          slots.push({
            time: timeString,
            displayTime: format(date, "HH:mm"),
            date,
            isBooked: !!appointment,
            appointmentId: appointment?.id,
            patientName: appointment?.reservation_name,
            appointmentType: appointment?.appointment_type || "일반예약"
          });
        }
      }
    });
    
    return slots;
  }, [days, confirmedAppointments]);
  
  // 시간 슬롯 초기화 및 업데이트
  React.useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [generateTimeSlots]);

  // 시간 슬롯 클릭 핸들러
  const handleTimeSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    
    if (slot.isBooked) {
      // 예약된 슬롯이면 예약 정보 표시
      const appointment = confirmedAppointments.find(app => app.id === slot.appointmentId);
      if (appointment) {
        setAppointmentData({
          patientName: appointment.reservation_name,
          patientPhone: appointment.reservation_phone || "",
          appointmentType: appointment.appointment_type || "일반예약",
          memo: appointment.memo || "",
          dateStr: format(slot.date, "yyyy-MM-dd"),
          timeStr: slot.time
        });
      }
    } else {
      // 빈 슬롯이면 새 예약 입력 준비
      setAppointmentData({
        patientName: "",
        patientPhone: "",
        appointmentType: "일반예약",
        memo: "",
        dateStr: format(slot.date, "yyyy-MM-dd"),
        timeStr: slot.time
      });
    }
    
    // 기본적으로 현재 날짜의 가능한 시간대 계산
    updateAvailableTimes(format(slot.date, "yyyy-MM-dd"));
    
    setIsDialogOpen(true);
  };
  
  // 날짜 변경 시 사용 가능한 시간대 업데이트
  const updateAvailableTimes = (dateStr: string) => {
    // 전체 시간대 (9:00 ~ 20:30, 30분 간격)
    const allTimes: string[] = [];
    for (let hour = 9; hour < 21; hour++) {
      for (let minute of [0, 30]) {
        allTimes.push(format(setMinutes(setHours(new Date(), hour), minute), "HH:mm"));
      }
    }
    
    // 해당 날짜에 이미 예약된 시간대 찾기
    const bookedTimes = confirmedAppointments
      .filter(app => {
        // 현재 수정 중인 예약은 제외 (자신의 시간대는 선택 가능하게)
        if (selectedSlot?.appointmentId === app.id) return false;
        
        return app.reservation_day0 === dateStr;
      })
      .map(app => app.reservation_time0)
      .filter(Boolean) as string[];
    
    // 예약된 시간대를 제외한 사용 가능한 시간대
    const available = allTimes.filter(time => !bookedTimes.includes(time));
    setAvailableTimes(available);
  };
  
  // 날짜 입력 처리
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    
    // 날짜 형식 검증
    const isValidDate = isValid(parseISO(newDateStr));
    
    if (isValidDate) {
      setAppointmentData({...appointmentData, dateStr: newDateStr});
      
      // 날짜가 변경되면 해당 날짜의 사용 가능한 시간대 업데이트
      updateAvailableTimes(newDateStr);
    } else {
      setAppointmentData({...appointmentData, dateStr: newDateStr});
    }
  };
  
  // 시간 선택 처리
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppointmentData({...appointmentData, timeStr: e.target.value});
  };

  // appointmentData 부분 업데이트 핸들러
  const handleAppointmentDataChange = (data: Partial<typeof appointmentData>) => {
    setAppointmentData(prev => ({...prev, ...data}));
  };
  
  // 예약 저장 핸들러
  const handleSaveAppointment = async () => {
    if (!selectedSlot) return;
    
    try {
      // 입력값 검증
      if (!appointmentData.patientName.trim()) {
        alert("환자명을 입력해주세요.");
        return;
      }
      
      // 날짜 및 시간 검증 (수정 시)
      if (selectedSlot.isBooked) {
        if (!appointmentData.dateStr) {
          alert("날짜를 선택해주세요.");
          return;
        }
        
        if (!appointmentData.timeStr) {
          alert("시간을 선택해주세요.");
          return;
        }
      }
      
      // 날짜 및 시간 포맷팅
      const dateStr = selectedSlot.isBooked ? appointmentData.dateStr : format(selectedSlot.date, "yyyy-MM-dd");
      const timeStr = selectedSlot.isBooked ? appointmentData.timeStr : selectedSlot.time;
      
      // 기존 예약 수정인지 새 예약 추가인지 확인
      if (selectedSlot.isBooked && selectedSlot.appointmentId) {
        // 기존 예약 수정 API 호출
        const response = await fetch('/api/admin/update-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appointmentId: selectedSlot.appointmentId,
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
        
        console.log("예약 수정 성공:", result);
        
        // 다이얼로그 닫기
        setIsDialogOpen(false);
        
        // 시간 슬롯 업데이트 - 먼저 UI 상태 업데이트
        const updatedSlots = timeSlots.map(slot => {
          if (slot.appointmentId === selectedSlot.appointmentId) {
            console.log(`슬롯 업데이트: ID ${slot.appointmentId}, 새 유형: ${appointmentData.appointmentType}`);
            return {
              ...slot,
              patientName: appointmentData.patientName,
              appointmentType: appointmentData.appointmentType
            };
          }
          return slot;
        });
        
        // 타임슬롯 상태 업데이트 (비동기 방식에서 즉시 실행되도록)
        setTimeSlots([...updatedSlots]);
        
        // 성공 메시지 표시
        alert(`예약이 성공적으로 수정되었습니다.`);
        
        // 부모 컴포넌트에 업데이트 알림
        if (onAppointmentUpdated) {
          onAppointmentUpdated();
        }
      } else {
        // 새 예약 추가 API 호출
        const response = await fetch('/api/admin/add-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientName: appointmentData.patientName,
            patientPhone: appointmentData.patientPhone,
            dateStr: dateStr,
            timeStr: timeStr,
            memo: appointmentData.memo,
            appointmentType: appointmentData.appointmentType
          }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || '예약 추가 중 오류가 발생했습니다');
        }
        
        console.log("예약 저장 성공:", result);
        
        // 다이얼로그 닫기
        setIsDialogOpen(false);
        
        // 방금 추가된 예약의 ID 가져오기
        const newAppointmentId = result.data?.[0]?.id;
        
        // 성공 메시지 표시
        alert(`예약이 성공적으로 추가되었습니다.`);
        
        // 부모 컴포넌트에 업데이트 알림
        if (onAppointmentUpdated) {
          onAppointmentUpdated();
        }
        
        // 시간 슬롯 업데이트
        const updatedSlots = timeSlots.map(slot => {
          if (isSameDay(slot.date, selectedSlot.date) && slot.time === selectedSlot.time) {
            return {
              ...slot,
              isBooked: true,
              patientName: appointmentData.patientName,
              appointmentType: appointmentData.appointmentType,
              appointmentId: newAppointmentId
            };
          }
          return slot;
        });
        
        setTimeSlots([...updatedSlots]);
      }
    } catch (error) {
      console.error("예약 저장 중 오류 발생:", error);
      
      // 상세 오류 정보 출력
      if (error instanceof Error) {
        alert(`예약 저장 중 오류가 발생했습니다: ${error.message}`);
      } else {
        alert("예약 저장 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.");
      }
    }
  };
  
  // 예약 삭제 핸들러
  const handleDeleteAppointment = async () => {
    if (!selectedSlot || !selectedSlot.appointmentId) return;
    
    // 사용자에게 삭제 확인
    const isConfirmed = window.confirm('정말로 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!isConfirmed) return;
    
    try {
      // 예약 삭제 API 호출
      const response = await fetch('/api/admin/delete-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedSlot.appointmentId
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '예약 삭제 중 오류가 발생했습니다');
      }
      
      console.log("예약 삭제 성공:", result);
      
      // 다이얼로그 닫기
      setIsDialogOpen(false);
      
      // 성공 메시지 표시
      alert(`예약이 성공적으로 삭제되었습니다.`);
      
      // 부모 컴포넌트에 업데이트 알림
      if (onAppointmentUpdated) {
        onAppointmentUpdated();
      }
      
      // 시간 슬롯 업데이트
      const updatedSlots = timeSlots.map(slot => {
        if (slot.appointmentId === selectedSlot.appointmentId) {
          return {
            ...slot,
            isBooked: false,
            patientName: undefined,
            appointmentType: undefined,
            appointmentId: undefined
          };
        }
        return slot;
      });
      
      setTimeSlots([...updatedSlots]);
    } catch (error) {
      console.error("예약 삭제 중 오류 발생:", error);
      
      // 상세 오류 정보 출력
      if (error instanceof Error) {
        alert(`예약 삭제 중 오류가 발생했습니다: ${error.message}`);
      } else {
        alert("예약 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.");
      }
    }
  };
  
  // 변경 취소 핸들러
  const handleCancelDialog = () => {
    setIsDialogOpen(false);
  };
  
  // 달력 날짜를 이전/다음으로 이동
  const changeWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'prev' ? addDays(prev, -7) : addDays(prev, 7)
    );
  };
  
  // 현재 표시된 주의 날짜 범위 텍스트
  const weekRangeText = React.useMemo(() => {
    if (days.length === 0) return "";
    
    const firstDay = days[0].date;
    const lastDay = days[6].date;
    
    // 같은 월인 경우 간략하게 표시
    if (format(firstDay, "yyyy-MM") === format(lastDay, "yyyy-MM")) {
      return `${format(firstDay, "yyyy년 MM월 dd일", { locale: ko })} - ${format(lastDay, "dd일", { locale: ko })}`;
    }
    
    // 다른 월인 경우 전체 날짜 표시
    return `${format(firstDay, "yyyy년 MM월 dd일", { locale: ko })} - ${format(lastDay, "yyyy년 MM월 dd일", { locale: ko })}`;
  }, [days]);
  
  // 헤더 렌더링
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <Button onClick={() => changeWeek('prev')} variant="outline" size="sm" className="px-2">
        &lt; 이전 주
      </Button>
      <h2 className="text-lg font-medium">
        {weekRangeText}
      </h2>
      <Button onClick={() => changeWeek('next')} variant="outline" size="sm" className="px-2">
        다음 주 &gt;
      </Button>
    </div>
  );
  
  // 시간대별 그리드 렌더링
  const renderTimeGrid = () => {
    // 시간별로 그룹화 (09:00, 09:30, 10:00, ...)
    const timeGroups: Record<string, TimeSlot[]> = {};
    
    timeSlots.forEach(slot => {
      if (!timeGroups[slot.time]) {
        timeGroups[slot.time] = [];
      }
      timeGroups[slot.time].push(slot);
    });
    
    if (Object.keys(timeGroups).length === 0) {
      return (
        <div className="border rounded-lg p-8 text-center bg-gray-50">
          <p className="text-gray-500 mb-2">시간 슬롯 정보를 불러오지 못했습니다.</p>
          <p className="text-sm text-gray-400">데이터베이스 구조 업데이트를 실행한 후 새로고침해 주세요.</p>
        </div>
      );
    }
    
    // 시간 슬롯 그룹화 (오전/오후)
    const morningTimes: string[] = [];
    const afternoonTimes: string[] = [];
    
    Object.keys(timeGroups).forEach(time => {
      const hour = parseInt(time.split(":")[0]);
      if (hour < 12) {
        morningTimes.push(time);
      } else {
        afternoonTimes.push(time);
      }
    });
    
    // 시간대 정렬
    morningTimes.sort();
    afternoonTimes.sort();
    
    return (
      <div className="border rounded-lg overflow-hidden">
        {/* 요일 헤더 (고정) */}
        <div className="grid grid-cols-8 border-b bg-gray-50">
          <div className="py-2 px-3 text-center text-sm font-medium border-r">
            시간
          </div>
          {days.map((day, index) => (
            <div 
              key={index} 
              className={cn(
                "py-2 px-2 text-center text-xs font-medium border-r last:border-r-0",
                day.isToday && "bg-blue-50",
                day.dayName === "토" && "text-blue-500",
                day.dayName === "일" && "text-red-500"
              )}
            >
              {day.dayName} ({day.dayNumber})
            </div>
          ))}
        </div>
        
        {/* 오전 시간대 */}
        {morningTimes.length > 0 && (
          <>
            <div className="grid grid-cols-8 border-b bg-yellow-50">
              <div className="py-1 px-3 text-left text-xs font-semibold col-span-8 text-yellow-700">
                오전
              </div>
            </div>
            {morningTimes.map(time => renderTimeRow(time, timeGroups[time]))}
          </>
        )}
        
        {/* 오후 시간대 */}
        {afternoonTimes.length > 0 && (
          <>
            <div className="grid grid-cols-8 border-b bg-blue-50">
              <div className="py-1 px-3 text-left text-xs font-semibold col-span-8 text-blue-700">
                오후
              </div>
            </div>
            {afternoonTimes.map(time => renderTimeRow(time, timeGroups[time]))}
          </>
        )}
      </div>
    );
  };
  
  // 시간대 행 렌더링 함수 (중복 코드 제거)
  const renderTimeRow = (time: string, slots: TimeSlot[]) => {
    const hour = parseInt(time.split(":")[0]);
    const isHalfHour = time.includes(":30");
    
    // 예약 유형에 따른 색상 지정 함수
    const getAppointmentTypeStyles = (type?: string) => {
      switch(type) {
        case "응급":
          return "bg-red-100 text-red-800";
        case "상담":
          return "bg-green-100 text-green-800";
        case "수술":
          return "bg-purple-100 text-purple-800";
        case "일반예약":
        default:
          return "bg-blue-100 text-blue-800";
      }
    };
    
    return (
      <div key={time} className={cn(
        "grid grid-cols-8 border-b last:border-b-0",
        // 홀수 시간대 (xx:00)는 기본 배경, 짝수 시간대 (xx:30)는 약간 어두운 배경
        isHalfHour ? "bg-gray-50/30" : "bg-white"
      )}>
        {/* 왼쪽 시간 표시 */}
        <div className={cn(
          "py-2 px-3 text-center text-sm font-medium border-r",
          // 시간 표시 칸도 행 전체 배경색과 동일하게 적용
          isHalfHour ? "bg-gray-100/70" : "bg-gray-50"
        )}>
          {time}
        </div>
        
        {/* 7일간의 슬롯 */}
        {slots.map((slot, index) => {
          // 예약 유형에 따른 배경색 결정
          const appointmentTypeStyle = slot.isBooked ? getAppointmentTypeStyles(slot.appointmentType) : "";
          const cellBgColor = slot.isBooked 
            ? (slot.appointmentType === "응급" ? "bg-red-50" : 
               slot.appointmentType === "상담" ? "bg-green-50" : 
               slot.appointmentType === "수술" ? "bg-purple-50" : 
               "bg-blue-50")
            : (isHalfHour ? "hover:bg-gray-100/50" : "hover:bg-gray-50");
          
          return (
            <div 
              key={index}
              onClick={() => handleTimeSlotClick(slot)}
              className={cn(
                "p-1 border-r last:border-r-0 min-h-[50px] cursor-pointer",
                cellBgColor
              )}
            >
              {slot.isBooked && (
                <div className={cn("text-xs p-1 rounded", appointmentTypeStyle)}>
                  <div className="font-medium truncate">{slot.patientName}</div>
                  <div>{slot.appointmentType || '일반예약'}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {renderHeader()}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {renderTimeGrid()}
        </div>
      </div>
      
      {/* 리팩토링된 모달 컴포넌트 사용 */}
      {selectedSlot && (
        selectedSlot.isBooked ? (
          <AppointmentEditModal
            isOpen={isDialogOpen}
            onClose={handleCancelDialog}
            selectedSlot={selectedSlot}
            appointmentData={appointmentData}
            availableTimes={availableTimes}
            onAppointmentDataChange={handleAppointmentDataChange}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            onSave={handleSaveAppointment}
            onDelete={handleDeleteAppointment}
          />
        ) : (
          <AppointmentCreateModal
            isOpen={isDialogOpen}
            onClose={handleCancelDialog}
            selectedSlot={selectedSlot}
            appointmentData={appointmentData}
            onAppointmentDataChange={handleAppointmentDataChange}
            onSave={handleSaveAppointment}
          />
        )
      )}
    </div>
  );
} 