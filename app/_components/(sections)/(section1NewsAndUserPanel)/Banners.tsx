"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import slider1 from "@/public/img/slider-img-1.jpg"
import slider2 from "@/public/img/slider-img-2.jpg"
import slider3 from "@/public/img/slider-img-3.jpg"
import { useLanguage } from "@/app/_context/LanguageContext"
import { Shield, Swords, Sparkles, ChevronRight, ChevronLeft } from "lucide-react"

export default function Banners() {
  const [current, setCurrent] = useState(0);
  const { lang } = useLanguage();

  const slides = [
    {
      image: slider1,
      badgeTh: "เซิร์ฟเวอร์ Season 2 คลาสสิก",
      badgeEn: "Season 2 Classic Realm",
      titleTh: "Aegis-Mu S2 · ไร้ระบบรีเซ็ต (No-Reset)",
      titleEn: "Aegis-Mu S2 · Authentic No-Reset",
      descTh: "เลเวลตันที่ 400 อัตราคูณ EXP x50 สมดุล 5 อาชีพคลาสสิก DK, DW, ELF, MG, DL คุณค่าไอเทมและสเตตัสแท้จริง",
      descEn: "Level 400 cap, dynamic EXP x50 rate, balanced 5 classic classes DK, DW, ELF, MG, DL. Pure MMORPG progression.",
      ctaTh: "ข้อมูลเซิร์ฟเวอร์",
      ctaEn: "Server Details",
      href: "/info",
    },
    {
      image: slider2,
      badgeTh: "ศึกชิงปราสาทแห่งเกียรติยศ",
      badgeEn: "Epic Castle Siege",
      titleTh: "สงครามกิลด์ Valley of Loren",
      titleEn: "Valley of Loren Siege War",
      descTh: "เปิดศึกชิงบัลลังก์เจ้าแห่งปราสาททุกสัปดาห์ รวบรวมพันธมิตร บุกห้องบัลลังก์ ชิงสิทธิ์ใช้งาน Lord Mix",
      descEn: "Battle for realm supremacy every week. Lead your alliance to conquer the throne room and claim the Lord Mix.",
      ctaTh: "ทำเนียบจัดอันดับ",
      ctaEn: "Guild Rankings",
      href: "/ranking",
    },
    {
      image: slider3,
      badgeTh: "กิจกรรมเดือดตลอดวัน",
      badgeEn: "Daily In-Game Events",
      titleTh: "Blood Castle & Chaos Castle",
      titleEn: "Blood Castle & Chaos Castle",
      descTh: "กิจกรรมลงดันเจี้ยนเปิดทุกๆ 2 ชั่วโมง โบนัส EXP ปาร์ตี้สูงสุด 45% ล่าเพชร Jewel of Bless และไอเทมยอดเยี่ยม",
      descEn: "Dungeon events every 2 hours with up to 45% party EXP bonus. Farm Jewels and excellent gear with your guild.",
      ctaTh: "ดาวน์โหลดตัวเกม",
      ctaEn: "Download Client",
      href: "/download",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 group">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
          }`}
        >
          <Image
            src={s.image}
            alt="slide_banner"
            fill
            className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
            priority={idx === 0}
          />
          {/* Measured Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Slide Content */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === "th" ? s.badgeTh : s.badgeEn}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">
              {lang === "th" ? s.titleTh : s.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {lang === "th" ? s.descTh : s.descEn}
            </p>
            <div className="mt-4">
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
              >
                <span>{lang === "th" ? s.ctaTh : s.ctaEn}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next Controls */}
      <button
        type="button"
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/70 border border-slate-700/80 text-slate-200 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/70 border border-slate-700/80 text-slate-200 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-amber-400" : "w-2 bg-slate-600 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
