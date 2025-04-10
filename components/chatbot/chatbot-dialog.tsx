"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown'; // react-markdown import 추가

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
    setIsLoading(true);

    // Log the received reportData prop structure right before using it
    console.log("ChatbotDialog handleSend received reportData:", JSON.stringify(reportData, null, 2));

    // Add check for reportData and surveyData itself before accessing id
    if (!reportData || !reportData.surveyData) {
        console.error("Report data or survey data is not available yet. reportData:", reportData); // Log the problematic data
        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: "죄송합니다. 리포트 데이터를 아직 불러오지 못했습니다. 잠시 후 다시 시도해주세요.", // More specific error
            },
        ]);
        setIsLoading(false);
        return;
    }

    // reportId 가져오기 (이제 reportData와 surveyData가 있음을 확신)
    const reportId = reportData.surveyData.id;

    if (!reportId) { // This check might be redundant now, but keep for safety
      console.error("Report ID not found in reportData.surveyData");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다. 현재 설문 정보를 찾을 수 없어 답변할 수 없습니다.",
        },
      ]);
      setIsLoading(false);
      return;
    }


    try {
      // --- 실제 API 호출 로직 ---
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          reportId: reportId, // reportData에서 가져온 ID 사용
        }),
      });

      if (!response.ok) {
        // 수정: errorData 변수 중복 선언 제거
        const errorText = await response.text(); // 먼저 텍스트로 읽기
        console.error("API request failed. Status:", response.status, "Response text:", errorText);
        let parsedErrorData = { error: `API request failed with status ${response.status}` }; // 기본 에러 객체
        try {
          parsedErrorData = JSON.parse(errorText); // JSON 파싱 시도
        } catch (parseError) {
          console.error("Failed to parse error response text as JSON:", parseError);
          // 파싱 실패 시 errorText 자체를 에러 메시지로 사용하거나 기본 메시지 유지
          parsedErrorData = { error: errorText || `API request failed with status ${response.status}` };
        }
        throw new Error(parsedErrorData.error || `API request failed with status ${response.status}`);
      }

      console.log("API response received, attempting to parse JSON..."); // 로그 추가
      const responseText = await response.text(); // 먼저 텍스트로 읽어보기
      console.log("API response text:", responseText); // 텍스트 내용 로깅
      const data = JSON.parse(responseText); // 텍스트를 JSON으로 파싱
      console.log("JSON parsed successfully:", data); // 로그 추가

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      console.log("State updated with new message."); // 로그 추가
      // --- API 호출 로직 끝 ---

    } catch (error) {
      // 수정: 에러 객체 전체와 에러 메시지를 더 자세히 로깅
      console.error("Detailed error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during message sending.";
      console.error("Error message extracted:", errorMessage);
      setMessages((prev) => [
        ...prev,
        // 복원: 에러 메시지 표시 부분
        {
          role: "assistant",
          content: "죄송합니다. 메시지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
        },
      ])
    } finally { // 복원: finally 블록
      setIsLoading(false)
    }
  } // 복원: handleSend 함수 닫는 괄호

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 수정: 채팅창 너비/높이/최대너비를 70vw/70vh로 설정 (w-[70vw], h-[70vh], max-w-[70vw]) */}
      <DialogContent className="w-[70vw] h-[70vh] max-w-[70vw] flex flex-col p-0">
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
                  {/* 수정: AI 챗봇 메시지에 ReactMarkdown 적용 (div로 감싸서 스타일 적용) */}
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none"> {/* div로 감싸고 className 이동 */}
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
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
