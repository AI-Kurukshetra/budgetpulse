"use client";

import Card from "@/components/Card";
import Topbar from "@/components/Topbar";

const mockBudgets = [
  { category: "Housing", budget: 1500, spent: 980 },
  { category: "Food", budget: 600, spent: 420 },
  { category: "Transport", budget: 300, spent: 180 },
];

export default function BudgetsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Budgets"
        subtitle="Budgets"
        action={
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Set Budget
          </button>
        }
      />

      <Card className="p-6">
        <div className="space-y-4">
          {mockBudgets.map((item) => {
            const progress = Math.min(
              (item.spent / item.budget) * 100,
              100
            );
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{item.category}</span>
                  <span>
                    ${item.spent} / ${item.budget}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {Math.round(progress)}% of budget used
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
