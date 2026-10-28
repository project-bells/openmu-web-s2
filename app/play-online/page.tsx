"use client"

import React from "react"
import ReturnToHomeButton from "../_components/(sections)/(Section2MainAndRankings)/(components)/ReturnToHomeButton"
import { useLanguage } from "../_context/LanguageContext"
import EgisMuLogo from "../_components/EgisMuLogo"

export default function PlayOnlinePage() {
  const { lang } = useLanguage();

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between border-b border-[#163152] pb-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
            {lang === "th" ? "สนับสนุนเซิร์ฟเวอร์ & บริการเสริม" : "Egis-MU Donate & Services"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ระบบสนับสนุนเซิร์ฟเวอร์ Egis-MU S2 (Play-to-Win 100% ไม่มีไอเทมโกงสเตตัส)"
              : "Egis-MU S2 Supporter Center & Browser Launcher"}
          </p>
        </div>
        <ReturnToHomeButton />
      </div>

      <div className="bg-[#040914] border border-cyan-400/30 p-10 sm:p-14 flex flex-col items-center justify-center text-center gap-4">
        <EgisMuLogo size="sm" />
        <span className="text-xs font-bold tracking-widest uppercase text-cyan-300 mt-2">
          Egis-MU Season 2 Classic · No-Reset
        </span>
        <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "เปิดระบบเร็วๆ นี้ (Coming Soon)" : "Coming Soon.."}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 leading-relaxed">
          {lang === "th"
            ? "เซิร์ฟเวอร์ Egis-MU S2 เน้นความสมดุล Play-to-Win แท้ ท่านสามารถดาวน์โหลดตัวเกมเต็ม Client 2.5Gb เพื่อเข้าเล่นได้ฟรีทันที"
            : "Egis-MU S2 is a pure Play-to-Win realm. Download the full 2.5GB client to jump into the continent of MU right away."}
        </p>
      </div>
    </div>
  )
}
