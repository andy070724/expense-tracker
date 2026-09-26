export type CategoryDTO = {
  id: number;
  userId: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
};

export type ExpenseDTO = {
  id: number;
  title: string;
  amount: string;
  description: string | null;
  expenseDate: string;
  createdAt: string;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  categoryIcon: string | null;
};
