"use client"

import GuildPopUp from "@/app/_components/(popUps)/GuildPopUp";
import { Guild } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function TopGuilds() {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [currentShowingGuild, setCurrentShowingGuild] = useState(-1);
  const [mousePosition, setMousePosition] = useState({x: 0, y:0});
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/guilds", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch");
        const res = await response.json();
        setGuilds(Array.isArray(res) ? res : []);
      } catch (e) {
        toast.error(lang === "th" ? "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง" : "There was a problem! Try again later");
      }
    }
    fetchData();
  }, [lang])    

  function handleMouseEnter(i: number, event: React.MouseEvent) {
    setCurrentShowingGuild(i);
    setMousePosition({x: event.clientX, y: event.clientY})
  }

  return (
    <div className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/90 text-xs text-slate-400 border-b border-slate-800">
          <tr>
            <th className="text-left font-medium py-3.5 pl-4 w-12">#</th>
            <th className="text-left font-medium py-3.5">
              {lang === "th" ? "ชื่อกิลด์" : "Guild Name"}
            </th>
            <th className="text-right font-medium py-3.5 pr-4">
              {lang === "th" ? "คะแนนกิลด์" : "Score"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {guilds.map((g, i) => (
            <tr
              key={g.Name}
              className="hover:bg-slate-900/40 transition-colors cursor-pointer"
              onMouseEnter={(event) => handleMouseEnter(i, event)}
              onMouseLeave={() => setCurrentShowingGuild(-1)}
            >
              <td className="py-3 pl-4 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
              <td className="py-3 font-medium text-slate-100">{g.Name}</td>
              <td className="py-3 pr-4 font-mono tabular-nums text-right font-bold text-amber-400">
                {g.Score}
                {currentShowingGuild === i && (
                  <GuildPopUp guildName={g.Name} style={{ left: mousePosition.x, top: mousePosition.y }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

