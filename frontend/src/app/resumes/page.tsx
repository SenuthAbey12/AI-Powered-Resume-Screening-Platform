"use client";

import { useState } from "react";
import { Upload, FileText, RefreshCw } from "lucide-react";
import { Topbar, Badge, ScorePill } from "@/components/shared";
import { Sidebar } from "@/components/Sidebar";

export default function ResumeUploadPage() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState([
    { name: "sarah_chen_resume.pdf", size: "312 KB", status: "analyzed", score: 94 },
    { name: "marcus_okafor_cv.pdf", size: "256 KB", status: "analyzed", score: 89 },
    { name: "priya_nair_resume.pdf", size: "198 KB", status: "processing", score: null },
  ]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Topbar
          title="Resume Upload"
          subtitle="Batch upload and AI-screen resumes"
          actions={
            <select className="bg-input-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none">
              <option>Senior ML Engineer</option>
              <option>MLOps Engineer</option>
              <option>AI Research Scientist</option>
            </select>
          }
        />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* DROPZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);

              const names = Array.from(e.dataTransfer.files).map((f) => f.name);

              setUploaded((prev) => [
                ...prev,
                ...names.map((n) => ({
                  name: n,
                  size: "—",
                  status: "queued",
                  score: null,
                })),
              ]);
            }}
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer
              ${
                dragging
                  ? "border-indigo-500 bg-indigo-500/5"
                  : "border-border hover:border-indigo-500/50 hover:bg-white/2"
              }`}
          >
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Upload size={22} className="text-indigo-400" />
            </div>

            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                Drop resumes here or click to upload
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                Supports PDF, DOCX, TXT · Max 10 MB per file · Batch up to 50 files
              </div>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors">
              Browse Files
            </button>
          </div>

          {/* SCREENING CONTEXT */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
              Screening Context
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Job Role", value: "Senior ML Engineer" },
                { label: "Required Skills", value: "PyTorch, Python, K8s" },
                { label: "Min. Experience", value: "5 years" },
                { label: "AI Model", value: "TalentScore v3.1" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide mb-1">
                    {label}
                  </div>
                  <div className="text-sm text-foreground font-medium">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="text-sm font-medium text-foreground">
                Upload Queue
              </div>

              <div className="flex items-center gap-2">
                <Badge label={`${uploaded.length} FILES`} variant="info" />
                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-mono">
                  Process All
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Filename", "Size", "Status", "AI Score", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-5 py-3"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {uploaded.map((f, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileText
                          size={14}
                          className="text-indigo-400 shrink-0"
                        />
                        <span className="text-sm text-foreground font-mono">
                          {f.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-xs text-muted-foreground font-mono">
                      {f.size}
                    </td>

                    <td className="px-5 py-3">
                      {f.status === "analyzed" && (
                        <Badge label="ANALYZED" variant="success" />
                      )}

                      {f.status === "processing" && (
                        <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                          <RefreshCw size={11} className="animate-spin" />
                          Processing
                        </span>
                      )}

                      {f.status === "queued" && (
                        <Badge label="QUEUED" variant="default" />
                      )}
                    </td>

                    <td className="px-5 py-3">
                      {f.score ? (
                        <ScorePill score={f.score} />
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-mono">
                          View
                        </button>

                        <button
                          onClick={() =>
                            setUploaded((prev) =>
                              prev.filter((_, j) => j !== i)
                            )
                          }
                          className="text-xs text-muted-foreground hover:text-red-400 font-mono"
                        >
                          Remove
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