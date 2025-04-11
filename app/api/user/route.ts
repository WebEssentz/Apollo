
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
    try {
        const { userEmail, userName } = await req.json();
        
        if (!userEmail) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const existingUser = await db.select().from(usersTable)
            .where(eq(usersTable.email, userEmail));

        if (existingUser?.length === 0) {
            const newUser = await db.insert(usersTable).values({
                name: userName || '',
                email: userEmail,
                credits: 3,
            }).returning();

            return NextResponse.json(newUser[0]);
        }
        
        return NextResponse.json(existingUser[0]);
    } catch (error) {
        console.error('User API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: 'Failed to process user request', details: errorMessage },
            { status: 500 }
        );
    }
}

// code

export async function GET(req: Request) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const email = searchParams?.get('email');

    if (email) {
        const result = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));
        return NextResponse.json(result[0]);
    }
}