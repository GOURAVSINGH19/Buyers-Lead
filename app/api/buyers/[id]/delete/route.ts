import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    const buyerId = params.id;

    const existingBuyer = await prisma.buyer.findUnique({
        where: { id: buyerId },
    });

    if (!existingBuyer) {
        return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    if (existingBuyer.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.buyer.delete({
        where: { id: buyerId },
    });

    revalidatePath("/buyers");

    return NextResponse.json({ success: true });
}
