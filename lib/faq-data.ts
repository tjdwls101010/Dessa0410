import qnaData from "@/Documents/References/QnA.json"; // QnA.json 파일 import

export interface FaqItem {
  id: string;
  question_title: string;
  question_content: string;
  answer_content: string;
  url?: string;
  tag: string[]; // 'tags'에서 'tag'로 변경 (QnA.json 형식에 맞춤)
}

// FAQ 데이터 배열 (QnA.json 데이터 사용)
export const faqData: FaqItem[] = qnaData.map((item) => ({
  ...item,
  id: item.id.toString(), // id를 string으로 변환
}));

// 모든 태그 목록을 가져오는 함수
export function getAllTags(): string[] {
  const allTags = new Set<string>();
  faqData.forEach((item) => {
    item.tag.forEach((tag) => allTags.add(tag)); // 'tags'에서 'tag'로 변경
  });
  // 사용자가 제공한 새 태그 목록으로 고정하고 정렬
  const fixedTags = [
    "허리/등/척추", "무릎", "어깨", "발/발목", "손/팔",
    "통증", "인대/근육", "신경통/저림", "관절염/퇴행성", "연골",
    "운동/재활", "자세/보행", "주사/시술", "검사", "수술"
  ];
  // 실제 데이터에 있는 태그와 고정 태그 목록을 합치고 중복 제거 후 정렬
  fixedTags.forEach(tag => allTags.add(tag));
  return Array.from(allTags).sort();
}

// 검색어에 따라 FAQ 항목을 필터링하고 점수 기반으로 정렬하는 함수
export function searchFaq(query: string): FaqItem[] {
  if (!query.trim()) return faqData;

  const lowerQuery = query.toLowerCase();

  // 1. 검색어 포함 항목 필터링
  const filteredItems = faqData.filter(
    (item) =>
      item.question_title.toLowerCase().includes(lowerQuery) ||
      item.question_content.toLowerCase().includes(lowerQuery) ||
      item.answer_content.toLowerCase().includes(lowerQuery) ||
      item.tag.some((tag) => tag.toLowerCase().includes(lowerQuery)), // 'tags'에서 'tag'로 변경
  );

  // 2. 각 항목에 점수 계산
  const scoredItems = filteredItems.map((item) => {
    let score = 0;
    if (item.question_title.toLowerCase().includes(lowerQuery)) {
      score += 3; // 제목 포함 시 3점
    }
    if (item.tag.some((tag) => tag.toLowerCase().includes(lowerQuery))) { // 'tags'에서 'tag'로 변경
      score += 2; // 태그 포함 시 2점
    }
    if (item.question_content.toLowerCase().includes(lowerQuery)) {
      score += 1; // 질문 내용 포함 시 1점
    }
    if (item.answer_content.toLowerCase().includes(lowerQuery)) {
      score += 1; // 답변 내용 포함 시 1점
    }
    // FaqItem 타입에 score 속성이 없으므로, 새로운 객체를 반환.
    return { ...item, score };
  });

  // 3. 점수 기준으로 내림차순 정렬
  scoredItems.sort((a, b) => b.score - a.score);

  // 4. score 속성 제거 후 반환 (FaqItem 타입 유지)
  return scoredItems.map(({ score, ...rest }) => rest as FaqItem);
}

// 태그로 FAQ 항목을 필터링하는 함수
export function filterByTag(tag: string): FaqItem[] {
  if (!tag) return faqData;
  return faqData.filter((item) => item.tag.includes(tag)); // 'tags'에서 'tag'로 변경
}

// 여러 태그로 FAQ 항목을 필터링하는 함수 (OR 조건)
export function filterByTagsOr(tags: string[]): FaqItem[] {
  if (!tags.length) return faqData;
  return faqData.filter((item) => item.tag.some((tag) => tags.includes(tag))); // 'tags'에서 'tag'로 변경
}

// 여러 태그로 FAQ 항목을 필터링하는 함수 (AND 조건)
export function filterByTagsAnd(tags: string[]): FaqItem[] {
  if (!tags.length) return faqData;
  return faqData.filter((item) => tags.every((tag) => item.tag.includes(tag))); // 'tags'에서 'tag'로 변경
}

// 태그 색상 매핑 (새로운 태그 목록 반영)
export const tagColors: Record<string, { bg: string; text: string }> = {
  "허리/등/척추": { bg: "bg-green-100", text: "text-green-800" },
  무릎: { bg: "bg-amber-100", text: "text-amber-800" },
  어깨: { bg: "bg-blue-100", text: "text-blue-800" },
  "발/발목": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "손/팔": { bg: "bg-cyan-100", text: "text-cyan-800" },
  통증: { bg: "bg-red-100", text: "text-red-800" },
  "인대/근육": { bg: "bg-emerald-100", text: "text-emerald-800" }, // 다른 태그와 통일성 있게 수정
  "신경통/저림": { bg: "bg-indigo-100", text: "text-indigo-800" },
  "관절염/퇴행성": { bg: "bg-lime-100", text: "text-lime-800" },
  "연골": { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
  "운동/재활": { bg: "bg-emerald-100", text: "text-emerald-800" },
  "자세/보행": { bg: "bg-rose-100", text: "text-rose-800" },
  "주사/시술": { bg: "bg-sky-100", text: "text-sky-800" },
  검사: { bg: "bg-stone-100", text: "text-stone-800" },
  수술: { bg: "bg-violet-100", text: "text-violet-800" },
};

// 태그에 대한 색상 클래스를 가져오는 함수
export function getTagColorClasses(tag: string): { bg: string; text: string } {
  return tagColors[tag] || { bg: "bg-gray-100", text: "text-gray-800" };
}
