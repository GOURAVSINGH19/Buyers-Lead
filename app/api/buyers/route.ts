import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { buyerSchema } from "@/lib/validations/buyer";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  try {
    const body = await req.json();
    const validatedData = buyerSchema.parse(body);

    const buyer = await prisma.buyer.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: session.user.id,
        diff: {
          action: "created",
          data: validatedData,
        },
      },
    });

    revalidatePath("/buyers");

    return NextResponse.json(buyer, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const res = await prisma.buyer.findMany({
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
      orderBy: { updatedAt: "asc" },
    });
    return NextResponse.json({ buyers: res }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

