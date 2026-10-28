"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img from "@/public/img/img-util.jpg";
import { useLanguage } from "@/app/_context/LanguageContext";
import type { ServerSpecItem } from "@/lib/siteConfig";
import { Shield, Swords, Trophy } from "lucide-react";

const defaultSpecs: ServerSpecItem[] = [
  {
    id: "version",
    labelTh: "เวอร์ชันเซิร์ฟเวอร์",
    labelEn: "Server Version",
    valueTh: "Season 2 (Classic 1.02)",
    valueEn: "Season 2 (Classic 1.02)",
  },
  {
    id: "server_type",
    labelTh: "รูปแบบเซิร์ฟเวอร์",
    labelEn: "Server Type",
    valueTh: "No-Reset (เลเวลตัน 400 ไร้รีเซ็ต)",
    valueEn: "No-Reset (Max Level 400)",
  },
  {
    id: "exp",
    labelTh: "อัตราคูณค่าประสบการณ์ (EXP)",
    labelEn: "Experience Rate",
    valueTh: "x50 คงที่สมดุล",
    valueEn: "x50 Balanced Dynamic",
  },
  {
    id: "drop_exc",
    labelTh: "อัตราดรอปไอเทมยอดเยี่ยม (Excellent)",
    labelEn: "Drop Rate Excellent",
    valueTh: "35%",
    valueEn: "35%",
  },
  {
    id: "drop_zen",
    labelTh: "อัตราดรอปเงิน (Zen)",
    labelEn: "Drop Rate Zen",
    valueTh: "50%",
    valueEn: "50%",
  },
  {
    id: "party_exp",
    labelTh: "โบนัส EXP ปาร์ตี้",
    labelEn: "Party Bonus Exp",
    valueTh: "20% · 30% · 45%",
    valueEn: "20% · 30% · 45%",
  },
  {
    id: "elf_buff",
    labelTh: "บัฟทหารเอลฟ์ (Elf Soldier)",
    labelEn: "Elf Soldier Buff",
    valueTh: "ถึงเลเวล 220",
    valueEn: "Up to Level 220",
  },
  {
    id: "conn_limit",
    labelTh: "จำกัดการเชื่อมต่อ",
    labelEn: "Connection Limit",
    valueTh: "สูงสุด 3 จอ ต่อ IP/HWID",
    valueEn: "Max 3 Accounts per IP/HWID",
  },
  {
    id: "classes",
    labelTh: "สายอาชีพที่เปิดให้เล่น",
    labelEn: "Available Classes",
    valueTh: "DK · DW · ELF · MG · DL (5 คลาส)",
    valueEn: "DK · DW · ELF · MG · DL (5 Classes)",
  },
  {
    id: "events",
    labelTh: "กิจกรรมหลักภายในเกม",
    labelEn: "In-Game Events",
    valueTh: "Blood Castle · Devil Square · Chaos Castle · Castle Siege",
    valueEn: "Blood Castle · Devil Square · Chaos Castle · Castle Siege",
  },
];

