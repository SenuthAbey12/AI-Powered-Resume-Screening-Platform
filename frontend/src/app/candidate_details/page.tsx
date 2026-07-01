"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  MapPin,
  Briefcase,
  Calendar,
  Award,
  Mail,
  Phone,
  Download,
  Brain,
  CheckCircle,
} from "lucide-react";

import {
  Topbar,
  Badge,
  ScorePill,
  Avatar,
} from "@/components/shared";

import { candidates } from "@/lib/mockData";

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [tab, setTab] =
    useState<"overview" | "resume" | "notes">("overview");

  const candidateId = Number(id);

  const c =
    candidates.find((x) => x.id === candidateId) ?? candidates[0];

  return (
    <div className="flex h-screen">
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        {/* TOPBAR */}
        <Topbar
          title="Candidate Details"
          subtitle={`${c.name} — ${c.role}`}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  router.push(`/candidates/${c.id}/analysis`)
                }
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                <Brain size={12} /> AI Report
              </button>

              <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
                <CheckCircle size={12} /> Shortlist
              </button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">
              {/* PROFILE CARD */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex flex-col items-center text-center mb-5">
                  <Avatar initials={c.avatar} size="lg" />

                  <div className="mt-3">
                    <h2 className="text-base font-semibold text-foreground">
                      {c.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {c.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <ScorePill score={c.score} />
                    <Badge
                      label={c.status.toUpperCase()}
                      variant={
                        c.status === "shortlisted"
                          ? "success"
                          : "info"
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex flex-col gap-3">
                  {[
                    { icon: MapPin, text: c.location },
                    { icon: Briefcase, text: `${c.exp} experience` },
                    { icon: Calendar, text: `Applied ${c.applied}` },
                    { icon: Award, text: c.education },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2.5 text-xs text-muted-foreground"
                    >
                      <Icon
                        size={13}
                        className="text-indigo-400 shrink-0"
                      />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACT */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  Contact
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-foreground">
                    <Mail size={12} className="text-muted-foreground" />
                    {c.name.toLowerCase().replace(" ", ".")}
                    @example.com
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-foreground">
                    <Phone size={12} className="text-muted-foreground" />
                    +1 (415) 555-0194
                  </div>
                </div>
              </div>

              {/* SKILLS */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  Skills
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[...c.skills, "Ray", "CUDA", "Spark"].map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              {/* TABS */}
              <div className="flex bg-secondary rounded-md p-1 w-fit">
                {(["overview", "resume", "notes"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-1.5 text-xs font-medium rounded capitalize transition-all
                      ${
                        tab === t
                          ? "bg-card text-foreground shadow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* OVERVIEW */}
              {tab === "overview" && (
                <>
                  {/* AI SCORE */}
                  <div className="bg-card border border-border rounded-lg p-5">
                    <div className="text-sm font-medium text-foreground mb-4">
                      AI Score Breakdown
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Technical Skills",
                          score: 96,
                          color: "#6366f1",
                        },
                        {
                          label: "Experience Match",
                          score: 92,
                          color: "#10b981",
                        },
                        {
                          label: "Education",
                          score: 88,
                          color: "#f59e0b",
                        },
                        {
                          label: "Culture Fit",
                          score: 84,
                          color: "#22d3ee",
                        },
                      ].map(({ label, score, color }) => (
                        <div
                          key={label}
                          className="bg-secondary rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {label}
                            </span>
                            <span
                              className="text-sm font-mono font-semibold"
                              style={{ color }}
                            >
                              {score}
                            </span>
                          </div>

                          <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${score}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EXPERIENCE */}
                  <div className="bg-card border border-border rounded-lg p-5">
                    <div className="text-sm font-medium text-foreground mb-4">
                      Work Experience
                    </div>

                    <div className="flex flex-col gap-4">
                      {[
                        {
                          role: "Senior ML Engineer",
                          company: "DeepMind",
                          period: "2022 — Present",
                          desc:
                            "Led development of production ML systems serving 50M+ users.",
                        },
                        {
                          role: "ML Engineer",
                          company: "Anthropic",
                          period: "2019 — 2022",
                          desc:
                            "Trained large language models and RLHF systems.",
                        },
                        {
                          role: "Research Engineer",
                          company: "Berkeley AI Lab",
                          period: "2018 — 2019",
                          desc:
                            "Research on reinforcement learning.",
                        },
                      ].map(({ role, company, period, desc }) => (
                        <div key={company} className="flex gap-3">
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-0.5" />
                            <div className="w-px flex-1 bg-border" />
                          </div>

                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {role}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground mb-1">
                              {company} · {period}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* RESUME */}
              {tab === "resume" && (
                <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center justify-center gap-3 min-h-64">
                  <Download size={20} className="text-indigo-400" />

                  <div className="text-sm font-medium text-foreground">
                    {c.name.toLowerCase().replace(" ", "_")}_resume.pdf
                  </div>

                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-md">
                    Download Resume
                  </button>
                </div>
              )}

              {/* NOTES */}
              {tab === "notes" && (
                <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
                  <textarea
                    rows={6}
                    placeholder="Add notes about this candidate..."
                    className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                  />

                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-md">
                    Save Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}