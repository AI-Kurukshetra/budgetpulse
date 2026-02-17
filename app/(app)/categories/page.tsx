"use client";

import Card from "@/components/Card";
import Topbar from "@/components/Topbar";
import toast from "react-hot-toast";

const categories = ["Housing", "Food", "Transport", "Savings", "Health"];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar
        title="Categories"
        subtitle="Categories"
        action={
          <button
            type="button"
            onClick={() => toast("Category management coming soon.")}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Add Category
          </button>
        }
      />

      <Card className="p-6">
        <ul className="space-y-3 text-sm text-slate-200">
          {categories.map((category) => (
            <li
              key={category}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span>{category}</span>
              <div className="flex gap-3 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() =>
                    toast(`Edit "${category}" coming soon.`)
                  }
                  className="hover:text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast(`Delete "${category}" coming soon.`)
                  }
                  className="hover:text-slate-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
