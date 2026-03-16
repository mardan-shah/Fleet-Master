"use server";

import prisma from "@/lib/prisma";
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
  return await prisma.driver.findMany({
    orderBy: { name: "asc" },
  });
}

export async function addOrEditDriver(formData: DriverFormData, id?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const data = {
    name: formData.name,
    vehicle_name: formData.vehicle,
    license_number: formData.license_number,
    license_expiry: new Date(formData.license_expiry),
    social_security: formData.social_security,
    join_date: new Date(formData.join_date),
    image_url: formData.image_url,
    created_by_id: (session.user as any).id,
  };

  let driver;
  if (id) {
    driver = await prisma.driver.update({
      where: { id },
      data,
    });
  } else {
    driver = await prisma.driver.create({
      data,
    });
  }

  revalidatePath("/pages/drivers");
  return driver;
}

export async function deleteDriver(id: string) {
  await prisma.driver.delete({
    where: { id },
  });
  revalidatePath("/pages/drivers");
}
