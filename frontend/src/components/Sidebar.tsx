"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Upload,
  Brain,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  Cpu,
} from "lucide-react";

import { Avatar } from "./shared";
import { auth } from "../lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/resumes", label: "Resume Upload", icon: Upload },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/aianalysis", label: "AI Analysis", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-56 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <Cpu size={14} className="text-white" />
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">
              TalentAI
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              RECRUITER PLATFORM
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <div className="text-[10px] font-mono text-muted-foreground px-2 mb-2 tracking-widest uppercase">
          Main Menu
        </div>

        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-300 font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon size={15} className={isActive ? "text-indigo-400" : ""} />

              <span>{label}</span>

              {isActive && (
                <ChevronRight
                  size={12}
                  className="ml-auto text-indigo-400"
                />
              )}
            </Link>
          );
        })}

        {/* Account */}
        <div className="text-[10px] font-mono text-muted-foreground px-2 mb-2 mt-4 tracking-widest uppercase">
          Account
        </div>

        <button className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-all w-full text-left">
          <Settings size={15} />
          Settings
        </button>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-all w-full text-left"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials="RK" size="sm" />

          <div className="min-w-0">
            <div className="text-xs font-medium text-foreground truncate">
              Rachel Kim
            </div>
            <div className="text-[10px] text-muted-foreground font-mono truncate">
              Head of Talent
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}