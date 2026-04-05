"use server";

import { mockDb } from "@/lib/mock-db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserData() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  return mockDb.users.find(u => u.id === (session.user as any).id) || null;
}

export async function updateUserData(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const { id: _, password: __, ...updateData } = data;

  const userIndex = mockDb.users.findIndex(u => u.id === (session.user as any).id);
  if (userIndex === -1) throw new Error("User not found");

  mockDb.users[userIndex] = {
    ...mockDb.users[userIndex],
    ...updateData,
  };

  return mockDb.users[userIndex];
}

export async function deleteAccount() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const userIndex = mockDb.users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockDb.users.splice(userIndex, 1);
  }

  return { success: true };
}
