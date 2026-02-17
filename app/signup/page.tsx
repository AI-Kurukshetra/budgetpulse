"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created.");
    router.push("/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-20">
      <section className="glass w-full max-w-md rounded-3xl p-8">
        <div className="flex justify-center">
          <Image
            src="/budgetpulse-logo.png.png"
            alt="BudgetPulse logo"
            width={420}
            height={180}
            className="logo-pulse h-auto w-72 drop-shadow-[0_12px_30px_rgba(56,189,248,0.45)]"
          />
        </div>
        <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
        <p className="mt-2 text-sm text-slate-200">
          Create your BudgetPulse account.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Email
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition focus:border-cyan-300"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Password
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition focus:border-cyan-300"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-200 hover:text-cyan-100">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
