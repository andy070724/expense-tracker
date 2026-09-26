import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", color: "#f97316", icon: "UtensilsCrossed" },
  { name: "Transportation", color: "#3b82f6", icon: "Car" },
  { name: "Shopping", color: "#ec4899", icon: "ShoppingBag" },
  { name: "Bills & Utilities", color: "#ef4444", icon: "Receipt" },
  { name: "Entertainment", color: "#8b5cf6", icon: "Popcorn" },
  { name: "Health", color: "#10b981", icon: "HeartPulse" },
  { name: "Other", color: "#6b7280", icon: "MoreHorizontal" },
];

/**
 * Ensures the given user has at least their default set of categories.
 * Runs once per user (idempotent — safe to call on every dashboard load).
 */
export async function ensureDefaultCategories(userId: string) {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.userId, userId))
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(categories).values(
    DEFAULT_CATEGORIES.map((c) => ({ ...c, userId }))
  );
}
