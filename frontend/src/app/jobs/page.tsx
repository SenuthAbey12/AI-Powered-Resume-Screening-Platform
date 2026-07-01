"use client";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Check,
} from "lucide-react";

import { Topbar, Badge } from "@/components/shared";
import { jobs } from "@/lib/mockData";

export default function JobsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        {/* TOP BAR */}
        <Topbar
          title="Job Management"
          subtitle="Create and manage job postings"
          actions={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <Plus size={12} /> Create Job
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* CREATE FORM */}
          {showForm && (
            <div className="bg-card border border-indigo-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold text-foreground">
                  New Job Posting
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Job Title", placeholder: "e.g. Senior ML Engineer" },
                  { label: "Department", placeholder: "e.g. AI Platform" },
                  {
                    label: "Location",
                    placeholder: "e.g. San Francisco, CA / Remote",
                  },
                  { label: "Employment Type", placeholder: "Full-time" },
                  {
                    label: "Min. Experience (years)",
                    placeholder: "5",
                  },
                  {
                    label: "Salary Range",
                    placeholder: "$160,000 — $220,000",
                  },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wide mb-1.5">
                      {label}
                    </label>

                    <input
                      placeholder={placeholder}
                      className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wide mb-1.5">
                    Job Description
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Describe the role, responsibilities, and ideal candidate..."
                    className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                {/* SKILLS */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wide mb-1.5">
                    Required Skills
                  </label>

                  <input
                    placeholder="PyTorch, Python, Kubernetes, MLOps, Docker"
                    className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                  <Check size={14} /> Publish Job
                </button>

                <button className="bg-secondary hover:bg-white/10 text-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors">
                  Save Draft
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="text-sm font-medium text-foreground">
                All Job Postings
              </div>

              <div className="flex items-center gap-2">
                {/* SEARCH */}
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    placeholder="Search jobs..."
                    className="bg-input-background border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-44"
                  />
                </div>

                {/* FILTER */}
                <button className="flex items-center gap-1.5 bg-secondary hover:bg-white/10 text-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
                  <Filter size={12} /> Filter
                </button>
              </div>
            </div>

            {/* TABLE BODY */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Job Title",
                    "Department",
                    "Applicants",
                    "Shortlisted",
                    "Stage",
                    "Deadline",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {jobs.map((j) => (
                  <tr
                    key={j.id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-foreground">
                        {j.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        Posted {j.posted}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {j.dept}
                    </td>

                    <td className="px-5 py-3 font-mono text-sm text-foreground">
                      {j.applicants}
                    </td>

                    <td className="px-5 py-3 font-mono text-sm text-emerald-400">
                      {j.shortlisted}
                    </td>

                    <td className="px-5 py-3">
                      <Badge
                        label={j.stage}
                        variant={j.stage === "Closed" ? "default" : "info"}
                      />
                    </td>

                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">
                      {j.deadline}
                    </td>

                    <td className="px-5 py-3">
                      <Badge
                        label={j.active ? "ACTIVE" : "CLOSED"}
                        variant={j.active ? "success" : "default"}
                      />
                    </td>

                    <td className="px-5 py-3">
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal size={15} />
                      </button>
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