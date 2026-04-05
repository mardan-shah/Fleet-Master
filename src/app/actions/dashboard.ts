"use server";

import { mockDb } from "@/lib/mock-db";

export async function getDashboardData() {
  const vehicles = [...mockDb.vehicles];
  const drivers = [...mockDb.drivers];
  const tickets = [...mockDb.tickets];
  const fuelUpdates = [...mockDb.fuelUpdates];

  return { vehicles, drivers, tickets, fuelUpdates };
}
