"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        setChecking(false);
        return;
      }
      setChecking(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        router.replace("/login");
      }
    });

    return () => data.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-300">
        <div className="glass rounded-2xl px-6 py-4 text-sm">
          Loading session...
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 md:ml-64">
        <div className="px-6 pb-16 pt-20 md:pt-10">{children}</div>
      </div>
    </div>
  );
}
