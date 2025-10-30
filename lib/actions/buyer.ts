"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  BHK,
  City,
  PropertyType,
  Purpose,
  Source,
  Status,
  Timeline,
} from "@prisma/client";

export async function getBuyer(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const buyer = await prisma.buyer.findUnique({
    where: { id },
    include: {
      owner: {
        select: { name: true, email: true },
      },
      history: {
        orderBy: { changedAt: "desc" },
        take: 5,
        include: {
          changer: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  if (!buyer) {
    throw new Error("Buyer not found");
  }
  return buyer;
}

export interface BuyersPageResult {
  buyers: {
    city: City;
    propertyType: PropertyType;
    status: Status;
    timeline: Timeline;
    email: string | null;
    phone: string;
    fullName: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    bhk: BHK | null;
    purpose: Purpose;
    budgetMin: number | null;
    budgetMax: number | null;
    source: Source;
    notes: string | null;
    tags: string[];
    ownerId: string;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getBuyersPage(params: {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  ownerId?: string;

}): Promise<BuyersPageResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;
  const where: any = {};

  if (params?.search) {
    where.OR = [
      { fullName: { contains: params.search, mode: "insensitive" } },
      { phone: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params?.city) where.city = params.city;
  if (params?.propertyType) where.propertyType = params.propertyType;
  if (params?.status) where.status = params.status;
  if (params?.timeline) where.timeline = params.timeline;

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.buyer.count({ where }),
  ]);
  return {
    buyers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
