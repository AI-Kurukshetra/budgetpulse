"use client";

import { useMemo, useState } from "react";
import { Search, PlusCircle, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import Topbar from "@/components/Topbar";
import TransactionForm from "@/components/TransactionForm";
import { useBudgets } from "@/lib/useBudgets";

const monthLabel = (value: string) =>
  new Date(value).toLocaleString("en-US", { month: "long", year: "numeric" });

export default function TransactionsPage() {
  const {
    session,
    items,
    saving,
    deletingId,
    addBudget,
    deleteBudget,
    updateBudget,
  } =
    useBudgets();
  const [showForm, setShowForm] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<{
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
  } | null>(null);
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const monthOptions = useMemo(() => {
    const options = Array.from(
      new Set(items.map((item) => item.created_at.slice(0, 7)))
    );
    return options.sort().reverse();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const monthKey = item.created_at.slice(0, 7);
      if (filterMonth !== "all" && monthKey !== filterMonth) return false;
      if (filterType !== "all" && item.type !== filterType) return false;
      if (search.trim()) {
        const hay = `${item.title} ${item.category}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, filterMonth, filterType, search]);

  const handleSubmit = async (draft: Parameters<typeof addBudget>[0]) => {
    if (editingId) {
      const result = await updateBudget(editingId, draft);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Transaction updated.");
      setEditingId(null);
      setEditingDraft(null);
      return;
    }

    const result = await addBudget(draft);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Transaction added.");
  };

  const handleDelete = async (id: string) => {
    const result = await deleteBudget(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Transaction deleted.");
  };

  if (!session) return null;

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Transactions"
        subtitle="Transactions"
        action={
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
          >
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </button>
        }
      />

      {showForm && (
        <TransactionForm
          onSubmit={handleSubmit}
          loading={saving}
          initial={editingDraft}
          submitLabel={editingId ? "Update Transaction" : "Add Transaction"}
          onCancel={
            editingId
              ? () => {
                  setEditingId(null);
                  setEditingDraft(null);
                }
              : undefined
          }
        />
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <select
              value={filterMonth}
              onChange={(event) => setFilterMonth(event.target.value)}
              className="select-dark rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 text-sm text-white shadow-[0_0_18px_rgba(15,23,42,0.6)] outline-none focus:border-cyan-300"
            >
              <option value="all">All months</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {monthLabel(`${month}-01`)}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              className="select-dark rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 text-sm text-white shadow-[0_0_18px_rgba(15,23,42,0.6)] outline-none focus:border-cyan-300"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or category"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Account</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No transactions match these filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={`${item.id}-${item.created_at}-${index}`}>
                    <td className="py-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-medium text-white">
                      {item.title}
                    </td>
                    <td className="py-4">{item.category}</td>
                    <td className="py-4">Primary</td>
                    <td
                      className={
                        item.type === "income"
                          ? "py-4 text-emerald-300"
                          : "py-4 text-rose-300"
                      }
                    >
                      {item.type === "income" ? "+" : "-"}
                      {item.amount.toFixed(2)}
                    </td>
                    <td className="py-4 capitalize">{item.type}</td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        className="mr-3 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                        onClick={() => {
                          setShowForm(true);
                          setEditingId(item.id);
                          setEditingDraft({
                            title: item.title,
                            amount: item.amount,
                            category: item.category,
                            type: item.type,
                          });
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={Boolean(deletingId)}
                        className="inline-flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
