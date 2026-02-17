"use client";

import { useEffect, useMemo, useState } from "react";

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "income" | "expense" | "net";
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function useCountUp(target: number, durationMs = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const next = target * progress;
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

export default function StatCard({ label, value, icon, tone }: StatCardProps) {
  const animatedValue = useCountUp(value);
  const gradient =
    tone === "income"
      ? "from-emerald-300 to-cyan-300"
      : tone === "expense"
      ? "from-rose-300 to-amber-300"
      : "from-cyan-200 to-indigo-200";

  const formatted = useMemo(
    () => currency.format(animatedValue),
    [animatedValue]
  );

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-5 transition hover:-translate-y-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <span>{label}</span>
        <span className="text-slate-300">{icon}</span>
      </div>
      <div
        className={`bg-gradient-to-r ${gradient} bg-clip-text text-2xl font-semibold text-transparent`}
      >
        {formatted}
      </div>
    </div>
  );
}
