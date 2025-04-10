import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, FileText, MessageSquare, Activity } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">서비스 소개</h1>
          <p className="text-xl text-muted-foreground">온누리마취통증의학과 자가 통증 점검 시스템에 대해 알아보세요.</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">서비스 개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                온누리마취통증의학과 자가 통증 점검 시스템은 잠재 환자들이 자신의 통증 상태를 객관적으로 점검하고, AI
                분석을 통해 맞춤형 정보를 제공받을 수 있는 서비스입니다.
              </p>
              <p>
                본 서비스는 의학적 진단을 대체하지 않으며, 사용자가 자신의 통증 상태를 더 잘 이해하고 필요시 전문적인
                의료 서비스를 받을 수 있도록 돕는 것을 목표로 합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">주요 기능</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex gap-3">
                  <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">체계적인 통증 설문</h3>
                    <p className="text-sm text-muted-foreground">
                      통증 부위, 강도, 특성, 기능 제한 등을 포괄적으로 평가하는 체계적인 설문 시스템을 제공합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Activity className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI 기반 분석</h3>
                    <p className="text-sm text-muted-foreground">
                      Gemini API를 활용한 AI 분석과 규칙 기반 분석을 통해 사용자의 통증 상태를 종합적으로 평가합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">시각화된 리포트</h3>
                    <p className="text-sm text-muted-foreground">
                      통증 부위, 기능 제한, 추천 치료법 등을 시각적으로 확인할 수 있는 종합 리포트를 제공합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI 챗봇 상담</h3>
                    <p className="text-sm text-muted-foreground">
                      리포트 내용이나 병원 정보에 대해 궁금한 점을 AI 챗봇을 통해 문의할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">서비스 이용 방법</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">통증 자가 점검 설문 작성</h3>
                    <p className="text-sm text-muted-foreground">
                      약 30개의 문항으로 구성된 설문을 통해 통증 상태를 체계적으로 평가합니다. 설문은 기본 정보, 통증
                      부위, 통증 특성, 기능 제한, 치료 이력 등의 섹션으로 구성되어 있습니다.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI 분석 및 리포트 생성</h3>
                    <p className="text-sm text-muted-foreground">
                      설문 응답을 바탕으로 AI가 통증 상태를 분석하고, 시각화된 리포트를 생성합니다. 리포트에는 통증 부위
                      시각화, 기능 제한 점수, 추천 치료법 등이 포함됩니다.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">리포트 확인 및 챗봇 문의</h3>
                    <p className="text-sm text-muted-foreground">
                      생성된 리포트를 확인하고, 궁금한 점이 있으면 AI 챗봇을 통해 추가 정보를 문의할 수 있습니다.
                      리포트는 PDF로 저장하여 병원 방문 시 참고자료로 활용할 수 있습니다.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">전문의 상담</h3>
                    <p className="text-sm text-muted-foreground">
                      리포트를 참고하여 필요시 온누리마취통증의학과에 방문하여 전문의 상담을 받습니다. 정확한 진단과
                      맞춤형 치료 계획은 전문의 상담을 통해 이루어집니다.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                주의사항
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                본 서비스는 의학적 진단을 대체하지 않습니다. 제공되는 정보는 참고용이며, 정확한 진단과 치료를 위해서는
                반드시 전문의 상담이 필요합니다.
              </p>
              <p>심각한 통증이나 급성 증상이 있는 경우, 즉시 의료기관을 방문하시기 바랍니다.</p>
              <p>
                본 서비스에서 수집된 정보는 사용자의 동의 없이 제3자에게 제공되지 않으며, 서비스 개선 및 연구 목적으로만
                익명화하여 활용될 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

