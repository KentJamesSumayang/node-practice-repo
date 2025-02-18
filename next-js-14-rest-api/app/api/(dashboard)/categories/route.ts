import { NextResponse } from "next/server";
import User from "@/lib/models/User.model";
import Category from "@/lib/models/Category.model";

// Get categories
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !Number.isInteger(Number(id))) {
            return NextResponse.json(
                { message: "Invalid or missing user id" },
                { status: 400 } // Correct placement
            );
        }
        const user = await User.findByPk(id);
        console.log(user);
        if (!user) {
            return NextResponse.json(
                { message: "User not found",},
                {status: 404}
            )
        }

        const categories = await Category.findAll({
            where: { user_id: id } // Assuming "userId" is the foreign key in Category
        });

        return NextResponse.json({
            status: 200,
            data: categories
        })

    } catch (error: unknown) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
        
    }
}

// Create Category
export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const { title } = await req.json();

        if (!id || !Number.isInteger(Number(id))) {
            return NextResponse.json(
                { message: "Invalid or missing user id" },
                {status: 400}
            )
        }

        const user = await User.findByPk(id);

        if (!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            ) 
        }

        const newCategory = await Category.build({
            title,
            user_id: Number(id)
        })

        newCategory.save()

        return NextResponse.json({
            message: "New category has been CREATED sucessfully.",
            user: id,
            category: newCategory
        })

    } catch (error: unknown) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}