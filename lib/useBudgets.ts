"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { Transaction } from "@/components/TransactionList";
import type { TransactionDraft } from "@/components/TransactionForm";

export function useBudgets() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [items, setItems] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBudgets = useCallback(async (activeSession: Session) => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", activeSession.user.id)
      .order("created_at", { ascending: false });

    setLoadingData(false);

    if (error) {
      return;
    }

    const normalized =
      data?.map((row) => ({
        id: row.id as string,
        title: row.title as string,
        amount: Number(row.amount),
        category: row.category as string,
        type: row.type as "income" | "expense",
        created_at: row.created_at as string,
      })) ?? [];

    setItems(normalized);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
      if (data.session) {
        fetchBudgets(data.session);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          fetchBudgets(nextSession);
        }
      } else {
        setItems([]);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (item.type === "income") acc.income += item.amount;
        if (item.type === "expense") acc.expense += item.amount;
        acc.net = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, net: 0 }
    );
  }, [items]);

  const addBudget = async (draft: TransactionDraft) => {
    if (!session) return { error: "No session" };
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("budgets")
        .insert([
          {
            user_id: session.user.id,
            title: draft.title,
            amount: draft.amount,
            category: draft.category,
            type: draft.type,
          },
        ])
        .select()
        .single();

      setSaving(false);

      if (error) {
        return { error: error.message };
      }

      const newItem: Transaction = {
        id: data.id as string,
        title: data.title as string,
        amount: Number(data.amount),
        category: data.category as string,
        type: data.type as "income" | "expense",
        created_at: data.created_at as string,
      };

      setItems((prev) => [newItem, ...prev]);
      return { error: null };
    } catch {
      setSaving(false);
      return { error: "Network error. Please check your connection." };
    }
  };

  const deleteBudget = async (id: string) => {
    if (!session) return { error: "No session" };
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      setDeletingId(null);

      if (error) {
        return { error: error.message };
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      return { error: null };
    } catch {
      setDeletingId(null);
      return { error: "Network error. Please check your connection." };
    }
  };

  const updateBudget = async (
    id: string,
    draft: TransactionDraft
  ) => {
    if (!session) return { error: "No session" };
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("budgets")
        .update({
          title: draft.title,
          amount: draft.amount,
          category: draft.category,
          type: draft.type,
        })
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      setSaving(false);

      if (error) {
        return { error: error.message };
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: data.title as string,
                amount: Number(data.amount),
                category: data.category as string,
                type: data.type as "income" | "expense",
              }
            : item
        )
      );
      return { error: null };
    } catch {
      setSaving(false);
      return { error: "Network error. Please check your connection." };
    }
  };

  return {
    session,
    loadingSession,
    items,
    loadingData,
    saving,
    deletingId,
    totals,
    fetchBudgets,
    addBudget,
    deleteBudget,
    updateBudget,
  };
}
