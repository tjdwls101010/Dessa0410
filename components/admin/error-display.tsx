"use client"

import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  title: string
  message: string
  details?: any
  suggestions?: string[]
}

export function ErrorDisplay({
  title,
  message,
  details,
  suggestions = []
}: ErrorDisplayProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(prev => !prev)
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-500 h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800">{title}</h3>
          <p className="text-red-700 mt-1">{message}</p>
          
          {suggestions.length > 0 && (
            <ul className="mt-2 text-sm text-red-600 list-disc pl-5 space-y-1">
              {suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          )}

          {details && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-100 hover:text-red-700"
                onClick={toggleExpanded}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>상세 내용 숨기기</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>상세 내용 보기</span>
                  </>
                )}
              </Button>
              
              {expanded && (
                <div className="mt-3 p-3 bg-white border border-red-200 rounded text-sm font-mono text-red-800 overflow-auto max-h-60">
                  <pre>{JSON.stringify(details, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 