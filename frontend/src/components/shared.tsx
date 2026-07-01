"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/* ---------------- Badge ---------------- */
export function Badge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "success" | "warn" | "danger" | "info";
}) {
  const styles: Record<string, string> = {
    default: "bg-white/5 text-gray-400 border border-white/10",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warn: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    info: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

/* ---------------- Score Pill ---------------- */
export function ScorePill({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 80
      ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
      : score >= 70
      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border font-mono text-sm font-semibold ${color}`}
    >
      {score}
    </span>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-semibold text-white shrink-0`}
    >
      {initials}
    </div>
  );
}

/* ---------------- Stat Card ---------------- */
export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  color = "indigo",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ElementType;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
    rose: "text-rose-400 bg-rose-500/10",
  };

  const isPositive = delta?.startsWith("+");

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {label}
        </span>

        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon size={15} />
        </div>
      </div>

      <div>
        <div className="text-2xl font-semibold text-foreground font-mono">
          {value}
        </div>

        {delta && (
          <div
            className={`flex items-center gap-1 text-xs mt-1 font-mono ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {delta} vs last month
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Topbar ---------------- */
export function Topbar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/80 backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground font-mono">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        <div className="relative p-1.5 rounded-md">
          <Avatar initials="RK" size="sm" />
        </div>
      </div>
    </div>
  );
}