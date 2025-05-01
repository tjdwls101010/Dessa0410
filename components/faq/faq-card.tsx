"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import type { FaqItem } from "@/lib/faq-data"
import { getTagColorClasses } from "@/lib/faq-data"

interface FaqCardProps {
  faq: FaqItem
  onClick: () => void
}

export function FaqCard({ faq, onClick }: FaqCardProps) {
  // 질문 내용 요약 (100자 제한)
  const questionSummary =
    faq.question_content.length > 100 ? `${faq.question_content.substring(0, 100)}...` : faq.question_content

  return (
    <Card className="h-full cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2">{faq.question_title}</h3>
          <MessageCircle className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{questionSummary}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <div className="flex flex-wrap gap-1">
          {faq.tags.map((tag) => {
            const { bg, text } = getTagColorClasses(tag)
            return (
              <Badge key={tag} variant="outline" className={`text-xs ${bg} ${text} border-transparent`}>
                {tag}
              </Badge>
            )
          })}
        </div>
      </CardFooter>
    </Card>
  )
}
