"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// 실제 로그인 폼 컴포넌트
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuth()
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 로그인 후 리다이렉트할 경로 (없으면 홈으로)
  const returnPath = searchParams.get('from') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Admin 계정 확인 (이름: 운영자, 전화번호: 12345678900, 비밀번호: 111111)
    if (name === "운영자" && phone === "12345678900" && password === "111111") {
      try {
        // 서버에 관리자 로그인 요청을 보내 세션 쿠키에 저장
        const response = await fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, phone, password }),
        });

        if (!response.ok) {
          throw new Error('관리자 로그인 처리 중 오류가 발생했습니다.');
        }

        setSuccess("관리자 로그인 성공! 관리자 페이지로 이동합니다...")
        setTimeout(() => {
          router.push('/admin') // /admin 경로로 리다이렉트
        }, 1000)
      } catch (error) {
        setError(error instanceof Error ? error.message : '관리자 로그인 처리 중 오류가 발생했습니다.');
      }
      return // Admin 로그인 처리 후 함수 종료
    }

    // 일반 사용자 로그인 (기존 Supabase 로직)
    const result = await login(name, phone, password)
    
    if (result.success) {
      setSuccess("로그인 성공! 리다이렉트 중...")
      
      // 로그인 성공 시 원래 접근하려던 페이지로 리다이렉트
      setTimeout(() => {
        router.push(returnPath)
      }, 1000)
    } else {
      setError(result.error || "로그인 중 오류가 발생했습니다.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-lg">이름</Label>
        <Input 
          id="name" 
          placeholder="예약하신 이름을 입력하세요" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required 
          className="h-12 text-lg"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="phone" className="text-lg">전화번호</Label>
        <Input 
          id="phone" 
          placeholder="010-0000-0000" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          required 
          className="h-12 text-lg"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="password" className="text-lg">예약 비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="SMS로 받으신 6자리 비밀번호"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            // 숫자만 입력 가능하고, 최대 6자리까지만 허용
            if (/^[0-9]*$/.test(value) && value.length <= 6) {
              setPassword(value);
            }
          }}
          maxLength={6} // 최대 입력 길이 제한
          required
          className="h-12 text-lg"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription className="text-base">{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={isLoading}>
        {isLoading ? "확인 중..." : "로그인"}
      </Button>
    </form>
  )
}

// 메인 로그인 페이지 컴포넌트
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 p-4 pt-20">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-2 px-6 py-6">
          <CardTitle className="text-3xl font-bold text-center">예약 확인</CardTitle>
          <CardDescription className="text-center text-lg">
            예약하실 때 입력하신 정보와 받으신 비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <Suspense fallback={<div className="text-center py-4">로딩 중...</div>}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-center text-base text-muted-foreground px-6 py-4">
          <p>예약하신 정보로 로그인하시면 예약 내용을 확인하실 수 있습니다.</p>
        </CardFooter>
      </Card>
    </div>
  )
} 