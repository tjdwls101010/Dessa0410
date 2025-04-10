import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import fs from 'fs/promises';
import path from 'path';

// AI 분석 결과 타입을 명확하게 정의
interface AiAnalysisResult {
  painSeverity?: string;
  potentialCauses?: string[];
  functionalImpact?: string;
  chronicityRisk?: string;
  redFlagSummary?: string;
  lifestyleRecommendations?: string[];
  suggestedTreatments?: { treatment: string; justification: string }[];
  nextStepGeneral?: string[];
}

// Gemini API 키와 모델 설정 (환경 변수에서 가져오는 것이 더 안전함)
// 실제 운영 환경에서는 .env.local 또는 환경 변수 설정을 통해 관리해야 함
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyCr09Db8misnZKeqiUeS66CTrSQW26v2vw"; // 사용자 제공 키 사용
const GOOGLE_MODEL = process.env.GOOGLE_MODEL || "gemini-1.5-flash-latest"; // 최신 모델 사용 고려

if (!GOOGLE_API_KEY) {
  console.error("Google API Key is missing!");
  // 실제 운영 환경에서는 에러를 던지거나 기본값 없이 처리해야 함
}

const model = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: GOOGLE_MODEL,
  temperature: 0.7, // 창의적인 분석을 위해 약간 높게 설정
});

// Calculation.md 파일 경로 설정 (프로젝트 루트 기준)
const calculationDocPath = path.join(process.cwd(), 'Documents', 'References', 'Calculation.md');

