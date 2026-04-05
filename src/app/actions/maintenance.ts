"use server";

import { mockDb, Ticket, FuelUpdate } from "@/lib/mock-db";
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
  return [...mockDb.tickets].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

export async function addTicket(formData: TicketFormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const cost = typeof formData.cost === 'string' ? parseFloat(formData.cost) : formData.cost;

  const ticketData: Ticket = {
    id: Math.random().toString(36).substring(7),
    vehicle_name: formData.vehicle,
    issue: formData.issue,
    priority: formData.priority,
    status: formData.status,
    cost: cost,
    created_by_id: (session.user as any).id,
    created_at: new Date(),
  };

  mockDb.tickets.push(ticketData);

  const vehicleIndex = mockDb.vehicles.findIndex(v => v.name === formData.vehicle);
  if (vehicleIndex !== -1) {
    mockDb.vehicles[vehicleIndex].total_maintenance_cost += ticketData.cost;
  }

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
  return ticketData;
}

export async function deleteTicket(id: string) {
  const index = mockDb.tickets.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Ticket not found");

  const ticket = mockDb.tickets[index];
  mockDb.tickets.splice(index, 1);

  const vehicleIndex = mockDb.vehicles.findIndex(v => v.name === ticket.vehicle_name);
  if (vehicleIndex !== -1) {
    mockDb.vehicles[vehicleIndex].total_maintenance_cost -= ticket.cost;
  }

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
  return [...mockDb.fuelUpdates].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

export async function addFuelUpdate(formData: FuelUpdateFormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const quantity = typeof formData.quantity === 'string' ? parseFloat(formData.quantity) : formData.quantity;
  const cost = typeof formData.cost === 'string' ? parseFloat(formData.cost) : formData.cost;
  const distance = typeof formData.distance === 'string' ? parseFloat(formData.distance) : formData.distance;

  const fuelData: FuelUpdate = {
    id: Math.random().toString(36).substring(7),
    vehicle_name: formData.vehicle,
    quantity,
    cost,
    distance,
    created_by_id: (session.user as any).id,
    created_at: new Date(),
  };

  mockDb.fuelUpdates.push(fuelData);

  const vehicleIndex = mockDb.vehicles.findIndex(v => v.name === formData.vehicle);
  if (vehicleIndex !== -1) {
    mockDb.vehicles[vehicleIndex].total_fuel_cost += fuelData.cost;
    mockDb.vehicles[vehicleIndex].total_distance += fuelData.distance;
  }

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
  return fuelData;
}

export async function deleteFuelUpdate(id: string) {
  const index = mockDb.fuelUpdates.findIndex(f => f.id === id);
  if (index === -1) throw new Error("Fuel update not found");

  const fuelUpdate = mockDb.fuelUpdates[index];
  mockDb.fuelUpdates.splice(index, 1);

  const vehicleIndex = mockDb.vehicles.findIndex(v => v.name === fuelUpdate.vehicle_name);
  if (vehicleIndex !== -1) {
    mockDb.vehicles[vehicleIndex].total_fuel_cost -= fuelUpdate.cost;
    mockDb.vehicles[vehicleIndex].total_distance -= fuelUpdate.distance;
  }

  revalidatePath("/pages/maintenance");
  revalidatePath("/pages/dashboard");
}
