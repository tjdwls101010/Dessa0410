import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle, HelpCircle } from "lucide-react"

interface Treatment {
  name: string
  description: string
  suitability: string
}

interface RecommendedTreatmentsProps {
  treatments: Treatment[]
  detailed?: boolean
}

export default function RecommendedTreatments({ treatments, detailed = false }: RecommendedTreatmentsProps) {
  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case "high":
        return <Check className="h-4 w-4 text-green-500" />
      case "medium":
        return <HelpCircle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getSuitabilityText = (suitability: string) => {
    switch (suitability) {
      case "high":
        return "높은 적합성"
      case "medium":
        return "중간 적합성"
      case "low":
        return "낮은 적합성"
      default:
        return "정보 없음"
    }
  }

  if (detailed) {
    return (
      <div className="space-y-4">
        {treatments.map((treatment, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{treatment.name}</CardTitle>
                <Badge
                  variant={
                    treatment.suitability === "high"
                      ? "default"
                      : treatment.suitability === "medium"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {getSuitabilityText(treatment.suitability)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{treatment.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {treatments.map((treatment, index) => (
        <div key={index} className="flex items-center gap-2">
          {getSuitabilityIcon(treatment.suitability)}
          <span className="font-medium">{treatment.name}</span>
          <Badge variant="outline" className="ml-auto">
            {getSuitabilityText(treatment.suitability)}
          </Badge>
        </div>
      ))}
    </div>
  )
}

