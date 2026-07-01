"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Search, Download, Eye, Brain } from "lucide-react";

import {
  Topbar,
  Badge,
  ScorePill,
  Avatar,
} from "@/components/shared";

import { candidates } from "@/lib/mockData";

export default function CandidatesPage() {
  const router = useRouter();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = candidates.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;

    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        {/* TOPBAR */}
        <Topbar
          title="Candidate Ranking"
          subtitle={`${candidates.length} candidates · AI-ranked by match score`}
          actions={
            <button className="flex items-center gap-1.5 bg-secondary hover:bg-white/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
              <Download size={12} /> Export
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center gap-3">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="bg-input-background border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-48"
              />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex items-center gap-1.5 bg-secondary rounded-md p-1">
              {[
                { key: "all", label: "All" },
                { key: "shortlisted", label: "Shortlisted" },
                { key: "reviewing", label: "Reviewing" },
                { key: "pending", label: "Pending" },
                { key: "rejected", label: "Rejected" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 text-xs rounded font-mono transition-all ${
                    filter === key
                      ? "bg-card text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* JOB SELECT */}
            <select className="bg-input-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none">
              <option>Senior ML Engineer</option>
              <option>MLOps Engineer</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Rank",
                    "Candidate",
                    "Role / Exp",
                    "Location",
                    "Skills",
                    "AI Score",
                    "Match",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/2 cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(`/candidates/${c.id}/details`)
                    }
                  >
                    {/* RANK */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground w-6 inline-block text-center">
                        {idx + 1}
                      </span>
                    </td>

                    {/* CANDIDATE */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={c.avatar} size="sm" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {c.applied}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-4 py-3">
                      <div className="text-xs text-foreground">
                        {c.role}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {c.exp}
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {c.location}
                    </td>

                    {/* SKILLS */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}

                        {c.skills.length > 2 && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            +{c.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SCORE */}
                    <td className="px-4 py-3">
                      <ScorePill score={c.score} />
                    </td>

                    {/* MATCH */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${c.match}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-foreground">
                          {c.match}%
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <Badge
                        label={c.status}
                        variant={
                          c.status === "shortlisted"
                            ? "success"
                            : c.status === "reviewing"
                            ? "info"
                            : c.status === "rejected"
                            ? "danger"
                            : "default"
                        }
                      />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/candidates/${c.id}/details`
                            );
                          }}
                          className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/candidates/${c.id}/analysis`
                            );
                          }}
                          className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-indigo-400 transition-colors"
                        >
                          <Brain size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>  
  );
}