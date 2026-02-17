"use client";

import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className }: CardProps) {
  return <div className={`glass rounded-2xl ${className ?? ""}`}>{children}</div>;
}
