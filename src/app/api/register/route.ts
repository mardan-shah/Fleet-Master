import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Registration request body:", { ...body, password: "[REDACTED]" });

    const { email, password, name, role, company } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields: " + [!email && "email", !password && "password", !name && "name", !role && "role"].filter(Boolean).join(", ") },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        company,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error("Registration error detail:", error);
    return NextResponse.json(
      { error: "Registration failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
