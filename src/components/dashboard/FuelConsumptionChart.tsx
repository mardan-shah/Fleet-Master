"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis } from "recharts"

const FuelConsumptionChart = ({ data }: { data: any }) => {
  return (
    <Card className="bg-dark border-dark-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-primaryaccent">Fuel Consumption Trend</CardTitle>
        <CardDescription className="text-gray-muted">Monthly fuel consumption in liters</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumption: {
              label: "Consumption",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px] md:h-[300px] w-full"
        >
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#c4c4c4" />
            <YAxis stroke="#c4c4c4" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="consumption" stroke="var(--color-consumption)" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default FuelConsumptionChart