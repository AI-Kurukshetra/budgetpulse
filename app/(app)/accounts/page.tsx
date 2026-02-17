"use client";

import Card from "@/components/Card";
import Topbar from "@/components/Topbar";

const accounts = [
  { name: "Cash", balance: 420 },
  { name: "Bank", balance: 2150 },
  { name: "UPI", balance: 320 },
  { name: "Credit Card", balance: -180 },
];

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Accounts"
        subtitle="Accounts"
        action={
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Add Account
          </button>
        }
      />

      <Card className="p-6">
        <div className="space-y-3 text-sm text-slate-200">
          {accounts.map((account) => (
            <div
              key={account.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span>{account.name}</span>
              <span
                className={
                  account.balance >= 0 ? "text-emerald-300" : "text-rose-300"
                }
              >
                ${account.balance}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
