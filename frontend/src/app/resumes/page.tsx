"use client";
import type { ChangeEvent } from "react";
import { useState, useRef } from "react";
import { Upload, FileText, RefreshCw, X } from "lucide-react";
import { Topbar, Badge, ScorePill } from "@/components/shared";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";

export default function ResumeUploadPage() {
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState([
    { name: "sarah_chen_resume.pdf", size: "312 KB", status: "analyzed", score: 94 },
    { name: "marcus_okafor_cv.pdf", size: "256 KB", status: "analyzed", score: 89 },
    { name: "priya_nair_resume.pdf", size: "198 KB", status: "processing", score: null },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(prev => [...prev, ...files]);
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const queue = selectedFiles.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      status: "processing",
      score: null,
    }));

    setUploaded(prev => [...prev, ...queue]);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
    }

    setSelectedFiles([]);
  };

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
              const files = Array.from(e.dataTransfer.files);
              setSelectedFiles(prev => [...prev, ...files]);
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

            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleBrowse}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
            >
              Browse Files
            </button>
          </div>

          {/* SELECTED FILES SECTION */}
          {selectedFiles.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium">
                  Selected Files
                </h2>
                <span className="text-xs text-muted-foreground">
                  {selectedFiles.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-border rounded-md px-3 py-2"
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
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleUpload}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          )}

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

          {/* UPLOADED FILES TABLE */}
          <div className="bg-card border border-border rounded-lg overflow-x-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="text-sm font-medium text-foreground">
                Uploaded Files
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
                {uploaded
                  .slice(-10)
                  .reverse()
                  .map((f, i) => {
                    console.log(i, f.name);

                    return (
                    
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
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}