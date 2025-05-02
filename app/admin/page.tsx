import React from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReservationConfirmDialog } from '@/components/admin/reservation-confirm-dialog';
import { ReservationEditButton } from '@/components/admin/reservation-edit-button';
import { AdminCalendar } from '@/components/admin/admin-calendar';
import { ErrorDisplay } from '@/components/admin/error-display';
import Link from 'next/link';
import { BarChart3, Database } from 'lucide-react';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 날짜 포맷 함수
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 날짜와 시간을 합쳐서 표시하는 함수
function formatDateTime(date: string, time: string) {
  if (!date || !time) return '';
  return `${date} ${time}`;
}

// 타임스탬프를 날짜와 시간 형식으로 변환하는 함수
function formatTimestamp(timestamp: string) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  return `${dateStr} ${timeStr}`;
}

export default async function AdminPage() {
  // Supabase에서 예약 데이터 가져오기 (reservation_name이 NULL이 아닌 레코드만)
  const { data: reservations, error } = await supabase
    .from('surveys')
    .select('id, created_at, reservation_name, reservation_phone, reservation_birth, reservation_memo, reservation_day0, reservation_time0, reservation_day1, reservation_time1, reservation_day2, reservation_time2, reservation_day3, reservation_time3, reservation_status')
    .not('reservation_name', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
        
        <ErrorDisplay 
          title="데이터 불러오기 오류"
          message="예약 정보를 불러오는 중 문제가 발생했습니다."
          details={error}
          suggestions={[
            "Supabase 연결 정보가 올바른지 확인해주세요.",
            "데이터베이스 구조 업데이트를 실행해보세요.",
            "문제가 지속되면 개발자에게 연락해주세요."
          ]}
        />
        
        {/* 데이터베이스 마이그레이션 실행 버튼 */}
        <div className="mt-8 p-4 border rounded-md bg-white">
          <h2 className="text-lg font-medium mb-4">데이터베이스 문제 해결</h2>
          <p className="mb-4 text-gray-600">데이터베이스 구조를 업데이트하여 문제를 해결할 수 있습니다.</p>
          <Link href="/api/admin/db-migration/add-appointment-type" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>데이터베이스 구조 업데이트 실행</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 확정된 예약만 필터링 (AdminCalendar에 전달할 데이터)
  const confirmedAppointments = reservations?.filter(
    (res) => res.reservation_day0 && res.reservation_time0 && res.reservation_status === 'confirmed'
  ).map(appointment => ({
    ...appointment,
    appointment_type: '일반예약' // appointment_type 필드가 없으므로 기본값 제공
  })) || [];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      
      {/* 데이터베이스 마이그레이션 버튼 - 항상 표시
      <div className="bg-white p-4 rounded-md shadow-md mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-md font-medium">데이터베이스 구조 업데이트</h2>
          <p className="text-sm text-gray-500">예약 시스템에 필요한 필드를 추가합니다.</p>
        </div>
        <Link href="/api/admin/db-migration/add-appointment-type" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>업데이트 실행</span>
          </Button>
        </Link>
      </div> */}
      
      {/* 타임테이블 달력 섹션 */}
      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">진료 스케줄</h2>
        <AdminCalendar 
          confirmedAppointments={confirmedAppointments}
        />
      </div>
      
      {/* 기존 예약 테이블 섹션 */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">예약 요청 목록</h2>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>총 {reservations?.length || 0}건의 예약 요청이 있습니다.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">리포트</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>생년월일</TableHead>
                <TableHead>메모</TableHead>
                <TableHead>희망일1</TableHead>
                <TableHead>희망일2</TableHead>
                <TableHead>희망일3</TableHead>
                <TableHead>확정일</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations && reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <Button 
                        asChild
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-1 p-1 h-auto"
                      >
                        <Link 
                          href={`https://dessa0410.vercel.app/report/${reservation.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          <span>리포트</span>
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>{formatTimestamp(reservation.created_at)}</TableCell>
                    <TableCell>{reservation.reservation_name}</TableCell>
                    <TableCell>{reservation.reservation_phone}</TableCell>
                    <TableCell>{reservation.reservation_birth}</TableCell>
                    <TableCell>{reservation.reservation_memo}</TableCell>
                    <TableCell>{formatDateTime(reservation.reservation_day1, reservation.reservation_time1)}</TableCell>
                    <TableCell>{formatDateTime(reservation.reservation_day2, reservation.reservation_time2)}</TableCell>
                    <TableCell>{formatDateTime(reservation.reservation_day3, reservation.reservation_time3)}</TableCell>
                    <TableCell>
                      {reservation.reservation_day0 && reservation.reservation_time0 ? 
                        formatDateTime(reservation.reservation_day0, reservation.reservation_time0) : 
                        ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!reservation.reservation_day0 && (
                          <ReservationConfirmDialog
                            reservationId={reservation.id}
                            options={{
                              day1: reservation.reservation_day1,
                              time1: reservation.reservation_time1,
                              day2: reservation.reservation_day2,
                              time2: reservation.reservation_time2,
                              day3: reservation.reservation_day3,
                              time3: reservation.reservation_time3,
                            }}
                          />
                        )}
                        <ReservationEditButton
                          reservationId={reservation.id}
                          reservationDate={reservation.reservation_day0 || ''}
                          reservationTime={reservation.reservation_time0 || ''}
                          reservationName={reservation.reservation_name || ''}
                          reservationPhone={reservation.reservation_phone || ''}
                          isDisabled={reservation.reservation_status === 'cancelled'}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-6">
                    예약 요청이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}