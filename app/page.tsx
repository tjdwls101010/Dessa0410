import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ClipboardCheck, FileText, MessageSquare, Phone, MapPin, Clock, Award } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">온누리마취통증의학과</h1>
          <p className="text-xl text-muted-foreground">통증 없는 건강한 삶을 위한 선택</p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/survey">
                통증 자가 점검 시작하기 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * 본 서비스는 의학적 진단을 대체하지 않으며, 전문의 상담이 필요합니다.
          </p>
        </div>

        {/* 병원 소개 섹션 */}
        <div className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">병원 소개</h2>
          <p className="mb-6">
            온누리마취통증의학과는 <span className="font-bold">마취통증의학과 전문의 김영환 원장</span>(부산 백병원
            외래교수)이 환자 개개인의 통증 원인을 정확히 진단하고, <span className="font-bold">비수술적 치료</span>를
            통해 근본적인 해결을 돕는 병원입니다.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                진료 시간 및 위치
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  평일: 09:00 - 18:00
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  토요일: 09:00 - 13:00
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  일요일/공휴일: 휴진
                </li>
                <li className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  부산광역시 동래구 동래로 25, 701호
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  051-714-1831
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Award className="h-5 w-5 text-primary mr-2" />
                전문 진료 분야
              </h3>
              <ul className="space-y-1 text-sm list-disc pl-5">
                <li>
                  <span className="font-medium">척추 질환</span>: 목/허리 디스크, 척추관 협착증, 만성 통증
                </li>
                <li>
                  <span className="font-medium">관절 질환</span>: 어깨 통증, 무릎 통증, 팔꿈치/발목 통증
                </li>
                <li>
                  <span className="font-medium">신경통</span>: 좌골신경통, 손발 저림, 두통
                </li>
                <li>
                  <span className="font-medium">자세 불균형</span>: 일자목, 거북목, 척추측만증
                </li>
                <li>
                  <span className="font-medium">기타</span>: 스포츠 손상, 교통사고 후유증, 근막통증증후군
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 서비스 소개 */}
        <h2 className="text-2xl font-bold mb-6 text-center">통증 자가 점검 서비스</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>통증 자가 점검</CardTitle>
              <CardDescription>객관적인 설문을 통해 통증 상태를 체계적으로 점검합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                약 30개의 문항을 통해 통증 부위, 강도, 양상 등을 파악하여 보다 정확한 자가 점검을 도와드립니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI 분석 리포트</CardTitle>
              <CardDescription>설문 결과를 바탕으로 AI가 분석한 맞춤형 리포트를 제공합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                통증 부위 시각화, 기능 제한 점수, 잠재적 원인 및 추천 치료법 등 종합적인 정보를 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>정보 챗봇</CardTitle>
              <CardDescription>리포트 내용이나 병원 정보에 대해 궁금한 점을 물어보세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                AI 챗봇이 리포트 내용을 바탕으로 추가 정보를 제공하고 병원 방문에 필요한 안내를 도와드립니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 핵심 치료법 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">핵심 비수술 치료법</h2>
          <p className="text-center mb-8 max-w-2xl mx-auto">
            온누리마취통증의학과는 스테로이드 사용을 최소화하고 인체 본연의 치유 능력을 활성화하는 치료에 집중합니다.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>프롤로테라피 (인대강화주사)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  손상된 인대나 힘줄을 강화하여 만성 통증의 근본 원인을 해결합니다. 스테로이드 주사와 달리 조직 재생을
                  촉진하는 치료법입니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>도수치료 (카이로프랙틱, 롤핑)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  전문 치료사가 손을 이용해 척추 및 관절의 정렬을 바로잡고, 근막을 이완시켜 통증을 완화하고 자세를
                  교정합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>특화 운동 치료 (슈로스, 슬링)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  척추측만증 교정(슈로스), 코어 근육 강화 및 기능적 움직임 개선(슬링)을 위한 맞춤 운동을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>첨단 장비 치료</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  고강도 레이저(HILT), 체외충격파(ESWT), 자기장 치료기 등 최신 장비를 이용해 통증 감소와 조직 재생을
                  촉진합니다.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/about">더 자세한 병원 정보 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

