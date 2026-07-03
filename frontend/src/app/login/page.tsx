"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cpu, RefreshCw } from "lucide-react";
import { api } from "@/services/api";

type TabType = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("login");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const handle = async () => {
    setLoading(true);

    try {
      if (tab === "login") {
        const res = await api.post("/auth/login", {
          email,
          password,
        });

        console.log(res.data);

        localStorage.setItem(
          "token",
          res.data.access_token
        );

        router.push("/dashboard");
      } else {
        await api.post("/auth/register", {
          name,
          email,
          password,
          company_name: company,
        });

        alert("Registration Successful!");

        setTab("login");

        setName("");
        setEmail("");
        setPassword("");
        setCompany("");
      }
    } catch (err: any) {
      console.log(err);

      alert(
        typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : "Something went wrong"
      );
    }

    setLoading(false);
  };
  
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-background border-r border-border flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <span className="font-semibold text-foreground">TalentAI</span>
        </div>

        <div>
          <div className="text-3xl font-semibold text-foreground leading-snug mb-4">
            Hire smarter with <br />
            <span className="text-indigo-400">AI-powered</span> screening.
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Rank candidates instantly, surface hidden talent, and reduce time-to-hire
            by 60% — all backed by explainable AI.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avg. time saved", value: "18 hrs/wk" },
              { label: "Screening accuracy", value: "94.2%" },
              { label: "Candidate NPS", value: "+72" },
              { label: "Active companies", value: "1,240+" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="text-xl font-mono font-semibold text-indigo-300">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          © 2025 TalentAI, Inc. All rights reserved.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
              <Cpu size={13} className="text-white" />
            </div>
            <span className="font-semibold text-foreground">TalentAI</span>
          </div>

          {/* tabs */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize
                  ${
                    tab === t
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* heading */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>

            <p className="text-sm text-muted-foreground mt-0.5">
              {tab === "login"
                ? "Sign in to your recruiter workspace"
                : "Start hiring smarter today"}
            </p>
          </div>

          {/* form */}
          <div className="flex flex-col gap-3">
            {tab === "register" && (
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rachel Kim"
                  className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wide">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rachel@acme.com"
                className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {tab === "register" && (
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {tab === "login" && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              onClick={handle}
              disabled={loading}
              className="mt-1 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && (
                <RefreshCw size={14} className="animate-spin" />
              )}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}