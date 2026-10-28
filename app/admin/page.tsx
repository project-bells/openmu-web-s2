import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteConfig } from "@/lib/siteConfig";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAuthorizedServer = Boolean(
    session?.user &&
      (session.user.role === "GAME_MASTER" ||
        session.user.username?.toLowerCase() === "admin")
  );
  const config = getSiteConfig();

  return (
    <Suspense fallback={<div className="p-6 text-slate-400 text-sm">กำลังโหลดระบบจัดการแอดมิน...</div>}>
      <AdminDashboard
        initialConfig={config}
        isAuthorizedServer={isAuthorizedServer}
      />
    </Suspense>
  );
}
