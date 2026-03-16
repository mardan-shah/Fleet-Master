"use client"

import { useState, useEffect } from "react"
import { Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm, Controller } from "react-hook-form"
import { format, differenceInDays, differenceInMonths, differenceInYears } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { getDrivers, addOrEditDriver, deleteDriver } from "@/app/actions/driver"
import { getVehicles } from "@/app/actions/vehicle"

interface Driver {
  id: string
  name: string
  vehicle_name: string
  license_number: string
  license_expiry: string
  social_security: string
  join_date: string
  image_url: string
}

const DriverComponent = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null)
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([])
  const { toast } = useToast()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      vehicle: "",
      license_number: "",
      license_expiry: "",
      social_security: "",
      join_date: format(new Date(), "yyyy-MM-dd"),
    },
  })

  useEffect(() => {
    fetchDrivers()
    fetchVehicles()
  }, [])

  const fetchDrivers = async () => {
    try {
      const data = await getDrivers()
      setDrivers(data as any[])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch drivers",
        variant: "destructive",
      })
    }
  }

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles()
      setAvailableVehicles(data)
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Upload failed")
    }

    const { url } = await response.json()
    return url
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    let image_url = previewImage || ""

    try {
      if (imageFile) {
        image_url = await handleImageUpload(imageFile)
      }

      const driverData = {
        ...data,
        image_url,
      }

      await addOrEditDriver(driverData, editingDriverId || undefined)

      toast({
        title: editingDriverId ? "Driver Updated" : "Driver Added",
        description: `The driver has been successfully ${editingDriverId ? "updated" : "added"}.`,
      })

      fetchDrivers()
      setShowAddDriver(false)
      reset()
      setPreviewImage(null)
      setImageFile(null)
      setEditingDriverId(null)
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditDriver = (driver: Driver) => {
    setEditingDriverId(driver.id)
    reset({
      name: driver.name,
      vehicle: driver.vehicle_name,
      license_number: driver.license_number,
      license_expiry: format(new Date(driver.license_expiry), "yyyy-MM-dd"),
      social_security: driver.social_security,
      join_date: format(new Date(driver.join_date), "yyyy-MM-dd"),
    })
    setPreviewImage(driver.image_url)
    setShowAddDriver(true)
  }

  const handleDeleteDriver = async (id: string) => {
    try {
      await deleteDriver(id)
      fetchDrivers()
      toast({
        title: "Driver Deleted",
        description: "The driver has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to delete the driver",
        variant: "destructive",
      })
    }
  }

  const calculateDuration = (joinDate: string) => {
    const now = new Date()
    const join = new Date(joinDate)
    const days = differenceInDays(now, join)
    const months = differenceInMonths(now, join)
    const years = differenceInYears(now, join)
    return `${years}y ${months % 12}m ${days % 30}d`
  }

  return (
    <div className="flex flex-col h-screen bg-dark text-gray-light">
      <div className="flex-none p-6">
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              reset()
              setShowAddDriver(!showAddDriver)
            }}
            className="bg-primaryaccent text-dark hover:bg-primaryaccent/90"
          >
            <Plus className="mr-2 h-4 w-4" /> {showAddDriver ? "Close" : "Add Driver"}
          </Button>
        </div>

        {showAddDriver && (
          <Card className="bg-dark border-dark-border mb-6">
            <CardHeader>
              <CardTitle className="text-primaryaccent">
                {editingDriverId ? "Edit Driver" : "Add Driver"}
              </CardTitle>
              <CardDescription className="text-gray-muted">
                {editingDriverId ? "Update driver details" : "Enter driver details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-gray-light">Driver Name</label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Enter driver name"
                          className="bg-dark-hover border-dark-border text-gray-light"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="license_number" className="text-gray-light">License Number</label>
                    <Controller
                      name="license_number"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Enter license number"
                          className="bg-dark-hover border-dark-border text-gray-light"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="license_expiry" className="text-gray-light">License Expiry Date</label>
                    <Controller
                      name="license_expiry"
                      control={control}
                      render={({ field }) => (
                        <Input type="date" className="bg-dark-hover border-dark-border text-gray-light" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="social_security" className="text-gray-light">Social Security Number</label>
                    <Controller
                      name="social_security"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Enter Social Security Number"
                          className="bg-dark-hover border-dark-border text-gray-light"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="join_date" className="text-gray-light">Join Date</label>
                    <Controller
                      name="join_date"
                      control={control}
                      render={({ field }) => (
                        <Input type="date" className="bg-dark-hover border-dark-border text-gray-light" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle" className="text-gray-light">Vehicle</label>
                    <Controller
                      name="vehicle"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-dark-hover border-dark-border text-gray-light">
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableVehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.name}>
                                {vehicle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="text-gray-light">Driver Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="bg-dark-hover border-dark-border text-gray-light"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImageFile(file)
                        setPreviewImage(URL.createObjectURL(file))
                      }
                    }}
                  />
                  {previewImage && (
                    <div className="mt-4">
                      <Image
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="w-24 h-24 object-cover rounded-md border border-dark-border"
                      />
                    </div>
                  )}
                </div>

                <Button className="w-full bg-primaryaccent text-dark hover:bg-primaryaccent/90" type="submit" disabled={loading}>
                  {loading ? "Processing..." : (editingDriverId ? "Save Changes" : "Add Driver")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex-grow overflow-auto p-6 pt-0">
        <Card className="bg-dark border-dark-border">
          <CardHeader>
            <CardTitle className="text-primaryaccent">Driver List</CardTitle>
            <CardDescription className="text-gray-muted">A list of all drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>License Expiry</TableHead>
                  <TableHead>Social Security</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-secondary">
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <Image
                        src={driver.image_url || "/placeholder.svg"}
                        alt={driver.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.vehicle_name}</TableCell>
                    <TableCell>{driver.license_number}</TableCell>
                    <TableCell>{format(new Date(driver.license_expiry), "yyyy-MM-dd")}</TableCell>
                    <TableCell>{driver.social_security}</TableCell>
                    <TableCell>{format(new Date(driver.join_date), "yyyy-MM-dd")}</TableCell>
                    <TableCell>{calculateDuration(driver.join_date)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-dark text-gray-light">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditDriver(driver)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteDriver(driver.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DriverComponent