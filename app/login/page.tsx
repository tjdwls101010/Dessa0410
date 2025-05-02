"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">예약 확인</CardTitle>
          <CardDescription className="text-center">
            예약하실 때 입력하신 정보와 받으신 비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input 
                id="name" 
                placeholder="예약하신 이름을 입력하세요" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input 
                id="phone" 
                placeholder="010-0000-0000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">예약 비밀번호</Label>
              <Input 
                id="password" 
                placeholder="SMS로 받으신 6자리 비밀번호" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "확인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>예약하신 정보로 로그인하시면 예약 내용을 확인하실 수 있습니다.</p>
        </CardFooter>
      </Card>
    </div>
  )
} 