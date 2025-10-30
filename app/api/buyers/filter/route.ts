import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    console.log(searchParams, "params")

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    const search = searchParams.get("search")
    const city = searchParams.get("city")
    const propertyType = searchParams.get("propertyType")
    const status = searchParams.get("status")
    const timeline = searchParams.get("timeline")

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ]
    }

    if (city && city !== "all") {
        where.city = city
    }

    if (propertyType && propertyType !== "all") {
        where.propertyType = propertyType
    }

    if (status && status !== "all") {
        where.status = status
    }

    if (timeline && timeline !== "all") {
        where.timeline = timeline
    }
    
    const [buyers, total] = await Promise.all([
        prisma.buyer.findMany({
            where,
            orderBy: { updatedAt: "asc" },
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
