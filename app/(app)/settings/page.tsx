"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import Topbar from "@/components/Topbar";
import { useBudgets } from "@/lib/useBudgets";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { session, items } = useBudgets();
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [defaultType, setDefaultType] = useState("expense");
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    setCurrency(localStorage.getItem("bp_currency") ?? "USD");
    setDateFormat(localStorage.getItem("bp_date_format") ?? "MM/DD/YYYY");
    setDefaultType(localStorage.getItem("bp_default_type") ?? "expense");
    setCompactMode(localStorage.getItem("bp_compact") === "true");
    setAnimations(localStorage.getItem("bp_animations") !== "false");
  }, []);

  useEffect(() => {
    localStorage.setItem("bp_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("bp_date_format", dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem("bp_default_type", defaultType);
  }, [defaultType]);

  useEffect(() => {
    localStorage.setItem("bp_compact", String(compactMode));
  }, [compactMode]);

  useEffect(() => {
    localStorage.setItem("bp_animations", String(animations));
  }, [animations]);

  const exportCsv = () => {
    const rows = [
      ["Date", "Title", "Category", "Type", "Amount"],
      ...items.map((item) => [
        new Date(item.created_at).toISOString(),
        item.title,
        item.category,
        item.type,
        String(item.amount),
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "budgetpulse-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  const profileEmail = session?.user?.email ?? "Not signed in";

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Settings" subtitle="Settings" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Profile
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <div className="flex justify-between">
              <span>Email</span>
              <span className="text-slate-400">{profileEmail}</span>
            </div>
            <div className="flex justify-between">
              <span>User ID</span>
              <span className="text-slate-400">
                {session?.user?.id?.slice(0, 8) ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Preferences
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Currency</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="select-dark rounded-full border border-white/10 bg-slate-950/90 px-3 py-1 text-sm text-white"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Date Format</span>
              <select
                value={dateFormat}
                onChange={(event) => setDateFormat(event.target.value)}
                className="select-dark rounded-full border border-white/10 bg-slate-950/90 px-3 py-1 text-sm text-white"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Default Type</span>
              <select
                value={defaultType}
                onChange={(event) => setDefaultType(event.target.value)}
                className="select-dark rounded-full border border-white/10 bg-slate-950/90 px-3 py-1 text-sm text-white"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Display
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <label className="flex items-center justify-between">
              <span>Compact layout</span>
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(event) => setCompactMode(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Animations</span>
              <input
                type="checkbox"
                checked={animations}
                onChange={(event) => setAnimations(event.target.checked)}
              />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Data
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Export CSV
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
