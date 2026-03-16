"use server";

import prisma from "@/lib/prisma";
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
  return await prisma.vehicle.findMany({
    orderBy: { name: "asc" },
  });
}

export async function addOrEditVehicle(formData: VehicleFormData, id?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const data = {
    name: formData.name,
    type: formData.type,
    year: typeof formData.year === 'string' ? parseInt(formData.year) : formData.year,
    make: formData.make,
    model: formData.model,
    manufacturer: formData.manufacturer,
    image_url: formData.image_url,
    created_by_id: (session.user as any).id,
  };

  let vehicle;
  if (id) {
    vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    });
  } else {
    vehicle = await prisma.vehicle.create({
      data,
    });
  }

  revalidatePath("/pages/vehicles");
  revalidatePath("/pages/dashboard");
  revalidatePath("/pages/maintenance");
  return vehicle;
}

export async function deleteVehicle(id: string) {
  await prisma.vehicle.delete({
    where: { id },
  });
  revalidatePath("/pages/vehicles");
  revalidatePath("/pages/dashboard");
}
