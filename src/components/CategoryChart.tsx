"use client";

import { ExpenseDTO } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function CategoryChart({ expenses }: { expenses: ExpenseDTO[] }) {
  const data = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    for (const e of expenses) {
      const key = e.categoryName ?? "Uncategorized";
      const color = e.categoryColor ?? "#6b7280";
      const existing = map.get(key);
      if (existing) {
        existing.value += parseFloat(e.amount);
      } else {
        map.set(key, { name: key, value: parseFloat(e.amount), color });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
        No data yet — add an expense to see the breakdown.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-foreground">
        Spending by Category
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              fontSize: 13,
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
