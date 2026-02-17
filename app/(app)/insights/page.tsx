"use client";

import Card from "@/components/Card";
import RuleInsights from "@/components/RuleInsights";
import Topbar from "@/components/Topbar";
import { useBudgets } from "@/lib/useBudgets";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export default function InsightsPage() {
  const { session, items } = useBudgets();

  if (!session) return null;

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Insights" subtitle="Insights" />

      <RuleInsights transactions={items} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-start gap-3 text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Expense exceeded income
              </h3>
              <p className="text-xs text-slate-300">
                Monitor categories that are over budget to restore balance.
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3 text-rose-200">
            <TrendingDown className="mt-0.5 h-5 w-5" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Savings below 20%
              </h3>
              <p className="text-xs text-slate-300">
                Try trimming discretionary expenses this week.
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3 text-emerald-200">
            <TrendingUp className="mt-0.5 h-5 w-5" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Income steady month-over-month
              </h3>
              <p className="text-xs text-slate-300">
                Keep building consistent saving habits.
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3 text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Category over 80% budget
              </h3>
              <p className="text-xs text-slate-300">
                Rebalance categories before the month ends.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
