import { db } from "@/configs/db";
import { usersTable, WireframeToCodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { description, imageUrl, model, uid, email } = await req.json();
        console.log('Received request:', { description, imageUrl, model, uid, email });

    const creditResult = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));

    if (creditResult[0]?.credits && creditResult[0]?.credits > 0) {

        const result = await db.insert(WireframeToCodeTable).values({
            uid: uid.toString(),
            description: description,
            imageUrl: imageUrl,
            model: model,
            createdBy: email
        }).returning({ id: WireframeToCodeTable.id });

        // Update user credits
        const data = await db.update(usersTable).set({
            credits: creditResult[0]?.credits - 1
        }).where(eq(usersTable.email, email));

        return NextResponse.json(result);
    }
    else {
        return NextResponse.json({ error: 'Not enough credits' }, { status: 400 })
    }
} catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Server error occurred', details: errorMessage }, { status: 500 });
}
}

export async function GET(req: Request) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams?.get('uid');
    const email = searchParams?.get('email');
    if (uid) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));
        return NextResponse.json(result[0]);
    }
    else if (email) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.createdBy, email))
            .orderBy(desc(WireframeToCodeTable.id))
            ;
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'No Record Found' })

}

export async function PUT(req: NextRequest) {
    const { uid, codeResp } = await req.json();

    const result = await db.update(WireframeToCodeTable)
        .set({
            code: codeResp
        }).where(eq(WireframeToCodeTable.uid, uid))
        .returning({ uid: WireframeToCodeTable.uid })

    return NextResponse.json(result);

}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    try {
        await db.delete(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting record:', error);
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}