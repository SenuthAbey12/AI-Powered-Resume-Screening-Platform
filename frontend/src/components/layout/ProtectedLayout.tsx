import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!auth.isAuthenticated()) {
    redirect("/login");
  }

  return <>{children}</>;
}