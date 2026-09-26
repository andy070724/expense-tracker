"use client";

import { ExpenseDTO } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getIcon } from "@/lib/icon-map";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  expenses: ExpenseDTO[];
  onEdit: (expense: ExpenseDTO) => void;
  onDeleted: () => void;
};

export default function ExpenseList({ expenses, onEdit, onDeleted }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) onDeleted();
    } finally {
      setDeletingId(null);
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        No expenses match your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border">
        {expenses.map((e) => {
          const Icon = getIcon(e.categoryIcon);
          return (
            <li
              key={e.id}
              className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${e.categoryColor ?? "#6b7280"}1A` }}
              >
                <Icon size={18} style={{ color: e.categoryColor ?? "#6b7280" }} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {e.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.categoryName ?? "Uncategorized"} · {formatDate(e.expenseDate)}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-foreground">
                {formatCurrency(e.amount)}
              </p>

              <div className="ml-1 flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onEdit(e)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  disabled={deletingId === e.id}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
