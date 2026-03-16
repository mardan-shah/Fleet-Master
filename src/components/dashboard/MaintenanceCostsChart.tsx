"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const MaintenanceCostsChart = ({ data }: { data: any }) => {
  return (
    <Card className="bg-dark border-dark-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-primaryaccent">Maintenance Costs</CardTitle>
        <CardDescription className="text-gray-muted">Monthly maintenance expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cost: {
              label: "Cost",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[200px] md:h-[300px] w-full"
        >
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#c4c4c4" />
            <YAxis stroke="#c4c4c4" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="cost" fill="#ce6d2c" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MaintenanceCostsChart