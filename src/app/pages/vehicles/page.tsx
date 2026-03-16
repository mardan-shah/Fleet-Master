"use client"

import { useState, useEffect } from "react"
import { Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { getVehicles, addOrEditVehicle, deleteVehicle } from "@/app/actions/vehicle"

interface Vehicle {
  id: string
  name: string
  type: string
  year: number
  make: string
  model: string
  manufacturer: string
  image_url: string
}

const vehicleTypes = [
  "Sedan", "SUV", "Truck", "Van", "Coupe", "Hatchback", "Convertible", "Wagon", "Minivan", "Pickup",
  "Crossover", "Sports Car", "Electric", "Hybrid", "Luxury", "Compact", "Mid-size", "Full-size", "Off-road", "Commercial",
]

const manufacturers = [
  "Toyota", "Ford", "Chevrolet", "Honda", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai",
  "Kia", "Subaru", "Mazda", "Lexus", "Jeep", "Tesla", "Porsche", "Volvo", "Land Rover", "Jaguar",
]

const modelsByManufacturer: { [key: string]: string[] } = {
  "Toyota": ["Corolla", "Camry", "Prius", "RAV4", "Highlander"],
  "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Focus"],
  "Chevrolet": ["Silverado", "Equinox", "Malibu", "Tahoe", "Camaro"],
  "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  "Nissan": ["Altima", "Rogue", "Sentra", "Maxima", "Pathfinder"],
  "BMW": ["3 Series", "5 Series", "X3", "X5", "i8"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  "Audi": ["A4", "A6", "Q5", "Q7", "R8"],
  "Volkswagen": ["Golf", "Jetta", "Passat", "Tiguan", "Atlas"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"],
  "Kia": ["Soul", "Optima", "Sorento", "Sportage", "Telluride"],
  "Subaru": ["Outback", "Forester", "Impreza", "Crosstrek", "Ascent"],
  "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5 Miata"],
  "Lexus": ["ES", "RX", "NX", "LS", "GX"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade"],
  "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  "Porsche": ["911", "Cayenne", "Panamera", "Macan", "Taycan"],
  "Volvo": ["XC90", "XC60", "S90", "V90", "XC40"],
  "Land Rover": ["Range Rover", "Discovery", "Defender", "Evoque", "Velar"],
  "Jaguar": ["F-PACE", "XE", "XF", "E-PACE", "I-PACE"],
};

const VehicleComponent = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "",
    year: "",
    make: "",
    model: "",
    manufacturer: "",
  })
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("")
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    if (selectedManufacturer) {
      setAvailableModels(modelsByManufacturer[selectedManufacturer] || [])
    } else {
      setAvailableModels([])
    }
  }, [selectedManufacturer])

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles()
      setVehicles(data as any[])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      })
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

  const handleAddOrEditVehicle = async () => {
    setLoading(true)
    let image_url = previewImage || ""

    try {
      if (imageFile) {
        image_url = await handleImageUpload(imageFile)
      }

      const vehicleData = {
        ...newVehicle,
        manufacturer: selectedManufacturer,
        image_url,
      }

      await addOrEditVehicle(vehicleData, editVehicleId || undefined)
      
      toast({
        title: editVehicleId ? "Vehicle Updated" : "Vehicle Added",
        description: `The vehicle has been successfully ${editVehicleId ? "updated" : "added"}.`,
      })

      fetchVehicles()
      resetForm()
      setShowAddVehicle(false)
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

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditVehicleId(vehicle.id);
    setNewVehicle({
      name: vehicle.name,
      type: vehicle.type,
      year: vehicle.year.toString(),
      make: vehicle.make,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
    });
    setSelectedManufacturer(vehicle.manufacturer);
    setPreviewImage(vehicle.image_url);
    setShowAddVehicle(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteVehicle(id)
      fetchVehicles()
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to delete the vehicle",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditVehicleId(null)
    setNewVehicle({
      name: "",
      type: "",
      year: "",
      make: "",
      model: "",
      manufacturer: "",
    })
    setSelectedManufacturer("")
    setPreviewImage(null)
    setImageFile(null)
  }

  const AddVehicleForm = () => (
    <Card className="bg-dark border-dark-border mb-6">
      <CardHeader>
        <CardTitle className="text-primaryaccent">
          {editVehicleId ? "Edit Vehicle" : "Add Vehicle"}
        </CardTitle>
        <CardDescription className="text-gray-muted">
          {editVehicleId ? "Update the details of the selected vehicle" : "Enter the details of the new vehicle"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleAddOrEditVehicle()
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-light">Name</label>
              <Input
                id="name"
                placeholder="Enter vehicle name"
                className="bg-dark-hover border-dark-border text-gray-light"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
              />

            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-gray-light">Type</label>
              <Select
                value={newVehicle.type}
                onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
              >
                <SelectTrigger className="bg-dark-hover border-dark-border text-gray-light">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium text-gray-light">Year</label>
              <Input
                id="year"
                placeholder="Enter year"
                className="bg-dark-hover border-dark-border text-gray-light"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="manufacturer" className="text-sm font-medium text-gray-light">Manufacturer</label>
              <Select
                value={selectedManufacturer}
                onValueChange={(value) => {
                  setSelectedManufacturer(value)
                  setNewVehicle({ ...newVehicle, manufacturer: value })
                }}
              >
                <SelectTrigger className="bg-dark-hover border-dark-border text-gray-light">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium text-gray-light">Model</label>
              <Select
                value={newVehicle.model}
                onValueChange={(value) => setNewVehicle({ ...newVehicle, model: value })}
                disabled={!selectedManufacturer}
              >
                <SelectTrigger className="bg-dark-hover border-dark-border text-gray-light">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="image" className="text-sm font-medium text-gray-light">Vehicle Image</label>
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
                  src={previewImage}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="w-24 h-24 object-cover rounded-md border border-dark-border"
                />
              </div>
            )}
          </div>

          <Button className="w-full bg-primaryaccent text-dark hover:bg-primaryaccent/90" type="submit" disabled={loading}>
            {loading ? "Processing..." : (editVehicleId ? "Save Changes" : "Add Vehicle")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-dark text-gray-light">
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => {
              resetForm()
              setShowAddVehicle(!showAddVehicle)
            }}
            className="bg-primaryaccent text-dark hover:bg-primaryaccent/90"
          >
            <Plus className="mr-2 h-4 w-4" /> {showAddVehicle ? "Close" : "Add Vehicle"}
          </Button>
        </div>

        {showAddVehicle && <AddVehicleForm />}

        <Card className="bg-dark border-dark-border">
          <CardHeader>
            <CardTitle className="text-primaryaccent">Vehicle List</CardTitle>
            <CardDescription className="text-gray-muted">A list of all vehicles in your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-light">Image</TableHead>
                  <TableHead className="text-gray-light">Name</TableHead>
                  <TableHead className="text-gray-light">Type</TableHead>
                  <TableHead className="text-gray-light">Year</TableHead>
                  <TableHead className="text-gray-light">Manufacturer</TableHead>
                  <TableHead className="text-gray-light">Model</TableHead>
                  <TableHead className="text-gray-light">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Image
                        src={vehicle.image_url || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-light">{vehicle.name}</TableCell>
                    <TableCell className="text-gray-light">{vehicle.type}</TableCell>
                    <TableCell className="text-gray-light">{vehicle.year}</TableCell>
                    <TableCell className="text-gray-light">{vehicle.manufacturer}</TableCell>
                    <TableCell className="text-gray-light">{vehicle.model}</TableCell>
                    <TableCell className="text-gray-light">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-dark text-gray-light">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</DropdownMenuItem>
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
    </div>
  )
}

export default VehicleComponent