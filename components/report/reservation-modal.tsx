"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogPortal, // DialogPortal import 추가
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Textarea import 추가
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // Supabase 클라이언트 추가

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerButton?: React.ReactNode; // Optional trigger button prop
}

// 시간 선택 옵션 생성 (09:00 ~ 17:30, 30분 간격) - 컴포넌트 외부 또는 내부에서 정의
const timeOptions: string[] = [];
for (let hour = 9; hour < 18; hour++) {
  timeOptions.push(`${String(hour).padStart(2, '0')}:00`);
  if (hour < 17) { // 17:30까지만 추가
      timeOptions.push(`${String(hour).padStart(2, '0')}:30`);
  }
}

export default function ReservationModal({ open, onOpenChange, triggerButton }: ReservationModalProps) {
  const [confirmationAlertOpen, setConfirmationAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 예약 폼 상태 (Modal 내부에서 관리하거나 props로 받을 수 있음. 여기서는 내부 관리)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [pref1Date, setPref1Date] = useState<Date | undefined>(undefined);
  const [pref1Time, setPref1Time] = useState<string | undefined>(undefined);
  const [pref2Date, setPref2Date] = useState<Date | undefined>(undefined);
  const [pref2Time, setPref2Time] = useState<string | undefined>(undefined);
  const [pref3Date, setPref3Date] = useState<Date | undefined>(undefined);
  const [pref3Time, setPref3Time] = useState<string | undefined>(undefined);
  const [memo, setMemo] = useState(""); // 메모 상태 추가 (올바른 위치로 이동)

  // 예약 폼 제출 핸들러
  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Supabase에 데이터 저장
      const { data, error } = await supabase.from('surveys').insert([
        {
          reservation_name: name,
          reservation_phone: phone,
          reservation_birth: birthDate ? format(birthDate, "yyyy-MM-dd") : null,
          reservation_memo: memo,
          reservation_day1: pref1Date ? format(pref1Date, "yyyy-MM-dd") : null,
          reservation_time1: pref1Time || null,
          reservation_day2: pref2Date ? format(pref2Date, "yyyy-MM-dd") : null,
          reservation_time2: pref2Time || null,
          reservation_day3: pref3Date ? format(pref3Date, "yyyy-MM-dd") : null,
          reservation_time3: pref3Time || null,
        }
      ]);

      if (error) throw error;

      console.log("Reservation Data saved:", {
        name,
        phone,
        birthDate: birthDate ? format(birthDate, "yyyy-MM-dd") : undefined,
        preference1: { date: pref1Date ? format(pref1Date, "yyyy-MM-dd") : undefined, time: pref1Time },
        preference2: { date: pref2Date ? format(pref2Date, "yyyy-MM-dd") : undefined, time: pref2Time },
        preference3: { date: pref3Date ? format(pref3Date, "yyyy-MM-dd") : undefined, time: pref3Time },
        memo,
      });
      
      // 예약 데이터 처리 후 확인 팝업 열기
      onOpenChange(false); // 예약 모달 닫기
      setConfirmationAlertOpen(true); // 확인 팝업 열기
    } catch (err) {
      console.error("Error saving reservation:", err);
      setError(err instanceof Error ? err.message : "예약 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 확인 팝업 닫기 핸들러
  const handleConfirmationClose = () => {
    setConfirmationAlertOpen(false);
    // 필요하다면 폼 초기화 로직 추가
    setName("");
    setPhone("");
    setBirthDate(undefined);
    setPref1Date(undefined);
    setPref1Time(undefined);
    setPref2Date(undefined);
    setPref2Time(undefined);
    setPref3Date(undefined);
    setPref3Time(undefined);
    setMemo(""); // 메모 초기화 추가 (올바른 위치로 이동)
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>진료 예약</DialogTitle>
            <DialogDescription>
              아래 정보를 입력하고 선호하는 예약 시간을 선택해주세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReservationSubmit}>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="col-span-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  연락처
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate" className="text-right">
                  생년월일
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? format(birthDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      initialFocus
                      locale={ko}
                      captionLayout="dropdown-buttons"
                      fromYear={1930}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* 메모 입력 필드 추가 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="memo" className="text-right">
                  메모
                </Label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="col-span-3"
                  placeholder="의사 선생님께 전달할 내용을 입력해주세요. (선택 사항)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-4 font-medium mb-2">예약 선호 시간</Label>
                {[1, 2, 3].map((priority) => (
                  <div key={priority} className="col-span-4 grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{priority}순위</Label>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !(priority === 1 ? pref1Date : priority === 2 ? pref2Date : pref3Date) && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {(priority === 1 ? pref1Date : priority === 2 ? pref2Date : pref3Date)
                              ? format((priority === 1 ? pref1Date : priority === 2 ? pref2Date : pref3Date)!, "PPP", { locale: ko })
                              : <span>날짜</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={priority === 1 ? pref1Date : priority === 2 ? pref2Date : pref3Date}
                            onSelect={priority === 1 ? setPref1Date : priority === 2 ? setPref2Date : setPref3Date}
                            initialFocus
                            locale={ko}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // 오늘 이전 날짜 비활성화
                          />
                        </PopoverContent>
                      </Popover>
                      <Select
                        value={priority === 1 ? pref1Time : priority === 2 ? pref2Time : pref3Time}
                        onValueChange={priority === 1 ? setPref1Time : priority === 2 ? setPref2Time : setPref3Time}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="시간" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "확인"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 예약 확인 팝업 */}
      <AlertDialog open={confirmationAlertOpen} onOpenChange={setConfirmationAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예약 요청 완료</AlertDialogTitle>
            <AlertDialogDescription>
              예약 요청이 성공적으로 접수되었습니다. 확정 여부는 병원에서 연락드릴 예정입니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmationClose}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}