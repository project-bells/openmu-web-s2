"use client"

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopPlayers from "./(tables)/TopPlayers";
import TopGuilds from "./(tables)/TopGuilds";
import TopKillers from "./(tables)/TopKillers";
import OnlinePlayers from "./(tables)/OnlinePlayers";
import { useLanguage } from "@/app/_context/LanguageContext";

function RankingContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") || "topLevel";
  const [selectedRanking, setSelectedRanking] = useState<string>(initialTab);
  const { lang } = useLanguage();

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab && ["topLevel", "topKillers", "topGuilds", "online"].includes(tab)) {
      setSelectedRanking(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: "topLevel", label: lang === "th" ? "อันดับเลเวลตัวละคร" : "Top Characters" },
    { id: "topKillers", label: lang === "th" ? "PK (อันดับฆาตกร)" : "Top Killers (PK)" },
    { id: "topGuilds", label: lang === "th" ? "อันดับกิลด์" : "Top Guilds" },
    { id: "online", label: lang === "th" ? "ผู้เล่นออนไลน์" : "Online Players" },
  ];

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#163152] pb-4 mb-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
            {lang === "th" ? "ทำเนียบจัดอันดับผู้เล่น Egis-MU" : "Egis-MU Hall of Fame Rankings"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ตารางอันดับตัวละคร กิลด์ และอันดับฆาตกร (PK) แบบเรียลไทม์ของเซิร์ฟเวอร์ Egis-MU S2"
              : "Real-time character, guild, and PK leaderboards for Egis-MU S2 No-Reset realm"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#030710] border border-[#173357]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={tab.id}
              type="button"
              onClick={() => setSelectedRanking(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedRanking === tab.id
                  ? "bg-gradient-to-b from-[#133863] to-[#0a213d] border border-cyan-400/60 text-cyan-100 shadow-[0_0_10px_rgba(0,210,255,0.2)]"
                  : "text-slate-400 hover:text-cyan-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {selectedRanking === "topLevel" && <TopPlayers />}
      {selectedRanking === "topGuilds" && <TopGuilds />}
      {selectedRanking === "topKillers" && <TopKillers />}
      {selectedRanking === "online" && <OnlinePlayers />}
    </div>
  );
}

export default function Ranking() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-400 text-xs">กำลังโหลดข้อมูลจัดอันดับ...</div>}>
      <RankingContent />
    </Suspense>
  );
}
