import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mockDb } from "@/lib/mock-db";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, avatar, company } = await request.json();

    const userIndex = mockDb.users.findIndex(u => u.id === (session.user as any).id);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    mockDb.users[userIndex] = {
      ...mockDb.users[userIndex],
      name: name ?? mockDb.users[userIndex].name,
      avatar: avatar ?? mockDb.users[userIndex].avatar,
      company: company ?? mockDb.users[userIndex].company,
    };

    return NextResponse.json(mockDb.users[userIndex]);
  } catch (error: any) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
