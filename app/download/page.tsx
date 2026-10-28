"use client"

import Image from "next/image";
import google from "@/public/img/download/google.png";
import mediafire from "@/public/img/download/mediafire.png";
import mega from "@/public/img/download/mega.png";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { ExternalLink, ShieldCheck } from "lucide-react";

function sanitizeEnvLink(val?: string): string {
  if (!val) return "";
  const cleaned = val.trim().replace(/^["']+|["']+$/g, "").trim();
  return cleaned === ">" ? "" : cleaned;
}

export default function Download() {
  const { lang } = useLanguage();

  const [links, setLinks] = useState({
    discord: sanitizeEnvLink(process.env.NEXT_PUBLIC_DISCORD_LINK),
    gd: sanitizeEnvLink(process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK),
    mf: sanitizeEnvLink(
      process.env.NEXT_PUBLIC_MEDIAFIRE_LINK ||
        "https://www.mediafire.com/file/y0cu54tjwrp1ppl/EgisMu-S2-Client.rar/file"
    ),
    mega: sanitizeEnvLink(
      process.env.NEXT_PUBLIC_MEGA_LINK ||
        "https://mega.nz/file/zlBEhYLB#MgmpfUPV02ylIy_S_oIbMaXa77uwa6dwke4SFaQAB2Q"
    ),
  });

  const loadDownloads = () => {
    fetch("/api/downloads", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setLinks({
          discord: sanitizeEnvLink(data.NEXT_PUBLIC_DISCORD_LINK),
          gd: sanitizeEnvLink(data.NEXT_PUBLIC_GOODLE_DRIVE_LINK),
          mf: sanitizeEnvLink(data.NEXT_PUBLIC_MEDIAFIRE_LINK),
          mega: sanitizeEnvLink(data.NEXT_PUBLIC_MEGA_LINK),
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadDownloads();
    window.addEventListener("site-config-updated", loadDownloads);
    return () => window.removeEventListener("site-config-updated", loadDownloads);
  }, []);

  const gdLink = links.gd;
  const mfLink = links.mf;
  const megaLink = links.mega;
  const discordLink = links.discord;

  const hasCustomMirrors =
    gdLink !== "" || mfLink !== "" || megaLink !== "" || discordLink !== "";

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col gap-8 w-full">
      <div>
        <div className="border-b border-[#163152] pb-4 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
              {lang === "th" ? "ดาวน์โหลดตัวเกม Egis-MU S2 (Client 2.5Gb)" : "Egis-MU S2 Client Downloads"}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>{lang === "th" ? "ตัวเต็ม Season 2 · 2.5GB" : "Full S2 Client · 2.5GB"}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ดาวน์โหลดตัวเกม Egis-MU Season 2 ตัวเต็มฟรี เลือกช่องทางดาวน์โหลดที่สะดวกด้านล่าง ติดตั้งแล้วเข้าเล่นได้ทันที"
              : "Download the full Egis-MU Season 2 client for free. Choose your preferred mirror below."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hasCustomMirrors ? (
            <>
              {gdLink !== "" && (
                <a
                  href={gdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 bg-[#040914] hover:bg-[#09152b] border border-[#163152] hover:border-cyan-400/60 transition-all"
                >
                  <Image src={google} width={150} quality={100} alt="google_drive" />
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-cyan-300 group-hover:text-cyan-200 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน Google Drive" : "Download via Google Drive"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
              {mfLink !== "" && (
                <a
                  href={mfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 bg-[#040914] hover:bg-[#09152b] border border-[#163152] hover:border-cyan-400/60 transition-all"
                >
                  <Image src={mediafire} width={150} quality={100} alt="mediafire" />
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-cyan-300 group-hover:text-cyan-200 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน MediaFire" : "Download via MediaFire"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
              {megaLink !== "" && (
                <a
                  href={megaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 bg-[#040914] hover:bg-[#09152b] border border-[#163152] hover:border-cyan-400/60 transition-all"
                >
                  <Image src={mega} width={150} quality={100} alt="mega" />
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-cyan-300 group-hover:text-cyan-200 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน MEGA" : "Download via MEGA"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center p-5 bg-[#040914] border border-[#163152]">
                <Image src={google} width={140} quality={100} alt="google_drive" />
                <span className="mt-2 text-xs text-slate-400">
                  {lang === "th" ? "ลิงก์สำรอง Google Drive" : "Google Drive Mirror"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-[#040914] border border-[#163152]">
                <Image src={mediafire} width={140} quality={100} alt="mediafire" />
                <span className="mt-2 text-xs text-slate-400">
                  {lang === "th" ? "ลิงก์สำรอง MediaFire" : "MediaFire Mirror"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-[#040914] border border-[#163152]">
                <Image src={mega} width={140} quality={100} alt="mega" />
                <span className="mt-2 text-xs text-slate-400">
                  {lang === "th" ? "ลิงก์สำรอง MEGA" : "MEGA Mirror"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="border-b border-[#163152] pb-3 mb-4">
          <h2 className="font-display text-lg font-bold text-slate-100 tracking-wide">
            {lang === "th" ? "ความต้องการของระบบคอมพิวเตอร์" : "System Requirements"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#040914] border border-[#163152] flex flex-col gap-3">
            <h3 className="font-display text-sm font-bold text-cyan-300">
              {lang === "th" ? "สเปกขั้นต่ำ" : "Minimum Requirements"}
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex justify-between border-b border-[#11243e] pb-1.5">
                <span className="text-slate-400">{lang === "th" ? "หน่วยประมวลผล (CPU)" : "CPU"}</span>
                <span>Intel Dual Core / AMD Athlon</span>
              </li>
              <li className="flex justify-between border-b border-[#11243e] pb-1.5">
                <span className="text-slate-400">{lang === "th" ? "หน่วยความจำ (RAM)" : "RAM"}</span>
                <span>2 GB RAM</span>
              </li>
              <li className="flex justify-between border-b border-[#11243e] pb-1.5">
                <span className="text-slate-400">{lang === "th" ? "การ์ดจอ (GPU)" : "GPU"}</span>
                <span>256 MB VRAM / DirectX 9.0c</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">{lang === "th" ? "ระบบปฏิบัติการ (OS)" : "OS"}</span>
                <span>Windows 7 / 8 / 10 / 11</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-[#040914] border border-[#163152] flex flex-col gap-3">
            <h3 className="font-display text-sm font-bold text-emerald-400">
              {lang === "th" ? "สเปกที่แนะนำ" : "Recommended Requirements"}
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex justify-between border-b border-[#11243e] pb-1.5">
                <span className="text-slate-400">{lang === "th" ? "หน่วยประมวลผล (CPU)" : "CPU"}</span>
                <span>Intel Core i3 / AMD Ryzen 3+</span>
              </li>
              <li className="flex justify-between border-b border-[#11243e] pb-1.5">
                <span className="text-slate-400">{lang === "th" ? "หน่วยความจำ (RAM)" : "RAM"}</span>
                <span>{lang === "th" ? "4 GB RAM ขึ้นไป" : "4 GB RAM or more"}</span>
              </li>
              <li className="flex justify-between border-b border-[#11243e] pb-1.5">
                <span className="text-slate-400">{lang === "th" ? "การ์ดจอ (GPU)" : "GPU"}</span>
                <span>{lang === "th" ? "1 GB VRAM ขึ้นไป" : "1 GB VRAM or higher"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">{lang === "th" ? "ระบบปฏิบัติการ (OS)" : "OS"}</span>
                <span>Windows 10 / 11 (64 bit)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
