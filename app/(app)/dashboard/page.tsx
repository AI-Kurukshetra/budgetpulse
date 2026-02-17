"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Topbar from "@/components/Topbar";
import { useBudgets } from "@/lib/useBudgets";

export default function DashboardOverviewPage() {
  const { session, loadingSession, items, totals, loadingData } = useBudgets();

  if (loadingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-300">
        <div className="glass rounded-2xl px-6 py-4 text-sm">
          Loading session...
        </div>
      </main>
    );
  }

  if (!session) return null;

  const recent = items.slice(0, 5);

  const quickInsight =
    totals.net > 0
      ? "Positive cashflow. Keep your savings rate steady."
      : "Net balance is negative. Review top expenses.";

  const savingsRate =
    totals.income > 0 ? (totals.net / totals.income) * 100 : 0;
  const savingsTone =
    savingsRate > 30 ? "text-emerald-300" : savingsRate >= 15 ? "text-amber-300" : "text-rose-300";

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(
    lastMonthDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const monthlyTotals = [lastMonthKey, currentMonthKey].map((key) => {
    const monthItems = items.filter((item) => item.created_at.startsWith(key));
    const income = monthItems
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = monthItems
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    return { key, income, expense, savings: income - expense };
  });

  const [prevMonth, currentMonth] = monthlyTotals;
  const pctChange = (current: number, prev: number) =>
    prev === 0 ? 0 : ((current - prev) / prev) * 100;
  const incomeChange = pctChange(currentMonth.income, prevMonth.income);
  const expenseChange = pctChange(currentMonth.expense, prevMonth.expense);
  const savingsChange = pctChange(currentMonth.savings, prevMonth.savings);

  const currentMonthItems = items.filter((item) =>
    item.created_at.startsWith(currentMonthKey)
  );
  const expenseItems = currentMonthItems.filter(
    (item) => item.type === "expense"
  );
  const expenseTotal = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = expenseItems.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    },
    {}
  );
  const topCategoryEntry = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];
  const topCategoryName = topCategoryEntry?.[0] ?? "N/A";
  const topCategoryAmount = topCategoryEntry?.[1] ?? 0;
  const topCategoryShare =
    expenseTotal > 0 ? (topCategoryAmount / expenseTotal) * 100 : 0;

  const budgetUsage = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, value]) => ({
      name,
      percent: expenseTotal > 0 ? (value / expenseTotal) * 100 : 0,
    }));

  const trendKeys = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
  const trendValues = trendKeys.map((key) => {
    const monthItems = items.filter((item) => item.created_at.startsWith(key));
    const income = monthItems
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = monthItems
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    return income - expense;
  });
  const maxTrend = Math.max(1, ...trendValues.map((v) => Math.abs(v)));
  const trendPoints = trendValues
    .map((value, index) => {
      const x = (index / (trendValues.length - 1)) * 100;
      const y = 50 - (value / maxTrend) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Dashboard Overview"
        subtitle="Dashboard"
        action={
          <div className="text-sm text-slate-300">
            {session.user.email}
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total Income"
          value={totals.income}
          tone="income"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <StatCard
          label="Total Expenses"
          value={totals.expense}
          tone="expense"
          icon={<ArrowDownRight className="h-4 w-4" />}
        />
        <StatCard
          label="Net Balance"
          value={totals.net}
          tone="net"
          icon={<Wallet className="h-4 w-4" />}
        />
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Savings Rate</span>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </div>
          <div className={`mt-3 text-2xl font-semibold ${savingsTone}`}>
            {savingsRate.toFixed(0)}%
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/5">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-700"
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Recent Activity
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Latest transactions
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {loadingData && items.length === 0
                ? "Loading..."
                : `${recent.length} items`}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-slate-300">
                No transactions yet. Add your first entry on the Transactions page.
              </p>
            ) : (
              recent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">
                      {item.category} ·{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={
                      item.type === "income"
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }
                  >
                    {item.type === "income" ? "+" : "-"}
                    {item.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Budget Usage
            </p>
            <div className="mt-4 space-y-3">
              {budgetUsage.length === 0 ? (
                <p className="text-sm text-slate-300">
                  Add expenses to see category usage.
                </p>
              ) : (
                budgetUsage.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{item.name}</span>
                      <span>{item.percent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-700"
                        style={{ width: `${Math.min(item.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              This Month vs Last Month
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Income</span>
                <span className={incomeChange >= 0 ? "text-emerald-300" : "text-rose-300"}>
                  {incomeChange >= 0 ? "↑" : "↓"} {Math.abs(incomeChange).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expenses</span>
                <span className={expenseChange <= 0 ? "text-emerald-300" : "text-rose-300"}>
                  {expenseChange >= 0 ? "↑" : "↓"} {Math.abs(expenseChange).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Savings</span>
                <span className={savingsChange >= 0 ? "text-emerald-300" : "text-rose-300"}>
                  {savingsChange >= 0 ? "↑" : "↓"} {Math.abs(savingsChange).toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Monthly Trend
          </p>
          <div className="mt-4 h-40">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <polyline
                fill="none"
                stroke="rgba(34,211,238,0.9)"
                strokeWidth="2"
                points={trendPoints}
              />
            </svg>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Net balance trend (last 6 months)
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Top Spending Category
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <div className="text-lg font-semibold text-white">
              {topCategoryName}
            </div>
            <div>Spent: ${topCategoryAmount.toFixed(0)}</div>
            <div className="text-slate-400">
              {topCategoryShare.toFixed(0)}% of total expenses
            </div>
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Quick Insight
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">{quickInsight}</h3>
        <p className="mt-2 text-sm text-slate-300">
          Review detailed insights to keep your plan on track.
        </p>
      </Card>
    </div>
  );
}