export default function Info() {
  const { lang } = useLanguage();
  const [serverInfo, setServerInfo] = useState({
    serverName: "Egis-MU",
    specs: defaultSpecs,
    play2WinTitleTh: "แนวทางเซิร์ฟเวอร์ Egis-MU S2 ไร้ระบบรีเซ็ต (No-Reset)",
    play2WinTitleEn: "Egis-MU S2 No-Reset Philosophy",
    play2WinBodyTh:
      "เซิร์ฟเวอร์ Egis-MU Season 2 ยึดหลัก No-Reset คลาสสิกแท้ เลเวลตันที่ 400 ทุกสเตตัสและไอเทมมีคุณค่าสูงสุด ไม่มี Web-Shop ขายของเทพ ไม่มี Cash-Shop เอาเปรียบ ทุกชิ้นส่วนชุดเกราะและอาวุธหาได้จากการดรอป ตีบวก ล่าบอส และการค้าขายของผู้เล่นอย่างเท่าเทียม",
    play2WinBodyEn:
      "Egis-MU Season 2 is committed to authentic non-reset gameplay capped at level 400. No webshop, no pay-to-win items. Every weapon, wing, and armor piece is earned through gameplay, crafting, boss battles, and player-driven market trading.",
    introTitleTh: "ยินดีต้อนรับสู่ทวีป Egis-MU Season 2",
    introTitleEn: "Welcome to Egis-MU Season 2",
    introBodyTh:
      "Egis-MU S2 นำพาผู้เล่นย้อนสู่ยุคทองของ MU Online ในรูปแบบ Season 2 คลาสสิกแท้ สัมผัสความสนุกของการเก็บเลเวลแบบดั้งเดิม การรวมปาร์ตี้ลง Blood Castle, Devil Square และ Chaos Castle และสงครามชิงปราสาท Castle Siege ที่ทรงเกียรติที่สุดแห่ง Valley of Loren",
    introBodyEn:
      "Egis-MU S2 brings you back to the golden era of classic Season 2 MU Online. Experience the thrill of genuine progression, intense team events like Blood Castle, Devil Square, and the legendary Castle Siege war for control of Valley of Loren.",
  });

  const loadConfig = () => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.serverInfo) {
          setServerInfo((prev) => ({
            ...prev,
            ...data.serverInfo,
            specs: Array.isArray(data.serverInfo.specs)
              ? data.serverInfo.specs
              : prev.specs,
          }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    window.addEventListener("site-config-updated", loadConfig);
    return () => window.removeEventListener("site-config-updated", loadConfig);
  }, []);

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col gap-6 w-full">
      <div className="border-b border-[#163152] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
            {lang === "th"
              ? `ข้อมูลเซิร์ฟเวอร์ ${serverInfo.serverName}`
              : `${serverInfo.serverName} Server Information`}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 font-semibold text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-300" />
            <span>Season 2 · No-Reset</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "รายละเอียดอัตราคูณ ระบบการเล่น No-Reset เลเวลตัน 400 และการตั้งค่าภายในเซิร์ฟเวอร์ Egis-MU"
            : "Realm rates, No-Reset level 400 progression, and Egis-MU gameplay specifications"}
        </p>
      </div>

      <div className="overflow-hidden border border-cyan-400/40 bg-[#040914] relative">
        <Image className="w-full h-48 sm:h-60 object-cover" src={img} alt="egis_mu_s2" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-[#040914]/40 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
              {lang === "th" ? "คลาสสิกแท้ ยุคทองของ MU Online" : "Classic Golden Era"}
            </span>
            <h2 className="font-display text-2xl font-bold text-white mt-0.5">
              {serverInfo.serverName} Season 2
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#081529]/90 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-200">
              EXP x50
            </span>
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/50 text-xs font-mono font-bold text-amber-300">
              No-Reset · Max Lv 400
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {serverInfo.specs.map((spec) => (
          <div
            key={spec.id}
            className="flex items-center justify-between p-3.5 bg-[#040914] border border-[#142c4c] hover:border-cyan-400/50 transition-colors"
          >
            <span className="text-xs text-slate-300">
              {lang === "th" ? spec.labelTh : spec.labelEn}
            </span>
            <span className="font-mono tabular-nums text-xs font-bold text-cyan-300 text-right">
              {lang === "th" ? spec.valueTh : spec.valueEn}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-[#040914] border border-[#142c4c] flex flex-col gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display text-sm font-bold text-cyan-100">
            {lang === "th" ? "ไร้ระบบรีเซ็ต (No-Reset)" : "No-Reset Economy"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "th"
              ? "เลเวลตันที่ 400 ไม่มีการรีเซ็ตสเตตัสวนซ้ำ เพิ่มคุณค่าให้ทุกเลเวลและอุปกรณ์ในเกมอย่างแท้จริง"
              : "Level 400 cap without repetitive resets. Every attribute point and piece of gear retains true value."}
          </p>
        </div>

        <div className="p-4 bg-[#040914] border border-[#142c4c] flex flex-col gap-2">
          <Swords className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display text-sm font-bold text-cyan-100">
            {lang === "th" ? "ศึกชิงปราสาท Castle Siege" : "Castle Siege Warfare"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "th"
              ? "สงครามกิลด์สุดยิ่งใหญ่แห่ง Valley of Loren ทุกวันอาทิตย์ ชิงความเป็นหนึ่งและ Lord Mix"
              : "Epic guild siege war at Valley of Loren every Sunday for supreme realm dominance."}
          </p>
        </div>

        <div className="p-4 bg-[#040914] border border-[#142c4c] flex flex-col gap-2">
          <Trophy className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display text-sm font-bold text-cyan-100">
            {lang === "th" ? "Play-to-Win แท้ 100%" : "Pure Play-to-Win"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "th"
              ? "ไม่มีเว็บช็อปขายของเทพ ไม่มีไอเทมโกง ทุกสิ่งหาได้จากการลงดัน ล่าบอส และการค้าขาย"
              : "No overpower web shop. All wings, jewels, and exc weapons are earned through honest play."}
          </p>
        </div>
      </div>

      <div className="bg-[#040914] border border-[#142c4c] p-5 flex flex-col gap-2">
        <h2 className="font-display text-base font-bold text-cyan-300">
          {lang === "th" ? serverInfo.play2WinTitleTh : serverInfo.play2WinTitleEn}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {lang === "th" ? serverInfo.play2WinBodyTh : serverInfo.play2WinBodyEn}
        </p>
      </div>

      <div className="bg-[#040914] border border-[#142c4c] p-5 flex flex-col gap-2">
        <h2 className="font-display text-base font-bold text-slate-100">
          {lang === "th" ? serverInfo.introTitleTh : serverInfo.introTitleEn}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {lang === "th" ? serverInfo.introBodyTh : serverInfo.introBodyEn}
        </p>
      </div>
    </div>
  );
}
