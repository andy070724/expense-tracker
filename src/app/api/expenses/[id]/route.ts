import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  amount: z.coerce.number().positive().optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  expenseDate: z.string().min(1).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { amount, ...rest } = parsed.data;

  const [row] = await db
    .update(expenses)
    .set({
      ...rest,
      ...(amount !== undefined ? { amount: amount.toString() } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [row] = await db
    .delete(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
