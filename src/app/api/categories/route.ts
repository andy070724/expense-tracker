import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ensureDefaultCategories } from "@/lib/categories";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().min(1).max(20).default("#6366f1"),
  icon: z.string().min(1).max(50).default("Tag"),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDefaultCategories(userId);

  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.name);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [row] = await db
    .insert(categories)
    .values({ ...parsed.data, userId })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
