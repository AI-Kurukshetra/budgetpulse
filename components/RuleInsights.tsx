"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import type { Transaction } from "@/components/TransactionList";

type Insight = {
  tone: "good" | "warn" | "risk";
  text: string;
};

type Recommendation = {
  tone: "good" | "warn" | "risk";
  text: string;
};

type AnalysisResult = {
  score: number;
  summary: string;
  insights: Insight[];
  recommendations: Recommendation[];
  analyzedAt: string;
};

type RuleInsightsProps = {
  transactions: Transaction[];
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function scoreTone(score: number) {
  if (score >= 75) return "good";
  if (score >= 55) return "warn";
  return "risk";
}

function toneClasses(tone: Insight["tone"]) {
  if (tone === "good") return "text-emerald-200 bg-emerald-500/10 border-emerald-500/30";
  if (tone === "warn") return "text-amber-200 bg-amber-500/10 border-amber-500/30";
  return "text-rose-200 bg-rose-500/10 border-rose-500/30";
}

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const next = Math.round(target * progress);
      setValue(next);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export default function RuleInsights({ transactions }: RuleInsightsProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return transactions.filter((tx) => {
      const date = new Date(tx.created_at);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [transactions]);

  const analyze = async () => {
    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const incomeItems = currentMonthTransactions.filter(
      (tx) => tx.type === "income"
    );
    const expenseItems = currentMonthTransactions.filter(
      (tx) => tx.type === "expense"
    );

    const totalIncome = incomeItems.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, tx) => sum + tx.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const expenseRatio =
      totalIncome === 0 ? (totalExpenses > 0 ? 1 : 0) : totalExpenses / totalIncome;

    const categoryMap = expenseItems.reduce<Record<string, number>>(
      (acc, tx) => {
        acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
        return acc;
      },
      {}
    );

    const topExpenseCategory = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const topCategoryName = topExpenseCategory?.[0];
    const topCategoryShare = topExpenseCategory
      ? topExpenseCategory[1] / Math.max(totalExpenses, 1)
      : 0;

    const largestExpense = expenseItems.reduce(
      (max, tx) => (tx.amount > max ? tx.amount : max),
      0
    );

    const transactionCount = currentMonthTransactions.length;
    const averageTransaction =
      transactionCount === 0
        ? 0
        : currentMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0) /
          transactionCount;

    let score = 100;
    if (expenseRatio > 0.8) score -= 20;
    if (totalIncome > 0 && largestExpense > 0.4 * totalIncome) score -= 15;
    if (topCategoryShare > 0.5) score -= 10;
    if (totalExpenses > totalIncome) score -= 10;
    if (transactionCount > 50) score -= 5;
    score = clamp(score, 0, 100);

    const insights: Insight[] = [];
    const recommendations: Recommendation[] = [];

    if (expenseRatio > 0.9) {
      insights.push({
        tone: "risk",
        text: "You are spending almost all your income. High financial risk.",
      });
      recommendations.push({
        tone: "risk",
        text: "Reduce discretionary spending by 10–15% this month.",
      });
    } else if (expenseRatio >= 0.7) {
      insights.push({
        tone: "warn",
        text: "Your expenses are consuming most of your income. Monitor closely.",
      });
      recommendations.push({
        tone: "warn",
        text: "Set category caps for your top spending areas.",
      });
    } else if (expenseRatio < 0.5 && totalIncome > 0) {
      insights.push({
        tone: "good",
        text: "Great job! You are maintaining healthy savings.",
      });
      recommendations.push({
        tone: "good",
        text: "Allocate fixed savings first to keep momentum.",
      });
    }

    if (totalExpenses > totalIncome && totalIncome > 0) {
      insights.push({
        tone: "risk",
        text: "You are running at a deficit this month.",
      });
      recommendations.push({
        tone: "risk",
        text: "Track daily micro-expenses to plug leaks quickly.",
      });
    }

    if (topCategoryName && topCategoryShare > 0.5) {
      insights.push({
        tone: "warn",
        text: `Most of your spending is concentrated in ${topCategoryName}. Consider balancing.`,
      });
      recommendations.push({
        tone: "warn",
        text: "Spread large expenses across multiple months when possible.",
      });
    }

    if (totalIncome > 0 && largestExpense > 0.3 * totalIncome) {
      insights.push({
        tone: "warn",
        text: "A single large expense is significantly impacting your budget.",
      });
    }

    if (totalIncome > 0 && netBalance > 0.3 * totalIncome) {
      insights.push({
        tone: "good",
        text: "Strong savings performance this month.",
      });
    }

    while (insights.length < 3) {
      insights.push({
        tone: "warn",
        text: "Keep reviewing your spending patterns to stay on track.",
      });
    }

    while (recommendations.length < 2) {
      recommendations.push({
        tone: "good",
        text: "Review your budget weekly to stay aligned with goals.",
      });
    }

    const summary =
      score >= 75
        ? "Financial health looks strong with good savings momentum."
        : score >= 55
        ? "Financial health is stable but needs active monitoring."
        : "Financial health is at risk. Adjust spending patterns quickly.";

    const analyzedAt = new Date().toLocaleString();

    setResult({
      score,
      summary,
      insights,
      recommendations,
      analyzedAt,
    });

    setAnalyzing(false);

    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const scoreValue = useCountUp(result?.score ?? 0);
  const scoreGradient =
    scoreTone(result?.score ?? 0) === "good"
      ? "from-emerald-300 to-cyan-200"
      : scoreTone(result?.score ?? 0) === "warn"
      ? "from-amber-200 to-yellow-200"
      : "from-rose-300 to-amber-200";

  return (
    <section ref={panelRef} className="glass rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Smart Financial Insights
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            AI Intelligence
          </h2>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Brain className="h-5 w-5 text-cyan-200" />
          <Sparkles className="h-5 w-5 text-emerald-200" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-300">
          Current month: {new Date().toLocaleString("en-US", { month: "long" })}
          <span className="ml-2 text-xs text-slate-500">
            {currentMonthTransactions.length} transactions
          </span>
        </div>
        <button
          type="button"
          onClick={analyze}
          disabled={analyzing}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Analyzing...
            </>
          ) : (
            "Analyze Now"
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-5 animate-in fade-in duration-500">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Financial Health Score
            </p>
            <div
              className={`mt-2 text-4xl font-semibold bg-gradient-to-r ${scoreGradient} bg-clip-text text-transparent`}
            >
              {scoreValue}
            </div>
            <p className="mt-2 text-sm text-slate-200">{result.summary}</p>
            <p className="mt-2 text-xs text-slate-500">
              Last analyzed: {result.analyzedAt}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Insights
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {result.insights.map((item, index) => (
                  <li
                    key={`${item.text}-${index}`}
                    className={`rounded-xl border px-3 py-2 text-sm ${toneClasses(
                      item.tone
                    )}`}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Recommendations
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {result.recommendations.map((item, index) => (
                  <li
                    key={`${item.text}-${index}`}
                    className={`rounded-xl border px-3 py-2 text-sm ${toneClasses(
                      item.tone
                    )}`}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
