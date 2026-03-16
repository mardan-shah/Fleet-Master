"use client"

import { useState, useEffect } from "react"
import { Pen, ChevronDown, MoreVertical, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { getVehicles } from "@/app/actions/vehicle"
import { getTickets, addTicket, deleteTicket, getFuelUpdates, addFuelUpdate, deleteFuelUpdate } from "@/app/actions/maintenance"

interface Ticket {
  id: string
  vehicle_name: string
  issue: string
  priority: string
  status: string
  cost: number
  created_at: string
}

interface FuelUpdate {
  id: string
  vehicle_name: string
  quantity: number
  cost: number
  distance: number
  created_at: string
}

interface Vehicle {
  id: string
  name: string
}

const MaintenanceComponent = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [fuelUpdates, setFuelUpdates] = useState<FuelUpdate[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false)
  const [isUploadFuelOpen, setIsUploadFuelOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ticketsData, fuelUpdatesData, vehiclesData] = await Promise.all([
        getTickets(),
        getFuelUpdates(),
        getVehicles(),
      ])
      setTickets(ticketsData as any[])
      setFuelUpdates(fuelUpdatesData as any[])
      setVehicles(vehiclesData as any[])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    }
  }

  const handleAddTicketAction = async (newTicket: any) => {
    try {
      await addTicket(newTicket)
      fetchData()
      toast({
        title: "Ticket Added",
        description: "The ticket has been successfully added.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add ticket",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTicketAction = async (id: string) => {
    try {
      await deleteTicket(id)
      fetchData()
      toast({
        title: "Ticket Deleted",
        description: "The ticket has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      })
    }
  }

  const handleAddFuelUpdateAction = async (newFuelUpdate: any) => {
    try {
      await addFuelUpdate(newFuelUpdate)
      fetchData()
      toast({
        title: "Fuel Update Added",
        description: "The fuel update has been successfully added.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add fuel update",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFuelUpdateAction = async (id: string) => {
    try {
      await deleteFuelUpdate(id)
      fetchData()
      toast({
        title: "Fuel Update Deleted",
        description: "The fuel update has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fuel update",
        variant: "destructive",
      })
    }
  }

  const AddTicketForm = () => {
    const [newTicket, setNewTicket] = useState({ vehicle: "", issue: "", priority: "Medium", status: "Pending", cost: "" })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newTicket.vehicle || !newTicket.issue || !newTicket.cost) {
        toast({ title: "Error", description: "Please fill out all required fields.", variant: "destructive" })
        return
      }
      await handleAddTicketAction(newTicket)
      setNewTicket({ vehicle: "", issue: "", priority: "Medium", status: "Pending", cost: "" })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select value={newTicket.vehicle} onValueChange={(value) => setNewTicket({ ...newTicket, vehicle: value })}>
          <SelectTrigger className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]">
            <SelectValue placeholder="Select vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.name}>{vehicle.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Issue Description"
          value={newTicket.issue}
          onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
          className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]"
        />
        <Input
          placeholder="Maintenance Cost"
          type="number"
          value={newTicket.cost}
          onChange={(e) => setNewTicket({ ...newTicket, cost: e.target.value })}
          className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]"
        />
        <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
          <SelectTrigger className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full bg-[#ce6d2c] text-[#232323] hover:bg-[#d97d3d]">
          Add Ticket
        </Button>
      </form>
    )
  }

  const FuelUpdateForm = ({ vehicles }: { vehicles: Vehicle[] }) => {
    const [fuelData, setFuelData] = useState({ vehicle: "", fuelAmount: "", distance: "", cost: "" })
    const totalPrice = parseFloat(fuelData.fuelAmount || "0") * parseFloat(fuelData.cost || "0")

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!fuelData.vehicle || !fuelData.fuelAmount || !fuelData.distance || !fuelData.cost) {
        toast({ title: "Error", description: "Please fill out all required fields.", variant: "destructive" })
        return
      }
      await handleAddFuelUpdateAction({
        vehicle: fuelData.vehicle,
        quantity: fuelData.fuelAmount,
        cost: (parseFloat(fuelData.fuelAmount) * parseFloat(fuelData.cost)).toString(),
        distance: fuelData.distance,
      })
      setFuelData({ vehicle: "", fuelAmount: "", distance: "", cost: "" })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select value={fuelData.vehicle} onValueChange={(value) => setFuelData({ ...fuelData, vehicle: value })}>
          <SelectTrigger className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]">
            <SelectValue placeholder="Select vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.name}>{vehicle.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Fuel Amount (liters)"
          type="number"
          value={fuelData.fuelAmount}
          onChange={(e) => setFuelData({ ...fuelData, fuelAmount: e.target.value })}
          className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]"
        />
        <Input
          placeholder="Distance Traveled (km)"
          type="number"
          value={fuelData.distance}
          onChange={(e) => setFuelData({ ...fuelData, distance: e.target.value })}
          className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]"
        />
        <Input
          placeholder="Fuel Cost (per liter)"
          type="number"
          value={fuelData.cost}
          onChange={(e) => setFuelData({ ...fuelData, cost: e.target.value })}
          className="bg-[#333333] border-[#3a3a3a] text-[#c4c4c4]"
        />
        <div className="text-[#c4c4c4]">Total Price: ${totalPrice.toFixed(2)}</div>
        <Button type="submit" className="w-full bg-[#ce6d2c] text-[#232323] hover:bg-[#d97d3d]">
          Submit Fuel Update
        </Button>
      </form>
    )
  }

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto bg-[#2a2a2a] min-h-screen">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-md overflow-hidden">
          <Button
            onClick={() => setIsAddMaintenanceOpen(!isAddMaintenanceOpen)}
            className="w-full flex justify-between items-center bg-[#2a2a2a] text-[#ce6d2c] hover:bg-[#333333] p-4"
          >
            Add Maintenance Ticket
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAddMaintenanceOpen ? "transform rotate-180" : ""}`} />
          </Button>
          <div className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${isAddMaintenanceOpen ? "max-h-[500px]" : "max-h-0"}`}>
            <div className="p-4"><AddTicketForm /></div>
          </div>
        </div>

        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-md overflow-hidden">
          <Button
            onClick={() => setIsUploadFuelOpen(!isUploadFuelOpen)}
            className="w-full flex justify-between items-center bg-[#2a2a2a] text-[#ce6d2c] hover:bg-[#333333] p-4"
          >
            Add Fuel Update
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUploadFuelOpen ? "transform rotate-180" : ""}`} />
          </Button>
          <div className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${isUploadFuelOpen ? "max-h-[500px]" : "max-h-0"}`}>
            <div className="p-4"><FuelUpdateForm vehicles={vehicles} /></div>
          </div>
        </div>
      </div>

      <Card className="mt-6 bg-[#2a2a2a] border-[#3a3a3a]">
        <CardHeader>
          <CardTitle className="text-[#ce6d2c]">Ongoing Maintenance Tickets</CardTitle>
          <CardDescription className="text-[#a0a0a0]">View and edit current maintenance tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#ce6d2c]">Vehicle</TableHead>
                <TableHead className="text-[#ce6d2c]">Issue</TableHead>
                <TableHead className="text-[#ce6d2c]">Priority</TableHead>
                <TableHead className="text-[#ce6d2c]">Status</TableHead>
                <TableHead className="text-[#ce6d2c]">Cost</TableHead>
                <TableHead className="text-[#ce6d2c]">Created At</TableHead>
                <TableHead className="text-[#ce6d2c]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-[#333333]">
                  <TableCell className="text-[#a0a0a0]">{ticket.vehicle_name}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{ticket.issue}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{ticket.priority}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{ticket.status}</TableCell>
                  <TableCell className="text-[#a0a0a0]">${ticket.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{new Date(ticket.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className=" text-white hover:text-dark h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a]">
                        <DropdownMenuItem onClick={() => handleDeleteTicketAction(ticket.id)} className="text-red-500 hover:text-red-600 cursor-pointer">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-[#2a2a2a] border-[#3a3a3a]">
        <CardHeader>
          <CardTitle className="text-[#ce6d2c]">Fuel Updates</CardTitle>
          <CardDescription className="text-[#a0a0a0]">View fuel updates for vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#ce6d2c]">Vehicle</TableHead>
                <TableHead className="text-[#ce6d2c]">Quantity (L)</TableHead>
                <TableHead className="text-[#ce6d2c]">Cost ($)</TableHead>
                <TableHead className="text-[#ce6d2c]">Distance (km)</TableHead>
                <TableHead className="text-[#ce6d2c]">Created At</TableHead>
                <TableHead className="text-[#ce6d2c]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelUpdates.map((update) => (
                <TableRow key={update.id} className="hover:bg-[#333333]">
                  <TableCell className="text-[#a0a0a0]">{update.vehicle_name}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{update.quantity}</TableCell>
                  <TableCell className="text-[#a0a0a0]">${update.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{update.distance.toFixed(2)}</TableCell>
                  <TableCell className="text-[#a0a0a0]">{new Date(update.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className=" text-white hover:text-dark h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a]">
                        <DropdownMenuItem onClick={() => handleDeleteFuelUpdateAction(update.id)} className="text-red-500 hover:text-red-600 cursor-pointer">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}

export default MaintenanceComponent