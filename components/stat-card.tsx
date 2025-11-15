import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: "up" | "down"
  trendValue?: string
}

export function StatCard({ title, value, subtitle, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-sidebar-primary">{value}</div>
        <div className="flex items-center justify-between mt-2">
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
