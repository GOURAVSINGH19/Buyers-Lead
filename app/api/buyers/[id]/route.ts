import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buyerUpdateSchema } from "@/lib/validations/buyer";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = params.id;
  const body = await req.json();

  const existingBuyer = await prisma.buyer.findUnique({ where: { id } });
  if (!existingBuyer) {
    return NextResponse.json({ message: "Buyer not found" }, { status: 404 });
  }

  if (existingBuyer.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const validatedData = buyerUpdateSchema.parse({
    ...body,
    id,
    updatedAt: existingBuyer.updatedAt,
  });

  const diff: any = {};
  Object.keys(validatedData).forEach((key) => {
    if (
      key !== "id" &&
      key !== "updatedAt" &&
      validatedData[key as keyof typeof validatedData] !==
        existingBuyer[key as keyof typeof existingBuyer]
    ) {
      diff[key] = {
        from: existingBuyer[key as keyof typeof existingBuyer],
        to: validatedData[key as keyof typeof validatedData],
      };
    }
  });

  const buyer = await prisma.buyer.update({
    where: { id },
    data: validatedData,
  });

  if (Object.keys(diff).length > 0) {
    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: session.user.id,
        diff,
      },
    });
  }

  return NextResponse.json(buyer);
}
