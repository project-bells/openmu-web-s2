"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import ServerStatistics from "./ServerStatistics"
import { IcyPanelHeader } from "@/app/_components/EgisMuLogo"
import { useLanguage } from "@/app/_context/LanguageContext"
import { getImage, getClassName } from "@/app/_utils/characterAvatarReturn"
import { ChevronRight, Shield, Flame } from "lucide-react"

interface KillerRow {
  Id?: string;
  Name: string;
  CharacterClassId: string;
  PlayerKillCount: number;
}

const DEFAULT_KILLERS: KillerRow[] = [
  {
    Name: "Aetherius",
    CharacterClassId: "00000040-0007-0000-0000-000000000000",
    PlayerKillCount: 88,
  },
  {
    Name: "Sovereign",
    CharacterClassId: "00000040-0011-0000-0000-000000000000",
    PlayerKillCount: 64,
  },
  {
    Name: "ArcaneSM",
    CharacterClassId: "00000040-0003-0000-0000-000000000000",
    PlayerKillCount: 52,
  },
  {
    Name: "Sylvanas",
    CharacterClassId: "00000040-000b-0000-0000-000000000000",
    PlayerKillCount: 38,
  },
  {
    Name: "Valerius",
    CharacterClassId: "00000040-000d-0000-0000-000000000000",
    PlayerKillCount: 29,
  },
];

const FAST_LINKS = [
  { labelEn: "Item Shop & Donate", labelTh: "ไอเทมช็อป & สนับสนุนเซิร์ฟ", href: "/play-online" },
  { labelEn: "Media Wallpapers", labelTh: "ภาพบรรยากาศและมีเดีย", href: "/info" },
  { labelEn: "Download Client", labelTh: "ดาวน์โหลดไฟล์เกม (Client)", href: "/download" },
  { labelEn: "PK Killers Ranking", labelTh: "ทำเนียบอันดับฆาตกร (PK)", href: "/ranking?tab=topKillers" },
  { labelEn: "News and Events", labelTh: "ข่าวสารและกิจกรรมประจำสัปดาห์", href: "/" },
  { labelEn: "Guides and Info", labelTh: "คู่มือการเล่น Season 2 (No-Reset)", href: "/info" },
];

