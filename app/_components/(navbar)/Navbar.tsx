"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useLanguage } from "@/app/_context/LanguageContext"
import type { MenuItemConfig } from "@/lib/siteConfig"
import EgisMuLogo from "@/app/_components/EgisMuLogo"
import { Shield, Send, Globe } from "lucide-react"

const defaultMenus: MenuItemConfig[] = [
  { id: "home", labelTh: "หน้าแรก", labelEn: "HOME", href: "/", enabled: true },
  { id: "download", labelTh: "ดาวน์โหลด", labelEn: "DOWNLOAD", href: "/download", enabled: true },
  { id: "ranking", labelTh: "จัดอันดับ", labelEn: "RANKINGS", href: "/ranking", enabled: true },
  { id: "register", labelTh: "สมัครสมาชิก", labelEn: "REGISTRATION", href: "/register", enabled: true },
  { id: "statistic", labelTh: "สถิติเซิร์ฟ", labelEn: "STATISTIC", href: "/#statistic", enabled: true },
  { id: "donate", labelTh: "สนับสนุน", labelEn: "DONATE", href: "/play-online", enabled: true },
  { id: "info", labelTh: "ข้อมูลเซิร์ฟ", labelEn: "ABOUT", href: "/info", enabled: true },
];

const THAI_MENU_FALLBACK: Record<string, string> = {
  home: "หน้าแรก",
  download: "ดาวน์โหลด",
  files: "ดาวน์โหลด",
  ranking: "จัดอันดับ",
  rankings: "จัดอันดับ",
  register: "สมัครสมาชิก",
  registration: "สมัครสมาชิก",
  statistic: "สถิติเซิร์ฟ",
  donate: "สนับสนุน",
  info: "ข้อมูลเซิร์ฟ",
  about: "ข้อมูลเซิร์ฟ",
};

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [menus, setMenus] = useState<MenuItemConfig[]>(defaultMenus);

  const loadConfig = () => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.menus) && data.menus.length > 0) {
          const cleaned = data.menus
            .filter((m: MenuItemConfig) => m.id !== "forum" && m.labelEn?.toUpperCase() !== "FORUM")
            .map((m: MenuItemConfig) =>
              m.id === "download" || m.labelEn?.toUpperCase() === "FILES"
                ? { ...m, labelEn: "DOWNLOAD" }
                : m
            );
          setMenus(cleaned);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    const handleUpdate = () => {
      loadConfig();
    };
    window.addEventListener("site-config-updated", handleUpdate);
    return () => window.removeEventListener("site-config-updated", handleUpdate);
  }, []);

  const visibleMenus = menus.filter((m) => m.enabled);

  const getMenuLabel = (item: MenuItemConfig) => {
    if (lang === "en") {
      return item.labelEn?.toUpperCase() === "FILES" ? "DOWNLOAD" : item.labelEn;
    }
    if (item.labelTh && item.labelTh.toUpperCase() !== item.labelEn.toUpperCase()) {
      return item.labelTh;
    }
    return THAI_MENU_FALLBACK[item.id.toLowerCase()] || item.labelTh;
  };

  return (
    <header className="relative z-20 w-full flex flex-col items-center select-none">
      {/* GRAND HERO BANNER WITH FANTASY CHARACTER ARTWORK & CENTRAL EGIS-MU CREST */}
      <div className="relative w-full max-w-[1240px] h-[240px] sm:h-[310px] lg:h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/img/bg-header.jpg"
            alt="Egis-MU Fantasy Header"
            fill
            priority
            sizes="1240px"
            className="object-cover object-top opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="hidden md:block absolute left-0 bottom-0 w-[360px] h-[320px] opacity-65 mix-blend-lighten pointer-events-none">
            <Image
              src="/img/slider-img-2.jpg"
              alt="Angel Fantasy Art"
              fill
              sizes="360px"
              className="object-cover object-left"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:block absolute right-0 bottom-0 w-[360px] h-[320px] opacity-65 mix-blend-lighten pointer-events-none">
            <Image
              src="/img/slider-img-1.jpg"
              alt="Warrior Fantasy Art"
              fill
              sizes="360px"
              className="object-cover object-right"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,210,255,0.22),transparent_60%)]" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#03060c] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#03060c] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#03060c]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#03060c] via-[#03060c]/60 to-transparent" />
        </div>

        {/* Center Egis-MU Emblem Logo */}
        <Link
          href="/"
          className="relative z-10 mt-6 sm:mt-8 transition-transform duration-300 hover:scale-[1.02]"
        >
          <EgisMuLogo size="lg" />
        </Link>
      </div>

      {/* HORIZONTAL ICY DARK-FANTASY NAVIGATION BAR */}
      <div className="relative z-20 w-full max-w-[1200px] px-3 sm:px-6 -mt-3">
        <div className="relative w-full bg-gradient-to-b from-[#0c1d36] via-[#071224] to-[#040a15] border-y-2 border-x border-[#1e436e] shadow-[0_6px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(0,210,255,0.18)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
          <div className="absolute inset-x-16 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* Main Navigation Links (Managed dynamically from Admin) */}
          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 lg:gap-4">
            {visibleMenus.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.replace("/#", "/"));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group relative px-2.5 py-2 font-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                    isActive
                      ? "text-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                      : "text-slate-300 hover:text-cyan-300"
                  }`}
                >
                  <span>{getMenuLabel(item)}</span>
                  <span
                    className={`absolute inset-x-2 -bottom-2.5 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-opacity ${
                      isActive ? "opacity-100 shadow-[0_0_8px_#00e5ff]" : "opacity-0 group-hover:opacity-70"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Toggle, Admin Button & Social Icons */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center bg-[#030812] border border-[#1a3961] p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLang("th")}
                title="ภาษาไทย"
                className={`px-2 py-1 transition-all ${
                  lang === "th"
                    ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                TH
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                title="English"
                className={`px-2 py-1 transition-all ${
                  lang === "en"
                    ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-bold text-[10px] uppercase tracking-wider transition-all"
              title={lang === "th" ? "จัดการระบบแอดมิน (ซ่อน/แสดงเมนู & ข่าวสาร)" : "Admin Control Panel"}
            >
              <Shield className="w-3 h-3 text-cyan-300" />
              <span>{lang === "th" ? "แอดมิน" : "ADMIN"}</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href="https://t.me/muorigins6e3"
                target="_blank"
                rel="noopener noreferrer"
                title={lang === "th" ? "กลุ่ม Telegram" : "Telegram Community"}
                className="w-6 h-6 bg-[#179cde] hover:bg-[#22b0f5] text-white flex items-center justify-center rounded-sm shadow transition-transform hover:scale-105"
              >
                <Send className="w-3 h-3" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61595685382415"
                target="_blank"
                rel="noopener noreferrer"
                title={lang === "th" ? "แฟนเพจ Facebook" : "Facebook Page"}
                className="w-6 h-6 bg-[#1877F2] hover:bg-[#2d88ff] text-white font-bold text-xs flex items-center justify-center rounded-sm shadow transition-transform hover:scale-105"
              >
                f
              </a>
              <Link
                href="/info"
                title={lang === "th" ? "ข้อมูลเซิร์ฟเวอร์" : "Server Information"}
                className="w-6 h-6 bg-[#d32f2f] hover:bg-[#e53935] text-white flex items-center justify-center rounded-sm shadow transition-transform hover:scale-105"
              >
                <Globe className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
