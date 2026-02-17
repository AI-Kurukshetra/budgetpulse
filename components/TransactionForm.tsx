"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

export type TransactionDraft = {
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

type TransactionFormProps = {
  onSubmit: (draft: TransactionDraft) => Promise<void>;
  loading?: boolean;
  initial?: TransactionDraft | null;
  submitLabel?: string;
  onCancel?: () => void;
};

export default function TransactionForm({
  onSubmit,
  loading,
  initial,
  submitLabel,
  onCancel,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setAmount(String(initial.amount));
      setCategory(initial.category);
      setType(initial.type);
    }
  }, [initial]);

  const reset = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setType("income");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount);

    if (!title.trim() || !category.trim() || Number.isNaN(parsedAmount)) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      type,
    });

    if (!initial) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass flex w-full flex-col gap-4 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Add Transaction</h2>
        <PlusCircle className="h-5 w-5 text-cyan-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Title
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition focus:border-cyan-300"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Salary or Grocery"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Amount
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition focus:border-cyan-300"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="1200"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Category
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition focus:border-cyan-300"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Savings, Food, Bills"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Type
          <select
            className="select-dark rounded-xl border border-white/10 bg-slate-950/90 px-4 py-2 text-white outline-none transition focus:border-cyan-300"
            value={type}
            onChange={(event) =>
              setType(event.target.value as "income" | "expense")
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 px-6 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-900" />
              Saving...
            </span>
          ) : (
            submitLabel ?? "Add Transaction"
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
