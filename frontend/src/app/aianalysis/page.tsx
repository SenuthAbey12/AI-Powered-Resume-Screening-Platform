"use client";

import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import {
  Download,
  Brain,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

import { Topbar, Badge } from "@/components/shared";
import { candidates } from "@/lib/mockData";

export default function AIAnalysisPage() {
  const { id } = useParams();
  const router = useRouter();

  const candidateId = Number(id);
  const c =
    candidates.find((x) => x.id === candidateId) ??
    candidates[0];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Topbar
          title="AI Analysis Report"
          subtitle={`${c.name} — ${c.role}`}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  router.push(`/candidates/${c.id}/details`)
                }
                className="flex items-center gap-1.5 bg-secondary hover:bg-white/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                <ArrowLeft size={12} /> Back to Profile
              </button>

              <Badge label="AI v3.1" variant="info" />

              <button className="flex items-center gap-1.5 bg-secondary hover:bg-white/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
                <Download size={12} /> Export PDF
              </button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* SCORE HEADER */}
          <div className="bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent border border-indigo-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">
                  Overall Match Score
                </div>

                <div className="text-5xl font-mono font-bold text-white">
                  {c.score}
                  <span className="text-2xl text-indigo-400 font-normal">
                    /100
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    label="TOP 5% CANDIDATE"
                    variant="success"
                  />
                  <Badge label="RECOMMENDED" variant="info" />
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-500/30 bg-indigo-500/10">
                <Brain size={32} className="text-indigo-400" />
              </div>
            </div>
          </div>

          {/* AI SUMMARY */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-indigo-400" />
              <div className="text-sm font-medium text-foreground">
                AI Summary
              </div>
              <Badge label="GENERATED" variant="default" />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.name} is an exceptionally strong match for the{" "}
              {c.role} role. Their {c.exp} experience aligns strongly
              with requirements and includes production ML systems,
              research, and scalable deployments.
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Strong strengths in {c.skills.slice(0, 3).join(", ")}.
              Minor gap in cloud stack diversity but overall highly
              recommended.
            </p>
          </div>

          {/* SCORE BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Technical Competency",
                score: 96,
                color: "#6366f1",
                findings: [
                  "Strong ML engineering background",
                  "Production system experience",
                  "Minor cloud gap",
                ],
              },
              {
                label: "Experience Alignment",
                score: 92,
                color: "#10b981",
                findings: [
                  "Strong industry experience",
                  "LLM training exposure",
                  "Research publications",
                ],
              },
            ].map(({ label, score, color, findings }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-foreground">
                    {label}
                  </div>
                  <span
                    className="text-lg font-mono font-bold"
                    style={{ color }}
                  >
                    {score}
                  </span>
                </div>

                <div className="bg-white/5 rounded-full h-1.5 overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${score}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {findings.map((text) => (
                    <div
                      key={text}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle
                        size={12}
                        className="text-emerald-400 mt-0.5"
                      />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RECOMMENDATION */}
          <div className="bg-card border border-emerald-500/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-emerald-400" />
              <div className="text-sm font-medium text-foreground">
                Recommendation
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={18}
                className="text-emerald-400 mt-1"
              />

              <div>
                <div className="text-sm font-semibold text-emerald-400 mb-1">
                  Strongly Recommend — Advance to Technical Interview
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Candidate shows strong ML engineering depth and
                  production readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div> 
  );
}