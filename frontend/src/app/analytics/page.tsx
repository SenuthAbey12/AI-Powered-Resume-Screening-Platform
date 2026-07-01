"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Download,
  Clock,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";

import { Topbar, StatCard } from "@/components/shared";
import {
  jobs,
  weeklyApplications,
  scoreDistribution,
  skillDemand,
} from "@/lib/mockData";
import { Sidebar } from "@/components/Sidebar";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar/>
    
      <div className="flex-1 flex flex-col min-h-0">
        <Topbar
          title="Admin Analytics"
          subtitle="Hiring performance · Dec 2024"
          actions={
            <div className="flex items-center gap-2">
              <select className="bg-input-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>

              <button className="flex items-center gap-1.5 bg-secondary hover:bg-white/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
                <Download size={12} /> Export
              </button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* STATS */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Time to Hire"
              value="14.2 days"
              delta="-3.1 days"
              icon={Clock}
              color="indigo"
            />
            <StatCard
              label="Offer Accept Rate"
              value="78.3%"
              delta="+5.2%"
              icon={TrendingUp}
              color="emerald"
            />
            <StatCard
              label="Diversity Score"
              value="72 / 100"
              delta="+8"
              icon={Activity}
              color="cyan"
            />
            <StatCard
              label="Cost per Hire"
              value="$4,230"
              delta="-$610"
              icon={Target}
              color="amber"
            />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* BAR CHART */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-1">
                Applications Over Time
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mb-4">
                Weekly volume
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyApplications} barSize={18}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0d1117",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="apps" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="hired" fill="#10b981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-1">
                Score Distribution
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mb-4">
                AI screening results
              </div>

              <div className="flex gap-6 items-center">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="count"
                      stroke="none"
                    >
                      {scoreDistribution.map(({ fill }, i) => (
                        <Cell key={i} fill={fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-col gap-2 flex-1">
                  {scoreDistribution.map(({ range, count, fill }) => (
                    <div
                      key={range}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: fill }}
                        />
                        <span className="text-muted-foreground font-mono">
                          {range}
                        </span>
                      </div>
                      <span className="font-mono text-foreground">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS + PIPELINE */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-4">
                Top Skill Demand
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={skillDemand} layout="vertical" barSize={10}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    width={70}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#6366f1" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-4">
                Pipeline by Job
              </div>

              <div className="flex flex-col gap-3">
                {jobs.map((j) => (
                  <div key={j.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground truncate">
                        {j.title}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {j.applicants} applied
                      </span>
                    </div>

                    <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                      <div
                        className="bg-indigo-500/80"
                        style={{
                          width: `${(j.shortlisted / j.applicants) * 100}%`,
                        }}
                      />
                      <div className="bg-emerald-500/50 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <div className="text-sm font-medium text-foreground">
                Recruiter Activity Log
              </div>
            </div>

            <div className="divide-y divide-border">
              {[
                {
                  user: "Rachel Kim",
                  action:
                    "Shortlisted Sarah Chen for Senior ML Engineer",
                  time: "2 min ago",
                  type: "shortlist",
                },
                {
                  user: "David Park",
                  action: "Ran AI batch screening on 34 resumes",
                  time: "1 hr ago",
                  type: "ai",
                },
              ].map(({ user, action, time, type }) => (
                <div
                  key={action}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/2"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                    {user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="flex-1">
                    <span className="text-xs font-medium text-foreground">
                      {user}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      {action}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}