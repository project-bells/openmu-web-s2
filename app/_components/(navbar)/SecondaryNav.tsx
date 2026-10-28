"use client"

import Image from "next/image"
import DownloadIcon from "../../../public/img/download.png"
import RegisterIcon from "../../../public/img/register.png"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "@/app/_context/LanguageContext"
import { Send, Play, Shield, Swords, Sparkles, Flame } from "lucide-react"

export default function SecondaryNav() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [serverInfo, setServerInfo] = useState({
    serverName: "Aegis-Mu S2",
    taglineTh: "Season 2 Classic · เลเวลตัน 400 ไร้ระบบรีเซ็ต (No-Reset) · Play-to-Win แท้",
    taglineEn: "Season 2 Classic · Max Level 400 No-Reset · Authentic Play-to-Win",
    heroDescriptionTh:
      "สัมผัสบรรยากาศมิวออนไลน์ Season 2 ฉบับคลาสสิกแท้ ไร้ระบบรีเซ็ต ฟาร์ม เลเวล ล่าบอส กิลด์วอร์ และศึกชิงปราสาท Valley of Loren สุดเข้มข้น ร่วมก้าวสู่ตำนานแห่ง Aegis-Mu",
    heroDescriptionEn:
      "Experience authentic classic Season 2 MU Online with no reset system. Grind, hunt bosses, forge alliances, and conquer Castle Siege in a balanced realm.",
    facebookUrl: "https://www.facebook.com/profile.php?id=61595685382415",
    telegramUrl: "https://t.me/muorigins6e3",
    playOnlineEnabled: true,
  });

  const loadConfig = () => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.serverInfo) {
          setServerInfo((prev) => ({ ...prev, ...data.serverInfo }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    window.addEventListener("site-config-updated", loadConfig);
    return () => window.removeEventListener("site-config-updated", loadConfig);
  }, []);

  const navigate = (location: string) => {
    router.push(location);
  }

  return (
    <section className="w-full py-4 sm:py-8 flex flex-col gap-6">
      {/* Top Banner Card with Dark Fantasy Backdrop */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-950 via-[#0e1424] to-slate-950 p-6 sm:p-10 shadow-2xl shadow-amber-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "เซิร์ฟเวอร์มิวออนไลน์ Season 2 คลาสสิก" : "Classic Season 2 MMORPG"}</span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-amber-200">{lang === "th" ? "ไร้ระบบรีเซ็ต (No-Reset)" : "No-Reset Realm"}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {serverInfo.serverName}
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium text-amber-300/90">
              {lang === "th" ? serverInfo.taglineTh : serverInfo.taglineEn}
            </p>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {lang === "th" ? serverInfo.heroDescriptionTh : serverInfo.heroDescriptionEn}
            </p>

            {/* Quick S2 Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
                EXP x50 Dynamic
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
                Drop 35%
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
                Max Lv 400
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
                Castle Siege
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
                5 Classic Classes
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              {serverInfo.playOnlineEnabled && (
                <button
                  type="button"
                  onClick={() => navigate("/play-online")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all whitespace-nowrap shrink-0 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Online</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate("/download")}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm transition-all whitespace-nowrap shrink-0 shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Image src={DownloadIcon} alt="download_icon" width={20} className="w-5 h-5 object-contain" />
                <span>{lang === "th" ? "ดาวน์โหลดเกม S2" : "Download Client"}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-bold text-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
              >
                <Image src={RegisterIcon} alt="register_icon" width={20} className="w-5 h-5 object-contain" />
                <span>{lang === "th" ? "สมัครสมาชิกใหม่" : "Register"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mt-1">
              {serverInfo.facebookUrl && (
                <Link
                  href={serverInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Page"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2]/50 hover:border-[#1877F2] text-slate-100 hover:text-white font-bold text-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="font-bold text-xs leading-none">f</span>
                  <span>Facebook Page</span>
                </Link>
              )}

              {serverInfo.telegramUrl && (
                <Link
                  href={serverInfo.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#229ED9]/20 hover:bg-[#229ED9] border border-[#229ED9]/50 hover:border-[#229ED9] text-slate-100 hover:text-white font-bold text-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Telegram</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
