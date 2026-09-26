import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { categories } from "./schema";

dotenv.config({ path: ".env.local" });

// Default categories are created per-user at first login (see src/lib/categories.ts),
// but this script can be used to seed demo data for a specific user id if needed.
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env.local");
  }
  const userId = process.argv[2];
  if (!userId) {
    console.log("Usage: npm run db:seed -- <clerk_user_id>");
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  const defaults = [
    { name: "Food & Dining", color: "#f97316", icon: "UtensilsCrossed" },
    { name: "Transportation", color: "#3b82f6", icon: "Car" },
    { name: "Shopping", color: "#ec4899", icon: "ShoppingBag" },
    { name: "Bills & Utilities", color: "#ef4444", icon: "Receipt" },
    { name: "Entertainment", color: "#8b5cf6", icon: "Popcorn" },
    { name: "Health", color: "#10b981", icon: "HeartPulse" },
    { name: "Other", color: "#6b7280", icon: "MoreHorizontal" },
  ];

  await db.insert(categories).values(
    defaults.map((c) => ({ ...c, userId }))
  );

  console.log(`Seeded ${defaults.length} categories for user ${userId}`);
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
