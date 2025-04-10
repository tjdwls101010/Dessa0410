"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface ChatbotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportData: any
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatbotDialog({ open, onOpenChange, reportData }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 온누리마취통증의학과 AI 챗봇입니다. 통증 리포트나 병원 정보에 대해 궁금한 점이 있으시면 무엇이든 물어보세요.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // In a real implementation, this would send the message to the backend
      // For demo purposes, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a mock response based on the user's message
      let response = ""
      const lowerCaseMessage = userMessage.toLowerCase()

      if (lowerCaseMessage.includes("통증") && lowerCaseMessage.includes("원인")) {
        response = `설문 응답을 분석한 결과, 귀하의 통증은 주로 ${reportData.aiAnalysis.potentialCauses.join(", ")} 등이 원인일 가능성이 있습니다. 정확한 원인 파악을 위해서는 전문의 상담이 필요합니다.`
      } else if (lowerCaseMessage.includes("치료") || lowerCaseMessage.includes("치료법")) {
        response = `귀하의 상태에 적합한 치료법으로는 ${reportData.recommendedTreatments.map((t: any) => t.name).join(", ")} 등이 있습니다. 특히 ${reportData.recommendedTreatments[0].name}은(는) 귀하의 상태에 높은 적합성을 보입니다.`
      } else if (lowerCaseMessage.includes("예약") || lowerCaseMessage.includes("진료")) {
        response =
          "온누리마취통증의학과 진료 예약은 전화(02-123-4567) 또는 홈페이지를 통해 가능합니다. 평일 09:00-18:00, 토요일 09:00-13:00에 진료를 제공하고 있습니다."
      } else if (lowerCaseMessage.includes("위치") || lowerCaseMessage.includes("어디")) {
        response =
          "온누리마취통증의학과는 서울시 강남구 테헤란로 123에 위치하고 있습니다. 강남역 3번 출구에서 도보 5분 거리입니다."
      } else if (lowerCaseMessage.includes("슈로스")) {
        response =
          "슈로스 운동치료는 척추 측만증 및 자세 교정을 위한 특화된 운동 프로그램입니다. 온누리마취통증의학과에서는 환자 개개인의 상태에 맞춘 슈로스 운동치료를 제공하고 있습니다."
      } else if (lowerCaseMessage.includes("도수치료")) {
        response =
          "도수치료는 전문가의 손을 이용하여 관절과 근육의 기능을 회복시키는 치료법입니다. 온누리마취통증의학과에서는 숙련된 전문가들이 환자의 상태에 맞는 맞춤형 도수치료를 제공합니다."
      } else if (lowerCaseMessage.includes("물리치료")) {
        response =
          "물리치료는 열, 전기, 초음파 등 다양한 물리적 요소를 이용하여 통증을 완화하고 기능을 회복시키는 치료법입니다. 온누리마취통증의학과에서는 최신 장비를 활용한 효과적인 물리치료를 제공합니다."
      } else if (lowerCaseMessage.includes("비용") || lowerCaseMessage.includes("가격")) {
        response =
          "치료 비용은 환자의 상태와 필요한 치료에 따라 다릅니다. 정확한 비용은 진료 후 안내해 드리며, 대부분의 치료는 건강보험이 적용됩니다. 자세한 내용은 병원에 문의해 주세요."
      } else {
        response =
          "죄송합니다. 질문에 대한 정확한 답변을 드리기 어렵습니다. 더 구체적인 질문을 해주시거나, 자세한 상담은 병원에 직접 문의해 주시기 바랍니다."
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다. 메시지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            온누리마취통증의학과 AI 챗봇
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    <span className="text-xs font-medium">{message.role === "user" ? "사용자" : "AI 챗봇"}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs font-medium">AI 챗봇이 응답 중...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * 본 챗봇은 의학적 진단을 대체하지 않습니다. 정확한 진단과 치료를 위해서는 전문의 상담이 필요합니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

