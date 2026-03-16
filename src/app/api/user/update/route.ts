import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, avatar, company } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        name,
        avatar,
        company,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
