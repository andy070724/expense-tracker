"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoryDTO, ExpenseDTO } from "@/lib/types";
import SummaryCards from "./SummaryCards";
import CategoryChart from "./CategoryChart";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import { Plus, SlidersHorizontal } from "lucide-react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExpenseDTO | null>(null);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  }, []);

  const loadExpenses = useCallback(async () => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("categoryId", categoryFilter);
    const res = await fetch(`/api/expenses?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setExpenses(data.expenses);
    }
  }, [categoryFilter]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadCategories(), loadExpenses()]);
      setLoading(false);
    })();
  }, [loadCategories, loadExpenses]);

  function openAddForm() {
    setEditing(null);
    setShowForm(true);
  }

  function openEditForm(expense: ExpenseDTO) {
    setEditing(expense);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  function handleSaved() {
    closeForm();
    loadExpenses();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading your expenses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and understand your spending.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <SummaryCards expenses={expenses} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CategoryChart expenses={expenses} />
        </div>

        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <ExpenseList
            expenses={expenses}
            onEdit={openEditForm}
            onDeleted={loadExpenses}
          />
        </div>
      </div>

      {showForm && (
        <ExpenseForm
          categories={categories}
          initial={editing}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
