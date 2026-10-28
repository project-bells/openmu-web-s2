"use client"

import { CharacterRanking } from "@/app/_models/character";
import { useEffect, useState } from "react";
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { getImage, getClassName } from "@/app/_utils/characterAvatarReturn";
import { toast } from "react-toastify";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function TopPlayers() {
  const [characters, setCharacters] = useState<CharacterRanking[]>([]);
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/characters/ranking/reset", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch");
        const res = await response.json();
        setCharacters(Array.isArray(res) ? res : []);
      } catch (e) {
        toast.error(
          lang === "th"
            ? "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง"
            : "There was a problem! Try again later"
        );
      }
    }
    fetchData();
  }, [lang]);

  return (
    <div className="w-full bg-[#040914] border border-[#152d4d] overflow-hidden">
      <div className="px-5 py-3.5 bg-[#081529] border-b border-[#163152] flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
          {lang === "th"
            ? "อันดับตัวละคร Season 2 (ไร้ระบบรีเซ็ต)"
            : "Season 2 Character Rankings (No-Reset)"}
        </span>
        <span className="text-xs text-slate-400">
          {lang === "th" ? `ทั้งหมด ${characters.length} ตัวละคร` : `${characters.length} Players`}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-[#060f1e] text-xs text-slate-400 border-b border-[#152d4d]">
          <tr>
            <th className="text-left font-medium py-3.5 pl-4 w-12">#</th>
            <th className="text-left font-medium py-3.5">
              {lang === "th" ? "ตัวละคร" : "Character"}
            </th>
            <th className="text-center font-medium py-3.5 w-32">
              {lang === "th" ? "สายอาชีพ" : "Class"}
            </th>
            <th className="text-right font-medium py-3.5 pr-5">
              {lang === "th" ? "เลเวล" : "Level"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#10233d]/60">
          {characters.map((c, i) => (
            <tr key={c.Name} className="hover:bg-cyan-500/5 transition-colors">
              <td className="py-3 pl-4 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
              <td className="py-3 font-medium text-slate-100 flex items-center gap-3">
                <Image
                  className="border border-cyan-500/30"
                  src={getImage(c.CharacterClassId) as StaticImport}
                  width={32}
                  height={32}
                  alt="character_avatar"
                />
                <span className="font-semibold text-cyan-50">{c.Name}</span>
              </td>
              <td className="py-3 font-mono text-center text-xs font-bold text-slate-300">
                <span className="px-2.5 py-1 bg-[#081529] border border-cyan-500/30 text-cyan-300">
                  {getClassName(c.CharacterClassId)}
                </span>
              </td>
              <td className="py-3 pr-5 font-mono tabular-nums text-right text-base font-bold text-cyan-300">
                {c.lvl}
              </td>
            </tr>
          ))}
          {characters.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                {lang === "th" ? "ยังไม่มีข้อมูลการจัดอันดับตัวละคร" : "No ranking data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
