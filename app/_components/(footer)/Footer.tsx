"use client"

import Link from "next/link"
import { useLanguage } from "@/app/_context/LanguageContext"
import EgisMuLogo from "@/app/_components/EgisMuLogo"

const FOOTER_LINKS = [
  { labelEn: "HOME", labelTh: "หน้าแรก", href: "/" },
  { labelEn: "DOWNLOAD", labelTh: "ดาวน์โหลด", href: "/download" },
  { labelEn: "RANKINGS", labelTh: "จัดอันดับ", href: "/ranking" },
  { labelEn: "REGISTRATION", labelTh: "สมัครสมาชิก", href: "/register" },
  { labelEn: "RULES", labelTh: "กฎกติกา", href: "/terms-and-conditions" },
  { labelEn: "ABOUT", labelTh: "ข้อมูลเซิร์ฟ", href: "/info" },
];

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="relative z-10 w-full mt-12 border-t border-[#183558] bg-[#03060c] overflow-hidden">
      <div className="absolute inset-0 bg-[url('~/public/img/bg-footer.jpg')] bg-bottom bg-cover bg-no-repeat opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="relative max-w-[1200px] mx-auto px-6 py-10 flex flex-col items-center text-center gap-5">
        {/* Footer Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[11px] font-display font-bold tracking-[0.18em] text-slate-300">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.labelEn}
              href={item.href}
              className="hover:text-cyan-300 transition-colors uppercase"
            >
              {lang === "th" ? item.labelTh : item.labelEn}
            </Link>
          ))}
        </nav>

        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#1e426e] to-transparent" />

        {/* Small Egis-MU Crest */}
        <EgisMuLogo size="sm" />

        <div className="flex flex-col items-center gap-1 text-[11px] tracking-widest text-slate-400 uppercase">
          <p className="font-semibold text-cyan-200/80">
            {lang === "th"
              ? "สงวนลิขสิทธิ์ 2026 © «EGIS-MU SEASON 2» · เซิร์ฟเวอร์คลาสสิกไร้ระบบรีเซ็ต"
              : "COPYRIGHT 2026 © «EGIS-MU SEASON 2» · NO-RESET SERVER"}
          </p>
          <p className="text-[10px] text-slate-500 normal-case tracking-normal max-w-xl">
            {lang === "th"
              ? "เซิร์ฟเวอร์คอมมูนิตี้ MU Online Season 2 Classic (No-Reset · เลเวลตัน 400) พัฒนาเพื่อความสมดุลในการทำสงครามกิลด์และปราสาท"
              : "All rights reserved. Community MU Online Season 2 Classic No-Reset Server (Max Level 400)."}
          </p>
        </div>
      </div>
    </footer>
  );
}
