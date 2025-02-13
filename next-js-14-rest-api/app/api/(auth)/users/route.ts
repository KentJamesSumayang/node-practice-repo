import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { UserRequest } from "@/lib/types/User";

// Get user/s
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // Fetch a single user by ID
            const user = await User.findByPk(Number(id));

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            return NextResponse.json(user);
        }

        // If no ID is provided, fetch all users
        const users = await User.findAll();
        return NextResponse.json(users);
    } catch (error: unknown) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

// Create user
export async function POST(req: NextRequest) {
    try {
        const body: UserRequest = await req.json();

        console.log(body);

        if (!body.username || !body.email || !body.password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Create a new user
        const newUser = await User.create({
            username: body.username,
            email: body.email,
            password: body.password
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

//Update user
export async function PUT(req: NextRequest) {
    try {
        const body: Partial<UserRequest> & { id: number } = await req.json();

        if (!body.id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findByPk(body.id);

        console.log(typeof(user));

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        user.set(body);
        
        await user.save();

        return NextResponse.json(user);
    } catch (error: unknown) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

// Delete user
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json() as { id: number }; // Ensure `id` is a number
        const user = await User.findByPk(id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await user.destroy();
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: unknown) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
