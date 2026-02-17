"use client";

import { Trash2 } from "lucide-react";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  created_at: string;
};

type TransactionListProps = {
  items: Transaction[];
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function TransactionList({
  items,
  onDelete,
  loading,
}: TransactionListProps) {
  if (!items.length) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-sm text-slate-300">
        No transactions yet. Add your first income or expense.
      </div>
    );
  }

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
        Recent Activity
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">{item.title}</div>
                <div className="text-xs text-slate-400">
                  {item.category} · {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={
                    item.type === "income"
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }
                >
                  {item.type === "income" ? "+" : "-"}
                  {currency.format(item.amount)}
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                  {item.type}
                </span>
              </div>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => onDelete(item.id)}
              className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-rose-300 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
