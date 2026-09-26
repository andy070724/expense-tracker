import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  numeric,
  timestamp,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    color: varchar("color", { length: 20 }).notNull().default("#6366f1"),
    icon: varchar("icon", { length: 50 }).notNull().default("Tag"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("categories_user_id_idx").on(table.userId),
  })
);

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 255 }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description"),
    expenseDate: date("expense_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("expenses_user_id_idx").on(table.userId),
    dateIdx: index("expenses_date_idx").on(table.expenseDate),
  })
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
