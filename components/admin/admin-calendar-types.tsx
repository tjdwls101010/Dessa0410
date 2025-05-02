// 타임슬롯 타입 정의
export interface TimeSlot {
  time: string;
  displayTime: string;
  date: Date;
  isBooked: boolean;
  appointmentId?: string;
  patientName?: string;
  appointmentType?: string;
}

// 예약 정보 타입 정의
export interface Appointment {
  id: string;
  created_at?: string;
  reservation_name: string;
  reservation_phone?: string;
  reservation_day0?: string;
  reservation_time0?: string;
  reservation_status?: string;
  appointment_type?: string; // 일반예약, 응급, 상담 등의 타입
  memo?: string;
}

export interface AdminCalendarProps {
  initialDate?: Date;
  confirmedAppointments?: Appointment[];
  onAppointmentUpdated?: () => void;
} 