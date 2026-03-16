"use server";

import prisma from "@/lib/prisma";

export async function getDashboardData() {
  const [vehicles, drivers, tickets, fuelUpdates] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.driver.findMany(),
    prisma.ticket.findMany(),
    prisma.fuelUpdate.findMany(),
  ]);

  return { vehicles, drivers, tickets, fuelUpdates };
}
