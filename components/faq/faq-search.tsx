"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { getAllTags, getTagColorClasses } from "@/lib/faq-data"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface FaqSearchProps {
  onSearch: (query: string) => void
  onTagsSelect: (tags: string[]) => void
  selectedTags: string[]
  isAndCondition: boolean
  onConditionChange: (isAnd: boolean) => void
}

export function FaqSearch({ onSearch, onTagsSelect, selectedTags, isAndCondition, onConditionChange }: FaqSearchProps) {
  const [query, setQuery] = useState("")
  const tags = getAllTags()

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  // 태그 선택/해제 처리
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그면 제거
      onTagsSelect(selectedTags.filter((t) => t !== tag))
    } else {
      // 선택되지 않은 태그면 추가
      onTagsSelect([...selectedTags, tag])
    }
  }

  // 모든 태그 선택 해제
  const clearAllTags = () => {
    onTagsSelect([])
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="증상, 부위, 질환 등을 검색해보세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 py-6 text-lg"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch id="condition-toggle" checked={isAndCondition} onCheckedChange={onConditionChange} />
          <Label htmlFor="condition-toggle" className="text-sm font-medium">
            {isAndCondition ? "AND 조건 (모든 태그 포함)" : "OR 조건 (하나라도 포함)"}
          </Label>
        </div>

        {selectedTags.length > 0 && (
          <button onClick={clearAllTags} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            선택 초기화
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const { bg, text } = getTagColorClasses(tag)
          const isSelected = selectedTags.includes(tag)

          return (
            <Badge
              key={tag}
              // variant 속성 제거하고 className으로만 스타일 제어
              className={`cursor-pointer border px-3 py-1 rounded-full text-sm font-medium transition-colors ${ // 기본 스타일 추가
                isSelected
                  ? tag === "전체" // '전체' 태그 선택 시
                    ? "bg-blue-600 text-white border-blue-600 ring-2 ring-offset-1 ring-blue-500" // 더 진한 파란색 배경, 흰색 텍스트, 파란 테두리 및 링
                    : "bg-primary text-primary-foreground border-primary ring-2 ring-offset-1 ring-primary" // 다른 태그 선택 시 primary 색상 및 링
                  : `${bg} ${text} border-transparent hover:opacity-80` // 선택 안 됐을 때: 정의된 색상, 투명 테두리, hover 효과
              }`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          )
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="text-sm text-muted-foreground">선택된 태그: {selectedTags.length}개</div>
      )}
    </div>
  )
}
