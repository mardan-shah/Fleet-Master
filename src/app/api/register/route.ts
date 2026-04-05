import { NextResponse } from "next/server";
import { mockDb, User } from "@/lib/mock-db";

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

    const existingUser = mockDb.users.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      password: "dummy_hashed_password",
      name,
      role,
      company,
    };
    
    mockDb.users.push(user);

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
