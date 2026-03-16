"use client"

import { useState, useEffect } from "react"
import { Users, Truck, Wrench, Fuel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VehicleUtilizationChart from "@/components/dashboard/VehicleUtilizationChart"
import MaintenanceCostsChart from "@/components/dashboard/MaintenanceCostsChart"
import FuelConsumptionChart from "@/components/dashboard/FuelConsumptionChart"
import { getDashboardData } from "@/app/actions/dashboard"

const Dashboard = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const dashboardData = await getDashboardData()
      setData(dashboardData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>
  if (!data) return <div className="p-6">Failed to load data.</div>

  const stats = [
    { title: "Total Vehicles", value: data.vehicles.length.toString(), icon: Truck, color: "text-blue-500" },
    { title: "Active Drivers", value: data.drivers.length.toString(), icon: Users, color: "text-green-500" },
    { title: "Ongoing Tickets", value: data.tickets.filter((t: any) => t.status !== "Completed").length.toString(), icon: Wrench, color: "text-yellow-500" },
    { title: "Total Fuel Cost", value: `$${data.vehicles.reduce((acc: number, v: any) => acc + v.total_fuel_cost, 0).toFixed(2)}`, icon: Fuel, color: "text-red-500" },
  ]

  // Map data for charts
  const utilizationData = data.vehicles.map((v: any) => ({
    vehicle: v.name,
    utilization: Math.floor(Math.random() * 40) + 60, // Placeholder for utilization
  }));

  const maintenanceData = [
    { month: "Jan", cost: 1200 },
    { month: "Feb", cost: 1900 },
    { month: "Mar", cost: 1500 },
    { month: "Apr", cost: 2100 },
    { month: "May", cost: 1800 },
    { month: "Jun", cost: 2400 },
  ]; // Placeholder for maintenance costs

  const fuelData = [
    { month: "Jan", consumption: 450 },
    { month: "Feb", consumption: 520 },
    { month: "Mar", consumption: 480 },
    { month: "Apr", consumption: 610 },
    { month: "May", consumption: 550 },
    { month: "Jun", consumption: 670 },
  ]; // Placeholder for fuel consumption

  return (
    <main className="flex-1 p-6 overflow-auto bg-dark">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primaryaccent">Fleet Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-dark-hover border-dark-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-muted">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-light">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="col-span-1 bg-dark-hover border-dark-border">
          <CardHeader>
            <CardTitle className="text-primaryaccent">Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleUtilizationChart data={utilizationData} />
          </CardContent>
        </Card>
        <Card className="col-span-1 bg-dark-hover border-dark-border">
          <CardHeader>
            <CardTitle className="text-primaryaccent">Maintenance Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceCostsChart data={maintenanceData} />
          </CardContent>
        </Card>
        <Card className="col-span-1 bg-dark-hover border-dark-border">
          <CardHeader>
            <CardTitle className="text-primaryaccent">Fuel Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <FuelConsumptionChart data={fuelData} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default Dashboard