export default function RightSidebar() {
  const { lang } = useLanguage();
  const [killers, setKillers] = useState<KillerRow[]>(DEFAULT_KILLERS);

  useEffect(() => {
    fetch("/api/characters/ranking/killers", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setKillers(data.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="flex flex-col gap-5 w-full">
      {/* CTA Buttons: DOWNLOAD (Green) & REGISTRATION (Red) */}
      <div className="flex flex-col gap-2.5">
        <Link
          href="/download"
          className="group relative w-full overflow-hidden border border-lime-300/70 bg-gradient-to-r from-[#2e6f14] via-[#4ea31d] to-[#68bd28] hover:from-[#398519] hover:to-[#7ad633] shadow-[0_0_20px_rgba(104,189,40,0.35)] p-3.5 flex items-center gap-3.5 transition-all"
        >
          <div className="w-11 h-11 rounded-lg bg-black/25 border border-lime-200/50 flex items-center justify-center shrink-0 shadow-inner">
            <Shield className="w-6 h-6 text-lime-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)] leading-none">
              {lang === "th" ? "ดาวน์โหลดเกม" : "DOWNLOAD"}
            </span>
            <span className="text-[11px] font-semibold text-lime-100/90 mt-1">
              {lang === "th" ? "ตัวเกมเต็ม Client 2.5Gb" : "Client 2.5Gb"}
            </span>
          </div>
        </Link>

        <Link
          href="/register"
          className="group relative w-full overflow-hidden border border-amber-400/70 bg-gradient-to-r from-[#7c1914] via-[#b3261e] to-[#d93829] hover:from-[#961f19] hover:to-[#ea4636] shadow-[0_0_20px_rgba(217,56,41,0.35)] p-3.5 flex items-center gap-3.5 transition-all"
        >
          <div className="w-11 h-11 rounded-lg bg-black/25 border border-amber-300/50 flex items-center justify-center shrink-0 shadow-inner">
            <Flame className="w-6 h-6 text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-black uppercase tracking-wider text-amber-100 drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)] leading-none">
              {lang === "th" ? "สมัครสมาชิก" : "REGISTRATION"}
            </span>
            <span className="text-[11px] font-semibold text-amber-100/90 mt-1">
              {lang === "th" ? "สมัครไอดีฟรีพร้อมเล่นทันที" : "Free sign in"}
            </span>
          </div>
        </Link>
      </div>

      {/* SERVER STATUS */}
      <ServerStatistics />

      {/* FAST LINK */}
      <div className="w-full bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_25px_rgba(0,180,255,0.08)] overflow-hidden">
        <IcyPanelHeader title={lang === "th" ? "ลิงก์ด่วน" : "FAST LINK"} />
        <div className="p-3 bg-gradient-to-b from-[#071122] to-[#040914] divide-y divide-[#11243e]">
          {FAST_LINKS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex items-center gap-2 py-2.5 px-2 text-xs text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              <span className="font-medium tracking-wide">
                {lang === "th" ? item.labelTh : item.labelEn}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* PK (อันดับฆาตกร) / TOP KILLERS (PK) */}
      <div className="w-full bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_25px_rgba(0,180,255,0.08)] overflow-hidden">
        <IcyPanelHeader title={lang === "th" ? "PK (อันดับฆาตกร)" : "TOP KILLERS (PK)"} />
        <div className="p-3.5 bg-gradient-to-b from-[#071122] to-[#040914]">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[11px] text-slate-400 border-b border-[#132946]">
                <th className="text-left font-semibold pb-2 w-6">#</th>
                <th className="text-left font-semibold pb-2 uppercase tracking-wider">
                  {lang === "th" ? "ชื่อตัวละคร" : "NAME"}
                </th>
                <th className="text-center font-semibold pb-2 w-12">
                  {lang === "th" ? "อาชีพ" : "Class"}
                </th>
                <th className="text-right font-semibold pb-2 w-12">
                  {lang === "th" ? "สังหาร" : "Kills"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10233d]/70">
              {killers.map((k, i) => (
                <tr key={k.Name + i} className="hover:bg-rose-500/5 transition-colors">
                  <td className="py-2 font-mono tabular-nums text-[11px] text-slate-400">{i + 1}.</td>
                  <td className="py-2 font-medium text-slate-200 flex items-center gap-1.5">
                    <Image
                      className="rounded-sm border border-rose-500/40"
                      src={getImage(k.CharacterClassId) as StaticImport}
                      width={18}
                      height={18}
                      alt="character_avatar"
                    />
                    <span className="truncate max-w-[92px] text-[11px] text-cyan-50 font-medium">
                      {k.Name}
                    </span>
                  </td>
                  <td className="py-2 font-mono text-center text-[11px] text-slate-300">
                    {getClassName(k.CharacterClassId)}
                  </td>
                  <td className="py-2 font-mono tabular-nums text-right text-[11px] font-bold text-rose-400">
                    {k.PlayerKillCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 pt-2.5 border-t border-[#132946] flex items-center justify-between text-[11px]">
            <Link
              href="/ranking?tab=topKillers"
              className="text-slate-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
            >
              {lang === "th" ? "อันดับฆาตกรทั้งหมด" : "All killers"}
            </Link>
            <Link
              href="/ranking?tab=topKillers"
              className="px-2.5 py-1 bg-[#0b1c36] hover:bg-[#122b52] border border-cyan-400/40 text-cyan-200 text-[10px] font-semibold tracking-wider transition-all"
            >
              {lang === "th" ? "+ ดูเพิ่ม" : "+ more"}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
