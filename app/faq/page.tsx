"use client"

import { useState } from "react"
import { FaqSearch } from "@/components/faq/faq-search"
import { FaqCard } from "@/components/faq/faq-card"
import { FaqModal } from "@/components/faq/faq-modal"
import { searchFaq, filterByTagsOr, filterByTagsAnd, type FaqItem } from "@/lib/faq-data"

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAndCondition, setIsAndCondition] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 검색어와 태그로 필터링된 FAQ 목록
  const filteredFaqs = (() => {
    // 먼저 검색어로 필터링
    const searchResults = searchFaq(searchQuery)

    // 선택된 태그가 없으면 검색 결과만 반환
    if (selectedTags.length === 0) {
      return searchResults
    }

    // 선택된 태그로 추가 필터링 (AND 또는 OR 조건)
    const tagFilterFunction = isAndCondition ? filterByTagsAnd : filterByTagsOr
    return searchResults.filter((faq) => tagFilterFunction(selectedTags).includes(faq))
  })()

  // FAQ 카드 클릭 시 모달 열기
  const handleFaqClick = (faq: FaqItem) => {
    setSelectedFaq(faq)
    setIsModalOpen(true)
  }

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
        <p className="text-muted-foreground mb-8">
          온누리마취통증의학과 원장님이 답변한 통증 관련 질문들을 검색해보세요.
        </p>

        <FaqSearch
          onSearch={setSearchQuery}
          onTagsSelect={setSelectedTags}
          selectedTags={selectedTags}
          isAndCondition={isAndCondition}
          onConditionChange={setIsAndCondition}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {filteredFaqs.length > 0 ? `검색 결과 (${filteredFaqs.length})` : "검색 결과가 없습니다"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaqs.map((faq) => (
              <FaqCard key={faq.id} faq={faq} onClick={() => handleFaqClick(faq)} />
            ))}
          </div>
        </div>

        <FaqModal faq={selectedFaq} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  )
}
