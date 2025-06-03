import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@repo/db/client";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json();

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        number: phone,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this phone number already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with balance record
    const user = await db.user.create({
      data: {
        name,
        number: phone,
        password: hashedPassword,
        Balance: {
          create: {
            amount: 0,
            locked: 0
          }
        }
      },
    });

    // Return success response (without password)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          phone: user.number,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
