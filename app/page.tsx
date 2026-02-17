import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-emerald-400/20 blur-[160px]" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="glass glow-ring relative grid items-center gap-10 rounded-[28px] px-8 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-14">
          <div className="flex flex-col gap-6 text-left">
            <Image
              src="/budgetpulse-logo.png.png"
              alt="BudgetPulse logo"
              width={520}
              height={220}
              priority
              className="logo-pulse h-auto w-80 drop-shadow-[0_12px_30px_rgba(56,189,248,0.45)] sm:w-96"
            />
            <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">
              Personal Finance Command Center
            </span>
            <h1 className="text-4xl font-semibold text-white drop-shadow-[0_8px_20px_rgba(15,23,42,0.6)] sm:text-6xl">
              Know your money at a glance.
              <span className="block text-cyan-200">
                Save smarter. Spend better.
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
              BudgetPulse turns daily transactions into a clear financial
              health snapshot, with insights that keep you ahead every month.
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group relative inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 px-6 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 sm:w-auto"
              >
                Get Started
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition group-hover:opacity-100" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 sm:w-auto"
              >
                See Demo
              </Link>
            </div>
          </div>
          <div className="w-full">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/10 p-6 text-left text-sm text-slate-300">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span>Live preview</span>
                  <span className="text-cyan-200">This month</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Net balance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-300">
                      $8,240
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-white/5">
                      <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Savings rate
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-cyan-200">
                      32%
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Above target by 7%
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                    <span>Top category · Housing</span>
                    <span className="text-rose-200">$1,240</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                    <span>Income vs Expense</span>
                    <span className="text-emerald-200">+ $2,180</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Savings Rate Tracker", "Spot your true savings pace instantly."],
            ["Budget Usage & Alerts", "Stay ahead of category overspend risk."],
            ["Top Spending Insights", "Know where every dollar flows."],
            ["Mini Monthly Trend Graph", "Track momentum in one glance."],
            ["Quick Financial Health", "Get a clear monthly score."],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 text-sm text-slate-200 transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <span className="text-xs text-cyan-200">●</span>
              </div>
              <p className="mt-2 text-slate-300">{desc}</p>
              <div className="mt-4 h-1 w-full rounded-full bg-white/5">
                <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white">
              How it works
            </h2>
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-center text-xs font-semibold text-cyan-200">
                  1
                </span>
                <div>
                  <div className="font-semibold text-white">Add transactions</div>
                  <p className="text-slate-300">
                    Log income and expenses in seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-center text-xs font-semibold text-cyan-200">
                  2
                </span>
                <div>
                  <div className="font-semibold text-white">Track progress</div>
                  <p className="text-slate-300">
                    See trends and budget usage in one place.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-center text-xs font-semibold text-cyan-200">
                  3
                </span>
                <div>
                  <div className="font-semibold text-white">Get insights</div>
                  <p className="text-slate-300">
                    Act on smart recommendations fast.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white">
              Trusted by teams and individuals
            </h2>
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-4">
                “BudgetPulse gave me instant clarity on my spending habits.”
              </blockquote>
              <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-4">
                “The savings rate card alone keeps me accountable.”
              </blockquote>
              <div className="grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center">
                  FinDaily
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center">
                  BudgetPro
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center">
                  PulseLab
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Security first</h3>
            <p className="mt-2 text-sm text-slate-300">
              Bank-level encryption, privacy-first design, and total control of
              your data.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Encrypted data
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Privacy-first
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Secure by design
              </span>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">
              Resources & tips
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Get weekly finance tips and practical guides.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10">
                Join the newsletter
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10">
                View resources
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400">
          <div className="flex flex-col gap-1">
            <span>© 2026 BudgetPulse. All rights reserved.</span>
            <span className="italic text-slate-500">
              Powered by Bacancy Technology, Made with Love
            </span>
          </div>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
