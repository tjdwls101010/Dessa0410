"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  name: string
  reportId: string
  isLoggedIn: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (name: string, phone: string, password: string) => Promise<{success: boolean, error?: string}>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기화 시 사용자 세션 확인
  useEffect(() => {
    async function loadUserSession() {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.isLoggedIn) {
          setUser({
            name: data.name,
            reportId: data.reportId,
            isLoggedIn: true
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('세션 로딩 오류:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserSession()
  }, [])

  // 로그인 함수
  const login = async (name: string, phone: string, password: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // 에러를 던지는 대신 객체 반환
        return {
          success: false,
          error: data.error || '로그인 중 오류가 발생했습니다.'
        }
      }

      setUser({
        name,
        reportId: data.reportId,
        isLoggedIn: true
      })
      
      // 성공 시 success: true 반환
      return { success: true }
      
    } catch (error) {
      console.error('로그인 오류:', error)
      // 에러를 던지는 대신 객체 반환
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃 함수
  const logout = async () => {
    setIsLoading(true)
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      setUser(null)
      router.push('/')
      
    } catch (error) {
      console.error('로그아웃 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 