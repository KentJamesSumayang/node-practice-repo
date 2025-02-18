import { NextResponse } from "next/server";
import User from "@/lib/models/User.model";
import Category from "@/lib/models/Category.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req:Request, context: { params: any }) {
    const category_id = await context.params.category;
    try {
        const body = await req.json();
        const {title} = body;

        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id")

        if (!user_id || !Number.isInteger(Number(user_id))) {
            return NextResponse.json(
                { message: "Invalid or missing user id" },
                {status: 400}
            )
        }

        if (!category_id || !Number.isInteger(Number(category_id))) {
            return NextResponse.json(
                { message: "Invalid or missing category id" },
                {status: 400}
            )
        }

        const user = await User.findByPk(user_id);

        if (!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            ) 
        }

        const category = await Category.findOne({
            where: {
                id: category_id,   // Assuming `id` is the primary key
                user_id: user_id   // Make sure `user_id` is correctly referenced
            }
        });
    
        if (!category) {
            return NextResponse.json(
                { message: "Category Not Found" },
                {status: 404}
            )
        }

        const updatedCategory = await category.update({
            id: category_id,
            title: title
        })

        return NextResponse.json({
            message: "New category has been UPDATED sucessfully.",
            category: updatedCategory
        })


    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req:Request, context: { params: any }) {
    const category_id = await context.params.category;
    try {

        const { searchParams } = new URL(req.url);
        const user_id =  searchParams.get("user_id")

        if (!user_id || !Number.isInteger(Number(user_id))) {
            return NextResponse.json(
                { message: "Invalid or missing user id" },
                {status: 400}
            )
        }

        if (!category_id || !Number.isInteger(Number(category_id))) {
            return NextResponse.json(
                { message: "Invalid or missing category id" },
                {status: 400}
            )
        }

        const user = await User.findByPk(user_id);

        if (!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            ) 
        }

        const category = await Category.findOne({
            where: {
                id: category_id,   // Assuming `id` is the primary key
                user_id: user_id   // Make sure `user_id` is correctly referenced
            }
        });
    
        if (!category) {
            return NextResponse.json(
                { message: "Category Not Found or does not belong to the user" },
                {status: 404}
            )
        }
        
        await category.destroy(category_id);

        return NextResponse.json({
            message: "A category has been DELETED sucessfully.",
        })


    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}