"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  BarChart3,
  Brain,
  CreditCard,
  Gauge,
  Layers,
  LogOut,
  Settings,
  WalletCards,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/transactions", label: "Transactions", icon: WalletCards },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/budgets", label: "Budgets", icon: Banknote },
  { href: "/insights", label: "Insights", icon: Brain },
  { href: "/categories", label: "Categories", icon: Layers },
  { href: "/accounts", label: "Accounts", icon: CreditCard },
];

type SidebarProps = {
  onLogout: () => Promise<void>;
};

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur md:hidden"
      >
        ☰
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col justify-between border-r border-white/10 bg-[#0b1220]/90 px-6 py-6 backdrop-blur-xl transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Image
              src="/budgetpulse-logo.png.png"
              alt="BudgetPulse logo"
              width={320}
              height={140}
              className="h-auto w-60 drop-shadow-[0_12px_30px_rgba(56,189,248,0.4)]"
            />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Track Smart
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2 transition ${
                    active
                      ? "border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-2 text-slate-300 transition hover:border-white/10 hover:bg-white/5"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-2 text-slate-300 transition hover:border-white/10 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
