"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button" // buttonVariants import 추가
import { ExternalLink, HelpCircle, Stethoscope } from "lucide-react" // Stethoscope 아이콘 추가
import type { FaqItem } from "@/lib/faq-data"
import { getTagColorClasses } from "@/lib/faq-data"
import { cn } from "@/lib/utils" // cn 함수 import 추가

interface FaqModalProps {
  faq: FaqItem | null
  isOpen: boolean
  onClose: () => void
}

export function FaqModal({ faq, isOpen, onClose }: FaqModalProps) {
  if (!faq) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col"> {/* 너비 및 높이 조정, flex 레이아웃 */}
        <DialogHeader className="pr-10"> {/* 닫기 버튼과 겹치지 않도록 패딩 추가 */}
          <DialogTitle className="text-2xl font-semibold mb-1">{faq.question_title}</DialogTitle> {/* 폰트 크기 및 굵기 조정 */}
          <div className="flex flex-wrap gap-2 mt-2"> {/* 태그 간격 조정 */}
            {faq.tag.map((tag) => {
              const { bg, text } = getTagColorClasses(tag)
              return (
                <Badge key={tag} variant="secondary" className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${bg} ${text} border-transparent`}> {/* 디자인 변경: secondary variant, 패딩, 둥근 모서리 */}
                  {tag}
                </Badge>
              )
            })}
          </div>
        </DialogHeader>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-6 pl-6 pb-6 -mr-6 -ml-6"> {/* 내부 스크롤 및 패딩 조정 */}
          <div className="mt-4"> {/* 상단 여백 추가 */}
            <div className="flex items-start gap-3 mb-3"> {/* 아이콘과 제목 정렬 */}
              <HelpCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" /> {/* 아이콘 추가 및 스타일 */}
              <h3 className="text-lg font-semibold text-foreground">질문 내용</h3> {/* 폰트 굵기 및 색상 조정 */}
            </div>
            <div className="bg-muted/60 p-4 rounded-lg ml-9"> {/* 배경색 변경, 들여쓰기 */}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{faq.question_content}</p> {/* 폰트 크기, 줄간격, 색상 조정 */}
            </div>
          </div>

          <div>
            <div className="flex items-start gap-3 mb-3"> {/* 아이콘과 제목 정렬 */}
               <Stethoscope className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" /> {/* 아이콘 추가 및 스타일 (다른 색상 사용) */}
              <h3 className="text-lg font-semibold text-foreground">원장님 답변</h3> {/* 폰트 굵기 및 색상 조정 */}
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg ml-9"> {/* 배경색 및 테두리 변경 (신뢰도 강조), 들여쓰기 */}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{faq.answer_content}</p> {/* 폰트 크기, 줄간격 조정 */}
            </div>
          </div>

          {faq.url && (
            <div className="flex justify-end pt-4 border-t border-border mt-6"> {/* 구분선 추가 및 여백 조정 */}
              {/* Button 컴포넌트 대신 a 태그에 직접 스타일 적용 */}
              <a
                href={faq.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }), // buttonVariants 사용
                  "text-primary hover:bg-primary/10" // 추가 스타일
                )}
              >
                <ExternalLink className="h-4 w-4" />
                <span>원본 보기</span>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
