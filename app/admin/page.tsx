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
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>데이터를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
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
                        <form action={`/api/admin/reservation/cancel`} method="POST">
                          <input type="hidden" name="id" value={reservation.id} />
                          <Button 
                            type="submit"
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            disabled={reservation.reservation_status === 'cancelled'}
                          >
                            취소
                          </Button>
                        </form>
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