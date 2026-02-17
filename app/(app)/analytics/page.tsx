"use client";

import Card from "@/components/Card";
import Topbar from "@/components/Topbar";
import { useBudgets } from "@/lib/useBudgets";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
}

export default function AnalyticsPage() {
  const { session, items, loadingData } = useBudgets();

  if (!session) return null;

  const now = new Date();
  const monthKeys = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return monthKey(date);
  });

  const monthlyTotals = monthKeys.map((key) => {
    const monthItems = items.filter((item) => item.created_at.startsWith(key));
    const income = monthItems
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = monthItems
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    return { key, income, expense, net: income - expense };
  });

  const currentMonthKey = monthKey(now);
  const currentMonthItems = items.filter((item) =>
    item.created_at.startsWith(currentMonthKey)
  );

  const currentIncome = currentMonthItems
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const currentExpense = currentMonthItems
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals = currentMonthItems
    .filter((item) => item.type === "expense")
    .reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    }, {});

  const categoryEntries = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const maxNet = Math.max(
    1,
    ...monthlyTotals.map((item) => Math.abs(item.net))
  );

  const maxBar = Math.max(1, currentIncome, currentExpense);

  const donutTotal = categoryEntries.reduce((sum, entry) => sum + entry[1], 0);
  let donutOffset = 0;

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Analytics" subtitle="Analytics" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Monthly Trend
          </p>
          <div className="mt-6 flex items-end gap-3">
            {monthlyTotals.map((item) => {
              const height = Math.max(
                16,
                (Math.abs(item.net) / maxNet) * 140
              );
              const tone =
                item.net >= 0
                  ? "from-emerald-300 to-cyan-300"
                  : "from-rose-300 to-amber-300";
              return (
                <div key={item.key} className="flex flex-1 flex-col items-center">
                  <div
                    className={`w-full rounded-xl bg-gradient-to-t ${tone}`}
                    style={{ height }}
                  />
                  <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    {monthLabel(item.key)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Net balance per month (last 6 months)
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Category Breakdown
          </p>
          {categoryEntries.length === 0 ? (
            <div className="mt-6 text-sm text-slate-300">
              No expense data for this month yet.
            </div>
          ) : (
            <div className="mt-6 flex items-center gap-6">
              <svg viewBox="0 0 36 36" className="h-32 w-32">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="rgba(148,163,184,0.2)"
                  strokeWidth="3.5"
                />
                {categoryEntries.map(([label, value], index) => {
                  const percent = (value / donutTotal) * 100;
                  const dash = `${percent} ${100 - percent}`;
                  const stroke = [
                    "#34d399",
                    "#22d3ee",
                    "#f97316",
                    "#f43f5e",
                    "#a78bfa",
                  ][index % 5];
                  const segment = (
                    <circle
                      key={label}
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke={stroke}
                      strokeWidth="3.5"
                      strokeDasharray={dash}
                      strokeDashoffset={100 - donutOffset}
                    />
                  );
                  donutOffset += percent;
                  return segment;
                })}
              </svg>
              <div className="space-y-2 text-sm text-slate-200">
                {categoryEntries.slice(0, 4).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span>{label}</span>
                    <span className="text-slate-400">
                      {currency.format(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Income vs Expense
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Income</span>
                <span>{currency.format(currentIncome)}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-white/5">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300"
                  style={{ width: `${(currentIncome / maxBar) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Expense</span>
                <span>{currency.format(currentExpense)}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-white/5">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-rose-300 to-amber-300"
                  style={{ width: `${(currentExpense / maxBar) * 100}%` }}
                />
              </div>
            </div>
          </div>
          {loadingData && (
            <p className="mt-3 text-xs text-slate-400">Updating data...</p>
          )}
        </Card>
      </div>
    </div>
  );
}
