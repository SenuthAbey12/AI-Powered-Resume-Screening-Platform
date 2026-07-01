"use client";

import { useRouter } from "next/navigation";
import {Sidebar} from "@/components/Sidebar";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  Briefcase,
  Star,
  Brain,
  Plus,
  ChevronRight,
} from "lucide-react";

import {
  Topbar,
  StatCard,
  Badge,
  ScorePill,
  Avatar,
} from "@/components/shared";

import {
  candidates,
  jobs,
  hiringFunnel,
  weeklyApplications,
} from "@/lib/mockData";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* TOPBAR */}
        <Topbar
          title="Recruiter Dashboard"
          subtitle="Dec 28, 2024 — Week 52"
          actions={
            <button
              onClick={() => router.push("/jobs")}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <Plus size={12} /> New Job
            </button>
          }
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* STATS */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Applicants"
              value="500"
              delta="+23%"
              icon={Users}
              color="indigo"
            />
            <StatCard
              label="Active Jobs"
              value="3"
              delta="+1"
              icon={Briefcase}
              color="cyan"
            />
            <StatCard
              label="Shortlisted"
              value="28"
              delta="+12%"
              icon={Star}
              color="amber"
            />
            <StatCard
              label="Avg. AI Score"
              value="81.4"
              delta="+3.2"
              icon={Brain}
              color="emerald"
            />
          </div>

          {/* CHART + FUNNEL */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* CHART */}
            <div className="xl:col-span-2 bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Weekly Applications
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Nov — Dec 2024
                  </div>
                </div>
                <Badge label="LIVE" variant="success" />
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weeklyApplications}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0d1117",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 6,
                      fontSize: 12,
                      fontFamily: "JetBrains Mono",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="apps"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#areaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* FUNNEL */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-1">
                Hiring Funnel
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mb-4">
                All active jobs
              </div>

              <div className="flex flex-col gap-2">
                {hiringFunnel.map(({ stage, count }) => (
                  <div key={stage} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground w-24">{stage}</span>

                    <div className="flex-1 mx-3 bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(count / 500) * 100}%` }}
                      />
                    </div>

                    <span className="font-mono text-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

            {/* CANDIDATES */}
            <div className="xl:col-span-3 bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="text-sm font-medium text-foreground">
                  Top Candidates
                </div>

                <button
                  onClick={() => router.push("/candidates")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
                >
                  View all <ChevronRight size={11} />
                </button>
              </div>

              <div className="divide-y divide-border">
                {candidates.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-white/2 cursor-pointer transition-colors"
                    onClick={() => router.push(`/candidates/${c.id}/details`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.avatar} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {c.role} · {c.exp}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ScorePill score={c.score} />
                      <Badge
                        label={c.status}
                        variant={
                          c.status === "shortlisted"
                            ? "success"
                            : c.status === "reviewing"
                            ? "info"
                            : "default"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JOBS */}
            <div className="xl:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="text-sm font-medium text-foreground">
                  Active Jobs
                </div>

                <button
                  onClick={() => router.push("/jobs")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
                >
                  Manage <ChevronRight size={11} />
                </button>
              </div>

              <div className="divide-y divide-border">
                {jobs
                  .filter((j) => j.active)
                  .map((j) => (
                    <div
                      key={j.id}
                      className="px-5 py-3 hover:bg-white/2 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {j.title}
                        </span>
                        <Badge label={j.stage} variant="info" />
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                        <span>{j.applicants} applied</span>
                        <span className="text-emerald-400">
                          {j.shortlisted} shortlisted
                        </span>
                      </div>

                      <div className="mt-2 bg-white/5 rounded-full h-1 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{
                            width: `${(j.shortlisted / j.applicants) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}