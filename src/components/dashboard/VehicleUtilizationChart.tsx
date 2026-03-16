"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const VehicleUtilizationChart = ({ data }: { data: any }) => {
  return (
    <Card className="mb-6 bg-dark border-dark-border">
      <CardHeader>
        <CardTitle className="text-primaryaccent">Vehicle Utilization</CardTitle>
        <CardDescription className="text-gray-muted">Percentage of time each vehicle is in use</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            utilization: {
              label: "Utilization",
              color: "#ce6d2c",
            },
          }}
          className="h-[200px] md:h-[300px] w-full"
        >
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} stroke="#c4c4c4" />
            <YAxis dataKey="vehicle" type="category" stroke="#c4c4c4" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="utilization" fill="#ce6d2c" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default VehicleUtilizationChart