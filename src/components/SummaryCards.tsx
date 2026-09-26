"use client";

import { ExpenseDTO } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingUp, Calendar, Hash } from "lucide-react";
import { useMemo } from "react";

export default function SummaryCards({ expenses }: { expenses: ExpenseDTO[] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = expenses.filter((e) => {
      const d = new Date(e.expenseDate);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });

    const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const monthTotal = thisMonth.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const avg = expenses.length ? total / expenses.length : 0;

    return {
      total,
      monthTotal,
      count: expenses.length,
      avg,
    };
  }, [expenses]);

  const cards = [
    {
      label: "This Month",
      value: formatCurrency(stats.monthTotal),
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Spent",
      value: formatCurrency(stats.total),
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg / Expense",
      value: formatCurrency(stats.avg),
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Expenses",
      value: stats.count.toString(),
      icon: Hash,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
            <c.icon size={18} className={c.color} />
          </div>
          <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
          <p className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
