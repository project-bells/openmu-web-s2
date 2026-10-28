import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";
import { IcyPanelHeader } from "@/app/_components/EgisMuLogo";
import { TranslatedText } from "@/app/_context/LanguageContext";

export default async function AccountPanel() {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_25px_rgba(0,180,255,0.08)] overflow-hidden">
      <IcyPanelHeader title={<TranslatedText th="แผงควบคุมบัญชี" en="ACCOUNT PANEL" />} />
      <div className="p-4 bg-gradient-to-b from-[#071122] to-[#040914]">
        {session?.user ? (
          <UserPanel role={(session.user as { role?: string }).role || "USER"} />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
