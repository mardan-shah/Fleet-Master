"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- Tickets ---

export interface TicketFormData {
  vehicle: string;
  issue: string;
  priority: string;
  status: string;
  cost: string | number;
}

export async function getTickets() {
  return await prisma.ticket.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function addTicket(formData: TicketFormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const cost = typeof formData.cost === 'string' ? parseFloat(formData.cost) : formData.cost;

  const ticketData = {
    vehicle_name: formData.vehicle,
    issue: formData.issue,
    priority: formData.priority,
    status: formData.status,
    cost: cost,
    created_by_id: (session.user as any).id,
  };

  const [ticket] = await prisma.$transaction([
    prisma.ticket.create({ data: ticketData }),
    prisma.vehicle.update({
      where: { name: formData.vehicle },
      data: {
        total_maintenance_cost: {
          increment: ticketData.cost,
        },
      },
    }),
  ]);

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
  return ticket;
}

export async function deleteTicket(id: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) throw new Error("Ticket not found");

  await prisma.$transaction([
    prisma.ticket.delete({ where: { id } }),
    prisma.vehicle.update({
      where: { name: ticket.vehicle_name },
      data: {
        total_maintenance_cost: {
          decrement: ticket.cost,
        },
      },
    }),
  ]);

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
}

// --- Fuel Updates ---

export interface FuelUpdateFormData {
  vehicle: string;
  quantity: string | number;
  cost: string | number;
  distance: string | number;
}

export async function getFuelUpdates() {
  return await prisma.fuelUpdate.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function addFuelUpdate(formData: FuelUpdateFormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const quantity = typeof formData.quantity === 'string' ? parseFloat(formData.quantity) : formData.quantity;
  const cost = typeof formData.cost === 'string' ? parseFloat(formData.cost) : formData.cost;
  const distance = typeof formData.distance === 'string' ? parseFloat(formData.distance) : formData.distance;

  const fuelData = {
    vehicle_name: formData.vehicle,
    quantity,
    cost,
    distance,
    created_by_id: (session.user as any).id,
  };

  const [fuelUpdate] = await prisma.$transaction([
    prisma.fuelUpdate.create({ data: fuelData }),
    prisma.vehicle.update({
      where: { name: formData.vehicle },
      data: {
        total_fuel_cost: {
          increment: fuelData.cost,
        },
        total_distance: {
          increment: fuelData.distance,
        },
      },
    }),
  ]);

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
  return fuelUpdate;
}

export async function deleteFuelUpdate(id: string) {
  const fuelUpdate = await prisma.fuelUpdate.findUnique({ where: { id } });
  if (!fuelUpdate) throw new Error("Fuel update not found");

  await prisma.$transaction([
    prisma.fuelUpdate.delete({ where: { id } }),
    prisma.vehicle.update({
      where: { name: fuelUpdate.vehicle_name },
      data: {
        total_fuel_cost: {
          decrement: fuelUpdate.cost,
        },
        total_distance: {
          decrement: fuelUpdate.distance,
        },
      },
    }),
  ]);

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
}
