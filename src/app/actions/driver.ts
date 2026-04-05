"use server";

import { mockDb, Driver } from "@/lib/mock-db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface DriverFormData {
  name: string;
  vehicle?: string;
  license_number: string;
  license_expiry: string;
  social_security: string;
  join_date: string;
  image_url?: string;
}

export async function getDrivers() {
  return [...mockDb.drivers].sort((a, b) => a.name.localeCompare(b.name));
}

export async function addOrEditDriver(formData: DriverFormData, id?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const data = {
    name: formData.name,
    vehicle_name: formData.vehicle || null,
    license_number: formData.license_number,
    license_expiry: new Date(formData.license_expiry),
    social_security: formData.social_security,
    join_date: new Date(formData.join_date),
    image_url: formData.image_url || null,
    created_by_id: (session.user as any).id,
  };

  let driver: Driver;
  if (id) {
    const index = mockDb.drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Driver not found");

    driver = {
      ...mockDb.drivers[index],
      ...data,
    };
    mockDb.drivers[index] = driver;
  } else {
    driver = {
      ...data,
      id: Math.random().toString(36).substring(7),
    };
    mockDb.drivers.push(driver);
  }

  revalidatePath("/pages/drivers");
  return driver;
}

export async function deleteDriver(id: string) {
  const index = mockDb.drivers.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDb.drivers.splice(index, 1);
  }
  revalidatePath("/pages/drivers");
}
