"use client"

import MapsEnum from "@/app/_utils/mapEnum";
import { Character } from "@prisma/client";
import { useEffect, useState } from "react"
import { getImage } from "@/app/_utils/characterAvatarReturn";
import Image from "next/image"
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { toast } from "react-toastify";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function TopKillers() {
  const [characters, setCharacters] = useState<Character[]>([])
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/characters/ranking/killers", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch");
        const res = await response.json();
        setCharacters(Array.isArray(res) ? res : []);
      } catch (e) {
        toast.error(lang === "th" ? "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง" : "There was a problem! Try again later");
      }
    }
    fetchData();
  }, [lang])

  return (
    <div className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/90 text-xs text-slate-400 border-b border-slate-800">
          <tr>
            <th className="text-left font-medium py-3.5 pl-4 w-12">#</th>
            <th className="text-left font-medium py-3.5">
              {lang === "th" ? "ตัวละคร" : "Character"}
            </th>
            <th className="text-right font-medium py-3.5">
              {lang === "th" ? "จำนวนสังหาร (PK)" : "Kill Count"}
            </th>
            <th className="text-right font-medium py-3.5 pr-4">
              {lang === "th" ? "แผนที่ปัจจุบัน" : "Location"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {characters.map((c, i) => (
            <tr key={c.Name} className="hover:bg-slate-900/40 transition-colors">
              <td className="py-3 pl-4 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
              <td className="py-3 font-medium text-slate-100 flex items-center gap-3">
                <Image
                  className="rounded-lg border border-slate-700"
                  src={(getImage(c.CharacterClassId) as StaticImport)}
                  width={32}
                  height={32}
                  alt="character_avatar"
                />
                <span>{c.Name}</span>
              </td>
              <td className="py-3 font-mono tabular-nums text-right font-bold text-red-400">
                {c.PlayerKillCount}
              </td>
              <td className="py-3 pr-4 text-right text-slate-300">
                {Object.values(MapsEnum)[Object.keys(MapsEnum).indexOf(c.CurrentMapId!)] || "Lorencia"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

