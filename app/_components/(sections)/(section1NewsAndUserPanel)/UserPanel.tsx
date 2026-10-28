"use client"

import React from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useLanguage } from "@/app/_context/LanguageContext"
import { Shield, KeyRound, LogOut, Swords, Settings } from "lucide-react"

export default function UserPanel({ role }: { role: string }) {
  const { data: session } = useSession();
  const { lang } = useLanguage();
  const isGM = role === "GAME_MASTER" || session?.user?.username?.toLowerCase() === "admin";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 pb-2.5 border-b border-[#152d4a]">
        <div className="w-9 h-9 bg-[#0a1c34] border border-cyan-400/50 shadow-[0_0_10px_rgba(0,210,255,0.2)] flex items-center justify-center text-cyan-300 font-bold text-sm">
          {session?.user?.username?.charAt(0).toUpperCase() || "E"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-cyan-50 truncate tracking-wide">
            {session?.user?.username || (lang === "th" ? "นักรบ Egis" : "Egis Warrior")}
          </h3>
          <span className="text-[10px] text-cyan-400/90 font-semibold uppercase tracking-wider flex items-center gap-1">
            {isGM ? (
              <>
                <Shield className="w-3 h-3 text-cyan-300" />
                <span>{lang === "th" ? "ผู้ดูแลระบบ (GM)" : "Game Master"}</span>
              </>
            ) : (
              <span>{lang === "th" ? "สมาชิก Egis-MU S2" : "Egis-MU S2 Member"}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Link
          href="/characters"
          className="flex items-center gap-2.5 p-2 bg-[#040914] hover:bg-[#0a192f] border border-[#152c4a] hover:border-cyan-400/60 text-slate-200 hover:text-cyan-200 transition-all text-xs font-semibold"
        >
          <Swords className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <span>{lang === "th" ? "จัดการตัวละคร" : "Manage Characters"}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {lang === "th" ? "อัปสเตตัส · ล้างหัวแดง · รีสเตตัส" : "Add Stats · PK Clear · Reset Stats"}
            </span>
          </div>
        </Link>

        <Link
          href="/account"
          className="flex items-center gap-2.5 p-2 bg-[#040914] hover:bg-[#0a192f] border border-[#152c4a] hover:border-cyan-400/60 text-slate-200 hover:text-cyan-200 transition-all text-xs font-semibold"
        >
          <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <span>{lang === "th" ? "เปลี่ยนรหัสผ่าน" : "Change Password"}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {lang === "th" ? "ตั้งค่าความปลอดภัยบัญชี" : "Account security settings"}
            </span>
          </div>
        </Link>

        {isGM && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 p-2 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-400/50 text-cyan-200 transition-all text-xs font-semibold"
          >
            <Settings className="w-4 h-4 text-cyan-300 shrink-0" />
            <div className="flex flex-col">
              <span>{lang === "th" ? "จัดการระบบแอดมิน" : "Admin Control Panel"}</span>
              <span className="text-[10px] text-cyan-300/70 font-normal">
                {lang === "th" ? "แก้ไขข่าวสารและค่าเซิร์ฟเวอร์" : "Manage news & server settings"}
              </span>
            </div>
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={() => signOut()}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#091324] hover:bg-rose-950/60 border border-[#1a3658] hover:border-rose-500/60 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-rose-200 transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{lang === "th" ? "ออกจากระบบ" : "SIGN OUT"}</span>
      </button>
    </div>
  )
}
