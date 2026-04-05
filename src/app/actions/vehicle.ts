"use server";

import { mockDb, Vehicle } from "@/lib/mock-db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface VehicleFormData {
  name: string;
  type: string;
  year: string | number;
  make?: string;
  model: string;
  manufacturer: string;
  image_url?: string;
}

export async function getVehicles() {
  return [...mockDb.vehicles].sort((a, b) => a.name.localeCompare(b.name));
}

export async function addOrEditVehicle(formData: VehicleFormData, id?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const data = {
    name: formData.name,
    type: formData.type,
    year: typeof formData.year === 'string' ? parseInt(formData.year) : formData.year,
    make: formData.make || null,
    model: formData.model,
    manufacturer: formData.manufacturer,
    image_url: formData.image_url || null,
    created_by_id: (session.user as any).id,
  };

  let vehicle: Vehicle;
  if (id) {
    const index = mockDb.vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error("Vehicle not found");
    
    vehicle = {
      ...mockDb.vehicles[index],
      ...data,
    };
    mockDb.vehicles[index] = vehicle;
  } else {
    vehicle = {
      ...data,
      id: Math.random().toString(36).substring(7),
      total_maintenance_cost: 0,
      total_fuel_cost: 0,
      total_distance: 0,
    };
    mockDb.vehicles.push(vehicle);
  }

  revalidatePath("/pages/vehicles");
  revalidatePath("/pages/dashboard");
  revalidatePath("/pages/maintenance");
  return vehicle;
}

export async function deleteVehicle(id: string) {
  const index = mockDb.vehicles.findIndex(v => v.id === id);
  if (index !== -1) {
    mockDb.vehicles.splice(index, 1);
  }
  revalidatePath("/pages/vehicles");
  revalidatePath("/pages/dashboard");
}