async function getCalculationGuide(): Promise<string> {
  try {
    const content = await fs.readFile(calculationDocPath, 'utf-8');
    return content;
  } catch (error) {
    console.error("Error reading calculation guide:", error);
    // 파일 읽기 실패 시 기본 가이드라인 또는 에러 메시지 반환
    return "Calculation guide not available.";
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const surveyId = params.id;

  if (!surveyId) {
    return NextResponse.json({ error: 'Survey ID is required' }, { status: 400 });
  }

  try {
    // 1. Supabase에서 설문 데이터 가져오기
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single(); // ID는 고유하므로 single() 사용

    if (surveyError) {
      console.error('Supabase error:', surveyError);
      if (surveyError.code === 'PGRST116') { // PostgREST 에러 코드: 결과 없음
        return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch survey data', details: surveyError.message }, { status: 500 });
    }

    if (!surveyData) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // 2. Calculation.md 내용 읽기
    const calculationGuide = await getCalculationGuide();

    // 3. Langchain과 Gemini를 사용하여 인사이트 및 맞춤형 치료 추천 생성
    // 프롬프트 구성: 설문 데이터, 해석 가이드라인, 병원 치료법 정보를 함께 제공
    const treatmentInfo = `
      [온누리마취통증의학과 제공 치료법 상세 정보]

      1.  **프롤로테라피 (인대강화주사)**:
          *   원리: 고농도 포도당 주사로 인위적 염증 유발 → 성장인자 자극 → 콜라겐 재생 및 인대/힘줄 강화. 스테로이드와 달리 조직 재생 촉진.
          *   적용: 만성 통증 (어깨, 무릎, 팔꿈치, 발목 등), 인대/힘줄 손상, 퇴행성 관절염.
          *   특징: 비수술적, 1주 간격 4-6회 시술, 효과는 3주 후부터 서서히 나타남.

      2.  **도수치료 (카이로프랙틱, 롤핑)**:
          *   원리: 전문가의 손을 이용해 척추/관절 정렬 교정 및 근막 이완.
          *   카이로프랙틱: 척추 정렬 불량(subluxation) 교정에 중점. 목/허리 디스크, 척추 관련 통증에 적용.
          *   롤핑: 근막 유착 해체 및 전신 균형 회복에 중점. 자세 불균형, 만성 근육 긴장에 적용.
          *   적용: 목/허리 통증, 자세 불균형 (거북목, 골반 틀어짐), 관절 가동성 제한.

      3.  **특화 운동 치료 (슈로스, 슬링)**:
          *   슈로스: 3차원적 척추 교정 운동 및 호흡법. 특발성 척추측만증 (주로 청소년) 교정에 특화. 만곡 패턴에 따른 맞춤 운동.
          *   슬링: 불안정한 줄(sling)을 이용한 운동. 코어 근육(심부 근육) 활성화, 근력 강화, 기능적 움직임 개선, 재활에 효과적.

      4.  **첨단 장비 치료 (HILT, ESWT)**:
          *   HILT (고강도 레이저): 1064nm 레이저 사용. 심부 조직 침투하여 염증 감소, 혈류 개선, ATP 생성 촉진 → 통증 완화 및 조직 재생. 급/만성 통증, 관절염, 힘줄염 등에 적용. 시술 시간 짧음 (10분 내외).
          *   ESWT (체외충격파): 고에너지 충격파 이용. 석회화 조직 분해, 혈관 신생 촉진, 통증 전달 차단. 만성 힘줄 문제 (오십견, 테니스엘보, 족저근막염), 석회화 건염 등에 효과적.

      [참고] 위 치료법들은 환자의 상태에 따라 단독 또는 병행하여 적용될 수 있습니다.
    `;

    const prompt = `
      다음은 환자의 통증 설문 응답 결과, 해당 설문 해석 가이드라인, 그리고 관련 병원에서 제공하는 치료법 정보입니다.

      [설문 응답 데이터]
      ${JSON.stringify(surveyData, null, 2)}

      [설문 해석 가이드라인 (Calculation.md)]
      ${calculationGuide}

      [병원 제공 치료법 정보]
      ${treatmentInfo}

      [요청]
      위 세 가지 정보(설문 응답, 해석 가이드라인, 치료법 정보)를 종합적으로 분석하여, 환자에게 제공할 개인화된 분석 및 구체적인 치료 추천을 생성해주세요.
      결과는 다음 형식의 JSON 객체로 반환해주세요:
      {
        "painSeverity": "통증 심각도 요약 (예: 중증도의 만성 통증)",
        "potentialCauses": ["잠재적 원인 목록 (예: 장시간 앉아있는 자세)", "근육 불균형"],
        "functionalImpact": "기능적 영향 요약 (예: 일상생활에 상당한 영향)",
        "chronicityRisk": "만성화 위험도 (예: 높음, 중간, 낮음)",
        "redFlagSummary": "위험 신호 요약 (예: '체중 감소' 항목 해당, 즉시 진료 필요)",
        "lifestyleRecommendations": ["생활 습관 개선 권장 사항 (예: 규칙적인 스트레칭)", "자세 교정"],
        "suggestedTreatments": [
          {
            "treatment": "추천 치료법 이름 (예: 프롤로테라피)",
            "justification": "해당 치료법을 추천하는 구체적인 이유 (환자의 설문 결과와 치료법의 특징을 연결하여 설명)"
          },
          {
            "treatment": "추천 치료법 이름 (예: 슬링 운동)",
            "justification": "해당 치료법을 추천하는 구체적인 이유"
          }
          // 필요시 추가 추천
        ],
        "nextStepGeneral": ["환자의 상태 분석 결과에 기반한 다음 단계 권장 사항 목록 (예: '전문의 상담 권장', '정밀 검사 고려')"] // 예시 단순화
      }

      [주의사항]
      - 해석 가이드라인과 치료법 정보를 충실히 반영하여 분석하고, 환자의 설문 응답 내용(통증 부위, 양상, 기능 제한, 생활 습관 등)과 치료법의 적용 대상/원리를 연결하여 **suggestedTreatments** 항목을 작성해주세요.
      - **justification**에는 왜 해당 치료가 이 환자에게 적합한지 명확하고 구체적인 근거를 제시해야 합니다.
      - 위험 신호(Red Flags)를 주의 깊게 확인하고 **redFlagSummary**에 명시하며, 필요한 경우 치료 추천 시 주의사항을 포함해주세요.
      - **nextStepGeneral** 항목은 **반드시** 생성해야 하며, 환자에게 필요한 다음 단계를 최소 1가지 이상 구체적으로 제시해야 합니다. (예: 상담, 검사, 특정 관리 등)
      - 환자가 이해하기 쉬운 언어를 사용하되, 전문적인 분석 내용을 포함해주세요.
      - 제공된 JSON 형식에 맞춰 답변해주세요. 각 필드의 값은 문자열 또는 배열(문자열 또는 객체)이어야 합니다.
      - 만약 정보가 부족하여 구체적인 치료 추천이 어렵다면, **suggestedTreatments** 항목에 그 이유를 명시하고 일반적인 다음 단계만 제안해주세요.
    `;

    const messages = [new HumanMessage(prompt)];
    const aiResponse = await model.invoke(messages);

    let aiAnalysis = {};
    try {
      // Gemini 응답에서 JSON 부분만 추출 시도
      const jsonMatch = aiResponse.content.toString().match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        console.warn("AI response did not contain valid JSON:", aiResponse.content);
        // JSON 파싱 실패 시 기본 메시지 또는 에러 처리
        aiAnalysis = { error: "Failed to parse AI analysis." };
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError, "Response:", aiResponse.content);
      // 파싱 실패 시 에러 객체 할당
      // 파싱 실패 시 에러 객체 할당
      aiAnalysis = { error: "Failed to parse AI analysis.", rawResponse: aiResponse.content.toString() };
    }

    // --- nextStepGeneral 처리 로직 (Fallback 강화 및 의미 확인 - 최종 수정 v6) ---
    let finalNextStepGeneral: string[] = ["전문의와 상담하여 정확한 진단 및 치료 계획을 세우는 것을 권장합니다."]; // 기본값 우선 설정

    // AI 분석 결과가 유효한 객체이고 에러가 없는 경우에만 AI 응답 확인
    if (typeof aiAnalysis === 'object' && aiAnalysis !== null && !('error' in aiAnalysis)) {
        const analysisResult = aiAnalysis as AiAnalysisResult; // 타입 단언
        const aiProvidedSteps = analysisResult.nextStepGeneral;

        // AI가 제공한 배열이 실제로 존재하고, 비어있지 않으며, 모든 요소가 유효한 문자열인지 더 엄격하게 확인
        const hasValidMeaningfulSteps = Array.isArray(aiProvidedSteps) &&
                                       aiProvidedSteps.length > 0 &&
                                       aiProvidedSteps.every(step =>
                                         typeof step === 'string' &&
                                         step.trim().length > 0 && // 비어있지 않고
                                         !step.includes("분석 중") && // "분석 중..." 아니고
                                         !step.includes("...") && // "..."만 있는 경우 제외
                                         step.length > 5 // 너무 짧은 (의미 없을 가능성 높은) 문자열 제외 (예: "상담")
                                       );

        if (hasValidMeaningfulSteps) {
            // 유효하고 의미있는 응답일 경우에만 AI 응답 사용
            finalNextStepGeneral = aiProvidedSteps;
            console.log("Using AI provided nextStepGeneral:", finalNextStepGeneral);
        } else {
             // 유효하지 않으면 기본값 사용 (이미 위에서 설정됨)
            console.warn("AI provided invalid or meaningless nextStepGeneral. Using default fallback. AI response was:", aiProvidedSteps);
        }
    } else if (typeof aiAnalysis === 'object' && aiAnalysis !== null && 'error' in aiAnalysis) {
        // AI 분석 자체에 에러가 있는 경우, 에러 메시지로 설정
        finalNextStepGeneral = ["AI 분석 오류로 구체적인 다음 단계를 제안하기 어렵습니다. 전문의와 상담해주세요."];
        console.error("AI analysis error occurred. Setting error message for nextStepGeneral.");
    } else {
        // aiAnalysis가 객체가 아니거나 null인 경우 등
        console.warn("aiAnalysis is not a valid object or is null. Using default fallback for nextStepGeneral.");
    }

    // 위험 신호가 있다면 항상 즉시 진료 권고 추가 (중복 방지)
    if (surveyData.f33_red_flags && surveyData.f33_red_flags.length > 0) {
        const warningMsg = "위험 신호(Red Flags)가 발견되었으므로, 즉시 전문의의 진료가 필요합니다.";
        if (!finalNextStepGeneral.includes(warningMsg)) {
            finalNextStepGeneral.push(warningMsg);
        }
    }

    // 최종 aiAnalysis 객체에 nextStepGeneral 업데이트
    if (typeof aiAnalysis === 'object' && aiAnalysis !== null) {
      (aiAnalysis as AiAnalysisResult).nextStepGeneral = finalNextStepGeneral;
    }
    // --- nextStepGeneral 처리 로직 끝 ---

    // 4. LLM 분석 결과를 Supabase에 저장
    if (typeof aiAnalysis === 'object' && aiAnalysis !== null && !('error' in aiAnalysis)) {
      try {
        const { error: updateError } = await supabase
          .from('surveys')
          .update({ llm_insight: JSON.stringify(aiAnalysis) }) // JSON 문자열로 저장
          .eq('id', surveyId);

        if (updateError) {
          console.error('Failed to update survey with LLM insight:', updateError);
          // 에러가 발생해도 리포트 자체는 반환하도록 처리 (로깅만 수행)
        } else {
          console.log(`Successfully updated survey ${surveyId} with LLM insight.`);
        }
      } catch (updateCatchError) {
        console.error('Caught error during Supabase update:', updateCatchError);
      }
    } else {
      console.warn(`Skipping Supabase update for survey ${surveyId} due to invalid or error state in aiAnalysis.`);
    }

    // 5. 결과 반환 (원본 설문 데이터 + AI 분석 결과)
    return NextResponse.json({
      surveyData,
      aiAnalysis, // 최종 업데이트된 aiAnalysis 반환
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred', details: (error as Error).message }, { status: 500 });
  }
}
