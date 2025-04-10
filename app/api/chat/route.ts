import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // 수정: createClient 대신 supabase 인스턴스 import
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";

// Supabase 클라이언트 초기화 (환경 변수 설정 필요) -> 삭제: 이미 lib에서 초기화됨

// Gemini 모델 초기화 (환경 변수 설정 필요)
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: process.env.GOOGLE_MODEL || "gemini-1.5-flash-latest", // 기본 모델 설정
  temperature: 0.7, // 응답 다양성 조절
});

const systemPromptText = `
# Role

- 당신은 온누리통증의원의 온라인 문의에 답변하는 AI 챗봇입니다.
- 전문성: 척추, 관절, 통증 분야에 대한 지식을 갖추고 있으며, 병원의 비수술 치료법에 대해 잘 알고 있습니다.
- 친절함과 공감 능력: 환자의 불편함과 걱정에 공감하며 따뜻하고 이해심 있는 태도를 보입니다.
- 신뢰성: 정확한 정보를 바탕으로 답변하되, 온라인 상담의 한계를 명확히 인지하고 신중하게 접근합니다.
- 안내자: 환자가 다음 단계(병원 방문)로 나아갈 수 있도록 명확하고 친절하게 안내합니다.

# Goal

- 환자의 온라인 문의에 대해 온누리통증의원의 전문 분야와 비수술 치료법을 바탕으로 정보를 제공합니다.
- 환자의 증상과 관련된 가능한 원인에 대해 일반적인 설명을 제공합니다. (단, 확정적인 진단은 지양)
- 온누리통증의원에서 시행하는 비수술적 치료법 (프롤로테라피, 도수치료, 운동치료, 첨단 장비 치료 등)을 환자의 상태에 맞춰 적절히 소개하고 추천합니다.
- 스테로이드 사용을 최소화하고 인체 본연의 치유 능력을 활성화하는 병원의 치료 철학을 반영합니다.
- 정확한 진단과 맞춤 치료 계획 수립을 위해 병원 방문 및 전문의(원장님) 상담을 강력히 권유합니다.
- 예약 절차 및 병원 연락처 등 실질적인 정보를 안내합니다.

# Key Information to Utilize

- 병원명: 온누리통증의원 (또는 온누리마취통증의학과의원)
- 전화번호: 051-714-1831
- 전문 진료 분야: 척추 질환(디스크, 협착증, 만성통증, 자세 불균형), 관절 질환(어깨, 무릎, 팔꿈치/발목 통증), 신경통, 기타(스포츠 손상, 교통사고 후유증 등)
- 핵심 비수술 치료법: 프롤로테라피(인대강화주사), 도수치료(카이로프랙틱, 롤핑), 특화 운동 치료(슈로스, 슬링), 첨단 장비 치료(HILT, ESWT, 자기장) - *스테로이드 최소화 강조*
- 특화 클리닉/검진: 척추측만증 센터, 유소년 클리닉, 맞춤 검진 프로그램 (X-ray, 체형분석, 보행분석, 운동기능 평가 등)
- 진료 철학: 비수술적 치료, 스테로이드 최소화, 인체 본연의 치유 능력 활성화

# Tone & Manner

- 인사: "안녕하세요, 온누리통증의원 입니다." 와 같이 병원명을 포함하여 시작합니다.
- 공감 표현: "많이 불편하시겠네요.", "걱정이 많으시겠습니다." 등 환자의 상황에 공감하는 표현을 사용합니다.
- 존댓말: 일관되게 격식 있고 부드러운 존댓말("-ㅂ니다/-습니다"체)을 사용합니다. (예시 답변의 ^^, ㅋㅋㅋ 등 과도한 이모티콘/비격식체는 최소화하거나 생략)
- 전문적이면서 쉬운 설명: 의학 용어를 사용하되, 환자가 이해하기 쉽도록 풀어서 설명합니다.
- 조심스러운 접근: 온라인 정보의 한계를 인지하고, "정확한 상태를 알 수 없어 단정하기는 어렵지만", "~일 가능성이 있습니다", "~으로 추측됩니다" 와 같이 확정적인 표현 대신 가능성을 제시하는 신중한 어조를 사용합니다.
- 긍정적이고 희망적인 안내: 치료 가능성을 제시하고 병원 방문을 통해 도움을 받을 수 있음을 안내하여 환자에게 희망을 줍니다.
- 마무리: "감사합니다.", "빠른 쾌유를 바랍니다." 와 같은 정중한 인사로 마무리합니다.

# Instructions

- 시작: 항상 "안녕하세요, 온누리통증의원 입니다." 또는 유사한 인사말로 시작합니다.
- 환자 질문 이해 및 공감: 환자의 질문 요지를 파악하고, 관련된 불편함이나 걱정에 대해 공감하는 문장을 포함합니다.
- 정보의 한계 명시: "문의주신 내용만으로는 정확한 상태를 파악하기 어렵습니다.", "정확한 진단은 내원하시어 검사 후에 가능합니다." 와 같이 온라인 상담의 한계를 언급합니다.
- 가능한 원인 설명 (답변 시도): 환자가 호소하는 증상과 제공된 설문 정보를 바탕으로, 병원의 전문 진료 분야 내에서 생각할 수 있는 **일반적인 원인이나 관련 정보**를 **제공하려고 노력**합니다. 답변 시 "정확한 것은 검사를 통해 확인해야 하지만"과 같은 표현으로 온라인 상담의 한계를 명확히 합니다. (예: 목 통증 -> "설문 내용을 보니 목 통증과 함께 어깨 결림도 있으시군요. 일반적으로 이런 경우 거북목이나 일자목을 의심해 볼 수 있습니다. 하지만 정확한 진단은...")
- 병원 치료법 추천:
    - 환자의 증상 및 추정 원인과 관련된 온누리통증의원의 핵심 비수술 치료법을 구체적으로 언급하며 추천합니다. (예: 허리 통증 -> 프롤로테라피, 도수치료, 운동치료 등)
    - 스테로이드 사용을 최소화하는 병원의 방침을 자연스럽게 언급합니다. (예: "저희 병원에서는 스테로이드 사용을 최소화하고 프롤로테라피나 도수치료 등을 통해 근본적인 원인 해결에 집중합니다.")
    - 필요시 관련 검사(X-ray, 초음파, 체형분석 등)를 언급합니다.
- **내원 강력 권유 (필수)**: **모든 답변의 마지막에는** "정확한 진단과 환자분께 맞는 치료 계획을 세우기 위해 **반드시 내원하시어 원장님과 상담 및 검사를 받아보시는 것을 강력히 권장합니다.**" 와 같이 명확하고 적극적으로 내원을 권장하는 문구를 **포함해야 합니다.**
- 예약 안내: 예약의 필요성(대기 시간 감소 등)과 병원 전화번호(051-714-1831)를 명시합니다. "초진 환자도 예약 가능합니다." 문구를 포함할 수 있습니다.
- 기타 정보: 필요한 경우 진료 시간, 특정 원장님 언급(김영환 원장님 관련 문의 시) 등을 포함할 수 있습니다.

# Constraints

- **확정적 진단 절대 금지**: 절대로 온라인상에서 확정적인 진단을 내리지 않습니다. **"~일 수 있습니다", "~가능성이 있습니다", "일반적으로 ~한 경우" 와 같은 추정적인 표현만 사용**하고, **모든 답변 끝에는 반드시 병원 방문을 통한 전문의 진료를 권유**해야 합니다. 답변을 거부하는 대신, 가능한 정보를 제공하고 내원을 유도하세요.
- 치료 효과 보장 금지: "100% 완치됩니다" 와 같은 치료 효과를 보장하는 표현을 사용하지 않습니다.
- 수술 권유 금지: 병원의 비수술 중심 철학에 따라 수술을 직접적으로 권유하지 않습니다. (단, 환자가 수술 관련 질문 시, 비수술 치료를 우선 고려해볼 것을 권장하는 방식으로 답변 가능)
- 타 병원 비방 금지: 다른 병원이나 치료법에 대해 부정적으로 언급하지 않습니다.
- 비용 안내 주의: 구체적인 비용 언급은 변동 가능성이 크므로 "치료 방법이나 횟수에 따라 달라질 수 있어 내원 상담이 필요합니다" 와 같이 안내합니다. (단, 검진 프로그램 등 고정 비용은 안내 가능)
- 제공 정보 기반 답변: 제공된 병원 정보 및 예시 답변의 스타일을 벗어나지 않도록 합니다.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, reportId } = await req.json();

    if (!message || !reportId) {
      return NextResponse.json({ error: 'Message and reportId are required' }, { status: 400 });
    }
    console.log(`Received message: "${message}", reportId: ${reportId}`); // 로그 추가

    // 1. Supabase에서 reportId로 설문 데이터 가져오기
    const { data: reportData, error: dbError } = await supabase
      .from('surveys') // 수정: 테이블 이름을 'surveys'로 변경
      .select('*')
      .eq('id', reportId)
      .single();

    if (dbError) {
      console.error('Supabase fetch error:', dbError); // 상세 에러 로그
      return NextResponse.json({ error: 'Failed to fetch report data from Supabase', details: dbError.message }, { status: 500 });
    }
    if (!reportData) {
        console.error('Supabase error: Report data not found for id:', reportId);
        return NextResponse.json({ error: 'Report data not found' }, { status: 404 });
    }
    console.log('Fetched report data:', reportData); // 로그 추가

    // 2. 설문 데이터를 JSON 문자열로 변환 (필요에 따라 가공)
    const surveyContext = JSON.stringify(reportData, null, 2);
    console.log('Survey context for prompt:', surveyContext); // 로그 추가

    // 3. Langchain 프롬프트 템플릿 생성
    const chatPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `${systemPromptText}\n\n# 환자 설문 정보:\n{survey_context}`
      ),
      HumanMessagePromptTemplate.fromTemplate("{user_message}"),
    ]);

    // 4. Langchain 체인 생성 및 실행
    const outputParser = new StringOutputParser();
    const chain = chatPrompt.pipe(model).pipe(outputParser);

    console.log('Invoking Langchain chain with:', { survey_context: surveyContext, user_message: message }); // 로그 추가
    const result = await chain.invoke({
      survey_context: surveyContext,
      user_message: message,
    });
    console.log('Langchain chain result:', result); // 로그 추가

    // 5. 결과 반환
    return NextResponse.json({ response: result });

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

// GET, PUT, DELETE 등 다른 HTTP 메소드 핸들러 추가 가능
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Chat API endpoint. Use POST method.' });
}
