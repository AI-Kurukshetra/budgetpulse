"use client";

type TopbarProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          {subtitle ?? "Command Center"}
        </p>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
