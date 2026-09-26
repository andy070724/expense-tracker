import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { expenses, categories } from "@/db/schema";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(255),
  amount: z.coerce.number().positive(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  expenseDate: z.string().min(1), // yyyy-mm-dd
});

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = Number(searchParams.get("limit") ?? 100);

  const conditions = [eq(expenses.userId, userId)];
  if (categoryId) conditions.push(eq(expenses.categoryId, Number(categoryId)));
  if (from) conditions.push(gte(expenses.expenseDate, from));
  if (to) conditions.push(lte(expenses.expenseDate, to));

  const rows = await db
    .select({
      id: expenses.id,
      title: expenses.title,
      amount: expenses.amount,
      description: expenses.description,
      expenseDate: expenses.expenseDate,
      createdAt: expenses.createdAt,
      categoryId: expenses.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(expenses.expenseDate), desc(expenses.createdAt))
    .limit(Math.min(limit, 500));

  const [{ total }] = await db
    .select({ total: sql<string>`coalesce(sum(${expenses.amount}), 0)` })
    .from(expenses)
    .where(and(...conditions));

  return NextResponse.json({ expenses: rows, total });
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

  const { title, amount, categoryId, description, expenseDate } = parsed.data;

  const [row] = await db
    .insert(expenses)
    .values({
      userId,
      title,
      amount: amount.toString(),
      categoryId: categoryId ?? undefined,
      description: description ?? null,
      expenseDate,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
