"use client";

import axios from "axios";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { FileText, RefreshCw, Upload, X } from "lucide-react";

import { Sidebar } from "@/components/Sidebar";
import { Badge, ScorePill, Topbar } from "@/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/services/api";

type ApiJobStatus = "queued" | "processing" | "completed" | "failed";
type UploadStatus = "uploading" | "queued" | "processing" | "analyzed" | "failed";

type ResumeJob = {
  job_id: string;
  file_id: string;
  filename: string;
  original_filename: string;
  status: ApiJobStatus;
  error: string | null;
  raw_text: string | null;
  parsed_data: Record<string, unknown> | null;
};

type UploadResponse = {
  success: boolean;
  message: string;
  data: ResumeJob;
};

type UploadedResume = {
  clientId: string;
  jobId?: string;
  name: string;
  size: string;
  status: UploadStatus;
  score: number | null;
  error?: string;
  rawText?: string;
  parsedData?: Record<string, unknown>;
};

const POLL_INTERVAL_MS = 2_000;

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (!error.response) {
      return "Cannot connect to the backend";
    }
  }

  return "Resume processing failed";
}

function toUploadStatus(status: ApiJobStatus): UploadStatus {
  return status === "completed" ? "analyzed" : status;
}

export default function ResumeUploadPage() {
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<UploadedResume[]>([]);
  const [viewingResume, setViewingResume] = useState<UploadedResume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePollsRef = useRef(new Set<string>());
  const mountedRef = useRef(true);

  useEffect(() => {
    const activePolls = activePollsRef.current;
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      activePolls.clear();
    };
  }, []);

  const updateUploadedResume = (
    clientId: string,
    updates: Partial<UploadedResume>,
  ) => {
    if (!mountedRef.current) {
      return;
    }

    setUploaded((current) =>
      current.map((resume) =>
        resume.clientId === clientId
          ? { ...resume, ...updates }
          : resume,
      ),
    );
  };

  const pollResumeJob = async (clientId: string, jobId: string) => {
    activePollsRef.current.add(clientId);

    while (mountedRef.current && activePollsRef.current.has(clientId)) {
      try {
        const response = await api.get<ResumeJob>(
          `/resumes/${jobId}/status`,
        );
        const job = response.data;

        if (job.status === "completed") {
          updateUploadedResume(clientId, {
            status: "analyzed",
            rawText: job.raw_text ?? "",
            parsedData: job.parsed_data ?? {},
            error: undefined,
          });
          activePollsRef.current.delete(clientId);
          return;
        }

        if (job.status === "failed") {
          updateUploadedResume(clientId, {
            status: "failed",
            error: job.error ?? "Resume processing failed",
          });
          activePollsRef.current.delete(clientId);
          return;
        }

        updateUploadedResume(clientId, { status: job.status });
      } catch (error) {
        updateUploadedResume(clientId, {
          status: "failed",
          error: getErrorMessage(error),
        });
        activePollsRef.current.delete(clientId);
        return;
      }

      await wait(POLL_INTERVAL_MS);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const addSelectedFiles = (files: File[]) => {
    const supportedFiles = files.filter((file) =>
      [".pdf", ".docx"].some((extension) =>
        file.name.toLowerCase().endsWith(extension),
      ),
    );

    setSelectedFiles((current) => [...current, ...supportedFiles]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addSelectedFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleRemoveUploadedFile = (clientId: string) => {
    activePollsRef.current.delete(clientId);
    setUploaded((current) =>
      current.filter((resume) => resume.clientId !== clientId),
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    const uploadBatch = selectedFiles.map((file) => ({
      file,
      resume: {
        clientId: crypto.randomUUID(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        status: "uploading" as const,
        score: null,
      },
    }));

    // Move files into the uploaded table before any network request finishes.
    setUploaded((current) => [
      ...current,
      ...uploadBatch.map(({ resume }) => resume),
    ]);
    setSelectedFiles([]);

    await Promise.allSettled(
      uploadBatch.map(async ({ file, resume }) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await api.post<UploadResponse>(
            "/upload-resume",
            formData,
          );
          const job = response.data.data;

          updateUploadedResume(resume.clientId, {
            jobId: job.job_id,
            status: toUploadStatus(job.status),
          });
          void pollResumeJob(resume.clientId, job.job_id);
        } catch (error) {
          updateUploadedResume(resume.clientId, {
            status: "failed",
            error: getErrorMessage(error),
          });
        }
      }),
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col">
        <Topbar
          title="Resume Upload"
          subtitle="Batch upload and AI-screen resumes"
          actions={
            <select className="rounded-md border border-border bg-input-background px-3 py-1.5 text-xs text-foreground focus:outline-none">
              <option>Senior ML Engineer</option>
              <option>MLOps Engineer</option>
              <option>AI Research Scientist</option>
            </select>
          }
        />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addSelectedFiles(Array.from(event.dataTransfer.files));
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-all ${
              dragging
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-border hover:border-indigo-500/50 hover:bg-white/2"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
              <Upload size={22} className="text-indigo-400" />
            </div>

            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                Drop resumes here or click to upload
              </div>
              <div className="mt-1 text-xs font-mono text-muted-foreground">
                Supports PDF and DOCX · Max 10 MB per file
              </div>
            </div>

            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleBrowse}
              className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Browse Files
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">Selected Files</h2>
                <span className="text-xs text-muted-foreground">
                  {selectedFiles.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-indigo-400" />
                      <div>
                        <div className="text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(index)}
                      className="text-red-400 transition-colors hover:text-red-300"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm transition-colors hover:bg-indigo-500"
                >
                  Upload
                </button>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Screening Context
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Job Role", value: "Senior ML Engineer" },
                { label: "Required Skills", value: "PyTorch, Python, K8s" },
                { label: "Min. Experience", value: "5 years" },
                { label: "AI Model", value: "Qwen2.5 1.5B" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="mb-1 text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
                    {label}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="text-sm font-medium text-foreground">
                Uploaded Files
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-muted-foreground">
                  AI processing runs in the background
                </span>
                <Badge label={`${uploaded.length} FILES`} variant="info" />
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Filename", "Size", "Status", "AI Score", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {uploaded.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      Uploaded resumes will appear here immediately.
                    </td>
                  </tr>
                )}

                {[...uploaded]
                  .slice(-10)
                  .reverse()
                  .map((resume) => (
                    <tr
                      key={resume.clientId}
                      className="transition-colors hover:bg-white/2"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileText
                            size={14}
                            className="shrink-0 text-indigo-400"
                          />
                          <div>
                            <div className="text-sm font-mono text-foreground">
                              {resume.name}
                            </div>
                            {resume.error && (
                              <div
                                className="mt-1 max-w-xs truncate text-[11px] text-red-400"
                                title={resume.error}
                              >
                                {resume.error}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-xs font-mono text-muted-foreground">
                        {resume.size}
                      </td>

                      <td className="px-5 py-3">
                        {resume.status === "uploading" && (
                          <span className="flex items-center gap-1.5 text-xs font-mono text-indigo-400">
                            <RefreshCw size={11} className="animate-spin" />
                            Uploading
                          </span>
                        )}
                        {resume.status === "queued" && (
                          <Badge label="QUEUED" variant="default" />
                        )}
                        {resume.status === "processing" && (
                          <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                            <RefreshCw size={11} className="animate-spin" />
                            AI Processing
                          </span>
                        )}
                        {resume.status === "analyzed" && (
                          <Badge label="ANALYZED" variant="success" />
                        )}
                        {resume.status === "failed" && (
                          <Badge label="FAILED" variant="danger" />
                        )}
                      </td>

                      <td className="px-5 py-3">
                        {resume.score !== null ? (
                          <ScorePill score={resume.score} />
                        ) : (
                          <span className="text-xs font-mono text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingResume(resume)}
                            disabled={!resume.parsedData}
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveUploadedFile(resume.clientId)
                            }
                            className="text-xs font-mono text-muted-foreground hover:text-red-400"
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

      <Dialog
        open={viewingResume !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewingResume(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingResume?.name}</DialogTitle>
            <DialogDescription>
              Structured data returned by the resume parser.
            </DialogDescription>
          </DialogHeader>
          <pre className="overflow-auto rounded-md border border-border bg-background p-4 text-xs leading-relaxed text-foreground">
            {JSON.stringify(viewingResume?.parsedData ?? {}, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
