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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (searchParams.get("city")) where.city = searchParams.get("city");
  if (searchParams.get("propertyType"))
    where.propertyType = searchParams.get("propertyType");
  if (searchParams.get("status")) where.status = searchParams.get("status");
  if (searchParams.get("timeline"))
    where.timeline = searchParams.get("timeline");

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      include: {
        owner: { select: { name: true, email: true } },
      },
    }),
    prisma.buyer.count({ where }),
  ]);

  return NextResponse.json({
    buyers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
